"use strict";

let Plugin, setTooltip;
try {
  ({ Plugin, setTooltip } = require("obsidian"));
} catch (err) {
  Plugin = class {};
  setTooltip = undefined;
}

// ---- Pure logic (inlined from former logic.js) ---------------------------

// Matches {text|comment} where:
//   text    contains no "{", "}", or "|"
//   comment contains no "{" or "}"
// A fresh RegExp (or one with .lastIndex reset) must be used for each
// exec loop to avoid shared-state bugs from a module-level global regex.
const COMMENT_SPAN_SOURCE = "\\{([^{}|]+)\\|([^{}]+)\\}";

function createCommentSpanRegex(flags) {
  return new RegExp(COMMENT_SPAN_SOURCE, flags);
}

// Quick non-stateful test for "does this string contain at least one match".
function containsCommentSpan(text) {
  return createCommentSpanRegex("").test(text);
}

// Splits `input` into an ordered array of tokens:
//   { type: "text", value: string }
//   { type: "span", text: string, comment: string }
// Plain text (including any {no-pipe} or malformed braces) is preserved
// verbatim as "text" tokens.
function splitCommentSpans(input) {
  const tokens = [];
  const re = createCommentSpanRegex("g");
  let lastIndex = 0;
  let match;
  while ((match = re.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: input.slice(lastIndex, match.index) });
    }
    tokens.push({ type: "span", text: match[1], comment: match[2] });
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) {
      re.lastIndex++;
    }
  }
  if (lastIndex < input.length) {
    tokens.push({ type: "text", value: input.slice(lastIndex) });
  }
  return tokens;
}

// ---- Reading view -------------------------------------------------------

// Ancestors matching any of these should never have their text content
// replaced: real code, real math, and known math-rendering plugin output
// (Obsidian's built-in MathJax, and the typst / wypst / mathlinks /
// obsidian-tikzjax community plugins). The exact class names those last
// four plugins render into were not independently verified (no running
// Obsidian instance was available to inspect their live DOM), so wildcard
// attribute selectors are used as a defensive superset. Spot-check on a
// math-heavy note after installing.
const READING_VIEW_SKIP_SELECTOR = [
  "code",
  "pre",
  "kbd",
  "svg",
  ".math",
  ".MathJax",
  "mjx-container",
  ".frontmatter",
  ".metadata-container",
  '[class*="typst"]',
  '[class*="wypst"]',
  '[class*="mathlink"]',
  '[class*="tikz"]',
].join(", ");

function isInsideSkippedAncestor(node, root) {
  let el = node.parentElement;
  while (el && el !== root.parentElement) {
    if (el.matches && el.matches(READING_VIEW_SKIP_SELECTOR)) return true;
    el = el.parentElement;
  }
  return false;
}

function buildCommentSpanElement(doc, text, comment) {
  const span = doc.createElement("span");
  span.className = "comment-span";
  span.textContent = text;
  if (typeof setTooltip === "function") {
    // delay: 0 overrides Obsidian's default hover delay (~300ms) so the
    // tooltip appears instantly.
    setTooltip(span, comment, { delay: 0 });
  } else {
    span.classList.add("comment-span-css-tooltip");
    span.setAttribute("data-comment", comment);
  }
  return span;
}

function processReadingView(rootEl) {
  const doc = rootEl.ownerDocument || document;
  const walker = doc.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
  const targets = [];
  let node;
  while ((node = walker.nextNode())) {
    const value = node.nodeValue;
    if (!value || !containsCommentSpan(value)) continue;
    if (isInsideSkippedAncestor(node, rootEl)) continue;
    targets.push(node);
  }
  for (const textNode of targets) {
    const tokens = splitCommentSpans(textNode.nodeValue);
    if (tokens.length === 1 && tokens[0].type === "text") continue;
    const frag = doc.createDocumentFragment();
    for (const token of tokens) {
      if (token.type === "text") {
        frag.appendChild(doc.createTextNode(token.value));
      } else {
        frag.appendChild(buildCommentSpanElement(doc, token.text, token.comment));
      }
    }
    textNode.parentNode.replaceChild(frag, textNode);
  }
}

// ---- Live Preview (CodeMirror 6) ----------------------------------------
//
// Obsidian exposes its internal CodeMirror 6 packages as runtime module
// externals: require("@codemirror/view"), require("@codemirror/state") and
// require("@codemirror/language") return the exact instances Obsidian's
// own editor uses, even from an unbundled plugin, because Obsidian's
// plugin loader intercepts require() calls for these module names itself
// (this is why esbuild-based plugins mark them "external" instead of
// bundling them — see obsidianmd/obsidian-sample-plugin's
// esbuild.config.mjs, which lists "@codemirror/view", "@codemirror/state",
// "@codemirror/language" etc. as externals rather than dependencies).
function buildEditorExtension() {
  let WidgetType_, Decoration_, MatchDecorator_, ViewPlugin_;
  try {
    const view = require("@codemirror/view");
    WidgetType_ = view.WidgetType;
    Decoration_ = view.Decoration;
    MatchDecorator_ = view.MatchDecorator;
    ViewPlugin_ = view.ViewPlugin;
  } catch (err) {
    console.warn(
      "comment-span: @codemirror/view is unavailable, Live Preview rendering is disabled.",
      err
    );
    return null;
  }

  // Best-effort, defensive: also skip matches inside code/math syntax nodes
  // when @codemirror/language's syntax tree is available and resolvable.
  // This path is NOT verified against a running Obsidian instance -- if
  // anything here throws, it is swallowed and the match is decorated as
  // normal rather than breaking the whole extension.
  let syntaxTree = null;
  try {
    syntaxTree = require("@codemirror/language").syntaxTree;
  } catch (err) {
    syntaxTree = null;
  }

  function isInsideExcludedSyntax(state, from) {
    if (!syntaxTree) return false;
    try {
      const name = syntaxTree(state).resolve(from, 1).name || "";
      return /code|math|frontmatter/i.test(name);
    } catch (err) {
      return false;
    }
  }

  class CommentSpanWidget extends WidgetType_ {
    constructor(text, comment) {
      super();
      this.text = text;
      this.comment = comment;
    }
    eq(other) {
      return other.text === this.text && other.comment === this.comment;
    }
    toDOM() {
      return buildCommentSpanElement(document, this.text, this.comment);
    }
    ignoreEvent() {
      return false;
    }
  }

  const matcher = new MatchDecorator_({
    regexp: createCommentSpanRegex("g"),
    decorate(add, from, to, match, view) {
      const overlapsSelection = view.state.selection.ranges.some(
        (range) => range.from <= to && range.to >= from
      );
      if (overlapsSelection) return;
      if (isInsideExcludedSyntax(view.state, from)) return;
      add(from, to, Decoration_.replace({ widget: new CommentSpanWidget(match[1], match[2]) }));
    },
  });

  const viewPlugin = ViewPlugin_.fromClass(
    class {
      constructor(view) {
        this.decorations = matcher.createDeco(view);
      }
      update(update) {
        // Cursor movement alone (no doc change, no viewport change) must
        // still re-run matching, since whether a range is decorated
        // depends on where the selection currently is (so the user can
        // click into a span and edit its raw {text|comment} syntax).
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = matcher.createDeco(update.view);
        }
      }
    },
    { decorations: (v) => v.decorations }
  );

  return viewPlugin;
}

// ---- Plugin ---------------------------------------------------------------

module.exports = class CommentSpanPlugin extends Plugin {
  onload() {
    this.registerMarkdownPostProcessor((el) => {
      processReadingView(el);
    });

    const editorExtension = buildEditorExtension();
    if (editorExtension) {
      this.registerEditorExtension(editorExtension);
    }
  }
};

module.exports.__test = {
  splitCommentSpans,
  containsCommentSpan,
  createCommentSpanRegex,
  COMMENT_SPAN_SOURCE,
};
