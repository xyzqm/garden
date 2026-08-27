import type { QuartzTransformerPlugin } from "@quartz-community/types";

export interface ProblemsetOptions {
  environments?: string[];
  markdownEmphasis?: boolean;
  numbering?: "per-page" | "off";
  pageWidth?: string;
  fontSize?: string;
  extraPreamble?: string;
  labels?: Record<string, string>;
}

export declare const Problemset: QuartzTransformerPlugin<Partial<ProblemsetOptions>>;
