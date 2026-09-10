#!/usr/bin/env node
/**
 * Launches Blender's official MCP server (Blender Lab, `blender-mcp`).
 *
 * Upstream is not vendored. The server is a Python project that lives in the
 * `mcp/` folder of a blender_mcp clone, and the official docs run it with uv:
 *
 *   uv --directory <repo>/mcp run blender-mcp
 *
 * This launcher only resolves <repo> for the current platform, then execs uv.
 *
 *   node scripts/blender-mcp.mjs [extra args...]
 *
 * Resolution order for the clone:
 *   1. BLENDER_MCP_DIR
 *   2. C:\blender_mcp on Windows, $HOME/blender_mcp elsewhere (the paths the
 *      official setup instructions use)
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_DIR =
  process.platform === "win32"
    ? "C:\\blender_mcp"
    : path.join(os.homedir(), "blender_mcp");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function resolveRepo() {
  const candidates = [process.env.BLENDER_MCP_DIR, DEFAULT_DIR].filter(Boolean);

  for (const dir of candidates) {
    if (existsSync(path.join(dir, "mcp", "blmcp"))) return dir;
  }

  fail(
    [
      `Blender MCP server not found. Looked for a clone containing mcp/blmcp in:`,
      ...candidates.map((dir) => `  ${dir}`),
      ``,
      `Clone it with the command from the official setup instructions:`,
      process.platform === "win32"
        ? `  cd c:\\ && git clone https://projects.blender.org/lab/blender_mcp.git`
        : `  cd $HOME && git clone https://projects.blender.org/lab/blender_mcp.git`,
      ``,
      `Or point BLENDER_MCP_DIR at an existing clone.`,
      `uv must be on PATH (https://docs.astral.sh/uv/).`,
      ``,
      `The server is only half the setup: Blender 5.1+ also needs the MCP Server`,
      `add-on from the Blender Lab repository, installed and started.`,
      `See https://www.blender.org/lab/mcp-server/`,
    ].join("\n"),
  );
}

const repo = resolveRepo();
const projectDir = path.join(repo, "mcp");

const child = spawn(
  "uv",
  ["--directory", projectDir, "run", "blender-mcp", ...process.argv.slice(2)],
  { stdio: "inherit", env: process.env },
);

child.on("error", (error) => {
  if (error.code === "ENOENT") {
    fail(
      [
        `Could not run "uv". Install it first:`,
        `  https://docs.astral.sh/uv/`,
        `Then restart the MCP client so it picks up the new PATH.`,
      ].join("\n"),
    );
  }
  fail(`Failed to start blender-mcp:\n  ${error.message}`);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
