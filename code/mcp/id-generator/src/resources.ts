import {
  McpServer,
  ResourceNotFoundError,
  ResourceTemplate,
} from "@modelcontextprotocol/server";
import { ALGORITHMS, getAlgorithm, implementedSlugs } from "./catalog.js";
import { DECISION_TREE_MD } from "./decision-tree.js";
import { log } from "./log.js";

export function registerResources(server: McpServer): void {
  server.registerResource(
    "catalog",
    "idgen://catalog",
    {
      title: "ID algorithm catalog",
      description: "All 39 catalog algorithms as JSON",
      mimeType: "application/json",
    },
    async (uri) => {
      log("resource read catalog");
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(ALGORITHMS, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "decision-tree",
    "idgen://decision-tree",
    {
      title: "ID algorithm decision tree",
      description: "Official recommendation table (markdown)",
      mimeType: "text/markdown",
    },
    async (uri) => {
      log("resource read decision-tree");
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: DECISION_TREE_MD,
          },
        ],
      };
    },
  );

  server.registerResource(
    "algorithm",
    new ResourceTemplate("idgen://algorithms/{slug}", {
      list: async () => ({
        resources: implementedSlugs().map((slug) => ({
          uri: `idgen://algorithms/${slug}`,
          name: slug,
          mimeType: "application/json",
        })),
      }),
    }),
    {
      title: "Single algorithm",
      description: "One catalog algorithm by slug (JSON). List enumerates sample-able slugs.",
      mimeType: "application/json",
    },
    async (uri, { slug }) => {
      const key = String(slug);
      log("resource read algorithm", key);
      const algo = getAlgorithm(key);
      if (!algo) {
        throw new ResourceNotFoundError(uri.href);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(algo, null, 2),
          },
        ],
      };
    },
  );
}
