import { visit } from "unist-util-visit";
import { splitAnchor } from "@quartz-community/utils";

// crawl-links skips any href that already starts with "#" (same-page anchors),
// so wikilinks like [[#^blockid|alias]] (no file path) never get their block
// reference caret stripped/slugified the way `mass-points#^blockid` does.
// This runs after crawl-links and normalizes those bare anchors the same way.
const AnchorFix = () => {
  return {
    name: "AnchorFix",
    htmlPlugins() {
      return [
        () => (tree) => {
          visit(tree, "element", (node) => {
            if (
              node.tagName === "a" &&
              typeof node.properties?.href === "string" &&
              node.properties.href.startsWith("#")
            ) {
              // mdast-to-hast percent-encodes the href (e.g. "^" -> "%5E")
              // before any rehype plugin runs, so decode before normalizing.
              const decoded = decodeURIComponent(node.properties.href);
              const [, anchor] = splitAnchor(decoded);
              node.properties.href = anchor;
            }
          });
        },
      ];
    },
  };
};

export { AnchorFix };
