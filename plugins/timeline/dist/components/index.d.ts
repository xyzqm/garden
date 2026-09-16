import { QuartzComponent } from '@quartz-community/types';

interface TimelineOptions {
    /** Slash-joined folder path (e.g. "posts") whose pages populate the timeline. */
    folder: string;
    title?: string;
}
declare const _default: (userOpts?: Partial<TimelineOptions>) => QuartzComponent;

export { _default as Timeline, type TimelineOptions };
