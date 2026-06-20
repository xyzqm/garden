import { load, tex, dvi2svg } from "node-tikzjax";
import { visit } from "unist-util-visit";

const TikzJax = () => {
  return {
    name: "TikzJax",
    markdownPlugins(ctx) {
      return [
        () => async (tree, _file) => {
          const nodes = [];
          visit(tree, "code", (node, index, parent) => {
            if (node.lang === "tikz") {
              nodes.push({ index, parent, value: node.value });
            }
          });

          if (nodes.length === 0) return;

          await load();

          for (const { index, parent, value } of nodes) {
            const dvi = await tex(value, { showConsole: ctx.argv.verbose });
            let svg = await dvi2svg(dvi);
            svg = svg
              .replaceAll(/("#000"|"black")/g, '"currentColor"')
              .replaceAll(/("#fff"|"white")/g, '"var(--background-primary)"');
            parent.children.splice(index, 1, {
              type: "html",
              value: `<div class="tikz">${svg}</div>`,
            });
          }
        },
      ];
    },
    externalResources() {
      return {
        css: [
          {
            content: "https://cdn.jsdelivr.net/npm/node-tikzjax@latest/css/fonts.css",
          },
        ],
      };
    },
  };
};

export { TikzJax };
