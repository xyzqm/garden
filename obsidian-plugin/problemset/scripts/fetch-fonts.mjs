import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// @myriaddreamin/typst-assets does not exist on npm, so fonts come from the
// typst/typst-assets GitHub repo via jsDelivr at sync time (dev-machine only).
// The plugin is fully offline at runtime: fonts are read from local disk,
// never fetched from the plugin's own code.

const CDN_PREFIX = "https://cdn.jsdelivr.net/gh/typst/typst-assets@v0.13.1/files/fonts/";
const FONTS = [
  "LibertinusSerif-Regular.otf",
  "LibertinusSerif-Bold.otf",
  "LibertinusSerif-Italic.otf",
  "LibertinusSerif-BoldItalic.otf",
  "NewCMMath-Regular.otf",
  "NewCMMath-Book.otf",
  "DejaVuSansMono.ttf",
];

export async function fetchFonts() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const fontsDir = path.join(__dirname, "../fonts");

  let hasFailure = false;

  for (const fontName of FONTS) {
    const fontPath = path.join(fontsDir, fontName);

    try {
      const stat = await fs.stat(fontPath);
      const sizeKib = (stat.size / 1024).toFixed(1);
      console.log(`cached ${fontName} (${sizeKib} KiB)`);
      continue;
    } catch (err) {
      // File doesn't exist, proceed to download
    }

    try {
      const url = CDN_PREFIX + fontName;
      const resp = await fetch(url);

      if (!resp.ok) {
        console.error(`failed to download ${fontName} (HTTP ${resp.status})`);
        hasFailure = true;
        continue;
      }

      const buffer = await resp.arrayBuffer();
      await fs.mkdir(fontsDir, { recursive: true });
      await fs.writeFile(fontPath, Buffer.from(buffer));

      const sizeKib = (buffer.byteLength / 1024).toFixed(1);
      console.log(`downloaded ${fontName} (${sizeKib} KiB)`);
    } catch (err) {
      console.error(`error downloading ${fontName}:`, err.message);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    throw new Error("problemset: font fetch failed");
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  fetchFonts().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
