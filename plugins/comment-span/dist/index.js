// Renders inline `{text|comment}` markdown syntax as a <span class="comment-span"> with
// a data-comment attribute, plus a hover/tap tooltip (see externalResources() below).
// Runs on mdast `text` nodes only, so code blocks, inline code, and math (already parsed
// into their own node types by the time this plugin's markdownPlugins transformer runs)
// are never touched.

const COMMENT_SPAN_REGEX = /\{([^{}|]+)\|([^{}]+)\}/g;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Given the string value of a single mdast `text` node, returns an array of
// replacement mdast nodes (a mix of `text` and `html` nodes) if the value contains
// one or more `{text|comment}` matches, or `null` if there were no matches (meaning
// the caller should leave the original text node untouched).
function splitCommentSpans(value) {
  COMMENT_SPAN_REGEX.lastIndex = 0;
  const result = [];
  let lastIndex = 0;
  let match;
  let found = false;

  while ((match = COMMENT_SPAN_REGEX.exec(value)) !== null) {
    found = true;
    if (match.index > lastIndex) {
      result.push({ type: "text", value: value.slice(lastIndex, match.index) });
    }
    const rawText = match[1];
    const rawComment = match[2];
    const text = escapeHtml(rawText);
    const comment = escapeHtml(rawComment);
    result.push({
      type: "html",
      value: `<span class="comment-span" tabindex="0" data-comment="${comment}">${text}</span>`,
    });
    lastIndex = COMMENT_SPAN_REGEX.lastIndex;
  }

  if (!found) return null;

  if (lastIndex < value.length) {
    result.push({ type: "text", value: value.slice(lastIndex) });
  }

  return result;
}

// Recursively walks an mdast tree. For every node with a `children` array, scans
// each child; any child of type "text" gets checked for {text|comment} matches and,
// if found, is spliced out and replaced in-place with a mix of "text"/"html" nodes.
// All other node types (code, inlineCode, math, inlineMath, etc.) are left completely
// alone since we only ever inspect nodes of type "text".
function walk(node) {
  if (!node || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "text" && typeof child.value === "string") {
      const replacement = splitCommentSpans(child.value);
      if (replacement) {
        node.children.splice(i, 1, ...replacement);
        i += replacement.length - 1;
        continue;
      }
    }
    walk(child);
  }
}

const commentSpanCss = `
.comment-span {
  background-color: var(--comment-span-bg, var(--highlight));
  border-bottom: 1px dotted var(--gray);
  border-radius: 3px;
  padding: 0 0.1rem;
  cursor: help;
}

/* --highlight is the same low-alpha grey in both themes, which all but
   disappears against the dark surface. Lift the alpha in dark mode only. */
:root[saved-theme="dark"] {
  --comment-span-bg: rgba(143, 159, 169, 0.3);
}

.comment-span-tooltip {
  position: fixed;
  z-index: 999;
  max-width: 300px;
  padding: 0.4rem 0.6rem;
  font-family: var(--bodyFont);
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--darkgray);
  background-color: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  box-shadow: 6px 6px 36px 0 rgba(0, 0, 0, 0.25);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.comment-span-tooltip.active {
  opacity: 1;
  visibility: visible;
}
`;

const commentSpanScript = `
function setupCommentSpans() {
  var spans = Array.prototype.slice.call(document.getElementsByClassName("comment-span"));
  var tooltipEl = null;
  var activeSpan = null;

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.classList.remove("active");
    }
    activeSpan = null;
  }

  function positionTooltip(span, tooltip) {
    var rect = span.getBoundingClientRect();
    var tooltipRect = tooltip.getBoundingClientRect();
    var margin = 8;
    var left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));
    var top = rect.top - tooltipRect.height - margin;
    if (top < margin) {
      top = rect.bottom + margin;
    }
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  function showTooltip(span) {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "comment-span-tooltip";
      document.body.appendChild(tooltipEl);
    }
    tooltipEl.textContent = span.dataset.comment || "";
    tooltipEl.classList.add("active");
    activeSpan = span;
    positionTooltip(span, tooltipEl);
  }

  function onMouseEnter(e) {
    showTooltip(e.currentTarget);
  }
  function onMouseLeave() {
    hideTooltip();
  }
  function onFocus(e) {
    showTooltip(e.currentTarget);
  }
  function onBlur() {
    hideTooltip();
  }
  function onClick(e) {
    e.stopPropagation();
    var span = e.currentTarget;
    if (activeSpan === span) {
      hideTooltip();
    } else {
      showTooltip(span);
    }
  }
  function onDocClick() {
    hideTooltip();
  }

  for (var i = 0; i < spans.length; i++) {
    (function (span) {
      span.addEventListener("mouseenter", onMouseEnter);
      span.addEventListener("mouseleave", onMouseLeave);
      span.addEventListener("focus", onFocus);
      span.addEventListener("blur", onBlur);
      span.addEventListener("click", onClick);
      window.addCleanup(function () {
        span.removeEventListener("mouseenter", onMouseEnter);
        span.removeEventListener("mouseleave", onMouseLeave);
        span.removeEventListener("focus", onFocus);
        span.removeEventListener("blur", onBlur);
        span.removeEventListener("click", onClick);
      });
    })(spans[i]);
  }

  document.addEventListener("click", onDocClick);
  window.addCleanup(function () {
    document.removeEventListener("click", onDocClick);
    if (tooltipEl) {
      tooltipEl.remove();
      tooltipEl = null;
    }
  });
}

document.addEventListener("nav", setupCommentSpans);
`;

const CommentSpan = () => {
  return {
    name: "CommentSpan",
    markdownPlugins() {
      return [
        () => (tree) => {
          walk(tree);
        },
      ];
    },
    externalResources() {
      return {
        css: [{ content: commentSpanCss, inline: true }],
        js: [{ script: commentSpanScript, loadTime: "afterDOMReady", contentType: "inline" }],
      };
    },
  };
};

export { CommentSpan };
