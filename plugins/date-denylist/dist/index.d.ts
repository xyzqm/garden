import type { QuartzTransformerPlugin } from "@quartz-community/types";
export interface DateDenylistOptions {
  ignoreCommits: string[];
}
export declare const DateDenylist: QuartzTransformerPlugin<Partial<DateDenylistOptions>>;
