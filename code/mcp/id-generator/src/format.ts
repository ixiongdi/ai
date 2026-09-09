import type { Algorithm } from "./types.js";
import type { Recommendation } from "./recommend.js";

export function algorithmRow(a: Algorithm): string {
  return `| \`${a.slug}\` | ${a.idType} | ${a.output} | ${a.sortable} | ${a.coordination} | ${a.jsSafe} | ${a.localGenerate} |`;
}

export function listMarkdown(
  items: Algorithm[],
  total: number,
  offset: number,
  hasMore: boolean,
  nextOffset: number | null,
): string {
  const header = [
    `| slug | IdType | output | sortable | coord | js_safe | local_gen |`,
    `| ---- | ------ | ------ | -------- | ----- | ------- | --------- |`,
    ...items.map(algorithmRow),
  ].join("\n");
  return [
    `# ID algorithms`,
    "",
    `Showing ${items.length} of ${total} (offset ${offset}).`,
    hasMore ? `More results: next_offset=${nextOffset}` : "End of list.",
    "",
    header,
  ].join("\n");
}

export function recommendMarkdown(rec: Recommendation): string {
  const alts = rec.alternatives
    .map((a) => `- \`${a.slug}\` (${a.idType})`)
    .join("\n");
  return [
    `# Recommendation: \`${rec.primary.slug}\``,
    "",
    rec.reason,
    "",
    `- IdType: ${rec.primary.idType}`,
    `- Coordination: ${rec.primary.coordination}`,
    `- JS-safe number: ${rec.primary.jsSafe}`,
    `- Local samples: ${rec.primary.localGenerate}`,
    "",
    "## Alternatives",
    "",
    alts || "- (none)",
  ].join("\n");
}

export function generateMarkdown(
  slug: string,
  ids: string[],
  note: string,
  warning?: string,
): string {
  return [
    `# Sample IDs: \`${slug}\``,
    "",
    note,
    ...(warning ? ["", `Warning: ${warning}`] : []),
    "",
    ...ids.map((id) => `- \`${id}\``),
  ].join("\n");
}

export function explainMarkdown(
  slug: string,
  idType: string,
  structure: string,
  use: string,
  limitations: string,
): string {
  return [
    `# \`${slug}\` (${idType})`,
    "",
    "## Structure",
    "",
    structure,
    "",
    "## When to use",
    "",
    use,
    "",
    "## Limitations",
    "",
    limitations,
  ].join("\n");
}
