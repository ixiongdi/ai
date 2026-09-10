---
name: blender
description: >
  Drive a running Blender session through Blender's official MCP server from
  Blender Lab (blender-mcp), which relays stdio MCP calls to a Blender add-on
  over a TCP socket. Use when a task involves Blender, .blend files, bpy
  scripting, scene and collection inspection, mesh or modifier work, materials
  and shader nodes, geometry nodes setups, rendering, viewport screenshots, or
  auditing a file for missing external references and linked libraries. Also
  use to look up the Blender Python API or the user manual from inside the
  editor. Skip for pure conceptual questions, and for Unity, Unreal, or Godot.
---

# blender

Blender's MCP support is **official but not built in**. Blender ships no LLM
connection of its own: the Blender Lab project supplies two of the three moving
parts, and you supply the third by installing the client.

The architecture is deliberately small, and knowing it explains every failure
mode:

```
MCP Client  ⇐ MCP / stdio ⇒  blender-mcp  ⇐ TCP socket ⇒  Blender add-on
```

Both halves must be alive. If the add-on is not installed, not enabled, or not
started, the server starts fine and every tool call fails.

| Piece | Source |
| ----- | ------ |
| Blender add-on | Blender Lab repository, or the release zip |
| MCP server (`blender-mcp`) | `mcp/` in the `blender_mcp` clone, run with uv |
| LLM client | yours |

Source, issues, and the wiki: <https://projects.blender.org/lab/blender_mcp>.
User-facing docs: <https://www.blender.org/lab/mcp-server/>.

## Setup

Requirements: **Blender 5.1 or newer**, `uv` on `PATH`, an MCP client, and a
clone of the repository.

1. **Add-on.** Download the release zip and drag it into Blender — you must do
   this **twice**: the first drop registers the Blender Lab repository, the
   second installs the add-on. Dragging in registers it as a normal extension,
   so later updates arrive through Blender's own update notifications.
   Dragging in also avoids the manual "Install from Disk" path that leaves you
   updating it by hand.

2. **Server.** Clone the repository and point this plugin's launcher at it:

   ```bash
   # Windows
   cd c:\ && git clone https://projects.blender.org/lab/blender_mcp.git
   # macOS / Linux
   cd $HOME && git clone https://projects.blender.org/lab/blender_mcp.git
   ```

   The launcher runs `uv --directory <repo>/mcp run blender-mcp`, matching the
   official setup instructions, and looks for the clone in `C:\blender_mcp`
   (Windows) or `$HOME/blender_mcp`. Set `BLENDER_MCP_DIR` to override.

   Clients that support `.mcpb` bundles can install the release bundle from
   the releases page instead. llama.cpp does not support bundles.

3. **Start it in Blender.** Open the add-on's preferences panel and use its
   start operator. Host, port, and an optional auto-start toggle live there,
   along with the polling intervals (active and idle) that keep the socket
   cheap when nothing is happening. Check the panel if a connection silently
   dies — stalled clients are evicted by design.

## What the server gives the agent

Two different things arrive at once, and it is worth separating them:

- **Instructions.** `prompts.yml` in the package is sent to the model at
  connection time. Treat it as authoritative about how Blender wants to be
  driven.
- **Bundled documentation.** The package ships the Blender Python API reference
  and user-manual excerpts as RST, searched offline. This is why an agent can
  answer "what is the correct argument name" without guessing or hallucinating
  a signature.

Tools, grouped by job:

| Job | Tools |
| --- | ----- |
| Code execution | `execute_blender_code`, `execute_blender_code_for_cli` |
| Documentation | `get_python_api_docs`, `search_api_docs`, `search_manual_docs` |
| Scene reading | `get_objects_summary`, `get_object_detail_summary` |
| File auditing | `get_blendfile_summary_datablocks`, `_missing_files`, `_of_linked_libraries`, `_path_info`, `_usage_guess` |
| Visual checks | `get_screenshot_of_area_as_image`, `get_screenshot_of_window_as_image`, `get_screenshot_of_window_as_json` |
| Navigation | `jump_to_tab_by_name`, `jump_to_tab_by_space_type`, `jump_to_view3d_object_by_name`, `jump_to_view3d_object_data_by_name` |
| Rendering | `render_viewport_to_path`, `render_thumbnail_to_path` |

Every `get_blendfile_summary_*` has a `_for_cli` twin. The plain version reads
the **live** session; the `_for_cli` version opens the given `.blend` in a
**background** Blender process. Use `_for_cli` to audit files nobody has open,
and the live version when the user is looking at the scene.

## How to work

**Look up the API before writing bpy code.** `get_python_api_docs` accepts an
identifier or a trailing-`*` discovery pattern; `search_api_docs` does full-text
search. Blender's API has a long tail of renamed and deprecated properties, and
a confident wrong call wastes a round trip every time.

**Read before you write.** `get_objects_summary` gives the collection hierarchy
and its objects, which is the cheapest way to learn a scene's shape before
touching it. `get_blendfile_summary_path_info` tells you whether the file has
unsaved changes — worth knowing before you generate edits.

**Verify visually, do not assert.** `render_viewport_to_path` renders with the
current settings; `render_thumbnail_to_path` renders small and fast and is the
right choice for a quick "did that land" check. `get_screenshot_of_window_as_json`
returns the layout, areas, active object, and selection as data, which is
cheaper than an image when you only need to know state.

**Batch, do not crawl.** `execute_blender_code` is the workhorse: one call can
carry a whole multi-step operation. Chaining many small calls through the socket
is slower and more fragile. That said, everything runs on Blender's main thread
against live data — a script that raises halfway leaves the file in whatever
state it reached. Save first, or work on a copy.

**Prefer describing the operator over the click path.** For repetitive work
(rename 300 objects, apply one modifier stack everywhere, batch export a
collection) write the loop in one script rather than driving the UI 300 times.

## Security

Blender states plainly that the MCP server **executes LLM-generated code in
Blender with no guards**: nothing stops a script from deleting data or sending
it off the machine. Their own recommendation is a virtual machine, or a system
without access to sensitive information. This is not a theoretical caveat — the
tool that does the work is literally "execute Python here".

So: run it against disposable scenes, keep uncommitted work committed, and do
not point it at a machine holding credentials or irreplaceable assets.

## Related

Anthropic's **Claude for Creative Work** includes a Blender connector built as
an MCP server and maintained by the Blender development team. It is the same
class of integration, installed from the Claude connectors directory rather than
from this plugin; the add-on half of the setup is unchanged.
