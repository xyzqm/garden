"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const mainPath = path.join(__dirname, "..", "main.js");
const src = fs.readFileSync(mainPath, "utf8");

function run(name, fn) {
  fn();
  console.log("ok - " + name);
}

run("main.js source contains no relative require", () => {
  assert.equal(src.includes('require("./'), false);
  assert.equal(src.includes("require('./"), false);
});

run("main.js evaluates under Obsidian's plugin loader require shim", () => {
  function requireShim(specifier) {
    if (specifier === "obsidian") {
      return { Plugin: class {}, setTooltip: function () {} };
    }
    if (specifier === "electron") {
      return {};
    }
    if (specifier.startsWith("@codemirror/") || specifier.startsWith("@lezer/")) {
      return {};
    }
    throw new Error("Cannot find module '" + specifier + "'");
  }

  const sandboxModule = { exports: {} };
  const evaluate = new Function("module", "exports", "require", src);
  evaluate(sandboxModule, sandboxModule.exports, requireShim);

  assert.equal(typeof sandboxModule.exports, "function");
});

console.log("\nAll loader.test.js tests passed.");
