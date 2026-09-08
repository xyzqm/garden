// Local stand-in for `remove-draft` that mirrors its draft-detection logic,
// but keeps draft pages when live-previewing locally (`npx quartz build --serve`)
// or when QUARTZ_INCLUDE_DRAFTS is explicitly set.
const includeDraftsEnv =
  process.env.QUARTZ_INCLUDE_DRAFTS === "1" || process.env.QUARTZ_INCLUDE_DRAFTS === "true";

const DraftFilter = () => ({
  name: "DraftFilter",
  shouldPublish(ctx, [_tree, vfile]) {
    // publish everything when live-previewing locally, or when explicitly asked
    if (ctx.argv.serve || includeDraftsEnv) return true;
    const frontmatter = vfile.data?.frontmatter;
    const draftFlag = frontmatter?.draft === true || frontmatter?.draft === "true";
    return !draftFlag;
  },
});

export { DraftFilter };
