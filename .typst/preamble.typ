// Shared Typst preamble. Injected at the start of every math block by
// plugins/typst-preamble, because rehype-typst compiles each equation as its
// own standalone document with no shared scope.
//
// Definitions only. A `#set`/`#show` rule here would apply to just one equation,
// and page-level settings would fight rehype-typst's own template.
//
// Keep in sync with .obsidian/plugins/typst/data.json -> preamable.shared
#let pref = math.scripts(sym.succ)
#let wpref = math.scripts(sym.succ.eq)
