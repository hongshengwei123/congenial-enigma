$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manifest = Get-Content (Join-Path $Root ".cursor-plugin\plugin.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$target = Join-Path $env:USERPROFILE ".cursor\plugins\local\$($manifest.name)"

if (-not (Test-Path (Split-Path $target -Parent))) {
  New-Item -ItemType Directory -Path (Split-Path $target -Parent) -Force | Out-Null
}

if (Test-Path $target) {
  Remove-Item $target -Recurse -Force
}
New-Item -ItemType Directory -Path $target -Force | Out-Null

$excludeDirs = @("node_modules", ".git", "dist")
$excludeFiles = @("*.zip", "*.vsix")

Get-ChildItem -LiteralPath $Root -Force | ForEach-Object {
  if ($_.PSIsContainer -and $excludeDirs -contains $_.Name) {
    return
  }
  if (-not $_.PSIsContainer) {
    foreach ($pat in $excludeFiles) {
      if ($_.Name -like $pat) { return }
    }
  }
  Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $target $_.Name) -Recurse -Force
}

Write-Host "Copied plugin sources to: $target"
Write-Host "Installing runtime dependencies (MCP)..."
Push-Location $target
try {
  npm install --omit=dev --ignore-scripts --no-fund --no-audit
} finally {
  Pop-Location
}

Write-Host "Installed to: $target"
Write-Host "Restart Cursor or reload Plugins, then check Customize."
