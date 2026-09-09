#!/usr/bin/env node
/**
 * npm install + build for code/mcp/id-generator when dist or node_modules is missing.
 * Logs only to stderr so a wrapping MCP stdio server stays clean.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const mcpDir = join(pluginRoot, "mcp", "id-generator");
const entry = join(mcpDir, "dist", "index.js");
const pkg = join(mcpDir, "package.json");
const modules = join(mcpDir, "node_modules");

function npm(args) {
  const result = spawnSync("npm", args, {
    cwd: mcpDir,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.stdout) process.stderr.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

export function ensureBuilt() {
  if (!existsSync(pkg)) {
    process.stderr.write("mcp: skip (no mcp/id-generator/package.json)\n");
    process.exit(0);
  }
  if (!existsSync(modules)) {
    process.stderr.write("mcp: npm install in mcp/id-generator\n");
    npm(["install"]);
  }
  if (!existsSync(entry)) {
    process.stderr.write("mcp: npm run build in mcp/id-generator\n");
    npm(["run", "build"]);
  }
  if (!existsSync(entry)) {
    process.stderr.write("mcp: build did not produce dist/index.js\n");
    process.exit(1);
  }
  return entry;
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : "";
if (invoked && resolve(fileURLToPath(import.meta.url)) === invoked) {
  ensureBuilt();
}
