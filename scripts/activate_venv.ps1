# Activation script for Windows PowerShell

# Check if virtual environment exists
if (!(Test-Path ".venv")) {
    Write-Host "Virtual environment not found. Creating one..."
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..."
.\.venv\Scripts\Activate.ps1

Write-Host "Virtual environment activated!"
Write-Host "Python path: $(Get-Command python | Select-Object -ExpandProperty Source)"
Write-Host "Python version: $(python --version)"
Write-Host "Ready for development work."