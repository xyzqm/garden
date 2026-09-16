import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
  FullSlug,
} from "@quartz-community/types";
import { resolveRelative } from "@quartz-community/utils/path";
import { getDate } from "@quartz-community/utils/sort";
import style from "./styles/timeline.scss";
// @ts-expect-error - Inline script loaded as text by esbuild plugin
import script from "./scripts/timeline.inline.ts";

export interface TimelineOptions {
  /** Slash-joined folder path (e.g. "posts") whose pages populate the timeline. */
  folder: string;
  title?: string;
}

const defaultOptions: TimelineOptions = {
  folder: "posts",
};

type TimelineFile = QuartzPluginData & Record<string, unknown>;

interface TimelineEntry {
  file: TimelineFile;
  date: Date;
}

// Memoized across every page render within a single build: recomputing the
// filtered + sorted post list from allFiles on every one of ~170 page
// renders would be wasted work. Mirrors the `cachedForFiles !== allFiles`
// cache in plugins/backlinks/src/components/Backlinks.tsx.
let cachedForFiles: unknown;
let cachedEntries: TimelineEntry[] = [];

function buildEntries(allFiles: TimelineFile[], folder: string): TimelineEntry[] {
  const prefix = `${folder}/`;
  const withDates: TimelineEntry[] = [];

  for (const file of allFiles) {
    const slug = file.slug as string | undefined;
    if (!slug || !slug.startsWith(prefix)) continue;
    // Exclude folder/tag index pages.
    if (slug.endsWith("/index")) continue;

    const date = getDate(file);
    if (!date) continue;

    withDates.push({ file, date });
  }

  // Copy before sorting -- sorting allFiles (or an array view backed by the
  // same source) in place is the bug Quartz's own PageList.tsx has.
  return withDates.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
}

function dayNumber(d: Date): number {
  return Math.floor(d.getTime() / 86400000);
}

export default ((userOpts?: Partial<TimelineOptions>) => {
  const opts: TimelineOptions = { ...defaultOptions, ...userOpts };

  const TimelineComponent: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
    if (cachedForFiles !== allFiles) {
      cachedEntries = buildEntries(allFiles as TimelineFile[], opts.folder);
      cachedForFiles = allFiles;
    }

    if (cachedEntries.length === 0) return null;

    const oldestDay = dayNumber(cachedEntries[cachedEntries.length - 1]!.date);
    const currentSlug = fileData.slug as string | undefined;
    const currentFullSlug = fileData.slug as FullSlug;

    let lastMonth: string | undefined;

    const nodes = cachedEntries.map(({ file, date }) => {
      const slug = file.slug as string;
      const days = dayNumber(date) - oldestDay;
      const words = ((file.text as string | undefined) ?? "").split(/\s+/).filter(Boolean).length;
      const month = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getFullYear() % 100).padStart(2, "0")}`;

      // Entries are in newest-first order, so the first time a month key is
      // seen, that entry is the newest post of that month.
      const isFirstOfMonth = month !== lastMonth;
      lastMonth = month;

      const title = (file.frontmatter as { title?: string } | undefined)?.title ?? slug;
      const href = resolveRelative(currentFullSlug, slug as FullSlug);
      const isCurrent = slug === currentSlug;

      return (
        <a
          key={slug}
          class="internal timeline-node"
          href={href}
          data-days={days}
          data-words={words}
          data-month={month}
          data-first-of-month={isFirstOfMonth ? "true" : "false"}
          data-current={isCurrent ? "true" : "false"}
        >
          <span class="timeline-dot"></span>
          <span class="timeline-title">{title}</span>
        </a>
      );
    });

    return (
      <div class="timeline" data-timeline>
        <div class="timeline-axis"></div>
        {nodes}
      </div>
    );
  };

  TimelineComponent.css = style;
  TimelineComponent.afterDOMLoaded = script;

  return TimelineComponent;
}) satisfies QuartzComponentConstructor;
