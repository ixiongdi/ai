#!/usr/bin/env bash
# Symlink code/skills/* into Cursor, Claude Code, and Codex user skill dirs.
set -euo pipefail

SKILLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAME_FILTER="${SKILL:-}"

dest_roots() {
  printf '%s\n' \
    "${HOME}/.cursor/skills" \
    "${HOME}/.claude/skills" \
    "${HOME}/.codex/skills"
}

link_one() {
  local src="$1"
  local name
  name="$(basename "$src")"
  local root dest
  local u
  u="$(uname -s 2>/dev/null || echo unknown)"
  while IFS= read -r root; do
    mkdir -p "$root"
    dest="${root}/${name}"
    if [[ -e "$dest" || -L "$dest" ]]; then
      rm -rf "$dest"
    fi
    case "$u" in
      MINGW*|MSYS*|CYGWIN*)
        export MSYS="${MSYS:+$MSYS }winsymlinks:nativestrict"
        if ! ln -s "$src" "$dest" 2>/dev/null; then
          if command -v cygpath >/dev/null 2>&1 && command -v powershell.exe >/dev/null 2>&1; then
            powershell.exe -NoProfile -Command \
              "New-Item -ItemType Junction -Force -Path '$(cygpath -w "$dest")' -Target '$(cygpath -w "$src")' | Out-Null"
          else
            echo "error: could not link $dest (use code/install.ps1 on Windows)" >&2
            exit 1
          fi
        fi
        ;;
      *)
        ln -s "$src" "$dest"
        ;;
    esac
    echo "skill: ${dest} -> ${src}"
  done < <(dest_roots)
}

shopt -s nullglob
found=0
for dir in "$SKILLS_DIR"/*/; do
  [[ -f "${dir}SKILL.md" ]] || continue
  name="$(basename "$dir")"
  if [[ -n "$NAME_FILTER" && "$name" != "$NAME_FILTER" ]]; then
    continue
  fi
  found=1
  link_one "$(cd "$dir" && pwd)"
done

if [[ "$found" -eq 0 ]]; then
  if [[ -n "$NAME_FILTER" ]]; then
    echo "error: no skill named '${NAME_FILTER}' under ${SKILLS_DIR}" >&2
  else
    echo "error: no SKILL.md directories under ${SKILLS_DIR}" >&2
  fi
  exit 1
fi
