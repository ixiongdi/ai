# Symlink code/skills/* into Cursor, Claude Code, and Codex user skill dirs.
param(
  [string]$Skill = $env:SKILL
)

$ErrorActionPreference = "Stop"
$SkillsDir = $PSScriptRoot

function Get-DestRoots {
  $homeDir = if ($env:HOME -and ($IsLinux -or $IsMacOS)) {
    $env:HOME
  } elseif ($env:USERPROFILE) {
    $env:USERPROFILE
  } else {
    $HOME
  }
  @(
    (Join-Path $homeDir ".cursor/skills"),
    (Join-Path $homeDir ".claude/skills"),
    (Join-Path $homeDir ".codex/skills")
  )
}

function Install-SkillLink([string]$Source, [string]$Name) {
  foreach ($root in Get-DestRoots) {
    New-Item -ItemType Directory -Force -Path $root | Out-Null
    $dest = Join-Path $root $Name
    if (Test-Path -LiteralPath $dest) {
      $item = Get-Item -LiteralPath $dest -Force
      if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        Remove-Item -LiteralPath $dest -Force
      } else {
        Remove-Item -LiteralPath $dest -Recurse -Force
      }
    }
    try {
      New-Item -ItemType SymbolicLink -Path $dest -Target $Source -ErrorAction Stop | Out-Null
    } catch {
      try {
        New-Item -ItemType Junction -Path $dest -Target $Source -ErrorAction Stop | Out-Null
      } catch {
        Write-Error @"
Failed to create link $dest -> $Source
Windows: enable Developer Mode or run as Administrator (junctions usually need no elevation).
$($_.Exception.Message)
"@
        exit 1
      }
    }
    Write-Host "skill: $dest -> $Source"
  }
}

$found = $false
foreach ($dir in Get-ChildItem -Directory $SkillsDir) {
  $skillMd = Join-Path $dir.FullName "SKILL.md"
  if (-not (Test-Path -LiteralPath $skillMd)) { continue }
  if ($Skill -and $dir.Name -ne $Skill) { continue }
  $found = $true
  Install-SkillLink $dir.FullName $dir.Name
}

if (-not $found) {
  if ($Skill) {
    Write-Error "error: no skill named '$Skill' under $SkillsDir"
  } else {
    Write-Error "error: no SKILL.md directories under $SkillsDir"
  }
  exit 1
}
