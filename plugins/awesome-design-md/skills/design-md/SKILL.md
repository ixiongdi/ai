---
name: design-md
description: >
  Apply or scaffold a battle-tested brand design system using DESIGN.md (Google Stitch / AI design system standard).
  Covers 74+ brand design systems (Linear, Vercel, Stripe, Claude, Apple, OpenAI, Cursor, Raycast, Supabase, etc.).
  Use when designing or styling UI, matching a brand aesthetic, creating a DESIGN.md, or generating consistent components.
license: MIT
metadata:
  source: "https://github.com/VoltAgent/awesome-design-md"
---

# DESIGN.md (Brand Design Systems for AI Agents)

Use this skill to apply, adapt, or scaffold a structured **DESIGN.md** specification for any project.

DESIGN.md is a plain-text design system format (introduced by Google Stitch) that gives coding agents a persistent, structured understanding of a design system (color tokens, typography scales, surface hierarchies, and component styling rules).

## Available Brand Design Systems (74+)

The plugin bundles 74 analyzed brand design systems under `./design-md/<brand>/DESIGN.md`:

- **Tech & Developer Tools**: `linear`, `vercel`, `cursor`, `claude`, `openai`, `github`, `supabase`, `raycast`, `resend`, `stripe`, `clerk`, `convex`, `notion`, `figma`
- **Consumer & Enterprise Brands**: `apple`, `airbnb`, `bmw`, `coinbase`, `binance`, `cal`, `replicate`, `perplexity`, `midjourney`
- **And 50+ more** under `./design-md/`.

## How to Use

### 1. Apply an Existing Brand Style
When the user asks for a specific brand look (e.g. "make it look like Linear" or "use Claude's warm cream aesthetic"):
1. Read the corresponding `./design-md/<brand>/DESIGN.md`.
2. Extract the color tokens (`primary`, `canvas`, `surface-card`, `ink`, etc.), typography rules, and component radius/border patterns.
3. Write or update the UI components (Tailwind classes, CSS variables, or inline styles) to strictly adhere to the tokens.

### 2. Scaffold a DESIGN.md for Current Project
When initializing design guidelines for a project:
1. Copy or adapt the chosen brand file into the project root as `DESIGN.md`.
2. Customize brand name, color hex values, and typography font stacks to match the project's brand identity.
3. Reference `DESIGN.md` in prompts or `AGENTS.md` so all generated UI remains visually coherent.

## Structure of a DESIGN.md

A valid DESIGN.md contains:
- `description`: Design philosophy, mood, visual voltage, and core aesthetic narrative.
- `colors`: Semantic color tokens (canvas, surfaces, primary, accent, ink/body text, borders).
- `typography`: Font families, display/heading/body sizes, line heights, and letter spacing.
- `components`: Button variants, card elevations, input states, and badge styles.
- `rules`: Do's and Don'ts for spacing, borders, shadows, and contrast.
