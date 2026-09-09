import { McpServer } from "@modelcontextprotocol/server";
import { SERVER_VERSION } from "./types.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources.js";
import { registerPrompts } from "./prompts.js";

/** Factory used by stdio and by in-process v2 Client tests. */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "id-generator-mcp-server",
    version: SERVER_VERSION,
  });
  registerTools(server);
  registerResources(server);
  registerPrompts(server);
  return server;
}
