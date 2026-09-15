import { visit } from "unist-util-visit";
import { readFileSync, statSync } from "fs";
import { resolve, isAbsolute } from "path";

// rehype-typst compiles every equation as its own standalone Typst document --
// there is no shared scope across equations, so `#let` macros the user relies
// on in Obsidian (pref, wpref, ...) are undefined here. Fix: inject the same
// preamble text at the start of every math element's content before
// rehype-typst runs (this plugin is order 79, latex/rehype-typst is order 80).
const defaults = {
  preambleFile: ".typst/preamble.typ",
  preamble: "",
};

// Cached in module scope so a build only reads the preamble file once, not
// once per equation. Keyed on path + mtime (not just computed once and
// forgotten) so `quartz build --serve`, which rebuilds in-process, picks up
// edits to the preamble file without a server restart.
let cachedPreamble = null;
let cachedPath = null;
let cachedMtimeMs = null;
let warnedMissing = false;

// Comment lines are stripped so nothing depends on comment-terminating
// newlines surviving once this text is spliced into the middle of an equation.
function stripComments(text) {
  return text
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed !== "" && !trimmed.startsWith("//");
    })
    .join("\n");
}

function resolvePreamble(opts) {
  const filePath = opts.preambleFile
    ? isAbsolute(opts.preambleFile)
      ? opts.preambleFile
      : resolve(process.cwd(), opts.preambleFile)
    : null;

  let mtimeMs = null;
  if (filePath) {
    try {
      mtimeMs = statSync(filePath).mtimeMs;
    } catch {
      mtimeMs = null; // missing/unreadable: treat as a cache miss below
    }
  }

  if (
    cachedPreamble !== null &&
    cachedPath === filePath &&
    mtimeMs !== null &&
    cachedMtimeMs === mtimeMs
  ) {
    return cachedPreamble;
  }

  let fileContents = "";
  if (filePath) {
    if (mtimeMs !== null) {
      fileContents = readFileSync(filePath, "utf8");
      warnedMissing = false; // file is back: warn again if it disappears later
    } else if (!warnedMissing) {
      // A missing preamble must not break the build -- just warn once.
      console.warn(`typst-preamble: preamble file not found at ${filePath}`);
      warnedMissing = true;
    }
  }

  const combined = [fileContents, opts.preamble || ""].join("\n");
  cachedPreamble = stripComments(combined);
  cachedPath = filePath;
  cachedMtimeMs = mtimeMs;
  return cachedPreamble;
}

// Same match rehype-typst itself uses to find math elements.
const MATH_CLASSES = ["language-math", "math-display", "math-inline"];

function isMathElement(node) {
  const className = node.properties && node.properties.className;
  if (!Array.isArray(className)) return false;
  return className.some((c) => MATH_CLASSES.includes(c));
}

const TypstPreamble = (userOpts) => {
  const opts = { ...defaults, ...(userOpts || {}) };
  // Guards an element from ever being injected into twice, e.g. if the
  // transformer somehow runs more than once over the same tree.
  const injected = new WeakSet();

  return {
    name: "TypstPreamble",
    htmlPlugins() {
      return [
        () => (tree) => {
          const preamble = resolvePreamble(opts);
          if (!preamble) return; // nothing configured: complete no-op

          visit(tree, "element", (node) => {
            if (!isMathElement(node)) return;
            if (injected.has(node)) return;
            injected.add(node);
            // Unshift rather than rewrite: rehype-typst reads element text
            // with hast-util-to-text (whitespace: 'pre'), so a leading text
            // node is equivalent to prepending to the source and leaves the
            // original content node untouched.
            node.children.unshift({ type: "text", value: preamble + "\n" });
          });
        },
      ];
    },
  };
};

export { TypstPreamble };
