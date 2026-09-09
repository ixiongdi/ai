export type Coordination = "none" | "shared" | "worker";
export type OutputKind = "long" | "string" | "uuid" | "binary";
export type Sortable = "time" | "lex" | "mono" | "no";
export type GenerateBlock = "shared" | "not_implemented";

export interface Algorithm {
  slug: string;
  idType: string;
  description: string;
  output: OutputKind;
  sortable: Sortable;
  coordination: Coordination;
  jsSafe: boolean;
  localGenerate: boolean;
  generateBlockReason?: GenerateBlock;
  needsName?: boolean;
  localOnly?: boolean;
}

export const SERVER_VERSION = "1.1.0";
