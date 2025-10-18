---
title: Setting up this blog
---
The main issue I ran into while setting up this blog was figuring out how to add support for TiKZ. After some digging, I found [this issue](https://github.com/jackyzha0/quartz/issues/1988) on the Quartz repository, under which a user linked to their own transformer plugin for TiKZ.

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