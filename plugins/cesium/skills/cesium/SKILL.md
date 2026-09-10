---
name: cesium
description: >
  Control a CesiumJS 3D globe from an AI agent over MCP. Use when a task involves
  Cesium, CesiumJS, Cesium ion, 3D Tiles, terrain, imagery layers, GeoJSON
  overlays, entity markers and models, camera flights and viewpoint bookmarks,
  path animations and trajectories, heatmaps, or geocoding to coordinates.
  Covers the MCP runtime this plugin wires up, the required browser half,
  toolsets and session routing, and Cesium's own official MCP and skills repo.
  Not a general GIS data-processing skill, and not for Mapbox or OpenLayers.
---

# cesium

Cesium has an MCP answer from both directions: an **official** one from Cesium
(CesiumGS) and a **community** one that is easier to run. This plugin wires up
the community one by default and documents the official one, because they differ
in a way that matters.

The chain is the same in both cases, and so is the gotcha:

```
AI Agent ⇐ MCP stdio/HTTP ⇒ MCP runtime ⇐ WebSocket ⇒ browser page with a CesiumJS Viewer ⇒ 3D globe
```

**The browser half is mandatory.** Without a page holding a live `Viewer`, the
MCP server starts fine and every tool call goes nowhere. This is not a data
source you can query headlessly — it drives a running globe.

## The runtime this plugin uses

[`cesium-mcp-runtime`](https://github.com/gaopengbin/cesium-mcp) — `npx -y
cesium-mcp-runtime`, MIT. 62 command tools across 12 toolsets plus 2 discovery
meta-tools.

**Getting the browser half, two options:**

1. **Use the built-in viewer.** The package ships the bridge bundle locally and
   serves its own Viewer at `http://localhost:9100/`. Open it and you are done —
   nothing to code.
2. **Embed the bridge** in your own CesiumJS app:

   ```js
   import { CesiumBridge } from 'cesium-mcp-bridge'

   const bridge = new CesiumBridge(viewer)
   const ws = new WebSocket('ws://localhost:9100?session=default')

   ws.onmessage = async (event) => {
     const { id, method, params } = JSON.parse(event.data)
     try {
       const result = await bridge.execute({ action: method, params })
       ws.send(JSON.stringify({ id, result }))
     } catch (error) {
       ws.send(JSON.stringify({ id, error: { message: String(error) } }))
     }
   }
   ```

Open the page **before** the agent starts issuing commands. A tool call against a
disconnected browser is the single most common failure here.

### Toolsets

Only four toolsets are on by default — 30 tools. The rest activate on demand:

| Toolset | Tools | Default |
| ------- | ----- | ------- |
| `view` — camera, viewpoint bookmarks, scene export | 8 | yes |
| `entity` — create, update, batch, query, inspect | 10 | yes |
| `layer` — GeoJSON, schema, style, basemap | 9 | yes |
| `interaction` — screenshot, highlight, measure | 3 | yes |
| `camera` — orbit, lookAt, controller options | 4 | — |
| `entity-ext` — box, cylinder, wall, ellipse, rectangle, corridor, billboard | 7 | — |
| `animation` — waypoints, clock, tracking, lighting | 8 | — |
| `tiles` — 3D Tiles, Gaussian Splats, terrain, imagery services, CZML, KML | 7 | — |
| `trajectory`, `heatmap`, `scene`, `geolocation` | 1, 1, 3, 1 | — |

Two meta-tools are always available unless everything is force-enabled:
`list_toolsets` (what exists and what is on) and `enable_toolset` (turn one on
mid-session). **Prefer activating toolsets on demand over `CESIUM_TOOLSETS=all`**
— in `all` mode you get 62 schemas and no meta-tools, which spends context before
any work happens.

### Settings

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `CESIUM_WS_PORT` | `9100` | WebSocket port the browser connects to |
| `DEFAULT_SESSION_ID` | `default` | Which browser session unattributed calls go to |
| `CESIUM_TOOLSETS` | *(unset)* | unset = 4 defaults · `all` · or a comma-separated list |
| `CESIUM_LOCALE` | `en` | `zh-CN` gives Chinese tool descriptions |
| `MCP_TRANSPORT` | `stdio` | `stdio` or `http` |
| `MCP_HTTP_PORT` | WS port + 100 | HTTP mode port (`3216` at the default) |

### Several globes at once

Multiple browser tabs can share one runtime by connecting with different session
IDs (`ws://localhost:9100?session=geoagent`). Routing priority is: `sessionId` in
the tool call → `?session=` in the MCP URL → `DEFAULT_SESSION_ID` → first
connected browser. Explicit routing is **fail-closed**: naming a session that is
missing returns an error rather than silently running against a different globe.
That is the behaviour you want, and it is worth relying on rather than avoiding.

### Remote clients

`npx cesium-mcp-runtime --transport http --port 3000` serves Streamable HTTP at
`POST http://localhost:3000/mcp`. In HTTP mode all 62 tools are enabled eagerly.
Append `?session=xxx` to route a connection to a specific browser.

Non-MCP integrations can push commands directly:

```bash
curl -X POST http://localhost:9100/push \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"default","command":{"action":"flyTo","params":{"longitude":116.39,"latitude":39.91}}}'
```

Resources: `cesium://scene/camera`, `cesium://scene/layers`.

## How to work

**Fly first, then draw.** A `flyTo` before adding entities means the result is
visible; adding a marker at coordinates the camera is nowhere near looks like a
failure. `getView` and `flyTo` in `view` are the cheapest way to establish "where
are we".

**Verify visually.** `screenshot` (in `interaction`) returns the map as an image.
A tool call that returned `success` is not evidence the globe shows anything
sensible — camera framing, styling, and z-fighting all fail silently.

**GeoJSON goes through layers, not entities.** `addGeoJsonLayer` with styling
(chloropleth, category) plus `updateLayerStyle` is the path for regional data.
Entities are for individual marks, models, and geometry.

**Watch what actually renders.** `load3dTiles` / `loadTerrain` / `loadImageryService`
need real asset IDs or service URLs, and imagery/terrain from Cesium ion need a
token in the browser app. A bad token or URL fails at render time, not at call
time.

**`scene` carries runtime-only Ion credentials** — it is the toolset to reach for
when credentials have to be set at runtime rather than baked into the page.

## Cesium's own official MCP and skills

Worth knowing they exist, and what they are:

- **Repo:** [`CesiumGS/cesium-ai-integrations`](https://github.com/CesiumGS/cesium-ai-integrations),
  Apache-2.0, announced by Cesium on its community forum in March 2026.
- **Official skills:** one, under `skills/` — `cesium-context7`, covering
  CesiumJS APIs, ion workflows, and 3D Tiles optimisation, to stop an agent
  inventing Cesium-specific API. Follows the agentskills.io `SKILL.md` format.
- **Official MCP servers:** under `mcp/` — six CesiumJS domain servers
  (camera `3002`, entity `3003`, animation `3004`, imagery `3005`, tiles `3006`,
  terrain `3007`), a `gateway` (`3010`), a geolocation server (Nominatim /
  Overpass / OSRM), a codegen MCP App, and two external integrations (Context7,
  the Cesium Discourse forum).

Cesium describes these as reference integrations and experiments, and that
framing is accurate. Three practical consequences:

- **Not on npm.** `@cesium-mcp/*` are pnpm workspace package names, not published
  packages. Setup is `git clone` then `pnpm install && pnpm run build`, and the
  client config points at `node {YOUR_WORKSPACE}/.../build/index.js`. Verified:
  `@cesium-mcp/camera-server` returns 404 from the registry.
- **Node >= 22 and pnpm >= 8.** Node 22 is a hard floor — the servers use the
  built-in global `WebSocket`.
- **Its own web app, started first.** The CesiumJS test app runs on
  `localhost:8080` and must be up before the agent connects.

**Use the `gateway`.** Connecting the six domain servers individually puts their
entire tool surface in the client at once. `gateway` exposes one endpoint plus
`cesium_list_domains` / `cesium_enable_domain` / `cesium_disable_domain` — the
same progressive-disclosure idea as the community runtime's toolsets.

One inconsistency to be aware of: Cesium's README says the boot domains come from
`CESIUM_DOMAINS`, while its own config example passes `GATEWAY_DOMAINS`. If the
gateway starts with the wrong domains, try the other name before assuming the
config is wrong.

**When to prefer the official one:** you want the vendor-maintained path, you are
already in a pnpm monorepo workflow, or you specifically want the geolocation and
codegen servers. Otherwise the community runtime is a `npx` away and covers the
same ground.

## Map compliance

Cesium renders a WGS84 globe with Cesium ion imagery by default. **None of that is
automatically suitable for China-facing maps**, and two parts of this toolchain
point at sources that are not permitted.

**Allowed providers only:** Tencent Maps, AMap (Gaode), Baidu Maps, NASG
Tianditu. **Not permitted:** Google Maps, Apple Maps, Bing (overseas), Mapbox,
and OpenStreetMap with direct overseas tiles.

Two specific traps in this plugin's stack:

- **The geolocation tools are OSM-based.** The community runtime's `geolocation`
  toolset geocodes through Nominatim (OSM), and Cesium's official
  `geolocation-server` uses Nominatim, Overpass, and OSRM. Treat all of it as
  non-compliant for China-facing work — geocoding, search, and routing included,
  not just tiles. Use a licensed domestic provider's service API instead.
- **Do not swap in OSM tiles as a "neutral" basemap.** It reads as a safe default
  and is not one.

**Coordinates differ between the two halves.** Cesium is WGS84 throughout, while
compliant Chinese providers publish GCJ-02 (Mars) imagery and vectors. Overlaying
Tencent / AMap / Baidu tiles on a Cesium globe without converting datums produces
a visible offset that grows with zoom. Decide the datum per layer and convert
explicitly rather than assuming the coordinates line up.

**Before rendering, not after:** territory such as national borders, Taiwan, and
the South China Sea islands must match national standards; do not mark military
restricted zones, classified installations, or undisclosed sensitive coordinates.
Bulk point data is subject to PIPL — do not collect, store, or publish other
people's location data, and keep personal check-in coordinates in local private
storage. Name the intended region explicitly to the agent rather than letting a
default globe imply it.
