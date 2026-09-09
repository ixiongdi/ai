# Install user-level Skills + MCP for Cursor, Claude Code, and Codex.
# Windows PowerShell 5.1+ / PowerShell 7 (Linux, macOS, Windows).
#
#   irm https://raw.githubusercontent.com/ixiongdi/ai/main/code/install.ps1 | iex
param(
  [string]$Skill = $env:SKILL,
  [switch]$SkipMcp,
  [switch]$SkipSkills
)

$ErrorActionPreference = "Stop"
try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
} catch {}

if ($env:SKIP_MCP -eq "1") { $SkipMcp = $true }
if ($env:SKIP_SKILLS -eq "1") { $SkipSkills = $true }

$RepoUrl = if ($env:AI_INSTALL_REPO) { $env:AI_INSTALL_REPO } else { "https://github.com/ixiongdi/ai.git" }
$RepoRef = if ($env:AI_INSTALL_REF) { $env:AI_INSTALL_REF } else { "main" }

function Get-OSFamily {
  if ($PSVersionTable.PSVersion.Major -ge 6) {
    if ($IsWindows) { return "windows" }
    if ($IsMacOS) { return "macos" }
    if ($IsLinux) { return "linux" }
  }
  return "windows"
}

function Get-UserHome {
  $os = Get-OSFamily
  if ($os -eq "windows") {
    if ($env:USERPROFILE) { return $env:USERPROFILE }
    return [Environment]::GetFolderPath("UserProfile")
  }
  if ($env:HOME) { return $env:HOME }
  if ($env:USERPROFILE) { return $env:USERPROFILE }
  return [Environment]::GetFolderPath("UserProfile")
}

function Add-CommonBinDirs {
  $os = Get-OSFamily
  $home = Get-UserHome
  $dirs = @()
  if ($os -eq "macos" -or $os -eq "linux") {
    $dirs += "/opt/homebrew/bin", "/usr/local/bin", "/home/linuxbrew/.linuxbrew/bin"
    $dirs += (Join-Path $home ".linuxbrew/bin")
    $dirs += (Join-Path $home ".local/bin")
    $dirs += (Join-Path $home ".volta/bin")
    $dirs += (Join-Path $home ".asdf/shims")
  } else {
    if ($env:ProgramFiles) { $dirs += (Join-Path $env:ProgramFiles "nodejs") }
    if ($env:LOCALAPPDATA) { $dirs += (Join-Path $env:LOCALAPPDATA "Programs\nodejs") }
  }
  $sep = [IO.Path]::PathSeparator
  foreach ($d in $dirs) {
    if ($d -and (Test-Path -LiteralPath $d)) {
      $env:PATH = $d + $sep + $env:PATH
    }
  }
}

function Get-InstallRoot {
  if ($env:AI_INSTALL_ROOT) { return $env:AI_INSTALL_ROOT }
  $os = Get-OSFamily
  if ($os -eq "windows") {
    $base = $env:LOCALAPPDATA
    if (-not $base) { $base = Join-Path (Get-UserHome) "AppData\Local" }
    return (Join-Path $base "ixiongdi\ai")
  }
  if ($env:XDG_DATA_HOME) { return (Join-Path $env:XDG_DATA_HOME "ixiongdi/ai") }
  return (Join-Path (Get-UserHome) ".local/share/ixiongdi/ai")
}

function Test-HasSkills([string]$CodeDir) {
  if (-not (Test-Path -LiteralPath (Join-Path $CodeDir "skills"))) { return $false }
  foreach ($dir in Get-ChildItem -Directory (Join-Path $CodeDir "skills") -ErrorAction SilentlyContinue) {
    if (Test-Path -LiteralPath (Join-Path $dir.FullName "SKILL.md")) { return $true }
  }
  return $false
}

function Test-LocalCheckout {
  if ($env:AI_INSTALL_REMOTE -eq "1") { return $false }
  if (-not $PSScriptRoot) { return $false }
  return (Test-HasSkills $PSScriptRoot)
}

function Get-GitHubHttpsBase([string]$Url) {
  $u = $Url.TrimEnd("/")
  if ($u.EndsWith(".git")) { $u = $u.Substring(0, $u.Length - 4) }
  if ($u.StartsWith("git@github.com:")) {
    $u = "https://github.com/" + $u.Substring("git@github.com:".Length)
  }
  return $u
}

function Remove-Path([string]$Dest) {
  if (-not (Test-Path -LiteralPath $Dest)) { return }
  $item = Get-Item -LiteralPath $Dest -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    Remove-Item -LiteralPath $Dest -Force
    return
  }
  Remove-Item -LiteralPath $Dest -Recurse -Force
}

function New-DirLink([string]$Dest, [string]$Source) {
  Remove-Path $Dest
  try {
    New-Item -ItemType SymbolicLink -Path $Dest -Target $Source -ErrorAction Stop | Out-Null
    return
  } catch {}
  if ((Get-OSFamily) -eq "windows") {
    try {
      New-Item -ItemType Junction -Path $Dest -Target $Source -ErrorAction Stop | Out-Null
      return
    } catch {}
  }
  throw @"
Failed to link $Dest -> $Source
Windows: enable Developer Mode, or run PowerShell as Administrator.
macOS/Linux: the filesystem must allow symbolic links.
"@
}

function Sync-Repo([string]$Dest) {
  $parent = Split-Path $Dest -Parent
  if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }

  if (Test-Path -LiteralPath (Join-Path $Dest ".git")) {
    Write-Host "install: updating $Dest ($RepoRef)"
    git -C $Dest fetch --depth 1 origin $RepoRef
    if ($LASTEXITCODE -ne 0) { throw "git fetch failed" }
    git -C $Dest checkout -B $RepoRef FETCH_HEAD
    if ($LASTEXITCODE -ne 0) { throw "git checkout failed" }
    git -C $Dest reset --hard FETCH_HEAD
    if ($LASTEXITCODE -ne 0) { throw "git reset failed" }
    return
  }

  $markerCode = Join-Path $Dest "code"
  if (Test-HasSkills $markerCode) {
    Write-Host "install: using existing $Dest"
    return
  }

  if ((Test-Path -LiteralPath $Dest) -and (Get-ChildItem -Force $Dest | Measure-Object).Count -gt 0) {
    throw "$Dest exists and is not an ixiongdi/ai checkout. Set AI_INSTALL_ROOT to an empty directory."
  }

  if (Test-Path -LiteralPath $Dest) { Remove-Item -LiteralPath $Dest -Recurse -Force }

  if (Test-Path -LiteralPath $RepoUrl) {
    Write-Host "install: cloning $RepoUrl -> $Dest"
    $gitDir = Join-Path $RepoUrl ".git"
    if ((Get-Command git -ErrorAction SilentlyContinue) -and (Test-Path -LiteralPath $gitDir)) {
      git clone --depth 1 --branch $RepoRef $RepoUrl $Dest
      if ($LASTEXITCODE -ne 0) { throw "git clone failed" }
    } else {
      Copy-Item -LiteralPath $RepoUrl -Destination $Dest -Recurse -Force
    }
    return
  }

  if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "install: git clone --depth 1 --branch $RepoRef $RepoUrl"
    git clone --depth 1 --branch $RepoRef $RepoUrl $Dest
    if ($LASTEXITCODE -ne 0) { throw "git clone failed" }
    return
  }

  $zipUrl = (Get-GitHubHttpsBase $RepoUrl) + "/archive/refs/heads/$RepoRef.zip"
  $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("ixiongdi-ai-" + [guid]::NewGuid().ToString("n"))
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  $zip = Join-Path $tmp "src.zip"
  Write-Host "install: fetching $zipUrl"
  Invoke-WebRequest -Uri $zipUrl -OutFile $zip -UseBasicParsing
  Expand-Archive -LiteralPath $zip -DestinationPath $tmp
  $top = Get-ChildItem -Directory $tmp | Select-Object -First 1
  if (-not $top) { throw "archive did not unpack a directory" }
  $parent = Split-Path $Dest -Parent
  if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  Move-Item -LiteralPath $top.FullName -Destination $Dest
}

function Get-CodeDir {
  if (Test-LocalCheckout) {
    Write-Host "install: local checkout $PSScriptRoot"
    return $PSScriptRoot
  }
  $root = Get-InstallRoot
  Sync-Repo $root
  $code = Join-Path $root "code"
  if (-not (Test-HasSkills $code)) {
    throw "no SKILL.md under $code\skills after fetch"
  }
  Write-Host "install: source $root"
  return $code
}

function Install-Skills([string]$CodeDir, [string]$NameFilter) {
  $homeDir = Get-UserHome
  $destRoots = @(
    (Join-Path $homeDir ".cursor/skills"),
    (Join-Path $homeDir ".claude/skills"),
    (Join-Path $homeDir ".codex/skills")
  )
  $found = $false
  foreach ($dir in Get-ChildItem -Directory (Join-Path $CodeDir "skills")) {
    if (-not (Test-Path -LiteralPath (Join-Path $dir.FullName "SKILL.md"))) { continue }
    if ($NameFilter -and $dir.Name -ne $NameFilter) { continue }
    $found = $true
    foreach ($root in $destRoots) {
      New-Item -ItemType Directory -Force -Path $root | Out-Null
      $dest = Join-Path $root $dir.Name
      New-DirLink $dest $dir.FullName
      Write-Host "skill: $dest -> $($dir.FullName)"
    }
  }
  if (-not $found) {
    if ($NameFilter) { throw "no skill named '$NameFilter' under $CodeDir\skills" }
    throw "no SKILL.md directories under $CodeDir\skills"
  }
}

function Invoke-Python3 {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$PyArgs)
  foreach ($name in @("python3", "python")) {
    $c = Get-Command $name -ErrorAction SilentlyContinue
    if (-not $c) { continue }
    & $c.Source -c "import sys; raise SystemExit(0 if sys.version_info[0] >= 3 else 1)" 2>$null
    if ($LASTEXITCODE -eq 0) {
      & $c.Source @PyArgs
      return $LASTEXITCODE
    }
  }
  if (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 @PyArgs
    return $LASTEXITCODE
  }
  return 127
}

Add-CommonBinDirs
$osFamily = Get-OSFamily
Write-Host "install: os=$osFamily home=$(Get-UserHome)"

$CodeDir = Get-CodeDir

if (-not $SkipSkills) {
  Install-Skills $CodeDir $Skill
}

if ($SkipMcp) { exit 0 }

$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue

if (-not $node) {
  Write-Host "mcp: skip (node not on PATH; need Node.js 20+). macOS: brew install node. Windows: https://nodejs.org/"
  exit 0
}
if (-not $npm) {
  Write-Host "mcp: skip (npm not on PATH)"
  exit 0
}

$mcpDir = Join-Path $CodeDir "mcp/id-generator"
if (-not (Test-Path (Join-Path $mcpDir "package.json"))) {
  Write-Host "mcp: skip (this checkout has no code/mcp/id-generator)"
  exit 0
}

$reg = Join-Path $CodeDir "install/register_mcp.py"
if (-not (Test-Path -LiteralPath $reg)) {
  Write-Host "mcp: skip (missing $reg)"
  exit 0
}

Write-Host "mcp: npm install + build in $mcpDir"
Push-Location $mcpDir
try {
  npm install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  npm run build
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
  Pop-Location
}

$entry = Join-Path $mcpDir "dist/index.js"
$code = Invoke-Python3 $reg "--entry" $entry
if ($code -eq 127) {
  Write-Host "mcp: skip (need Python 3: python3, python, or py -3)"
  exit 0
}
if ($code -ne 0) { exit $code }
Write-Host "mcp: registered id-generator (stdio). Hosts that lack MCP 2026-07-28 may not connect."
