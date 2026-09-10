#!/usr/bin/env node
/**
 * Starts the Unity CLI's MCP server: `unity mcp`.
 *
 * The Unity CLI ships `unity mcp`, which serves MCP over stdio
 * ("Start the MCP stdio server"). That is the supported path; the older
 * in-Editor relay is deprecated in favour of it.
 *
 *   node scripts/unity-cli-mcp.mjs [--project-path <dir>] [...]
 *
 * The reason this is a launcher rather than a one-line `command: "unity"`:
 * the CLI is not necessarily on PATH. On Windows the Hub drops it at
 * %LOCALAPPDATA%\Unity\bin\unity.exe and does not add that directory, so a
 * bare "unity" fails to spawn. This resolves the binary first.
 *
 * Resolution order:
 *   1. UNITY_CLI_PATH
 *   2. PATH (unity, unity.exe, unity.cmd)
 *   3. known install locations for the platform
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const EXE_SUFFIXES = process.platform === "win32" ? [".exe", ".cmd", ""] : [""];

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function firstExisting(paths) {
  for (const candidate of paths) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  return null;
}

function fromPath() {
  const dirs = (process.env.PATH || "").split(path.delimiter).filter(Boolean);
  const names = process.platform === "win32" ? ["unity"] : ["unity"];
  const candidates = [];
  for (const dir of dirs) {
    for (const name of names) {
      for (const suffix of EXE_SUFFIXES) {
        candidates.push(path.join(dir, name + suffix));
      }
    }
  }
  return firstExisting(candidates);
}

function knownLocations() {
  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
    return [
      path.join(localAppData, "Unity", "bin", "unity.exe"),
      path.join(os.homedir(), ".unity", "bin", "unity.exe"),
    ];
  }
  // Linux: the install script targets ~/.local/bin; ~/.unity is the older
  // location it migrates from. macOS: Homebrew cask, or the install script.
  return [
    path.join(os.homedir(), ".local", "bin", "unity"),
    path.join(os.homedir(), ".unity", "bin", "unity"),
    "/usr/local/bin/unity",
    "/opt/homebrew/bin/unity",
    "/home/linuxbrew/.linuxbrew/bin/unity",
  ];
}

function resolveUnity() {
  if (process.env.UNITY_CLI_PATH) {
    if (existsSync(process.env.UNITY_CLI_PATH)) return process.env.UNITY_CLI_PATH;
    fail(`UNITY_CLI_PATH points at a missing file:\n  ${process.env.UNITY_CLI_PATH}`);
  }

  const found = fromPath() || firstExisting(knownLocations());
  if (found) return found;

  fail(
    [
      `Unity CLI not found. Looked on PATH and in:`,
      ...knownLocations().map((p) => `  ${p}`),
      ``,
      `Install it:`,
      process.platform === "win32"
        ? `  winget install Unity.CLI`
        : `  curl -fsSL https://public-cdn.cloud.unity3d.com/hub/prod/cli/install.sh | UNITY_CLI_CHANNEL=beta bash`,
      process.platform !== "win32"
        ? `  or: brew install --cask unity-cli`
        : null,
      ``,
      `Or set UNITY_CLI_PATH to the binary. The CLI is experimental; the`,
      `reference lives at https://docs.unity.com/en-us/unity-cli`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

const unity = resolveUnity();
const child = spawn(unity, ["mcp", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", (error) => {
  fail(`Failed to start "unity mcp" via ${unity}:\n  ${error.message}`);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
