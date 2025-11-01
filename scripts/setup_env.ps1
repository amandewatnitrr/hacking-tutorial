<#
PowerShell helper to create a venv and install dependencies.
Usage:
  powershell -ExecutionPolicy RemoteSigned -File .\scripts\setup_env.ps1 -InstallDev
#>
param(
    [switch]$InstallDev
)

$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $Root

$python = "python"

Write-Host "Using Python: $($python)"
& $python -m venv .venv

# Activate in current session
. .\.venv\Scripts\Activate.ps1

& $python -m pip install --upgrade pip setuptools wheel
& pip install -r requirements.txt

if ($InstallDev -and (Test-Path requirements-dev.txt)) {
    & pip install -r requirements-dev.txt
}

Write-Host "Setup complete. To activate in a new session: .\\.venv\\Scripts\\Activate.ps1"
