"use strict";

const assert = require("node:assert/strict");
const { splitCommentSpans } = require("../main.js").__test;

function run(name, fn) {
  fn();
  console.log("ok - " + name);
}

run("plain text with no braces is untouched", () => {
  const tokens = splitCommentSpans("just plain text");
  assert.deepEqual(tokens, [{ type: "text", value: "just plain text" }]);
});

run("a single simple span", () => {
  const tokens = splitCommentSpans("see {this|a comment} here");
  assert.deepEqual(tokens, [
    { type: "text", value: "see " },
    { type: "span", text: "this", comment: "a comment" },
    { type: "text", value: " here" },
  ]);
});

run("{no pipe} is left as plain text", () => {
  const tokens = splitCommentSpans("this is {no pipe} left alone");
  assert.deepEqual(tokens, [{ type: "text", value: "this is {no pipe} left alone" }]);
});

run("adjacent matches with no separating text", () => {
  const tokens = splitCommentSpans("{a|b}{c|d}");
  assert.deepEqual(tokens, [
    { type: "span", text: "a", comment: "b" },
    { type: "span", text: "c", comment: "d" },
  ]);
});

run("nested braces: only the well-formed inner span matches", () => {
  const tokens = splitCommentSpans("{a{b|c}|d}");
  assert.deepEqual(tokens, [
    { type: "text", value: "{a" },
    { type: "span", text: "b", comment: "c" },
    { type: "text", value: "|d}" },
  ]);
});

run("comment containing quotes and an apostrophe", () => {
  const tokens = splitCommentSpans(`{word|it's a "quoted" comment}`);
  assert.deepEqual(tokens, [
    { type: "span", text: "word", comment: `it's a "quoted" comment` },
  ]);
});

run("multiple spans separated by text", () => {
  const tokens = splitCommentSpans("a {x|y} b {z|w} c");
  assert.deepEqual(tokens, [
    { type: "text", value: "a " },
    { type: "span", text: "x", comment: "y" },
    { type: "text", value: " b " },
    { type: "span", text: "z", comment: "w" },
    { type: "text", value: " c" },
  ]);
});

console.log("\nAll logic.js tests passed.");
