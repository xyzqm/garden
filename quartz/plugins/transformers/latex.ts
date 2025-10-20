import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/svg"
//@ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
import { Options as MathjaxOptions } from "rehype-mathjax/svg"
//@ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"
import { visit } from "unist-util-visit"
import { Element } from "hast"
import { toString } from "hast-util-to-string"
import { typst2tex } from "tex2typst"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  mathJaxOptions: Omit<MathjaxOptions, "macros">
  typstOptions: TypstOptions
}

interface MacroType {
  [key: string]: string
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "katex"
  const macros = opts?.customMacros ?? {}
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
              // console.log(node.properties.className)
              const classes = Array.isArray(node.properties.className)
                ? node.properties.className
                : []

              if (classes.includes("language-math")) {
                // console.log(toString(node))
                // console.log(typst2tex(toString(node)))
                // console.log(node)
                node.children = [{ type: "text", value: typst2tex(toString(node)) }]
              }
            })
          }
        },
        [rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }],
      ]
      // switch (engine) {
      //   case "katex": {
      //     return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
      //   }
      //   case "typst": {
      //     return [[rehypeTypst, opts?.typstOptions ?? {}]]
      //   }
      //   case "mathjax": {
      //     return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
      //   }
      //   default: {
      //     return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
      //   }
      // }
    },
    externalResources() {
      switch (engine) {
        case "katex":
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
      }
    },
  }
}
