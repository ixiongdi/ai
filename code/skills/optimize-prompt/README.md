# optimize-prompt

Agent Skill that **rewrites user chat prompts** for ChatGPT, Claude,
Cursor, and similar. Diagnose gaps, then return one copy-paste prompt
in the user's language.

Not for system prompts, role cards, or `SKILL.md` descriptions.

Format: [Agent Skills](https://agentskills.io/home).

## Install

Install the **ixiongdi** [Agent Plugin](https://agent-plugins.org/) (this skill + the others, and MCP):
[code/README.md](../../README.md).

Do not also symlink this skill into `~/.cursor/skills/` if the plugin is installed.
Do not write `~/.cursor/skills-cursor/`. Optional project copies:
`.cursor/skills/optimize-prompt/`, `.claude/skills/optimize-prompt/`,
`.codex/skills/optimize-prompt/`.

### For agent

```
Do not clone https://github.com/ixiongdi/ai.git into the user's project.
Install Agent Plugin ixiongdi (Agent Skills + MCP only) from that repo's code/:
  Cursor / Codex / other Agent Plugins 1.0 hosts: install the plugin (Cursor local: symlink code/ to ~/.cursor/plugins/local/ixiongdi)
  Claude Code and other non-Agent-Plugins hosts: skill symlink fallback, do not /plugin install
```

### For human

See [code/README.md](../../README.md). Skill-only symlink fallback:
`curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash -s -- --skill optimize-prompt --skip-mcp`


## Layout

| Path | Role |
| ---- | ---- |
| `SKILL.md` | Classify, diagnose, rewrite, deliver |
| `references/patterns.md` | Extra bullets by intent (debug / generate / plan) |
| `references/anti-patterns.md` | Padding and fake-role to strip |
| `evals/` | Output-quality cases and description triggers |

No scripts. The agent follows `SKILL.md`.

## Validate

```bash
uvx --from git+https://github.com/agentskills/agentskills#subdirectory=skills-ref \
  skills-ref validate /path/to/optimize-prompt
```

`evals/` are labeled cases only. This repository does not run a
cross-client trigger-rate loop.

## License

MIT — see [LICENSE](LICENSE).
