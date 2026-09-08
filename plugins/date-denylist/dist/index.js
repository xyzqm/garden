import { execFileSync } from "node:child_process";
import path from "node:path";
import { styleText } from "node:util";

// Two bulk mechanical commits (a filename migration that also rewrote wikilink
// casing, e.g. [[akari]] -> [[Akari]]) reset the "modified" date of ~40 pages
// that had no meaningful content change, because created-modified-date's git
// strategy just takes the last commit that touched the path. This plugin
// re-derives `data.dates.modified` from git history while ignoring commits on
// `ignoreCommits`, so those mechanical commits no longer count as content edits.
const defaultOptions = {
  ignoreCommits: [],
};

const DateDenylist = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  return {
    name: "DateDenylist",
    markdownPlugins(ctx) {
      return [
        () => {
          let repoRoot;
          const dates = new Map();
          let broken = false;

          try {
            repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
              cwd: ctx.argv.directory,
              encoding: "utf8",
              maxBuffer: 1 << 28,
            }).trim();

            const output = execFileSync(
              "git",
              [
                "-c",
                "core.quotepath=false",
                "log",
                "-z",
                "-M",
                "--name-status",
                "--format=C%x09%aI%x09%H",
              ],
              {
                cwd: repoRoot,
                encoding: "utf8",
                maxBuffer: 1 << 28,
              }
            );

            const tokens = output
              .split("\0")
              .map((t) => t.replace(/^\n+/, ""))
              .filter((t) => t.length > 0);

            const alias = new Map();
            let curIso;
            let curSha;
            let ignored = false;

            let i = 0;
            while (i < tokens.length) {
              const tok = tokens[i];
              if (tok.startsWith("C\t")) {
                const [, iso, sha] = tok.split("\t");
                curIso = iso;
                curSha = sha;
                ignored = opts.ignoreCommits.some(
                  (entry) =>
                    entry.length >= 7 &&
                    (curSha === entry || curSha.startsWith(entry))
                );
                i += 1;
                continue;
              }

              const status = tok;
              if (status.startsWith("R") || status.startsWith("C")) {
                const oldPath = tokens[i + 1];
                const newPath = tokens[i + 2];
                const cur = alias.get(newPath) ?? newPath;
                if (status.startsWith("R")) {
                  alias.set(oldPath, cur);
                  const sim = status.slice(1);
                  if (sim !== "100" && !ignored && !dates.has(cur)) {
                    dates.set(cur, curIso);
                  }
                } else if (!ignored && !dates.has(cur)) {
                  dates.set(cur, curIso);
                }
                i += 3;
              } else {
                const p = tokens[i + 1];
                if (status === "M" || status === "A") {
                  const cur = alias.get(p) ?? p;
                  if (!ignored && !dates.has(cur)) {
                    dates.set(cur, curIso);
                  }
                }
                i += 2;
              }
            }
          } catch (e) {
            console.log(
              styleText(
                "yellow",
                `\nWarning: date-denylist couldn't walk git history for ${ctx.argv.directory}, dates will be unaffected`
              )
            );
            broken = true;
          }

          return async (_tree, file) => {
            if (broken) return;
            const data = file.data;
            if (!data.dates) return;
            if (data.frontmatter?.modified) return;
            const key = path
              .relative(repoRoot, path.resolve(data.filePath))
              .split(path.sep)
              .join("/");
            const iso = dates.get(key);
            if (iso) {
              data.dates.modified = new Date(iso);
            }
          };
        },
      ];
    },
  };
};

export { DateDenylist };
