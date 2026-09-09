#!/usr/bin/env node
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server.js";
import { log } from "./log.js";

serveStdio(() => createServer(), {
  onerror: (error) => log("stdio error", error),
});
