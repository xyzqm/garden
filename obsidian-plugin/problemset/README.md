# Problemset (Obsidian plugin)

Renders ```` ```problem ```` code fences as styled boxes with Typst-rendered content in
WebAssembly. The plugin is fully offline at runtime — Typst compiles only the problem
body (plain text, zero `@preview` imports), and the box chrome (border, title tab,
colours, symbol) is HTML/CSS from the shared `plugins/problemset/common.js`, replicating
a "theorion fancy" look. It is the Obsidian half of the Quartz `problemset` transformer
in `plugins/problemset/` — both sides import the same `plugins/problemset/common.js`, so
a note renders identically in the vault and on the published site.

````markdown
```problem
Let $f$ be **continuous** on $[0,1]$. Show that ...
```
````

## Environments

Each name in the *Environments* setting is registered as a code-fence language and
rendered as a Typst box, so ```` ```problem ```` renders a problem box and ```` ```theorem ````
renders a theorem box. The environment determines the box color group (purple for problems,
orange for theorems, etc.) and numbering if enabled.
Changing the list requires reloading the plugin, since the fence processors are
registered at load time.

Numbering is per-note: with *Numbering* set to `per-page`, the plugin counts the
preceding fences of the same environment in the note, so the boxes read 1, 2, 3 down the page.

## Fully offline at runtime

The plugin is fully offline at runtime — every compilation happens locally in WASM, with
no network calls whatsoever. The only network use anywhere is `npm run sync`'s one-time
font fetch from the typst-assets repo via jsDelivr onto local disk. The fonts are copied
into the plugin folder alongside the two `.wasm` binaries and read from there through the
vault adapter at first render, never fetched again.

## Sizing and selection

Each block is compiled at the measured pixel width of its container (rounded to 25px
buckets so the render cache still hits), so the SVG displays 1:1 and text appears at its
true point size rather than being scaled down. The *Page width* setting is only the
fallback for when that measurement fails. *Font size* (default `12pt`, roughly Obsidian's
16px editor default) sets the Typst text size.

Resizing the pane re-renders any block whose width bucket changed, debounced by 250ms.
Rendered text stays selectable and copyable: Typst's invisible text layer is preserved and
its stylesheet scoped to the box, so it does not leak into the rest of the note.

## Rebuilding

```sh
cd obsidian-plugin/problemset
npm install
npm run sync
```

`sync` regenerates `styles.css` from the shared module, downloads fonts into `fonts/` if
not already there, builds `dist/main.js`, and copies the manifest, stylesheet, bundle,
both `.wasm` files, and the fonts into `.obsidian/plugins/problemset/`. It does not enable
the plugin — do that once in Obsidian's settings.

`npm run build` builds only. `npm run smoke` runs the pure-logic tests (fence counting,
cache eviction, document building, box HTML) without loading WASM.

The fonts come from the `typst/typst-assets` v0.13.1 repo via jsDelivr at sync time — there
is no npm package for them. Libertinus Serif (Typst's default text face), NewCMMath, and
DejaVu Sans Mono are enough for the boxes; add more to `scripts/fetch-fonts.mjs` if a note
needs them.
