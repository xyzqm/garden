/**
 * Shared between the `backlinks` and `graph` plugin forks so both detect Base
 * transclusions the same way. Node-only (reads source files from disk) — only
 * import this from build-time code, never from a client-bundled script.
 */
import { readFileSync } from "fs";
import { join } from "path";
import type { Edge } from "./collapse-edges";
import { isBaseSlug } from "./collapse-edges";

export interface EmbedScanFile {
  slug: string;
  /** Path relative to the content directory (`argv.directory`) — NOT `filePath`, which vfile sets to the full/absolute path. */
  relativePath?: string;
}

const embedRegex = /!\[\[([^\]|#]+)/g;

/**
 * Obsidian resolves embeds by bare filename, so match a base by name with or
 * without extension. Derived from `slug`, not `relativePath` — Quartz assigns
 * Base virtual pages a synthetic `relativePath` of `<slug>.md` that doesn't
 * correspond to any file on disk, but the slug itself reliably keeps the
 * `.base` extension (see bases-page's `slugifyFilePath` usage).
 */
function buildBaseLookup(baseFiles: EmbedScanFile[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const f of baseFiles) {
    const fileName = f.slug.split("/").pop() ?? "";
    const nameNoExt = fileName.replace(/\.base$/i, "");
    lookup.set(fileName.toLowerCase(), f.slug);
    lookup.set(nameNoExt.toLowerCase(), f.slug);
    lookup.set(f.slug.toLowerCase(), f.slug);
  }
  return lookup;
}

/**
 * Scans each non-Base file's raw markdown source for `![[SomeBase]]` transclusions
 * and returns a `page -> base` edge for every embed found. The bases-page plugin
 * consumes these transclusions during its own HTML transform and never registers
 * them as normal links, so this has to be recovered independently by re-reading
 * the source from disk.
 */
export function findBaseEmbedEdges(allFiles: EmbedScanFile[], contentDir: string): Edge[] {
  const baseFiles = allFiles.filter((f) => isBaseSlug(f.slug));
  if (baseFiles.length === 0) return [];
  const lookup = buildBaseLookup(baseFiles);

  const edges: Edge[] = [];
  for (const file of allFiles) {
    if (isBaseSlug(file.slug) || !file.relativePath) continue;

    let raw: string;
    try {
      raw = readFileSync(join(contentDir, file.relativePath), "utf-8");
    } catch {
      continue;
    }

    embedRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = embedRegex.exec(raw))) {
      const target = match[1]?.trim().toLowerCase();
      const baseSlug = target ? lookup.get(target) : undefined;
      if (baseSlug) edges.push({ source: file.slug, target: baseSlug });
    }
  }
  return edges;
}
