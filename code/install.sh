#!/usr/bin/env bash
# Install user-level Skills + MCP for Cursor, Claude Code, and Codex.
# Linux, macOS, Windows (Git Bash / MSYS / Cygwin). Native Windows: install.ps1.
#
#   curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash
set -euo pipefail
shopt -s nullglob

REPO_URL="${AI_INSTALL_REPO:-https://github.com/ixiongdi/ai.git}"
REPO_REF="${AI_INSTALL_REF:-main}"
SKIP_MCP="${SKIP_MCP:-0}"
SKIP_SKILLS="${SKIP_SKILLS:-0}"
SKILL="${SKILL:-}"
CODE_DIR=""

# curl | bash is non-interactive: Homebrew / nvm / linuxbrew are often missing from PATH.
prepend_path() {
  local p="${1:-}"
  [[ -n "$p" && -d "$p" ]] || return 0
  case ":${PATH}:" in
    *:"$p":*) ;;
    *) PATH="$p:$PATH" ;;
  esac
}

bootstrap_path() {
  prepend_path /opt/homebrew/bin
  prepend_path /usr/local/bin
  prepend_path /home/linuxbrew/.linuxbrew/bin
  prepend_path "${HOME}/.linuxbrew/bin"
  prepend_path "${HOME}/.local/bin"
  prepend_path "${HOME}/.volta/bin"
  prepend_path "${HOME}/.cargo/bin"
  prepend_path "${HOME}/.asdf/shims"
  prepend_path "${HOME}/.fnm"
  if [[ -n "${LOCALAPPDATA:-}" ]]; then
    prepend_path "${LOCALAPPDATA}/Programs/nodejs"
  fi
  prepend_path "/c/Program Files/nodejs"
  prepend_path "/c/Program Files (x86)/nodejs"
  if [[ -n "${PROGRAMFILES:-}" ]]; then
    prepend_path "${PROGRAMFILES}/nodejs"
  fi

  export NVM_DIR="${NVM_DIR:-${HOME}/.nvm}"
  if [[ -s "${NVM_DIR}/nvm.sh" ]]; then
    set +euo pipefail
    # shellcheck disable=SC1091
    . "${NVM_DIR}/nvm.sh"
    set -euo pipefail
    shopt -s nullglob
  fi
  if command -v fnm >/dev/null 2>&1; then
    set +euo pipefail
    eval "$(fnm env --shell bash 2>/dev/null)" || true
    set -euo pipefail
    shopt -s nullglob
  fi
  export PATH
}

detect_os() {
  local u
  u="$(uname -s 2>/dev/null || echo unknown)"
  case "$u" in
    Linux*) printf '%s' linux ;;
    Darwin*) printf '%s' macos ;;
    MINGW*|MSYS*|CYGWIN*) printf '%s' windows ;;
    *) printf '%s' unknown ;;
  esac
}

is_wsl() {
  grep -qi microsoft /proc/version 2>/dev/null || grep -qi microsoft /proc/sys/kernel/osrelease 2>/dev/null
}

portable_mktemp_d() {
  mktemp -d "${TMPDIR:-/tmp}/ixiongdi-ai.XXXXXX"
}

user_home() {
  if [[ -n "${HOME:-}" ]]; then
    printf '%s' "$HOME"
    return
  fi
  if [[ -n "${USERPROFILE:-}" ]]; then
    printf '%s' "$USERPROFILE"
    return
  fi
  printf '%s' "$(cd && pwd)"
}

run_python() {
  if command -v python3 >/dev/null 2>&1; then
    python3 "$@"
    return $?
  fi
  if command -v python >/dev/null 2>&1; then
    if python -c 'import sys; raise SystemExit(0 if sys.version_info[0] >= 3 else 1)' 2>/dev/null; then
      python "$@"
      return $?
    fi
  fi
  if command -v py >/dev/null 2>&1; then
    py -3 "$@"
    return $?
  fi
  return 127
}

link_dir() {
  local src="$1"
  local dest="$2"
  local os="$3"
  if [[ -e "$dest" || -L "$dest" ]]; then
    rm -rf "$dest"
  fi
  if [[ "$os" == windows ]]; then
    export MSYS="${MSYS:+$MSYS }winsymlinks:nativestrict"
    if ln -s "$src" "$dest" 2>/dev/null; then
      return 0
    fi
    if command -v cygpath >/dev/null 2>&1 && command -v powershell.exe >/dev/null 2>&1; then
      local wsrc wdest
      wsrc="$(cygpath -w "$src")"
      wdest="$(cygpath -w "$dest")"
      powershell.exe -NoProfile -Command \
        "New-Item -ItemType Junction -Force -Path '$wdest' -Target '$wsrc' | Out-Null"
      return 0
    fi
    echo "error: could not link $dest -> $src (enable Developer Mode or use install.ps1)" >&2
    exit 1
  fi
  ln -s "$src" "$dest"
}

default_install_root() {
  if [[ -n "${AI_INSTALL_ROOT:-}" ]]; then
    printf '%s' "$AI_INSTALL_ROOT"
    return
  fi
  local os home
  os="$(detect_os)"
  home="$(user_home)"
  if [[ "$os" == windows ]]; then
    if [[ -n "${LOCALAPPDATA:-}" ]]; then
      printf '%s' "${LOCALAPPDATA}/ixiongdi/ai"
    else
      printf '%s' "${home}/AppData/Local/ixiongdi/ai"
    fi
    return
  fi
  if [[ -n "${XDG_DATA_HOME:-}" ]]; then
    printf '%s' "${XDG_DATA_HOME}/ixiongdi/ai"
  else
    printf '%s' "${home}/.local/share/ixiongdi/ai"
  fi
}

has_skills() {
  local root="$1"
  local d
  for d in "$root"/skills/*/; do
    if [[ -f "${d}SKILL.md" ]]; then
      return 0
    fi
  done
  return 1
}

is_local_checkout() {
  [[ "${AI_INSTALL_REMOTE:-0}" == 1 ]] && return 1
  local src="${BASH_SOURCE[0]:-}"
  case "$src" in
    ''|-|/dev/*|/proc/*) return 1 ;;
  esac
  [[ -f "$src" ]] || return 1
  local dir
  dir="$(cd "$(dirname "$src")" && pwd)"
  has_skills "$dir"
}

github_https_base() {
  local url="${REPO_URL%.git}"
  url="${url%/}"
  case "$url" in
    git@github.com:*) url="https://github.com/${url#git@github.com:}" ;;
    ssh://git@github.com/*) url="https://github.com/${url#ssh://git@github.com/}" ;;
  esac
  printf '%s' "$url"
}

download() {
  local url="$1"
  local out="$2"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$out"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$out" "$url"
  else
    echo "error: need curl or wget to fetch $url" >&2
    exit 1
  fi
}

fetch_tarball() {
  local dest="$1"
  local archive_url
  archive_url="$(github_https_base)/archive/refs/heads/${REPO_REF}.tar.gz"
  local tmp tarball top
  tmp="$(portable_mktemp_d)"
  tarball="${tmp}/src.tar.gz"
  echo "install: fetching ${archive_url}" >&2
  download "$archive_url" "$tarball"
  tar -xzf "$tarball" -C "$tmp"
  top=""
  for d in "$tmp"/*/; do
    [[ -d "$d" ]] || continue
    top="${d%/}"
    break
  done
  if [[ -z "$top" ]] || ! has_skills "${top}/code"; then
    echo "error: archive did not contain code/skills/*/SKILL.md" >&2
    rm -rf "$tmp"
    exit 1
  fi
  mkdir -p "$(dirname "$dest")"
  rm -rf "$dest"
  mv "$top" "$dest"
  rm -rf "$tmp"
}

sync_repo() {
  local dest="$1"
  mkdir -p "$(dirname "$dest")"

  if [[ -d "$dest/.git" ]]; then
    echo "install: updating ${dest} (${REPO_REF})" >&2
    git -C "$dest" fetch -q --depth 1 origin "$REPO_REF"
    git -C "$dest" checkout -q -B "$REPO_REF" FETCH_HEAD
    git -C "$dest" reset -q --hard FETCH_HEAD
    return 0
  fi

  if has_skills "${dest}/code"; then
    echo "install: using existing ${dest}" >&2
    return 0
  fi

  if [[ -e "$dest" && -n "$(ls -A "$dest" 2>/dev/null || true)" ]]; then
    echo "error: ${dest} exists and is not an ixiongdi/ai checkout" >&2
    echo "       set AI_INSTALL_ROOT to an empty directory" >&2
    exit 1
  fi

  rm -rf "$dest"

  if [[ -d "$REPO_URL" ]]; then
    echo "install: cloning ${REPO_URL} -> ${dest}" >&2
    if command -v git >/dev/null 2>&1 && [[ -d "${REPO_URL}/.git" ]]; then
      git clone -q --depth 1 --branch "$REPO_REF" "$REPO_URL" "$dest"
    else
      cp -R "$REPO_URL" "$dest"
    fi
    return 0
  fi

  if command -v git >/dev/null 2>&1; then
    echo "install: git clone --depth 1 --branch ${REPO_REF} ${REPO_URL}" >&2
    git clone -q --depth 1 --branch "$REPO_REF" "$REPO_URL" "$dest"
    return 0
  fi

  fetch_tarball "$dest"
}

ensure_code_dir() {
  if is_local_checkout; then
    CODE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    echo "install: local checkout ${CODE_DIR}" >&2
    return 0
  fi
  local root
  root="$(default_install_root)"
  sync_repo "$root"
  CODE_DIR="${root}/code"
  if ! has_skills "$CODE_DIR"; then
    echo "error: no SKILL.md under ${CODE_DIR}/skills after fetch" >&2
    exit 1
  fi
  echo "install: source ${root}" >&2
}

install_skills() {
  local name_filter="${SKILL:-}"
  local os home
  os="$(detect_os)"
  home="$(user_home)"
  local dest_roots=(
    "${home}/.cursor/skills"
    "${home}/.claude/skills"
    "${home}/.codex/skills"
  )
  local dir name src root dest found=0
  for dir in "$CODE_DIR"/skills/*/; do
    [[ -f "${dir}SKILL.md" ]] || continue
    name="$(basename "$dir")"
    if [[ -n "$name_filter" && "$name" != "$name_filter" ]]; then
      continue
    fi
    found=1
    src="$(cd "$dir" && pwd)"
    for root in "${dest_roots[@]}"; do
      mkdir -p "$root"
      dest="${root}/${name}"
      link_dir "$src" "$dest" "$os"
      echo "skill: ${dest} -> ${src}"
    done
  done
  if [[ "$found" -eq 0 ]]; then
    if [[ -n "$name_filter" ]]; then
      echo "error: no skill named '${name_filter}' under ${CODE_DIR}/skills" >&2
    else
      echo "error: no SKILL.md directories under ${CODE_DIR}/skills" >&2
    fi
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-mcp) SKIP_MCP=1; shift ;;
    --skip-skills) SKIP_SKILLS=1; shift ;;
    --skill)
      if [[ $# -lt 2 || -z "${2}" || "$2" == -* ]]; then
        echo "error: --skill requires a name" >&2
        exit 1
      fi
      SKILL="$2"
      shift 2
      ;;
    -h|--help)
      cat <<'EOF'
Linux / macOS:
  curl -fsSL https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.sh | bash

Windows (PowerShell 5.1+):
  irm https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.ps1 | iex

Windows (Git Bash): this script also works.

  bash -s -- [--skill NAME] [--skip-mcp] [--skip-skills]

  SKILL / SKIP_MCP / SKIP_SKILLS / AI_INSTALL_ROOT / AI_INSTALL_REPO / AI_INSTALL_REF / AI_INSTALL_REMOTE
EOF
      exit 0
      ;;
    *)
      echo "error: unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

bootstrap_path
OS_NAME="$(detect_os)"
echo "install: os=${OS_NAME} home=$(user_home)" >&2
if [[ "$OS_NAME" == linux ]] && is_wsl; then
  echo "install: WSL — Skills go to the Linux home. Windows Cursor/Claude/Codex: run install.ps1 in PowerShell." >&2
fi
if [[ "$OS_NAME" == windows ]]; then
  echo "install: Git Bash/MSYS. For native Windows hosts prefer: irm https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.ps1 | iex" >&2
fi

ensure_code_dir

if [[ "$SKIP_SKILLS" != 1 ]]; then
  install_skills
fi

if [[ "$SKIP_MCP" == 1 ]]; then
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "mcp: skip (node not on PATH; need Node.js 20+). macOS: brew install node. Windows: https://nodejs.org/" >&2
  exit 0
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "mcp: skip (npm not on PATH)" >&2
  exit 0
fi
if ! run_python -c 'import sys' >/dev/null 2>&1; then
  echo "mcp: skip (need Python 3: python3, python, or py -3)" >&2
  exit 0
fi

MCP_DIR="$CODE_DIR/mcp/id-generator"
if [[ ! -f "$MCP_DIR/package.json" ]]; then
  echo "mcp: skip (this checkout has no code/mcp/id-generator)" >&2
  exit 0
fi

REG="$CODE_DIR/install/register_mcp.py"
if [[ ! -f "$REG" ]]; then
  echo "mcp: skip (missing $REG)" >&2
  exit 0
fi

echo "mcp: npm install + build in $MCP_DIR"
(
  cd "$MCP_DIR"
  npm install
  npm run build
)

run_python "$REG" --entry "$MCP_DIR/dist/index.js"
echo "mcp: registered id-generator (stdio). Hosts that lack MCP 2026-07-28 may not connect."
