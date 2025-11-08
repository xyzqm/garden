import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
//@ts-ignore
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
//@ts-ignore
import { visit } from "unist-util-visit"
import { Element } from "hast"
import { toString } from "hast-util-to-string"
import { typst2tex } from "tex2typst"

export const Latex: QuartzTransformerPlugin = () => {
  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      return [
        () => {
          return (tree) => {
            // using tex2typst, convert all math blocks returned by remarkMath to latex
            visit(tree, "element", (node: Element) => {
              const classes = Array.isArray(node.properties.className)
                ? node.properties.className
                : []

              if (classes.includes("language-math")) {
                node.children = [{ type: "text", value: typst2tex(toString(node)) }]
              }
            })
          }
        },
        [rehypeKatex, { output: "html", macros: { "\\xor": "\\oplus" } } as KatexOptions],
      ]
    },
    externalResources() {
      return {
        css: [{ content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" }],
        js: [
          {
            // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
            src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
            loadTime: "afterDOMReady",
            contentType: "external",
          },
        ],
      }
    },
  }
}
