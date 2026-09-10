# cesium

CesiumJS 3D globe control for AI agents. One MCP server plus one skill.

| File | Contents |
| ---- | -------- |
| [plugin.json](plugin.json) | plugin manifest |
| [mcp.json](mcp.json) | starts `cesium` via `npx -y cesium-mcp-runtime` |
| [skills/cesium/SKILL.md](skills/cesium/SKILL.md) | the browser half, toolsets, session routing, the official alternative, map compliance |

Nothing from Cesium is vendored.

## The chain, and the gotcha

```
AI Agent ⇐ MCP stdio/HTTP ⇒ MCP runtime ⇐ WebSocket ⇒ browser page with a CesiumJS Viewer
```

**A browser page with a live Viewer is mandatory.** Without one the server starts
and every tool call goes nowhere. The skill shows both ways to provide it —
open the runtime's built-in viewer at `http://localhost:9100/`, or embed
`cesium-mcp-bridge` in your own app — and open it *before* the agent starts.

## Which server

| | Community (used here) | Official (CesiumGS) |
| --- | --- | --- |
| Package | `cesium-mcp-runtime` on npm | `CesiumGS/cesium-ai-integrations` |
| Install | `npx -y cesium-mcp-runtime` | clone + `pnpm install && pnpm run build` |
| Published | yes, MIT | no — `@cesium-mcp/*` returns 404 |
| Shape | one server, 62 tools / 12 toolsets + 2 meta-tools | 6 domain servers + gateway, per-domain config |
| Browser | built-in viewer, or `cesium-mcp-bridge` in your app | CesiumJS test app on `:8080`, started first |

The community runtime is the default here because it is registry-pullable, which
is this repo's rule for MCP servers. Cesium's own offering is genuine — same org,
Apache-2.0, announced on their forum — but it is deliberately positioned as
reference integrations, and installing it means a clone, a pnpm build, and a
Node 22 floor. The skill covers it properly, including the `gateway` and an env
var name that Cesium's own docs disagree with themselves about.

## Toolsets

Four are on by default (30 tools): `view`, `entity`, `layer`, `interaction`.
Eight more activate on demand via `list_toolsets` / `enable_toolset` — `camera`,
`entity-ext`, `animation`, `tiles`, `trajectory`, `heatmap`, `scene`,
`geolocation`. Leave `CESIUM_TOOLSETS` unset to keep that behaviour;
`CESIUM_TOOLSETS=all` gives all 62 tools and drops the meta-tools.

`CESIUM_LOCALE=zh-CN` switches tool descriptions to Chinese.

## Map compliance

Cesium renders a WGS84 globe with ion imagery by default. **Neither is
automatically suitable for China-facing maps.** Allowed providers are Tencent
Maps, AMap, Baidu, and NASG Tianditu; Google, Apple, Bing (overseas), Mapbox, and
OpenStreetMap direct tiles are not permitted.

Two traps specific to this stack: the community runtime's `geolocation` toolset
and Cesium's official `geolocation-server` both geocode through OSM
(Nominatim / Overpass / OSRM), so geocoding, search, and routing need a licensed
domestic provider just as much as tiles do. And because Cesium is WGS84 while
compliant Chinese providers publish GCJ-02, overlaying their tiles needs an
explicit datum conversion or the result is visibly offset.

The skill spells this out, including territory, restricted-zone, and PIPL rules,
so an agent reading only the skill still sees it.
