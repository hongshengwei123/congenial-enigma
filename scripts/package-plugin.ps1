$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$manifestPath = Join-Path $Root ".cursor-plugin\plugin.json"
$manifest = Get-Content $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$outName = "{0}-{1}.zip" -f $manifest.name, $manifest.version
$outPath = Join-Path $Root $outName
$distDir = Join-Path $Root "dist"
New-Item -ItemType Directory -Path $distDir -Force | Out-Null
$stage = Join-Path $distDir ("stage-{0}-{1}" -f $manifest.name, (Get-Date -Format "yyyyMMddHHmmss"))
New-Item -ItemType Directory -Path $stage -Force | Out-Null

$include = @(
  ".cursor-plugin",
  "assets",
  "media",
  "extension",
  "rules",
  "skills",
  "commands",
  "agents",
  "hooks",
  "mcp",
  "mcp.json",
  "package.json",
  "package-lock.json",
  "node_modules",
  "CHANGELOG.md",
  "LICENSE",
  "README.md"
)

foreach ($item in $include) {
  $src = Join-Path $Root $item
  if (Test-Path $src) {
    Copy-Item $src (Join-Path $stage $item) -Recurse -Force
  }
}

if (Test-Path $outPath) {
  Remove-Item $outPath -Force
}

Get-ChildItem $stage -Recurse -Directory -Filter "dist" -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem $stage -Recurse -Filter "*.zip" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# tar 对长路径/node_modules 比 Compress-Archive 更稳（Windows 10+）
Push-Location $stage
try {
  tar -a -cf $outPath .
}
finally {
  Pop-Location
}

Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Packaged: $outPath"
