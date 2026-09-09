/** Stdio MCP servers must not write to stdout — JSON-RPC uses it. */
export function log(message: string, extra?: unknown): void {
  if (extra === undefined) {
    console.error(`[id-generator-mcp] ${message}`);
    return;
  }
  console.error(`[id-generator-mcp] ${message}`, extra);
}
