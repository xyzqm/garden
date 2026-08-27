// escapeHtml: HTML-escape special characters
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// convertMarkdownEmphasis: Convert markdown emphasis (**bold**, *ital*) to Typst emphasis (*bold*, _ital_)
// using a masking approach to protect math ($...$), raw/backtick (```...```), and escaped sequences (\X)
function convertMarkdownEmphasis(src) {
  const n = src.length;
  if (n === 0) return src;

  // Step 1: Build a mask identifying protected character ranges
  const protected_ = new Array(n).fill(false);
  let i = 0;

  while (i < n) {
    // Handle escape sequences: \X is a 2-char protected sequence
    if (src[i] === "\\") {
      protected_[i] = true;
      if (i + 1 < n) {
        protected_[i + 1] = true;
        i += 2;
        continue;
      }
    }

    // Handle backtick-delimited raw spans: exactly N backticks open/close
    if (src[i] === "`") {
      const backtickStart = i;
      i++;
      while (i < n && src[i] === "`") {
        i++;
      }
      const actualCount = i - backtickStart;

      // Mark all opening backticks as protected
      for (let j = backtickStart; j < i; j++) {
        protected_[j] = true;
      }

      // Scan for closing run of exactly actualCount backticks
      let foundClose = false;
      while (i < n) {
        if (src[i] === "`") {
          const closeStart = i;
          i++;
          while (i < n && src[i] === "`") {
            i++;
          }
          const closeCount = i - closeStart;

          if (closeCount === actualCount) {
            // Mark closing backticks and all content between as protected
            for (let j = closeStart; j < i; j++) {
              protected_[j] = true;
            }
            foundClose = true;
            break;
          }
          // Otherwise: closeCount != actualCount, not a match, keep scanning
        } else {
          // Mark all characters in the raw span as protected
          protected_[i] = true;
          i++;
        }
      }

      // If no matching close found, mark all remaining characters as protected
      if (!foundClose) {
        while (i < n) {
          protected_[i] = true;
          i++;
        }
      }
      continue;
    }

    // Handle math spans delimited by unescaped $
    if (src[i] === "$") {
      protected_[i] = true;
      const mathStart = i;
      i++;

      // Scan for closing unescaped $
      let foundClose = false;
      while (i < n) {
        if (src[i] === "\\") {
          // Escape sequence: mark both chars as protected
          protected_[i] = true;
          if (i + 1 < n) {
            protected_[i + 1] = true;
            i += 2;
          } else {
            i++;
          }
        } else if (src[i] === "$") {
          // Found unescaped $: close the math span
          protected_[i] = true;
          i++;
          foundClose = true;
          break;
        } else {
          protected_[i] = true;
          i++;
        }
      }

      // If no matching close, all remaining chars are already marked as protected
      continue;
    }

    // Plain character
    i++;
  }

  // Step 2: Build masked string, replacing protected chars with NUL
  let masked = "";
  for (let i = 0; i < n; i++) {
    masked += protected_[i] ? "\0" : src[i];
  }

  // Step 3: Apply emphasis conversions to the masked string (length-preserving)
  // Pass A: **bold** -> \x01\x01...\x01\x01 (2 placeholder chars each side, preserves length)
  masked = masked.replace(/\*\*(?![\s*])([\s\S]*?)(?<![\s*])\*\*/g, (m, g1) => "\x01\x01" + g1 + "\x01\x01");

  // Pass B: *ital* -> \x02...\x02 (1 placeholder char each side, preserves length)
  masked = masked.replace(/\*(?![\s*])([\s\S]*?)(?<![\s*])\*/g, (m, g1) => "\x02" + g1 + "\x02");

  // Step 4: Reconstruct by restoring protected chars from original src
  let result = "";
  for (let i = 0; i < n; i++) {
    if (protected_[i]) {
      result += src[i];
    } else {
      result += masked[i];
    }
  }

  // Step 5: Collapse placeholders to final form (after reconstruction, position-independent)
  result = result.replace(/\x01\x01/g, "*").replace(/\x02/g, "_");

  return result;
}

// buildTypstDoc: Build a body-only Typst document (no @preview imports, fully offline)
function buildTypstDoc({ body, pageWidth, fontSize, extraPreamble }) {
  const lines = [];

  lines.push(`#set page(width: ${pageWidth}, height: auto, margin: 2pt, fill: none)`);

  if (fontSize) {
    lines.push(`#set text(size: ${fontSize})`);
  }

  if (extraPreamble && extraPreamble.trim()) {
    lines.push(extraPreamble);
  }

  lines.push(body);

  return lines.join("\n");
}

// postprocessSvg: theming adaptation, same replaceAll approach as tikzjax:
// map black-ish attribute values to currentColor so the box adapts to light/dark mode.
//
// Also strips document-level content the typst compiler embeds inline: an unscoped
// <style> block (which includes bare-element rules like `svg { fill: none }` and
// `.tsel { position: fixed; width/height: 100% }` that would leak out and corrupt
// the rest of the page once this SVG is inlined into HTML), and any <script>. The
// <foreignObject> text-selection layer is kept — those nodes carry the invisible,
// selectable text overlay, and BOX_CSS supplies the equivalent of the stripped
// stylesheet's rules for it. Glyphs render fine without the stylesheet because
// their fill is inherited from the recolored parent <g>.
function postprocessSvg(svg) {
  return svg
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
    .replaceAll(/"(#000000|#000|black)"/g, '"currentColor"');
}

// envColorGroup: theorion fancy's env -> color-group mapping
function envColorGroup(env) {
  switch (env) {
    case "problem":
    case "exercise":
    case "example":
    case "remark":
    case "note":
      return "purple";
    case "theorem":
    case "lemma":
    case "corollary":
    case "axiom":
    case "postulate":
    case "assumption":
    case "conjecture":
      return "orange";
    case "definition":
      return "green";
    case "proposition":
    case "property":
      return "blue";
    default:
      return "purple";
  }
}

// envLabel: per-env title override, else capitalized env name
function envLabel(env, labels) {
  return (labels && labels[env]) || (env ? env[0].toUpperCase() + env.slice(1) : env);
}

const GROUP_SYMBOLS = {
  purple: "♢", // ♢
  orange: "♡", // ♡
  green: "♣", // ♣
  blue: "♠", // ♠
};

// buildBoxHtml: recreate theorion's cosmos.fancy box as HTML/CSS around a rendered SVG
function buildBoxHtml({ env, label, number, svgHtml }) {
  const group = envColorGroup(env);
  const symbol = GROUP_SYMBOLS[group];
  const titleSuffix = number != null ? " " + number : "";
  return `<figure class="problemset problemset-env-${env} problemset-g-${group}"><figcaption class="problemset-title">${escapeHtml(label)}${titleSuffix}</figcaption><div class="problemset-body">${svgHtml}</div><span class="problemset-symbol" aria-hidden="true">${symbol}</span></figure>`;
}

const BOX_CSS = `
.problemset { position: relative; margin: 2.2rem 0 1.5rem; border: 1px solid var(--ps-border); border-radius: 6px; background: var(--ps-body); padding: 1.3em 1.2em 1.2em; }
.problemset-title { position: absolute; top: 0; left: 1em; transform: translateY(-50%); background: var(--ps-border); color: #fff; font-weight: 600; font-size: 0.95em; padding: 0.3em 1em; line-height: 1.2; }
.problemset-body { --glyph_fill: currentColor; }
.problemset-body svg { width: 100%; height: auto; display: block; fill: none; }
.problemset-body .typst-text { pointer-events: bounding-box; }
.problemset-body .tsel span, .problemset-body .tsel { left: 0; position: fixed; text-align: justify; white-space: pre; width: 100%; height: 100%; text-align-last: justify; color: transparent; }
.problemset-body .tsel span::selection, .problemset-body .tsel::selection { color: transparent; background: #7db9dea0; }
.problemset-body .pseudo-link { fill: transparent; cursor: pointer; pointer-events: all; }
.problemset-body .outline_glyph path, .problemset-body path.outline_glyph { fill: var(--glyph_fill); }
.problemset-symbol { position: absolute; right: 0.5em; bottom: 0.2em; color: var(--ps-border); font-size: 0.85em; line-height: 1; user-select: none; }
.problemset-g-purple { --ps-border: #7c098d; --ps-body: #fbf3fc; }
.problemset-g-orange { --ps-border: #ff851b; --ps-body: #fff9f3; }
.problemset-g-green  { --ps-border: #208e2c; --ps-body: #f4fcf5; }
.problemset-g-blue   { --ps-border: #005198; --ps-body: #f2f8fd; }
.problemset-error { border: 1px solid #c33; border-radius: 6px; padding: 0.75rem; }
.problemset-error pre { overflow-x: auto; }
`.trim();

const DARK_CSS = `
.problemset-g-purple { --ps-border: #c973d6; --ps-body: #231627; }
.problemset-g-orange { --ps-border: #ffa04d; --ps-body: #271d12; }
.problemset-g-green  { --ps-border: #5fbf6c; --ps-body: #14211a; }
.problemset-g-blue   { --ps-border: #4d9fe6; --ps-body: #131e2b; }
`.trim();

// prefixCss: prefix every top-level selector in a flat (no nesting, no at-rules) CSS string
function prefixCss(css, prefix) {
  return css.replace(/([^{}]*)\{([^{}]*)\}/g, (match, selectors, decls) => {
    const leading = (selectors.match(/^\s*/) || [""])[0];
    const prefixed = selectors
      .trim()
      .split(",")
      .map((sel) => `${prefix} ${sel.trim()}`)
      .join(", ");
    return `${leading}${prefixed}{${decls}}`;
  });
}

export {
  escapeHtml,
  convertMarkdownEmphasis,
  buildTypstDoc,
  postprocessSvg,
  envColorGroup,
  envLabel,
  buildBoxHtml,
  BOX_CSS,
  DARK_CSS,
  DARK_CSS as DARK_CSS_VARS,
  prefixCss,
};
