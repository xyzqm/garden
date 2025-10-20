---
title: Setting up this blog
---
The main issue I ran into while setting up this blog was figuring out how to add support for TikZ. After some digging, I found [this issue](https://github.com/jackyzha0/quartz/issues/1988) on the Quartz repository, under which a user linked to their own transformer plugin for TikZ.

However, that transformer didn't work when I tried to use it directly, so I ended up digging up a copy of that transformer from an older version of his repo instead 😩 You can find my version [here](https://github.com/xyzqm/garden/blob/v4/quartz/plugins/transformers/tikz.ts). I also had to add this bit
```js
svg = svg
  .replaceAll(/("#000"|"black")/g, `"currentColor"`)
  .replaceAll(/("#fff"|"white")/g, `"var(--background-primary)"`)
```
as well as this to `custom.scss`
```css
svg > g {
  fill: currentColor;
}
```
In order to get the diagrams to render properly in dark mode (which took me way too long to figure out).

Overall, I'd say the experience of setting up Quartz was not the greatest. It also took me a while to figure out how to add custom CSS (`custom.scss`) as well as how to hide title and reading time on the main page (which can be done like [so](https://github.com/xyzqm/garden/blob/afe411caa802333cde445c7f3e8bba67e9b82cb2/quartz.layout.ts#L24)).

Hoping for smoother sailing from here 🙏

### UPD: 10/18
Ran into another stupid issue because Typst injected the following block of CSS into my page:
```css
svg {
	fill: none
}
```

Genuinely, why? I was considering switching to KaTeX but ultimately decided against it, opting for a [stupid, vibe-coded fix](https://github.com/xyzqm/garden/commit/4933c0ab9cece1458f0d5261876bb346e1e97f5d#diff-daf6fe07165fdca40b7f30f223cfc1d94d958b4b6803bbb9772fc0c667f9129e) (see `tikz.ts`) instead that basically sets `fill = currentColor` for all SVG elements that don't currently have `fill` set. Truly 🤮

### UPD: 10/19
Replaced vibe-coded fix with [this](https://github.com/xyzqm/garden/blob/f2d3b367865f93342de45989c3cdbc6517d89705/quartz/styles/custom.scss#L15) instead, hopefully everything works now