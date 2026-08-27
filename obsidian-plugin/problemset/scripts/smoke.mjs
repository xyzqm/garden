import * as esbuild from "esbuild";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { buildTypstDoc, envColorGroup, buildBoxHtml } from "../../../plugins/problemset/common.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const shimDir = path.join(__dirname, "../node_modules/.cache/problemset-smoke");
const shimPath = path.join(shimDir, "obsidian-shim.mjs");
const buildDir = path.join(shimDir, "build");
const outfile = path.join(buildDir, "main.mjs");

let passCount = 0;
let failCount = 0;

function pass(name) {
  console.log(`PASS ${name}`);
  passCount++;
}

function fail(name, detail) {
  console.log(`FAIL ${name}: ${detail}`);
  failCount++;
}

async function setup() {
  await fs.mkdir(shimDir, { recursive: true });
  await fs.mkdir(buildDir, { recursive: true });

  const shimContent = `
export class Component {
  onunload() {}
}

export class MarkdownRenderChild extends Component {
  constructor(containerEl) {
    super();
    this.containerEl = containerEl;
  }
}

export class Plugin extends Component {
  addSettingTab() {}
  registerMarkdownCodeBlockProcessor() {}
  addChild(child) { return child; }
  async loadData() { return null; }
  async saveData() {}
}

export class PluginSettingTab {}

export class Setting {
  setName() { return this; }
  setDesc() { return this; }
  addText() { return this; }
  addToggle() { return this; }
  addDropdown() { return this; }
  addTextArea() { return this; }
  addButton() { return this; }
}

export class Notice {}
`;

  await fs.writeFile(shimPath, shimContent);
}

async function buildPlugin() {
  let platform = "neutral";

  try {
    await esbuild.build({
      entryPoints: [path.join(__dirname, "../src/main.js")],
      bundle: true,
      outfile,
      format: "esm",
      platform,
      target: "es2022",
      plugins: [
        {
          name: "obsidian-alias",
          setup(build) {
            build.onResolve({ filter: /^obsidian$/ }, () => ({
              path: shimPath,
            }));
          },
        },
      ],
      define: {
        "import.meta.url": '""',
      },
      loader: {
        ".wasm": "empty",
      },
    });
  } catch (err) {
    console.log("Build with platform:neutral failed, retrying with platform:browser");
    await esbuild.build({
      entryPoints: [path.join(__dirname, "../src/main.js")],
      bundle: true,
      outfile,
      format: "esm",
      platform: "browser",
      target: "es2022",
      plugins: [
        {
          name: "obsidian-alias",
          setup(build) {
            build.onResolve({ filter: /^obsidian$/ }, () => ({
              path: shimPath,
            }));
          },
        },
      ],
      define: {
        "import.meta.url": '""',
      },
      loader: {
        ".wasm": "empty",
      },
    });
    console.log("Build with platform:browser succeeded");
  }
}

async function runTests() {
  const m = await import(pathToFileURL(outfile).href);

  // Test countFencesBefore
  const text = ["# Note", "", "```problem", "a", "```", "", "text", "", "```problem", "b", "```"].join("\n");

  try {
    if (m.countFencesBefore(text, "problem", 2) === 0) {
      pass("countFencesBefore(text, 'problem', 2) === 0");
    } else {
      fail("countFencesBefore(text, 'problem', 2) === 0", `got ${m.countFencesBefore(text, "problem", 2)}`);
    }
  } catch (err) {
    fail("countFencesBefore(text, 'problem', 2)", String(err?.message || err));
  }

  try {
    if (m.countFencesBefore(text, "problem", 8) === 1) {
      pass("countFencesBefore(text, 'problem', 8) === 1");
    } else {
      fail("countFencesBefore(text, 'problem', 8) === 1", `got ${m.countFencesBefore(text, "problem", 8)}`);
    }
  } catch (err) {
    fail("countFencesBefore(text, 'problem', 8)", String(err?.message || err));
  }

  try {
    if (m.countFencesBefore(text, "other", 8) === 0) {
      pass("countFencesBefore(text, 'other', 8) === 0");
    } else {
      fail("countFencesBefore(text, 'other', 8) === 0", `got ${m.countFencesBefore(text, "other", 8)}`);
    }
  } catch (err) {
    fail("countFencesBefore(text, 'other', 8)", String(err?.message || err));
  }

  // Test that "problem" env doesn't match "problemx" fence
  try {
    const textWithProblemp = ["# Note", "", "```problemx", "a", "```", "", "```problem", "b", "```"].join("\n");
    if (m.countFencesBefore(textWithProblemp, "problem", 6) === 0) {
      pass("countFencesBefore doesn't match 'problemx' fence");
    } else {
      fail("countFencesBefore doesn't match 'problemx' fence", `got ${m.countFencesBefore(textWithProblemp, "problem", 6)}`);
    }
  } catch (err) {
    fail("countFencesBefore env boundary test", String(err?.message || err));
  }

  // Test makeCache
  try {
    const c = m.makeCache(3);
    c.set("a", "A");
    c.set("b", "B");
    c.set("c", "C");
    c.set("d", "D");

    if (c.get("a") === undefined && c.get("d") === "D" && c.size === 3) {
      pass("makeCache eviction");
    } else {
      fail("makeCache eviction", `get(a)=${c.get("a")}, get(d)=${c.get("d")}, size=${c.size}`);
    }
  } catch (err) {
    fail("makeCache eviction", String(err?.message || err));
  }

  // Test cache re-setting
  try {
    const c = m.makeCache(3);
    c.set("a", "A");
    c.set("b", "B");
    c.set("c", "C");
    c.set("b", "B2");

    if (c.size === 3) {
      pass("makeCache re-set preserves size");
    } else {
      fail("makeCache re-set preserves size", `size=${c.size}`);
    }
  } catch (err) {
    fail("makeCache re-set preserves size", String(err?.message || err));
  }

  // Test bucketWidth
  try {
    if (m.bucketWidth(700) === 700) {
      pass("bucketWidth(700) === 700");
    } else {
      fail("bucketWidth(700) === 700", `got ${m.bucketWidth(700)}`);
    }
  } catch (err) {
    fail("bucketWidth(700) === 700", String(err?.message || err));
  }

  try {
    if (m.bucketWidth(712) === 700 && m.bucketWidth(713) === 725) {
      pass("bucketWidth(712) === 700 and bucketWidth(713) === 725");
    } else {
      fail("bucketWidth(712) === 700 and bucketWidth(713) === 725", `got bucketWidth(712)=${m.bucketWidth(712)}, bucketWidth(713)=${m.bucketWidth(713)}`);
    }
  } catch (err) {
    fail("bucketWidth(712) === 700 and bucketWidth(713) === 725", String(err?.message || err));
  }

  try {
    if (m.bucketWidth(0) === 0) {
      pass("bucketWidth(0) === 0");
    } else {
      fail("bucketWidth(0) === 0", `got ${m.bucketWidth(0)}`);
    }
  } catch (err) {
    fail("bucketWidth(0) === 0", String(err?.message || err));
  }

  // Test pxToPt
  try {
    if (m.pxToPt(700) === "525pt") {
      pass("pxToPt(700) === '525pt'");
    } else {
      fail("pxToPt(700) === '525pt'", `got ${m.pxToPt(700)}`);
    }
  } catch (err) {
    fail("pxToPt(700) === '525pt'", String(err?.message || err));
  }

  // Test buildTypstDoc with fontSize
  try {
    const doc = buildTypstDoc({ body: "x", pageWidth: "525pt", fontSize: "12pt", extraPreamble: "" });
    const hasWidth = doc.includes("525pt");
    const hasFontSize = doc.includes("12pt");

    if (hasWidth && hasFontSize) {
      pass("buildTypstDoc with fontSize includes both width and fontSize");
    } else {
      fail("buildTypstDoc with fontSize includes both width and fontSize", `hasWidth=${hasWidth}, hasFontSize=${hasFontSize}`);
    }
  } catch (err) {
    fail("buildTypstDoc with fontSize", String(err?.message || err));
  }

  // Test buildTypstDoc
  try {
    const doc = buildTypstDoc({ body: "hi", pageWidth: "450pt", extraPreamble: "#set text(size: 9pt)" });
    const hasWidth = doc.includes("width: 450pt");
    const hasHeight = doc.includes("height: auto");
    const hasExtra = doc.includes("#set text(size: 9pt)");
    const hasBody = doc.includes("hi");
    const noPreview = !doc.includes("@preview");
    const noTheorion = !doc.includes("theorion");

    if (hasWidth && hasHeight && hasExtra && hasBody && noPreview && noTheorion) {
      pass("buildTypstDoc generates correct structure");
    } else {
      fail("buildTypstDoc", `hasWidth=${hasWidth}, hasHeight=${hasHeight}, hasExtra=${hasExtra}, hasBody=${hasBody}, noPreview=${noPreview}, noTheorion=${noTheorion}`);
    }
  } catch (err) {
    fail("buildTypstDoc", String(err?.message || err));
  }

  // Test envColorGroup
  try {
    const groups = ["purple", "orange", "green", "blue"];
    const allKnown = groups.every((g) => g === envColorGroup(g === "purple" ? "problem" : g === "orange" ? "theorem" : g === "green" ? "definition" : "proposition"));
    const unknownDefault = envColorGroup("totally-unknown-env") === "purple";

    if (allKnown && unknownDefault) {
      pass("envColorGroup mapping");
    } else {
      fail("envColorGroup mapping", `allKnown=${allKnown}, unknownDefault=${unknownDefault}`);
    }
  } catch (err) {
    fail("envColorGroup mapping", String(err?.message || err));
  }

  // Test buildBoxHtml
  try {
    const html = buildBoxHtml({ env: "problem", label: "Problem", number: 2, svgHtml: "<svg/>" });
    const hasEnvClass = html.includes("problemset-env-problem");
    const hasGroupClass = ["purple", "orange", "green", "blue"].some((g) => html.includes(`problemset-g-${g}`));
    const hasTitle = html.includes("Problem 2");
    const hasSvg = html.includes("<svg/>");

    if (hasEnvClass && hasGroupClass && hasTitle && hasSvg) {
      pass("buildBoxHtml renders complete box");
    } else {
      fail("buildBoxHtml renders complete box", `hasEnvClass=${hasEnvClass}, hasGroupClass=${hasGroupClass}, hasTitle=${hasTitle}, hasSvg=${hasSvg}`);
    }
  } catch (err) {
    fail("buildBoxHtml renders complete box", String(err?.message || err));
  }
}

async function cleanup() {
  try {
    await fs.rm(buildDir, { recursive: true });
  } catch (err) {
    // Ignore cleanup errors
  }
}

async function main() {
  try {
    await setup();
    await buildPlugin();
    await runTests();
  } finally {
    await cleanup();
  }

  console.log(`\n${passCount} passed, ${failCount} failed`);
  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("smoke test failed:", err);
  process.exit(1);
});
