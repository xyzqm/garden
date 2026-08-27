import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fetchFonts } from "./fetch-fonts.mjs";
import { genCss } from "./gen-css.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginRepoDir = path.join(__dirname, "..");
const targetDir = "/Users/danielzhu/Documents/garden/.obsidian/plugins/problemset";

async function copyFile(srcPath, destPath) {
  const data = await fs.readFile(srcPath);
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, data);

  const sizeKib = (data.length / 1024).toFixed(1);
  const sizeStr = data.length > 1024 * 1024 ? `(${(data.length / (1024 * 1024)).toFixed(1)} MiB)` : `(${sizeKib} KiB)`;
  console.log(`${destPath} ${sizeStr}`);
}

async function sync() {
  await genCss();
  await fetchFonts();

  // manifest.json
  await copyFile(path.join(pluginRepoDir, "manifest.json"), path.join(targetDir, "manifest.json"));

  // styles.css
  await copyFile(path.join(pluginRepoDir, "styles.css"), path.join(targetDir, "styles.css"));

  // dist/main.js
  await copyFile(path.join(pluginRepoDir, "dist/main.js"), path.join(targetDir, "main.js"));

  // WASM files
  await copyFile(
    path.join(pluginRepoDir, "node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm"),
    path.join(targetDir, "typst_ts_web_compiler_bg.wasm"),
  );

  await copyFile(
    path.join(pluginRepoDir, "node_modules/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm"),
    path.join(targetDir, "typst_ts_renderer_bg.wasm"),
  );

  // Fonts
  const fontsDir = path.join(pluginRepoDir, "fonts");
  try {
    const files = await fs.readdir(fontsDir);
    for (const fontFile of files) {
      const srcFontPath = path.join(fontsDir, fontFile);
      const destFontPath = path.join(targetDir, "fonts", fontFile);
      await copyFile(srcFontPath, destFontPath);
    }
  } catch (err) {
    // fonts dir doesn't exist yet
  }
}

sync().catch((err) => {
  console.error("sync failed:", err);
  process.exit(1);
});
