import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler";
import { visit } from "unist-util-visit";
import {
  convertMarkdownEmphasis,
  buildTypstDoc,
  escapeHtml,
  postprocessSvg,
  envLabel,
  buildBoxHtml,
  BOX_CSS,
  DARK_CSS,
  prefixCss,
} from "../common.js";

// pageWidth/fontSize defaults are tuned to match the site's rendered body text,
// not a hard contract: the site's content column is ~750px wide on desktop, and
// 560pt ~= 747px, so an SVG rendered at `width: 100%` (see BOX_CSS) displays near
// 1:1 scale — meaning 12.5pt Typst text comes out at its true printed size,
// matching the surrounding body text instead of appearing shrunk.
const defaults = {
  environments: ["problem"],
  markdownEmphasis: true,
  numbering: "per-page",
  pageWidth: "560pt",
  fontSize: "12.5pt",
  extraPreamble: "",
  labels: {},
};

let compiler = null;
const svgCache = new Map();

const Problemset = (userOpts) => {
  const opts = { ...defaults, ...(userOpts || {}) };
  return {
    name: "Problemset",
    markdownPlugins(ctx) {
      return [
        () => async (tree, file) => {
          // Collect code blocks matching configured environments
          const nodes = [];
          visit(tree, "code", (node, index, parent) => {
            if (opts.environments.includes(node.lang)) {
              nodes.push({ index, parent, node });
            }
          });
          if (nodes.length === 0) return;

          // Track per-environment counters (1-based, in document order)
          const counters = new Map();

          for (const { index, parent, node } of nodes) {
            const env = node.lang;
            const n = (counters.get(env) || 0) + 1;
            counters.set(env, n);
            const number = opts.numbering === "per-page" ? n : null;
            const label = envLabel(env, opts.labels);

            const body = opts.markdownEmphasis
              ? convertMarkdownEmphasis(node.value)
              : node.value;
            const doc = buildTypstDoc({
              body,
              pageWidth: opts.pageWidth,
              fontSize: opts.fontSize,
              extraPreamble: opts.extraPreamble,
            });

            let html;
            try {
              let svg;
              if (svgCache.has(doc)) {
                svg = svgCache.get(doc);
                html = buildBoxHtml({ env, label, number, svgHtml: svg });
              } else {
                if (!compiler) compiler = NodeCompiler.create();
                const res = compiler.compile({ mainFileContent: doc });
                if (res.result) {
                  const rawSvg = compiler.svg({ mainFileContent: doc });
                  svg = postprocessSvg(rawSvg);
                  svgCache.set(doc, svg);
                  html = buildBoxHtml({ env, label, number, svgHtml: svg });
                } else {
                  const msgs = res
                    .takeDiagnostics()
                    .shortDiagnostics.map((d) => d.message);
                  console.warn(
                    `problemset: typst compile failed in ${file?.path}: ${msgs[0]}`
                  );
                  html = `<figure class="problemset problemset-error"><figcaption>problemset: typst compile failed</figcaption><pre>${escapeHtml(
                    msgs.join("\n")
                  )}</pre><pre>${escapeHtml(node.value)}</pre></figure>`;
                }
              }
            } catch (err) {
              console.warn(
                `problemset: typst compile failed in ${file?.path}: ${err?.message}`
              );
              html = `<figure class="problemset problemset-error"><figcaption>problemset: typst compile failed</figcaption><pre>${escapeHtml(
                String(err?.message || err)
              )}</pre><pre>${escapeHtml(node.value)}</pre></figure>`;
            }

            parent.children.splice(index, 1, { type: "html", value: html });
          }

          if (compiler) compiler.evictCache(30);
        },
      ];
    },
    externalResources() {
      return {
        css: [
          {
            content: BOX_CSS + "\n" + prefixCss(DARK_CSS, ':root[saved-theme="dark"]'),
            inline: true,
          },
        ],
      };
    },
  };
};

export { Problemset };
