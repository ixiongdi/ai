import { completable, type McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { implementedSlugs } from "./catalog.js";
import { DECISION_TREE_MD } from "./decision-tree.js";
import { log } from "./log.js";

export function registerPrompts(server: McpServer): void {
  server.registerPrompt(
    "choose-id",
    {
      title: "Choose an ID algorithm",
      description:
        "Pick an ID algorithm from output/coordination (and optional overrides). Uses the official decision tree and id_recommend.",
      argsSchema: z.object({
        output: z.enum(["long", "string"]).describe("64-bit integer vs string/UUID"),
        coordination: z
          .enum(["none", "shared"])
          .describe("none=uncoordinated; shared=shared counter"),
        js_safe: z.enum(["true", "false"]).optional().describe("Must fit JavaScript Number"),
        url_safe: z.enum(["true", "false"]).optional().describe("Compact URL-safe string"),
        mongo_style: z.enum(["true", "false"]).optional().describe("MongoDB ObjectId-like"),
        lexicographic: z.enum(["true", "false"]).optional().describe("Lexicographic time order"),
        snowflake: z.enum(["true", "false"]).optional().describe("Force classic Snowflake"),
      }),
    },
    (args) => {
      log("prompt choose-id", args);
      const flags = [
        args.js_safe === "true" ? "js_safe=true" : null,
        args.url_safe === "true" ? "url_safe=true" : null,
        args.mongo_style === "true" ? "mongo_style=true" : null,
        args.lexicographic === "true" ? "lexicographic=true" : null,
        args.snowflake === "true" ? "snowflake=true" : null,
      ]
        .filter(Boolean)
        .join(", ");
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "resource" as const,
              resource: {
                uri: "idgen://decision-tree",
                mimeType: "text/markdown",
                text: DECISION_TREE_MD,
              },
            },
          },
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: [
                "Choose an ID algorithm for this project.",
                `Constraints: output=${args.output}, coordination=${args.coordination}${flags ? `, ${flags}` : ""}.`,
                "Call the id_recommend tool with these arguments and explain the primary slug plus alternatives.",
                "Do not default to uuid_v4 as a clustered primary key.",
              ].join("\n"),
            },
          },
        ],
      };
    },
  );

  server.registerPrompt(
    "generate-samples",
    {
      title: "Generate sample IDs",
      description: "Ask the model to call id_generate for a catalog slug.",
      argsSchema: z.object({
        algorithm: completable(z.string().describe("Catalog slug to sample"), (value) =>
          implementedSlugs().filter((slug) => slug.startsWith(value)),
        ),
        count: z
          .string()
          .optional()
          .describe("How many samples (1-32, default 1)"),
      }),
    },
    ({ algorithm, count }) => {
      log("prompt generate-samples", { algorithm, count });
      const n = count ?? "1";
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: [
                `Generate ${n} sample ID(s) using algorithm \`${algorithm}\`.`,
                "Call the id_generate tool with that algorithm and count.",
                "If the slug is uuid_v3 or uuid_v5, ask for a name first.",
                "Treat results as format samples, not a production allocator. Surface any warning from the tool (mist_id / uuid_v8 / worker).",
              ].join("\n"),
            },
          },
        ],
      };
    },
  );
}
