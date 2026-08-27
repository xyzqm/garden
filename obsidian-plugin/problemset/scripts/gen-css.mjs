import { BOX_CSS, DARK_CSS, prefixCss } from "../../../plugins/problemset/common.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export async function genCss() {
  const obsidianOnlyCss = `
/* Obsidian-specific rules not in common.js (which has no placeholder/error-title concept) */
.problemset-placeholder { color: var(--text-muted); font-size: var(--font-ui-smaller); margin: 1rem 0; }
.problemset-error-title { color: var(--text-error); font-weight: 600; margin-bottom: 0.5rem; }
`;
  const css = BOX_CSS + "\n\n" + prefixCss(DARK_CSS, ".theme-dark") + "\n" + obsidianOnlyCss + "\n";
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outPath = path.join(__dirname, "../styles.css");
  await fs.writeFile(outPath, css);
  console.log(`wrote ${outPath} (${(css.length / 1024).toFixed(1)} KiB)`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  genCss();
}
