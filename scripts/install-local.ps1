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

Copy-Item $Root $target -Recurse -Force
@("dist", "*.zip") | ForEach-Object { Get-ChildItem $target -Recurse -Include $_ -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "Installed to: $target"
Write-Host "Restart Cursor or reload Plugins, then check Customize."
