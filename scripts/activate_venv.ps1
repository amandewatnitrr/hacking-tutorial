# Create (if needed) and activate the project virtual environment.
#
# This script must be *dot-sourced* so that the activation affects your
# current PowerShell session (running it as a subprocess would activate and
# then immediately discard the environment):
#
#   . .\scripts\activate_venv.ps1
#
# Optional parameter: -VenvPath <path>  (default: .venv in the repo root).
#
# Deactivate later with:  deactivate
#
# If activation is blocked by policy, allow local scripts for this session:
#   Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned

param(
    [string]$VenvPath
)

# --- guard: must be dot-sourced, not executed -------------------------------
if ($MyInvocation.InvocationName -ne '.') {
    Write-Host "activate_venv.ps1: this script must be dot-sourced, not executed." -ForegroundColor Red
    Write-Host "  Run:  . .\scripts\activate_venv.ps1" -ForegroundColor Red
    return
}

# --- locate repo root and venv ----------------------------------------------
if (-not $PSScriptRoot) {
    Write-Host "activate_venv.ps1: unable to locate the script directory." -ForegroundColor Red
    return
}
$repoRoot = Split-Path -Parent $PSScriptRoot
if (-not $VenvPath) {
    $VenvPath = Join-Path $repoRoot '.venv'
}

if (-not (Test-Path $VenvPath)) {
    Write-Host "[activate_venv] creating virtual environment at $VenvPath"
    python -m venv $VenvPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "activate_venv.ps1: failed to create a virtual environment." -ForegroundColor Red
        Write-Host "  Is Python 3 ('py -3 -m venv') installed and on PATH?" -ForegroundColor Red
        return
    }
}

$activateScript = Join-Path $VenvPath 'Scripts\Activate.ps1'
if (-not (Test-Path $activateScript)) {
    Write-Host "activate_venv.ps1: $activateScript not found. Is $VenvPath a valid venv?" -ForegroundColor Red
    return
}

. $activateScript

Write-Host "[activate_venv] activated $VenvPath ($(python --version 2>&1))"
Write-Host "  Install dependencies:  pip install -r requirements.txt"
Write-Host "  Dev tools:             pip install -r requirements-dev.txt"
Write-Host "  Deactivate:            deactivate"
