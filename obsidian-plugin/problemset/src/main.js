import { $typst, TypstSnippet } from "@myriaddreamin/typst.ts/contrib/snippet";
import { buildTypstDoc, convertMarkdownEmphasis, postprocessSvg, envLabel, buildBoxHtml } from "../../../plugins/problemset/common.js";
import { Plugin, MarkdownRenderChild } from "obsidian";
import { ProblemsetSettingTab, DEFAULT_SETTINGS } from "./settings.js";

const svgCache = makeCache(200);
let compileQueue = Promise.resolve();
let providersRegistered = false; // $typst is a module-level singleton; only register once per bundle evaluation

function enqueueCompile(fn) {
  const p = compileQueue.then(fn, fn);
  compileQueue = p.catch(() => {});
  return p;
}

function makeCache(limit) {
  const map = new Map();

  return {
    get(k) {
      return map.get(k);
    },
    set(k, v) {
      if (map.has(k)) {
        map.delete(k);
      }
      map.set(k, v);
      if (map.size > limit) {
        const first = map.keys().next().value;
        map.delete(first);
      }
    },
    clear() {
      map.clear();
    },
    get size() {
      return map.size;
    },
  };
}

function countFencesBefore(text, env, lineStart) {
  const lines = text.split("\n");
  const escapedEnv = env.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fenceRegex = new RegExp("^`{3,}\\s*" + escapedEnv + "\\s*$");
  let count = 0;
  for (let i = 0; i < lineStart && i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (fenceRegex.test(trimmed)) {
      count++;
    }
  }
  return count;
}

function renderErrorCard(el, errorText, source) {
  el.innerHTML = "";
  const errorDiv = document.createElement("div");
  errorDiv.className = "problemset-error";
  const title = document.createElement("div");
  title.className = "problemset-error-title";
  title.textContent = "problemset: typst compile failed";
  errorDiv.appendChild(title);
  const errPre = document.createElement("pre");
  errPre.textContent = errorText;
  errorDiv.appendChild(errPre);
  const srcPre = document.createElement("pre");
  srcPre.textContent = source;
  errorDiv.appendChild(srcPre);
  el.appendChild(errorDiv);
}

function measureWidth(el) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => {
      if (!done) {
        done = true;
        resolve(v);
      }
    };
    requestAnimationFrame(() => finish(el.clientWidth || el.parentElement?.clientWidth || 0));
    setTimeout(() => finish(el.clientWidth || el.parentElement?.clientWidth || 0), 100);
  });
}

function bucketWidth(px) {
  return Math.round(px / 25) * 25;
}

function pxToPt(px) {
  return (px * 0.75) + "pt";
}

export default class ProblemsetPlugin extends Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    this._resizeObservers = new Set();
  }

  async onload() {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data || {});

    this.addSettingTab(new ProblemsetSettingTab(this.app, this));

    for (const env of this.settings.environments) {
      this.registerMarkdownCodeBlockProcessor(env, (source, el, ctx) => this.processBlock(source, el, ctx, env));
    }
  }

  onunload() {
    for (const observer of this._resizeObservers) {
      observer.disconnect();
    }
    this._resizeObservers.clear();
  }

  async processBlock(source, el, ctx, env) {
    try {
      const body = this.settings.markdownEmphasis ? convertMarkdownEmphasis(source) : source;

      let number = null;
      if (this.settings.numbering === "per-page") {
        const info = ctx.getSectionInfo(el);
        if (info) number = 1 + countFencesBefore(info.text, env, info.lineStart);
      }

      // cache miss: placeholder, then measure, then compile
      el.innerHTML = "";
      const placeholder = document.createElement("div");
      placeholder.className = "problemset-placeholder";
      placeholder.textContent = "rendering…";
      el.appendChild(placeholder);

      const px = await measureWidth(el);
      const bucket = bucketWidth(px);
      const pageWidth = bucket > 0 ? pxToPt(bucket) : this.settings.pageWidth;

      const doc = buildTypstDoc({ body, pageWidth, fontSize: this.settings.fontSize, extraPreamble: this.settings.extraPreamble });

      await this.ensureInit();
      if (!el.isConnected) return;

      await this.renderBlock(el, doc, env, number, source);

      if (el.isConnected) {
        this.attachResizeObserver(el, ctx, source, env, number, bucket);
      }
    } catch (err) {
      if (!el.isConnected) return;
      const errorText = String(err?.message || err);
      console.warn("problemset: unexpected error", err);
      renderErrorCard(el, errorText, source);
    }
  }

  async renderBlock(el, doc, env, number, source) {
    const cachedSvgHtml = svgCache.get(doc);
    if (cachedSvgHtml !== undefined) {
      if (!el.isConnected) return;
      el.innerHTML = buildBoxHtml({ env, label: envLabel(env, {}), number, svgHtml: cachedSvgHtml });
      return;
    }

    const result = await enqueueCompile(() => this.compileDoc(doc));

    if (result.svg) {
      const svgHtml = postprocessSvg(result.svg);
      svgCache.set(doc, svgHtml);
      if (!el.isConnected) return;
      el.innerHTML = buildBoxHtml({ env, label: envLabel(env, {}), number, svgHtml });
    } else {
      if (!el.isConnected) return;
      console.warn("problemset: typst compile failed", result.error);
      renderErrorCard(el, result.error, source);
    }
  }

  attachResizeObserver(el, ctx, source, env, number, lastBucket) {
    let debounceTimer = null;
    const observer = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!el.isConnected) {
          observer.disconnect();
          this._resizeObservers.delete(observer);
          return;
        }

        if (el.clientWidth === 0) {
          return;
        }

        const newBucket = bucketWidth(el.clientWidth);
        if (newBucket !== lastBucket) {
          lastBucket = newBucket;
          const pageWidth = newBucket > 0 ? pxToPt(newBucket) : this.settings.pageWidth;
          const body = this.settings.markdownEmphasis ? convertMarkdownEmphasis(source) : source;
          const doc = buildTypstDoc({ body, pageWidth, fontSize: this.settings.fontSize, extraPreamble: this.settings.extraPreamble });
          this.renderBlock(el, doc, env, number, source).catch((err) => {
            console.warn("problemset: resize re-render failed", err);
          });
        }
      }, 250);
    });

    observer.observe(el);
    this._resizeObservers.add(observer);

    // A ResizeObserver on a detached element never fires, so the debounced
    // callback's own isConnected check can't be the cleanup path — ctx.addChild
    // is what actually guarantees this observer gets torn down.
    const child = new MarkdownRenderChild(el);
    child.onunload = () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
      this._resizeObservers.delete(observer);
    };
    ctx.addChild(child);
  }

  async ensureInit() {
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      try {
        const pluginDir = this.manifest.dir || `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
        const adapter = this.app.vault.adapter;

        const compilerWasmBytes = await adapter.readBinary(`${pluginDir}/typst_ts_web_compiler_bg.wasm`);
        const rendererWasmBytes = await adapter.readBinary(`${pluginDir}/typst_ts_renderer_bg.wasm`);

        const fontBytes = [];
        try {
          const fontDir = `${pluginDir}/fonts`;
          const listing = await adapter.list(fontDir);
          for (const file of listing.files) {
            if (file.endsWith(".otf") || file.endsWith(".ttf")) {
              const bytes = await adapter.readBinary(file);
              // adapter.readBinary returns an ArrayBuffer; typst.ts's font loader only
              // treats Uint8Array as raw bytes (anything else is fetched as a URL).
              fontBytes.push(new Uint8Array(bytes));
            }
          }
        } catch (err) {
          // Font dir missing or unreadable; proceed with no preloaded fonts
          console.warn("problemset: fonts dir missing", err);
        }

        if (!providersRegistered) {
          $typst.setCompilerInitOptions({ getModule: () => ({ module_or_path: compilerWasmBytes }) });
          $typst.setRendererInitOptions({ getModule: () => ({ module_or_path: rendererWasmBytes }) });

          $typst.use(
            TypstSnippet.disableDefaultFontAssets(),
            ...fontBytes.map((b) => TypstSnippet.preloadFontData(b)),
          );

          providersRegistered = true;
        }

        await $typst.getCompiler();
      } catch (err) {
        this._initPromise = null;
        throw err;
      }
    })();

    return this._initPromise;
  }

  async compileDoc(doc) {
    try {
      const compiler = await $typst.getCompiler();
      compiler.addSource("/main.typ", doc);
      // Use the two-step compile + svg approach: $typst.svg({ mainContent }) hardcodes
      // diagnostics: 'none', so failures return { result: undefined } with no error text.
      // Instead, compile directly and use $typst.svg for the vector→SVG step only.
      const res = await compiler.compile({ mainFilePath: "/main.typ", diagnostics: "unix" });
      if (res.result) {
        const svg = await $typst.svg({ vectorData: res.result });
        return { svg };
      }
      return { error: (res.diagnostics || []).join("\n") || "compile failed with no diagnostics" };
    } catch (err) {
      return { error: String(err?.message || err) };
    }
  }

  async clearCaches() {
    svgCache.clear();
  }

  async saveSettings() {
    await this.saveData(this.settings);
    svgCache.clear();
  }
}

export { countFencesBefore, makeCache, bucketWidth, pxToPt };
