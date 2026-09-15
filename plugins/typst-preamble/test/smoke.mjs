// Dependency-light smoke test for the typst-preamble plugin.
// Run from the repo root:
//   GARDEN_NODE_MODULES=/path/to/garden/node_modules node plugins/typst-preamble/test/smoke.mjs
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// test/ -> typst-preamble/ -> plugins/ -> repo root
const repoRoot = path.resolve(__dirname, "../../..");
const hostNodeModules = process.env.GARDEN_NODE_MODULES || path.join(repoRoot, "node_modules");
const require = createRequire(path.join(hostNodeModules, "package.json"));
// Fail fast with a clear error if the host node_modules path is wrong.
require.resolve("unist-util-visit");

const { TypstPreamble } = await import("../dist/index.js");

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`PASS: ${name}`);
  } else {
    console.log(`FAIL: ${name}`);
    failures++;
  }
}

function mathElement(classNames, text) {
  return {
    type: "element",
    tagName: "code",
    properties: { className: classNames },
    children: [{ type: "text", value: text }],
  };
}

const inlineMath = mathElement(["language-math", "math-inline"], "c' wpref_1 c");
const displayMath = mathElement(
  ["language-math", "math-display"],
  "max_(c != w) 1 - P(w pref c)"
);
const preMath = mathElement(["language-math", "math-display"], "a + b");
const preWrapped = {
  type: "element",
  tagName: "pre",
  properties: {},
  children: [preMath],
};
const plain = {
  type: "element",
  tagName: "p",
  properties: {},
  children: [{ type: "text", value: "just some text" }],
};

const tree = {
  type: "root",
  children: [inlineMath, displayMath, preWrapped, plain],
};

const plugin = TypstPreamble({});
const factory = plugin.htmlPlugins()[0];
const transform = factory();

// Run the transformer TWICE over the same tree to prove the WeakSet guard
// holds: a second pass must not inject a second copy of the preamble.
transform(tree);
transform(tree);

function firstChildText(el) {
  return el.children[0] && el.children[0].type === "text" ? el.children[0].value : "";
}

function countPreambleInjections(el) {
  return el.children.filter(
    (c) => c.type === "text" && c.value.includes("#let pref")
  ).length;
}

check("inline math got exactly one injection", countPreambleInjections(inlineMath) === 1);
check("display math got exactly one injection", countPreambleInjections(displayMath) === 1);
check("pre>code math got exactly one injection", countPreambleInjections(preMath) === 1);
check(
  "pre wrapper itself was not injected into",
  preWrapped.children.length === 1 && preWrapped.children[0] === preMath
);
check(
  "non-math element left untouched",
  plain.children.length === 1 &&
    plain.children[0].type === "text" &&
    plain.children[0].value === "just some text"
);

const injectedText = firstChildText(inlineMath);
check("injected text contains #let pref", injectedText.includes("#let pref"));
check("injected text contains #let wpref", injectedText.includes("#let wpref"));
check("injected text contains no // comment lines", !injectedText.includes("//"));

// --- Cache invalidation on file mtime (needed for `quartz build --serve`,
// which rebuilds in-process, so edits to the preamble file must not require
// a server restart to take effect) ---
const tmpPreamblePath = path.join(
  os.tmpdir(),
  `typst-preamble-smoke-${process.pid}-${Date.now()}.typ`
);
try {
  fs.writeFileSync(tmpPreamblePath, "#let foo = 1");

  const mtimePlugin = TypstPreamble({ preambleFile: tmpPreamblePath });
  const mtimeTransform = mtimePlugin.htmlPlugins()[0]();

  const elementV1 = mathElement(["language-math", "math-inline"], "foo");
  mtimeTransform({ type: "root", children: [elementV1] });
  const textV1 = firstChildText(elementV1);
  check(
    "mtime cache: initial content picked up",
    textV1.includes("#let foo = 1")
  );

  // Rewrite with different content, and explicitly bump mtime forward --
  // filesystem mtime resolution can be too coarse for two writes microseconds
  // apart to register as different, so don't rely on wall-clock advancing.
  fs.writeFileSync(tmpPreamblePath, "#let bar = 2");
  const bumped = new Date(Date.now() + 5000);
  fs.utimesSync(tmpPreamblePath, bumped, bumped);

  const elementV2 = mathElement(["language-math", "math-inline"], "bar");
  mtimeTransform({ type: "root", children: [elementV2] });
  const textV2 = firstChildText(elementV2);
  check(
    "mtime cache: edited content picked up after mtime bump",
    textV2.includes("#let bar = 2") && !textV2.includes("#let foo")
  );
} finally {
  fs.rmSync(tmpPreamblePath, { force: true });
}

if (failures > 0) {
  console.log(`\n${failures} check(s) FAILED`);
  process.exit(1);
} else {
  console.log("\nAll checks passed");
}
