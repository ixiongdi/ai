const fs = require("fs");

const cssContent = `/* ==========================================================================
   DIRECTION 1: LINEAR / VERCEL / RAYCAST / SHADCN-VUE 极简暗黑科技美学
   Zero-VDOM Pure CSS Design System for Vue 3 Vapor Mode
   ========================================================================== */

:root {
  color-scheme: dark;

  /* Backgrounds */
  --bg-page: #08090d;
  --bg-subtle: #0e1017;
  --card: #10131c;
  --card-hover: #151924;
  --card-inner: #141722;
  --card-highlight: #181d2a;
  --paper: #08090d;
  --paper-warm: #10131c;
  --paper-deep: #0c0e15;
  --paper-subtle: #131722;

  /* Borders & Lines */
  --line: rgba(255, 255, 255, 0.08);
  --line-light: rgba(255, 255, 255, 0.05);
  --line-dark: rgba(255, 255, 255, 0.16);
  --card-border: rgba(255, 255, 255, 0.08);
  --card-border-hover: rgba(99, 102, 241, 0.45);

  /* Typography Colors */
  --ink: #f8fafc;
  --ink-secondary: #94a3b8;
  --muted: #64748b;
  --muted-light: #475569;

  /* Brand & Accents */
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --accent-soft: rgba(99, 102, 241, 0.12);
  --accent-border: rgba(99, 102, 241, 0.35);

  --green: #10b981;
  --green-hover: #34d399;
  --green-soft: rgba(16, 185, 129, 0.12);
  --green-border: rgba(16, 185, 129, 0.35);

  --orange: #f59e0b;
  --orange-hover: #fbbf24;
  --orange-soft: rgba(245, 158, 11, 0.12);
  --orange-border: rgba(245, 158, 11, 0.35);

  --rose: #f43f5e;
  --rose-soft: rgba(244, 63, 94, 0.12);
  --rose-border: rgba(244, 63, 94, 0.35);

  /* Typography Stacks */
  --font-mono: "DM Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --font-sans: "DM Sans", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* Shadows & Radius */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 16px rgba(99, 102, 241, 0.08);
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
}

/* Light Theme Overrides */
html.light {
  color-scheme: light;
  --bg-page: #f8fafc;
  --bg-subtle: #f1f5f9;
  --card: #ffffff;
  --card-hover: #fcfdfe;
  --card-inner: #f8fafc;
  --card-highlight: #f1f5f9;
  --paper: #f8fafc;
  --paper-warm: #f1f5f9;
  --paper-deep: #e2e8f0;
  --paper-subtle: #f8fafc;

  --line: rgba(0, 0, 0, 0.09);
  --line-light: rgba(0, 0, 0, 0.05);
  --line-dark: rgba(0, 0, 0, 0.18);
  --card-border: rgba(0, 0, 0, 0.08);
  --card-border-hover: rgba(99, 102, 241, 0.5);

  --ink: #0f172a;
  --ink-secondary: #475569;
  --muted: #64748b;
  --muted-light: #94a3b8;

  --accent-soft: rgba(99, 102, 241, 0.08);
  --green: #059669;
  --green-soft: rgba(5, 150, 105, 0.08);
  --green-border: rgba(5, 150, 105, 0.25);
  --orange: #d97706;
  --orange-soft: rgba(217, 119, 6, 0.08);
  --orange-border: rgba(217, 119, 6, 0.25);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 10px 24px -3px rgba(0, 0, 0, 0.08);
}

/* Base Reset */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background-color: var(--bg-page);
  background-image: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.12), transparent),
    radial-gradient(ellipse 60% 40% at 90% 20%, rgba(16, 185, 129, 0.04), transparent);
  background-attachment: fixed;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

html.light body {
  background-image: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.06), transparent),
    radial-gradient(ellipse 60% 40% at 90% 20%, rgba(16, 185, 129, 0.03), transparent);
}

button, input, select {
  font: inherit;
  color: inherit;
  outline: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Page Shell */
.page-shell {
  max-width: 1400px;
  padding: 0 32px;
  margin: 0 auto;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 16px;
  color: var(--muted);
}

/* ==========================================================================
   TOPBAR (Linear Glass)
   ========================================================================== */
.topbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 max(24px, calc((100vw - 1400px) / 2));
  border-bottom: 1px solid var(--line);
  background: rgba(8, 9, 13, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: sticky;
  top: 0;
  z-index: 50;
  transition: border-color 0.2s ease;
}

html.light .topbar {
  background: rgba(248, 250, 252, 0.88);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  padding: 5px;
  background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
  border: 1px solid rgba(99, 102, 241, 0.4);
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.25);
}

.brand-mark i {
  width: 4px;
  background: #818cf8;
  display: block;
  border-radius: 2px 2px 0 0;
}

.brand-mark i:nth-child(1) { height: 8px; }
.brand-mark i:nth-child(2) { height: 13px; }
.brand-mark i:nth-child(3) { height: 18px; }

.brand-name {
  font: 700 13px var(--font-mono);
  letter-spacing: 0.06em;
  color: var(--ink);
}

.brand-name span {
  color: var(--accent);
  padding: 0 2px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--muted);
}

.data-stamp {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

html.light .data-stamp {
  background: rgba(0, 0, 0, 0.03);
}

.data-stamp b {
  color: var(--ink);
  font: 600 12px var(--font-mono);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse-glow 2.5s infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-toggle:hover {
  color: var(--ink);
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

html.light .theme-toggle {
  background: rgba(0, 0, 0, 0.03);
}

html.light .theme-toggle:hover {
  border-color: rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.06);
}

.top-link {
  font-weight: 500;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.top-link:hover {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.05);
}

/* ==========================================================================
   HERO SECTION (Linear Typography & Glow)
   ========================================================================== */
.hero {
  padding: 56px 0 36px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 48px;
}

.hero-copy {
  max-width: 780px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 700 11px var(--font-mono);
  letter-spacing: 0.08em;
  color: #818cf8;
  margin: 0 0 16px;
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(99, 102, 241, 0.25);
  width: fit-content;
}

.eyebrow-line {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.hero h1 {
  font-size: 46px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 18px;
  color: var(--ink);
  background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

html.light .hero h1 {
  background: linear-gradient(135deg, #0f172a 40%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero h1 em {
  font-style: normal;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-lede {
  font-size: 15px;
  line-height: 1.65;
  color: var(--ink-secondary);
  margin: 0;
  max-width: 680px;
}

.hero-aside {
  flex-shrink: 0;
  width: 320px;
  background: var(--card);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-sm), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  font-size: 13px;
  position: relative;
}

.aside-index {
  font: 700 11px var(--font-mono);
  color: var(--muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
}

.hero-aside p {
  margin: 0 0 14px;
  color: var(--muted);
  line-height: 1.5;
}

.hero-aside p:last-child {
  margin-bottom: 0;
}

.hero-aside strong {
  color: var(--ink);
  font-weight: 600;
  display: block;
  margin-top: 3px;
}

/* ==========================================================================
   STATS ROW (Elevated Metric Cards)
   ========================================================================== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-sm), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.stat-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.stat-label {
  font: 600 11px var(--font-mono);
  color: var(--muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.stat-card strong {
  font: 800 32px var(--font-mono);
  letter-spacing: -0.03em;
  color: var(--ink);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-card small {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.4;
}

.stat-ink strong {
  color: #818cf8;
}

/* ==========================================================================
   WORKBENCH & TOOLBAR (Precision Alignment)
   ========================================================================== */
.workbench {
  margin-bottom: 40px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.section-heading h2 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 4px 0 0;
  color: var(--ink);
}

.price-mode {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
}

.price-mode select {
  height: 36px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 0 12px;
  color: var(--ink);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.price-mode select:hover,
.price-mode select:focus {
  border-color: var(--accent);
}

/* Sector Tabs (shadcn Segmented Control) */
.sector-tabs {
  display: inline-flex;
  background: #0e1017;
  border: 1px solid var(--card-border);
  padding: 3px;
  border-radius: var(--radius-md);
  margin-bottom: 18px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
}

html.light .sector-tabs {
  background: #f1f5f9;
}

.sector-tab {
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
  user-select: none;
}

.sector-tab:hover {
  color: var(--ink);
}

.sector-tab.is-active {
  background: var(--card);
  color: var(--ink);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

html.light .sector-tab.is-active {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.sector-tab span {
  font: 600 11px var(--font-mono);
  padding: 1px 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
}

/* Unified Filter Grid (Harmonious 5-Column Toolbar) */
.filter-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr 1.3fr;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.field > span {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.search-field {
  min-width: 0;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-wrap > span[aria-hidden="true"] {
  position: absolute;
  left: 12px;
  color: var(--muted);
  pointer-events: none;
  font-size: 15px;
  line-height: 1;
}

.search-kbd {
  position: absolute;
  right: 10px;
  padding: 2px 6px;
  font: 500 11px var(--font-mono);
  color: var(--muted-light);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--line);
  border-radius: 4px;
  pointer-events: none;
  user-select: none;
}

html.light .search-kbd {
  background: rgba(0, 0, 0, 0.05);
  color: var(--muted);
}

.filter-grid input[type="search"] {
  width: 100%;
  height: 38px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 0 42px 0 34px;
  color: var(--ink);
  font-size: 13px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: all 0.15s ease;
}

.filter-grid input[type="search"]:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

.filter-grid select {
  width: 100%;
  height: 38px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 0 10px;
  color: var(--ink);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-grid select:hover,
.filter-grid select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

/* ==========================================================================
   SCENARIO STRIP (Token Simulation Console)
   ========================================================================== */
.scenario-strip {
  background: #0d0f16;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  display: grid;
  grid-template-columns: minmax(240px, 1.2fr) auto minmax(240px, 1fr);
  gap: 18px;
  align-items: center;
  padding: 12px 18px;
  margin-top: 14px;
}

html.light .scenario-strip {
  background: #f1f5f9;
}

.scenario-title {
  display: flex;
  gap: 12px;
  align-items: center;
}

.scenario-icon {
  width: 30px;
  height: 30px;
  border: 1px solid var(--accent-border);
  background: var(--accent-soft);
  color: #a5b4fc;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.scenario-text b {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 2px;
}

.scenario-text small {
  display: block;
  font-size: 11px;
  color: var(--muted);
}

.scenario-inputs {
  display: flex;
  align-items: center;
  gap: 14px;
}

.scenario-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.scenario-field input {
  width: 90px;
  height: 32px;
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  text-align: right;
  font: 600 12px var(--font-mono);
  color: var(--ink);
  transition: border-color 0.15s;
}

.scenario-field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

.scenario-note {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

/* ==========================================================================
   METHODOLOGY NOTE BOX (Calculation Chain Callout)
   ========================================================================== */
.methodology-note-box {
  margin-top: 12px;
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note-box-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  font-size: 13px;
}

.note-box-icon {
  font-size: 15px;
}

.note-box-body {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-secondary);
}

.note-box-body b {
  color: #ffffff;
}

html.light .note-box-body b {
  color: #0f172a;
}

/* ==========================================================================
   CONFIDENCE BADGES & LEGEND PANEL
   ========================================================================== */
.confidence-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font: 700 11px var(--font-mono);
  padding: 2px 7px;
  border-radius: 4px;
  line-height: 1.25;
  white-space: nowrap;
  letter-spacing: 0.02em;
  transition: all 0.15s ease;
  user-select: none;
}

.confidence-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* S 官方明确 */
.confidence-badge.is-s {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.35);
}
.confidence-badge.is-s .confidence-dot {
  background: #f59e0b;
  box-shadow: 0 0 6px #f59e0b;
}

/* A 多方验证 */
.confidence-badge.is-a {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}
.confidence-badge.is-a .confidence-dot {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

/* B 单方测试 */
.confidence-badge.is-b {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
}
.confidence-badge.is-b .confidence-dot {
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
}

/* C 不可信 */
.confidence-badge.is-c {
  background: rgba(244, 63, 94, 0.12);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.35);
}
.confidence-badge.is-c .confidence-dot {
  background: #f43f5e;
  box-shadow: 0 0 6px #f43f5e;
}

/* Confidence Legend Panel (Interactive 4-Card Grid) */
.confidence-legend-panel {
  margin-top: 14px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  font-size: 13px;
}

.legend-badge {
  font: 700 11px var(--font-mono);
  background: rgba(255, 255, 255, 0.06);
  color: var(--ink);
  border: 1px solid var(--line);
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.confidence-grid-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.confidence-card-item {
  background: var(--bg-subtle);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.confidence-card-item:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-sm);
}

.confidence-card-item.is-selected {
  border-color: var(--accent);
  background: rgba(99, 102, 241, 0.08);
}

.confidence-card-item.is-s.is-selected {
  border-color: var(--orange);
  background: rgba(245, 158, 11, 0.08);
}

.confidence-card-item.is-a.is-selected {
  border-color: var(--green);
  background: rgba(16, 185, 129, 0.08);
}

.confidence-card-item.is-b.is-selected {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.08);
}

.confidence-card-item.is-c.is-selected {
  border-color: var(--rose);
  background: rgba(244, 63, 94, 0.08);
}

.card-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.card-count {
  font: 600 11px var(--font-mono);
  color: var(--muted);
}

.confidence-card-item p {
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--ink-secondary);
}

/* ==========================================================================
   RESULTS SECTION & VIEW TOGGLE
   ========================================================================== */
.results-section {
  margin-bottom: 48px;
}

.results-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.results-heading h2 {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 4px 0 0;
  color: var(--ink);
}

.results-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.results-meta {
  color: var(--muted);
  font-size: 12px;
  display: flex;
  align-items: center;
}

.results-badge {
  color: var(--ink);
  font: 700 13px var(--font-mono);
}

.results-separator {
  margin: 0 8px;
  color: var(--line);
}

/* View Mode Segmented Toggle */
.view-toggle {
  display: inline-flex;
  background: #0e1017;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 3px;
  gap: 3px;
}

html.light .view-toggle {
  background: #f1f5f9;
}

.view-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font: 600 12px var(--font-sans);
  color: var(--muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.view-toggle-btn:hover {
  color: var(--ink);
}

.view-toggle-btn.is-active {
  background: var(--card);
  color: var(--ink);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

html.light .view-toggle-btn.is-active {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.view-toggle-btn .btn-icon {
  font-size: 13px;
}

/* ==========================================================================
   CARDS VIEW (Linear Card Grid)
   ========================================================================== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  gap: 18px;
  margin-bottom: 32px;
}

.offer-card {
  background: var(--card);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-sm), inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.offer-card:hover {
  border-color: var(--card-border-hover);
  box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.7), 0 0 16px rgba(99, 102, 241, 0.12);
  transform: translateY(-2px);
}

.offer-card.is-top-rank {
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.1);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-vendor-plan {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.vendor-stamp {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 8px;
  font: 700 13px var(--font-mono);
  flex-shrink: 0;
  padding: 5px;
  box-sizing: border-box;
}

html.light .vendor-stamp {
  background: #ffffff;
}

.vendor-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.vendor-initial-fallback {
  color: #818cf8;
  font: 700 13px var(--font-mono);
}

.card-vendor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-vendor-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-vendor-name {
  font: 700 13px var(--font-sans);
  color: var(--ink-secondary);
}

.sector-chip {
  width: fit-content;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.12);
  font: 600 10px var(--font-mono);
  letter-spacing: 0.02em;
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.card-plan-title {
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
}

.card-plan-title strong {
  font: 800 16px var(--font-sans);
  color: var(--ink);
}

.plan-subname {
  font-size: 13px;
  color: var(--muted);
}

.card-price-box {
  text-align: right;
  flex-shrink: 0;
}

.card-price-main {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 2px;
}

.card-price-usd {
  font: 800 20px var(--font-mono);
  color: var(--ink);
  letter-spacing: -0.02em;
}

.card-price-unit {
  font-size: 11px;
  color: var(--muted);
  font-weight: 600;
}

.card-price-caption {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.native-price {
  font: 600 11px var(--font-mono);
  color: var(--ink-secondary);
}

.seat-badge {
  font: 600 10px var(--font-mono);
  color: var(--muted);
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 6px;
  border-radius: 3px;
}

/* Card Model Row */
.card-model-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--bg-subtle);
  border: 1px solid var(--line-light);
  border-radius: var(--radius-sm);
  gap: 10px;
}

.card-model-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.model-name-link {
  font: 700 13px var(--font-sans);
  color: var(--ink);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.model-name-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

.model-name-link .ext-arrow {
  font-size: 11px;
  color: var(--muted);
}

.model-meta-tag {
  font: 500 11px var(--font-mono);
  color: var(--muted);
}

.card-aa-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 4px;
  flex-shrink: 0;
}

.card-aa-badge .aa-label {
  font: 700 10px var(--font-mono);
  color: #a5b4fc;
  letter-spacing: 0.04em;
}

.card-aa-badge .aa-val {
  font: 800 12px var(--font-mono);
  color: #a5b4fc;
}

/* Card 3-Metric Value Grid */
.card-metrics-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr 1fr;
  gap: 8px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--line-light);
  border-radius: var(--radius-sm);
  padding: 10px;
}

html.light .card-metrics-grid {
  background: #f8fafc;
}

.metric-box {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.metric-box-title {
  font: 700 10px var(--font-mono);
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.metric-main-val {
  font: 800 15px var(--font-mono);
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.metric-main-val.is-green {
  color: var(--green);
  font-size: 17px;
  text-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
}

.metric-main-val small {
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
  margin-left: 2px;
}

.subsidy-badge-wrap {
  display: flex;
  align-items: center;
  min-height: 22px;
}

.subsidy-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  font: 700 11px var(--font-mono);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.subsidy-badge.is-super {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.subsidy-badge.is-high {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.subsidy-badge.is-fair {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.subsidy-badge.is-discount {
  background: rgba(244, 63, 94, 0.15);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.4);
}

.subsidy-badge.is-opaque {
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted);
  border: 1px solid var(--line);
}

.metric-caption-text {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Card Footer */
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--line-light);
  font-size: 11px;
}

.card-footer-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-quota-rule {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--ink-secondary);
}

.quota-icon {
  font-size: 12px;
  color: var(--orange);
  flex-shrink: 0;
}

.quota-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
}

.card-confidence-rule {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.4;
  overflow: hidden;
}

.confidence-rule-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-sources-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.source-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  font-size: 10px;
  color: var(--muted);
  text-decoration: none;
  transition: all 0.15s ease;
}

.source-chip:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent);
  color: var(--ink);
}

.source-chip-mark {
  font: 700 11px var(--font-mono);
  color: var(--accent);
}

.source-chip-text {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==========================================================================
   COMPARISON TABLE (Dense Linear Grid)
   ========================================================================== */
.comparison-scroll {
  overflow-x: auto;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow-sm);
  margin-bottom: 48px;
}

.comparison-table {
  width: 100%;
  min-width: 1320px;
  table-layout: fixed;
  border-collapse: collapse;
  color: var(--ink);
}

.comparison-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 12px 14px;
  background: #0d1017;
  color: var(--muted);
  text-align: left;
  font: 700 11px var(--font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--line);
  white-space: nowrap;
}

html.light .comparison-table th {
  background: #f1f5f9;
}

.comparison-table th:nth-child(1) { width: 11%; }
.comparison-table th:nth-child(2) { width: 11%; }
.comparison-table th:nth-child(3) { width: 12%; }
.comparison-table th:nth-child(4) { width: 11%; }
.comparison-table th:nth-child(5) { width: 9%; }
.comparison-table th:nth-child(6) { width: 14%; }
.comparison-table th:nth-child(7) { width: 14%; }
.comparison-table th:nth-child(8) { width: 13%; }
.comparison-table th:nth-child(9) { width: 5%; text-align: center; }

.comparison-table td {
  padding: 12px 14px;
  vertical-align: top;
  border-right: 1px solid var(--line-light);
  border-bottom: 1px solid var(--line-light);
  font-size: 13px;
  line-height: 1.45;
  overflow-wrap: break-word;
}

.comparison-table tr:last-child td {
  border-bottom: 0;
}

.comparison-table td:last-child {
  border-right: 0;
}

.comparison-table tbody tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

html.light .comparison-table tbody tr:hover td {
  background: #f8fafc;
}

/* Cell Layouts */
.cell-flow {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.vendor-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vendor-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.vendor-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
}

.subscription-cell strong {
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
}

.subscription-cell span {
  color: var(--ink-secondary);
  font-size: 12px;
}

.model-cell a {
  color: #818cf8;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  line-height: 1.3;
}

.model-cell a:hover {
  text-decoration: underline;
}

.model-cell small {
  color: var(--muted);
  font: 11px var(--font-mono);
  line-height: 1.4;
}

.confidence-cell {
  background: rgba(255, 255, 255, 0.02);
}

.confidence-reason-text {
  font-size: 11px;
  color: var(--muted);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-cell strong {
  font: 700 16px var(--font-mono);
  letter-spacing: -0.04em;
  color: var(--ink);
  white-space: nowrap;
}

.price-cell strong small {
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
}

.price-cell span {
  font-size: 11px;
  color: var(--muted);
}

.api-cell {
  font-family: var(--font-mono);
}

.api-cost {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.api-caption {
  font-size: 11px;
  color: var(--muted);
}

.quota-label-text {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.subsidy-note {
  font-size: 11px;
  color: var(--muted);
  margin-top: 2px;
}

.sub-ipd-strong {
  font: 800 18px var(--font-mono);
  color: var(--green);
  letter-spacing: -0.02em;
}

.sub-ipd-sub {
  font-size: 11px;
  color: var(--muted);
}

.no-benchmark {
  color: var(--muted-light);
  font-style: italic;
  font-size: 12px;
}

.source-cell {
  text-align: center;
}

.source-wrap {
  display: flex;
  justify-content: center;
  gap: 4px;
}

/* ==========================================================================
   UNPAIRED PLANS & SOURCES & METHODOLOGY
   ========================================================================== */
.compact-heading {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 16px;
}

.compact-heading h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--ink);
}

.coverage-count {
  font: 600 12px var(--font-mono);
  color: var(--muted);
}

.unpaired-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;
  margin-bottom: 48px;
}

.unpaired-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow-sm);
}

.unpaired-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.unpaired-name strong {
  font-size: 14px;
  color: var(--ink);
}

.unpaired-price {
  font: 700 15px var(--font-mono);
  color: var(--ink);
}

.unpaired-reason {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.5;
}

.unpaired-reason a {
  color: #818cf8;
  font-weight: 600;
  margin-left: 8px;
}

.unpaired-reason a:hover {
  text-decoration: underline;
}

/* Methodology Section */
.method-section {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) 2.2fr;
  gap: 40px;
  border-top: 1px solid var(--line);
  padding: 48px 0;
}

.method-intro h2 {
  font-size: 24px;
  line-height: 1.3;
  margin-bottom: 12px;
}

.method-intro h2 em {
  color: #818cf8;
  font-style: normal;
}

.method-intro > p:last-child {
  font-size: 13px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0;
}

.method-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.method-cards article {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: var(--shadow-sm);
}

.method-number {
  font: 700 12px var(--font-mono);
  color: var(--orange);
  margin-bottom: 10px;
}

.method-cards h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--ink);
}

.method-cards p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.65;
  margin: 0 0 auto;
}

.method-cards code {
  margin-top: 14px;
  color: #a5b4fc;
  font: 600 11px var(--font-mono);
  background: rgba(99, 102, 241, 0.12);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  white-space: normal;
  display: block;
}

.method-footnote {
  grid-column: 2;
  margin: 16px 0 0;
  padding: 12px 16px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: var(--radius-sm);
  font-size: 12px;
  color: #fbbf24;
  line-height: 1.6;
}

.method-footnote span {
  display: inline-grid;
  place-items: center;
  background: rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  font: 700 10px var(--font-mono);
}

/* Sources Panel */
.sources-panel {
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: var(--radius-md);
  margin-bottom: 48px;
  box-shadow: var(--shadow-sm);
}

.sources-panel summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.sources-panel summary::-webkit-details-marker {
  display: none;
}

.sources-panel summary b {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 3px;
}

.sources-panel summary small {
  display: block;
  font-size: 12px;
  color: var(--muted);
}

.summary-action {
  font-size: 12px;
  font-weight: 600;
  color: #818cf8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-action i {
  font-style: normal;
  font-size: 16px;
  transition: transform 0.2s ease;
}

.sources-panel[open] .summary-action i {
  transform: rotate(45deg);
}

.source-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: var(--muted);
  font-size: 12px;
  padding: 12px 24px;
  background: var(--bg-subtle);
  border-top: 1px solid var(--line-light);
  border-bottom: 1px solid var(--line-light);
}

.source-tools b {
  color: var(--ink);
  font: 600 12px var(--font-mono);
}

.sources-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 10px;
  padding: 18px 24px;
}

.source-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--line-light);
  border-radius: var(--radius-sm);
  font-size: 12px;
}

.source-kind {
  color: #fbbf24;
  font: 700 10px var(--font-mono);
  background: rgba(245, 158, 11, 0.12);
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  flex-shrink: 0;
  margin-top: 1px;
}

.source-detail {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.source-detail a {
  color: #818cf8;
  font-weight: 600;
  line-height: 1.4;
  word-break: break-all;
}

.source-detail a:hover {
  text-decoration: underline;
}

.source-detail small {
  color: var(--muted);
  font: 11px var(--font-mono);
}

.source-disclosure {
  margin: 0 24px 20px;
  padding: 14px 18px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--accent);
}

.source-disclosure b {
  font-size: 12px;
  color: var(--ink);
}

.source-disclosure p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

/* Footer */
.footer {
  border-top: 1px solid var(--line);
  padding: 24px max(24px, calc((100vw - 1400px) / 2));
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: var(--muted);
  font-size: 12px;
}

.footer span:first-child {
  font: 600 11px var(--font-mono);
  letter-spacing: 0.08em;
}

/* Utilities & Cell Helpers */
.text-muted {
  color: var(--muted);
}

.is-neutral {
  color: var(--muted);
  background: rgba(255, 255, 255, 0.05);
}

.card-sources {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.vendor-cell {
  vertical-align: top;
}

.subsidy-cell {
  vertical-align: top;
}

.api-value {
  font: 700 13px var(--font-mono);
  color: var(--ink);
}

.ipd-cell {
  vertical-align: top;
}

.unpaired-section {
  margin-bottom: 48px;
}

/* Responsive Media Queries */
@media (max-width: 1080px) {
  .page-shell {
    padding: 0 20px;
  }
  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }
  .scenario-strip {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .method-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .method-footnote {
    grid-column: 1;
  }
  .confidence-grid-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .topbar {
    height: 56px;
    padding: 0 16px;
  }
  .hero {
    display: block;
    padding: 32px 0 24px;
  }
  .hero-aside {
    margin-top: 20px;
    width: 100%;
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 28px;
  }
  .filter-grid {
    grid-template-columns: 1fr;
  }
  .confidence-grid-cards {
    grid-template-columns: 1fr;
  }
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .card-metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
  .metric-box-primary {
    grid-column: 1 / -1;
  }
  .results-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .results-actions {
    width: 100%;
    justify-content: space-between;
  }
  .comparison-table {
    min-width: 1100px;
  }
}
`;

fs.writeFileSync("web/styles.css", cssContent);
console.log("Successfully written web/styles.css (" + cssContent.length + " bytes)");
