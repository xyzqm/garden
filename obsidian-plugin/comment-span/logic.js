"use strict";

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

module.exports = {
  COMMENT_SPAN_SOURCE,
  createCommentSpanRegex,
  containsCommentSpan,
  splitCommentSpans,
};
