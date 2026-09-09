#!/usr/bin/env node
/**
 * Stdio MCP entry for hosts that load this plugin.
 * Builds dist on first run (npm logs go to stderr).
 */
import { spawn } from "node:child_process";
import { ensureBuilt } from "./build-mcp.mjs";

const entry = ensureBuilt();
const child = spawn(process.execPath, [entry], { stdio: "inherit" });
child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
