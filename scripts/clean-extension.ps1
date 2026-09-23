# Run after fully quitting Cursor if VSIX install fails with EPERM rename
$ErrorActionPreference = "Continue"
$extDir = Join-Path $env:USERPROFILE ".cursor\extensions"

Write-Host "Cleaning: $extDir"

Get-ChildItem $extDir -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match '^chinese-ai-helper\.' -or $_.Name -match '^\.[a-f0-9-]{36}$' } |
  ForEach-Object {
    Write-Host "Remove: $($_.Name)"
    Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    if (Test-Path $_.FullName) {
      Write-Host "  FAILED - folder locked. Quit Cursor completely and retry."
    } else {
      Write-Host "  OK"
    }
  }

Write-Host "Then install chinese-ai-helper-1.0.5.vsix from Extensions menu."
