# ai_backend_health.ps1
# Starts the AI backend on port 5000 and runs health checks (Windows PowerShell).

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$BackendDir  = Join-Path $ProjectRoot "ai-auto-backend"

Write-Host "→ Using backend dir: $BackendDir"
Set-Location $BackendDir

# 1) Install deps if needed
if (-not (Test-Path "node_modules")) {
  Write-Host "→ Installing npm dependencies…"
  npm install
}

# 2) Kill anything on port 5000
try {
  $conns = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
  if ($conns) {
    foreach ($c in $conns) {
      $pid = $c.OwningProcess
      Write-Host "→ Killing PID $pid on :5000"
      Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
  }
} catch {}

# 3) Start backend
Write-Host "→ Starting backend…"
$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.FileName = "node"
$startInfo.Arguments = "index.js"
$startInfo.WorkingDirectory = $BackendDir
$startInfo.RedirectStandardOutput = $true
$startInfo.RedirectStandardError  = $true
$startInfo.UseShellExecute = $false
$startInfo.CreateNoWindow = $true
$p = [System.Diagnostics.Process]::Start($startInfo)
Start-Sleep -Seconds 1
Write-Host ("→ Backend PID: {0}" -f $p.Id)

# 4) Wait for /health
Write-Host -NoNewline "→ Waiting for /health"
$ok = $false
for ($i=0; $i -lt 30; $i++) {
  try {
    $r = Invoke-WebRequest "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch {}
  Write-Host -NoNewline "."
  Start-Sleep -Seconds 1
}
if ($ok) { Write-Host " ✓" } else { Write-Host " (timeout)" }

# 5) Print health and OpenAI check
Write-Host "→ /health:"
try { Invoke-WebRequest "http://localhost:5000/health" -UseBasicParsing | Select-Object -ExpandProperty Content | Write-Output } catch { Write-Host $_.Exception.Message -ForegroundColor Red }

Write-Host "→ /debug/openai:"
try { Invoke-WebRequest "http://localhost:5000/debug/openai" -UseBasicParsing | Select-Object -ExpandProperty Content | Write-Output } catch { Write-Host $_.Exception.Message -ForegroundColor Red }

Write-Host "→ Logs: $BackendDir\logs\openai-last.json (OpenAI raw), $BackendDir\logs\server.out (server)"
