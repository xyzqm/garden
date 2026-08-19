# Comment Span

Renders the inline `{text|comment}` syntax as `text` with a dim highlighted background; hovering over it shows `comment` in a tooltip. Works in both Reading view and Live Preview, and skips code blocks, inline code, and rendered math (including typst/wypst/mathlinks/tikzjax output) so it won't interfere with math-heavy notes.

## Install

Copy this folder into your vault's plugins directory, then enable it in Obsidian's Community Plugins settings:

```sh
cp -r obsidian-plugin/comment-span .obsidian/plugins/comment-span
```

Then reload Obsidian (or toggle the plugin off/on) and enable "Comment Span" under Settings → Community plugins.
