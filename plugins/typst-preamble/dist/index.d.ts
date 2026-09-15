import type { QuartzTransformerPlugin } from "@quartz-community/types";

export interface TypstPreambleOptions {
  preambleFile?: string;
  preamble?: string;
}

export declare const TypstPreamble: QuartzTransformerPlugin<Partial<TypstPreambleOptions>>;
