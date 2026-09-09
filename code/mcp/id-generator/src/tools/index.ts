import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import {
  allSlugs,
  filterAlgorithms,
  getAlgorithm,
  implementedSlugs,
} from "../catalog.js";
import { recommend } from "../recommend.js";
import { generateLocal } from "../generators/index.js";
import { getExplain } from "../explain.js";
import {
  explainMarkdown,
  generateMarkdown,
  listMarkdown,
  recommendMarkdown,
} from "../format.js";
import { log } from "../log.js";
import type { Algorithm } from "../types.js";

const ResponseFormat = z.enum(["markdown", "json"]).default("markdown");

const algorithmSchema = z.object({
  slug: z.string(),
  idType: z.string(),
  description: z.string(),
  output: z.enum(["long", "string", "uuid", "binary"]),
  sortable: z.enum(["time", "lex", "mono", "no"]),
  coordination: z.enum(["none", "shared", "worker"]),
  jsSafe: z.boolean(),
  localGenerate: z.boolean(),
  generateBlockReason: z.enum(["shared", "not_implemented"]).optional(),
  needsName: z.boolean().optional(),
  localOnly: z.boolean().optional(),
});

function ok(text: string, structured: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text }],
    structuredContent: structured,
  };
}

function fail(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true as const,
  };
}

function unknownSlug(slug: string): string {
  return `Error: Unknown algorithm '${slug}'. Valid slugs: ${allSlugs().join(", ")}.`;
}

function publicAlgorithm(a: Algorithm): z.infer<typeof algorithmSchema> {
  const row: z.infer<typeof algorithmSchema> = {
    slug: a.slug,
    idType: a.idType,
    description: a.description,
    output: a.output,
    sortable: a.sortable,
    coordination: a.coordination,
    jsSafe: a.jsSafe,
    localGenerate: a.localGenerate,
  };
  if (a.generateBlockReason) row.generateBlockReason = a.generateBlockReason;
  if (a.needsName) row.needsName = true;
  if (a.localOnly) row.localOnly = true;
  return row;
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "id_list_algorithms",
    {
      title: "List ID algorithms",
      description: `List ID algorithms (39 catalog slugs).

Filter by coordination (none/shared/worker), output (long/string/uuid/binary), sortable (time/lex/mono/no), js_safe, or local sample generation. Paginate with limit/offset.

Does not generate IDs. Use id_recommend to choose, id_generate for samples, id_explain for one algorithm.`,
      inputSchema: z.object({
        coordination: z
          .enum(["none", "shared", "worker"])
          .optional()
          .describe("Coordination: none=uncoordinated, shared=shared counter, worker=Snowflake-family"),
        output: z
          .enum(["long", "string", "uuid", "binary"])
          .optional()
          .describe("Output shape"),
        sortable: z
          .enum(["time", "lex", "mono", "no"])
          .optional()
          .describe("Ordering: time, lexicographic, monotonic allocator, or none"),
        js_safe: z
          .boolean()
          .optional()
          .describe("If true, only IDs safe as JavaScript Number or strings"),
        local_generate: z
          .boolean()
          .optional()
          .describe("If true, only algorithms this MCP can sample-generate"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .default(20)
          .describe("Page size (1-50, default 20)"),
        offset: z
          .number()
          .int()
          .min(0)
          .default(0)
          .describe("Items to skip"),
        response_format: ResponseFormat.describe("markdown or json"),
      }),
      outputSchema: z.object({
        total: z.number(),
        count: z.number(),
        offset: z.number(),
        has_more: z.boolean(),
        next_offset: z.number().nullable(),
        items: z.array(algorithmSchema),
      }),
      annotations: {
        title: "List ID algorithms",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({
      coordination,
      output,
      sortable,
      js_safe,
      local_generate,
      limit,
      offset,
      response_format,
    }) => {
      log("tool id_list_algorithms", { coordination, output, offset, limit });
      const filtered = filterAlgorithms({
        coordination,
        output,
        sortable,
        jsSafe: js_safe,
        localGenerate: local_generate,
      });
      const total = filtered.length;
      const page = filtered.slice(offset, offset + limit).map(publicAlgorithm);
      const hasMore = offset + page.length < total;
      const nextOffset = hasMore ? offset + page.length : null;
      const payload = {
        total,
        count: page.length,
        offset,
        has_more: hasMore,
        next_offset: nextOffset,
        items: page,
      };
      const text =
        response_format === "json"
          ? JSON.stringify(payload, null, 2)
          : listMarkdown(page, total, offset, hasMore, nextOffset);
      return ok(text, payload);
    },
  );

  server.registerTool(
    "id_recommend",
    {
      title: "Recommend an ID algorithm",
      description: `Recommend an ID algorithm from constraints.

Official defaults: uncoordinated long=entropy_id, uncoordinated string=uuid_v7, shared long=mist_id, shared string=uuid_v8. Overrides: js_safe, url_safe, mongo_style, lexicographic, snowflake.`,
      inputSchema: z.object({
        coordination: z
          .enum(["none", "shared"])
          .default("none")
          .describe("none=no shared store; shared=cluster allocator (Redis/DB counter)"),
        output: z
          .enum(["long", "string"])
          .default("long")
          .describe("Numeric 64-bit long vs string/UUID"),
        js_safe: z
          .boolean()
          .optional()
          .describe("Must fit JavaScript Number (53-bit)"),
        url_safe: z
          .boolean()
          .optional()
          .describe("Compact URL-safe string"),
        mongo_style: z
          .boolean()
          .optional()
          .describe("MongoDB ObjectId-like"),
        lexicographic: z
          .boolean()
          .optional()
          .describe("String that sorts by time lexicographically"),
        snowflake: z
          .boolean()
          .optional()
          .describe("Force classic Snowflake (worker IDs required)"),
        response_format: ResponseFormat.describe("markdown or json"),
      }),
      outputSchema: z.object({
        primary: z.string(),
        id_type: z.string(),
        reason: z.string(),
        coordination: z.string(),
        js_safe: z.boolean(),
        local_generate: z.boolean(),
        alternatives: z.array(
          z.object({
            slug: z.string(),
            id_type: z.string(),
          }),
        ),
      }),
      annotations: {
        title: "Recommend an ID algorithm",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      log("tool id_recommend", {
        coordination: params.coordination,
        output: params.output,
      });
      const rec = recommend({
        coordination: params.coordination,
        output: params.output,
        js_safe: params.js_safe,
        url_safe: params.url_safe,
        mongo_style: params.mongo_style,
        lexicographic: params.lexicographic,
        snowflake: params.snowflake,
      });
      const payload = {
        primary: rec.primary.slug,
        id_type: rec.primary.idType,
        reason: rec.reason,
        coordination: rec.primary.coordination,
        js_safe: rec.primary.jsSafe,
        local_generate: rec.primary.localGenerate,
        alternatives: rec.alternatives.map((a) => ({
          slug: a.slug,
          id_type: a.idType,
        })),
      };
      const text =
        params.response_format === "json"
          ? JSON.stringify(payload, null, 2)
          : recommendMarkdown(rec);
      return ok(text, payload);
    },
  );

  server.registerTool(
    "id_generate",
    {
      title: "Generate sample IDs",
      description: `Generate 1-32 sample IDs locally (TypeScript). Supported: ${implementedSlugs().join(", ")}.

Samples illustrate format only — they are NOT a production cluster guarantee.

atomic_id, rid, and segment_chain_id need a shared store and cannot be sampled here. mist_id / uuid_v8 samples are process-local and include a warning.`,
      inputSchema: z.object({
        algorithm: z.string().min(1).describe("Slug such as entropy_id or uuid_v7"),
        count: z
          .number()
          .int()
          .min(1)
          .max(32)
          .default(1)
          .describe("How many samples (1-32)"),
        worker: z
          .number()
          .int()
          .min(0)
          .max(65535)
          .optional()
          .describe("Worker/machine id for snowflake (0–1023) or sonyflake (0–65535)"),
        name: z
          .string()
          .min(1)
          .optional()
          .describe("Name for uuid_v3 / uuid_v5 (URL namespace)"),
        response_format: ResponseFormat.describe("markdown or json"),
      }),
      outputSchema: z.object({
        algorithm: z.string(),
        ids: z.array(z.string()),
        count: z.number(),
        note: z.string(),
        warning: z.string().optional(),
        worker: z.number().optional(),
      }),
      annotations: {
        title: "Generate sample IDs",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ algorithm, count, worker, name, response_format }) => {
      log("tool id_generate", { algorithm, count });
      const algo = getAlgorithm(algorithm);
      if (!algo) {
        return fail(unknownSlug(algorithm));
      }
      if (!algo.localGenerate) {
        if (algo.generateBlockReason === "shared") {
          return fail(
            `Error: '${algorithm}' requires a shared counter (Redis/DB). This MCP cannot sample-generate it.`,
          );
        }
        return fail(
          `Error: '${algorithm}' has no local generator. Supported sample slugs: ${implementedSlugs().join(", ")}.`,
        );
      }
      try {
        const { ids, warning } = generateLocal(algorithm, count, { worker, name });
        const note =
          "These are local samples (TypeScript). They illustrate format only and are not a production uniqueness guarantee.";
        const payload: Record<string, unknown> = {
          algorithm,
          ids,
          count: ids.length,
          note,
        };
        if (warning) payload.warning = warning;
        if (algorithm === "snowflake" || algorithm === "sonyflake") {
          payload.worker = worker ?? 0;
        }
        const text =
          response_format === "json"
            ? JSON.stringify(payload, null, 2)
            : generateMarkdown(algorithm, ids, note, warning);
        return ok(text, payload);
      } catch (e) {
        return fail(e instanceof Error ? `Error: ${e.message}` : "Error: generate failed");
      }
    },
  );

  server.registerTool(
    "id_explain",
    {
      title: "Explain an ID algorithm",
      description:
        "Explain one ID algorithm: bit layout, when to use, and limitations. Language-agnostic.",
      inputSchema: z.object({
        algorithm: z.string().min(1).describe("Slug such as entropy_id"),
        response_format: ResponseFormat.describe("markdown or json"),
      }),
      outputSchema: z.object({
        slug: z.string(),
        id_type: z.string(),
        description: z.string(),
        output: z.string(),
        sortable: z.string(),
        coordination: z.string(),
        js_safe: z.boolean(),
        local_generate: z.boolean(),
        structure: z.string(),
        use: z.string(),
        limitations: z.string(),
      }),
      annotations: {
        title: "Explain an ID algorithm",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ algorithm, response_format }) => {
      log("tool id_explain", { algorithm });
      const found = getExplain(algorithm);
      if (!found) {
        return fail(unknownSlug(algorithm));
      }
      const { algo, doc } = found;
      const payload = {
        slug: algo.slug,
        id_type: algo.idType,
        description: algo.description,
        output: algo.output,
        sortable: algo.sortable,
        coordination: algo.coordination,
        js_safe: algo.jsSafe,
        local_generate: algo.localGenerate,
        structure: doc.structure,
        use: doc.use,
        limitations: doc.limitations,
      };
      const text =
        response_format === "json"
          ? JSON.stringify(payload, null, 2)
          : explainMarkdown(algo.slug, algo.idType, doc.structure, doc.use, doc.limitations);
      return ok(text, payload);
    },
  );
}
