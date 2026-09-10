#!/usr/bin/env node
/**
 * Launches Unity's MCP relay as a stdio MCP server.
 *
 * The relay binary is installed by the Unity Editor (the com.unity.ai.assistant
 * package writes it to ~/.unity/relay/). This plugin does NOT ship or copy that
 * binary: it only resolves the right path for the current platform and execs it
 * with --mcp, which is what puts the relay into MCP-server mode.
 *
 *   node scripts/unity-relay.mjs [--project-path <dir>] [--instance-id <pid>]
 *
 * Override the binary location with UNITY_RELAY_PATH when the default lookup
 * fails. Target selection can also come from the environment, and a command-line
 * argument wins over the equivalent variable:
 *
 *   UNITY_PROJECT_PATH / --project-path
 *   UNITY_INSTANCE_ID  / --instance-id
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const RELAY_DIR = path.join(os.homedir(), ".unity", "relay");

const MAC_ARM = "relay_mac_arm64.app/Contents/MacOS/relay_mac_arm64";
const MAC_X64 = "relay_mac_x64.app/Contents/MacOS/relay_mac_x64";

const CANDIDATES = {
  win32: ["relay_win.exe"],
  linux: ["relay_linux"],
  darwin: [
    process.arch === "arm64" ? MAC_ARM : MAC_X64,
    MAC_ARM,
    MAC_X64,
  ],
};

function resolveRelay() {
  const override = process.env.UNITY_RELAY_PATH;
  if (override) {
    if (existsSync(override)) return override;
    fail(`UNITY_RELAY_PATH points at a missing file:\n  ${override}`);
  }

  const names = CANDIDATES[process.platform];
  if (!names) {
    fail(`Unsupported platform "${process.platform}". Set UNITY_RELAY_PATH to the relay binary.`);
  }

  for (const name of names) {
    const candidate = path.join(RELAY_DIR, name);
    if (existsSync(candidate)) return candidate;
  }

  fail(
    [
      `Unity MCP relay not found. Looked in:`,
      ...names.map((name) => `  ${path.join(RELAY_DIR, name)}`),
      ``,
      `Fix it by one of:`,
      `  1. Open a Unity 6 project that has the com.unity.ai.assistant package installed.`,
      `     The editor installs the relay and starts the MCP bridge on load.`,
      `  2. Set UNITY_RELAY_PATH to an existing relay binary.`,
      `  3. Copy the exact path from the editor:`,
      `     Edit > Project Settings > AI > Unity MCP Server > Integrations > Locate Server.`,
    ].join("\n"),
  );
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const relay = resolveRelay();
const child = spawn(relay, ["--mcp", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", (error) => {
  fail(`Failed to start the Unity MCP relay at ${relay}:\n  ${error.message}`);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
