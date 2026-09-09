#!/usr/bin/env python3
"""Idempotently register the id-generator stdio MCP server in user configs.

Does not delete other MCP servers. Stdlib only.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path

KEY = "id-generator"
HEADER_RE = re.compile(r"^\[([^\]]+)\]\s*$")
OWN_TABLE = "mcp_servers.id-generator"


def _home() -> Path:
    return Path(os.environ.get("USERPROFILE") or os.path.expanduser("~"))


def host_path(p: Path | str) -> str:
    """Windows-native path for MCP hosts (Cursor/Claude/Codex), including Git Bash."""
    raw = os.path.abspath(str(p))
    if sys.platform == "win32" and not os.environ.get("MSYSTEM"):
        return raw
    if os.environ.get("MSYSTEM") or sys.platform == "cygwin":
        cygpath = shutil.which("cygpath")
        if cygpath:
            import subprocess

            try:
                return subprocess.check_output(
                    [cygpath, "-w", raw], text=True
                ).strip()
            except (OSError, subprocess.CalledProcessError):
                pass
    return raw


def atomic_write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(str(tmp), str(path))


def merge_json(path: Path, command: str, args: list[str]) -> None:
    data: dict = {}
    if path.exists():
        raw = path.read_text(encoding="utf-8").strip()
        if raw:
            loaded = json.loads(raw)
            if not isinstance(loaded, dict):
                raise SystemExit(f"{path}: root must be a JSON object")
            data = loaded
    servers = data.get("mcpServers")
    if servers is None:
        servers = {}
        data["mcpServers"] = servers
    elif not isinstance(servers, dict):
        raise SystemExit(f"{path}: mcpServers must be an object")
    servers[KEY] = {"command": command, "args": args}
    atomic_write(path, json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"mcp: {path} -> mcpServers.{KEY}")


def _strip_own_toml_tables(text: str) -> str:
    lines = text.splitlines(keepends=True)
    out: list[str] = []
    skip = False
    for line in lines:
        stripped = line.strip()
        match = HEADER_RE.match(stripped)
        if match:
            name = match.group(1).strip()
            skip = name == OWN_TABLE or name.startswith(OWN_TABLE + ".")
        if not skip:
            out.append(line)
    return "".join(out).rstrip() + ("\n" if out else "")


def merge_codex_toml(path: Path, command: str, args: list[str]) -> None:
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    body = _strip_own_toml_tables(text)
    args_lit = ", ".join(json.dumps(a) for a in args)
    section = (
        f"[mcp_servers.{KEY}]\n"
        f"command = {json.dumps(command)}\n"
        f"args = [{args_lit}]\n"
    )
    if body.strip():
        written = body.rstrip() + "\n\n" + section
    else:
        written = section
    atomic_write(path, written)
    print(f"mcp: {path} -> [mcp_servers.{KEY}]")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--entry",
        required=True,
        help="Absolute path to dist/index.js",
    )
    parser.add_argument(
        "--node",
        default=None,
        help="Path to node (default: from PATH)",
    )
    args = parser.parse_args(argv)

    entry = Path(args.entry).resolve()
    if not entry.is_file():
        raise SystemExit(f"MCP entry not found: {entry} (build first)")

    node = args.node or shutil.which("node")
    if not node:
        raise SystemExit("node not found on PATH")
    # abspath, not resolve: keep brew/nvm shims instead of Cellar/versioned paths.
    command = host_path(node)

    argv_js = [host_path(entry)]
    home = _home()
    merge_json(home / ".cursor" / "mcp.json", command, argv_js)
    merge_json(home / ".claude.json", command, argv_js)
    merge_codex_toml(home / ".codex" / "config.toml", command, argv_js)
    return 0


if __name__ == "__main__":
    sys.exit(main())
