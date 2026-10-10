# Usage, from the repo root:  . .\scripts\load-env.ps1     (note the leading dot and space)
$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".env"
if (-not (Test-Path $envFile)) { Write-Error ".env not found at $envFile"; return }
Get-Content $envFile | Where-Object { $_ -match '^\s*[A-Za-z_][A-Za-z0-9_]*\s*=' } | ForEach-Object {
  $k, $v = $_ -split '=', 2
  Set-Item -Path "Env:$($k.Trim())" -Value $v.Trim()
}
Write-Host "Loaded .env  (DB_URL=$env:DB_URL)"