import esbuild from "esbuild";

// Bundles src/main.js (plus the shared Quartz-side ../../plugins/problemset/common.js
// and the typst.ts ESM modules) into a single CommonJS file Obsidian can require().
//
// - "obsidian" is provided by the app at runtime, so it stays external.
// - The .wasm files are NOT bundled; they ship alongside main.js and are read
//   from disk through the vault adapter at init time (see src/main.js).
// - typst.ts's browser code reads `import.meta.url` only to locate its own wasm
//   when no getModule() override is given. We always give one, so the value is
//   never used -- define it away to keep esbuild from warning about import.meta
//   in a CommonJS output.
const result = await esbuild.build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "dist/main.js",
  format: "cjs",
  platform: "browser",
  target: "es2022",
  external: ["obsidian", "@codemirror/view", "@codemirror/state", "@codemirror/language"],
  loader: { ".wasm": "empty" },
  minify: false,
  sourcemap: false,
  logLevel: "info",
  define: { "import.meta.url": '""' },
  metafile: true,
});

const out = result.metafile.outputs["dist/main.js"];
console.log(`bundle: dist/main.js  ${(out.bytes / 1024).toFixed(1)} KiB`);
