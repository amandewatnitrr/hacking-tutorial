# Bootstrap script for Windows PowerShell
# Sets up the entire development environment with one command

Write-Host "🚀 Starting bootstrap process..."

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Python not found"
    }
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
}

# Parse Python version
$versionMatch = [regex]::Match($pythonVersion, 'Python (\d+\.\d+)')
if ($versionMatch.Success) {
    $version = [double]$versionMatch.Groups[1].Value
    if ($version -lt 3.8) {
        Write-Host "❌ Python version is too old. Please install Python 3.8 or higher."
        exit 1
    }
    Write-Host "✅ Python version: $version"
} else {
    Write-Host "❌ Could not determine Python version."
    exit 1
}

# Create virtual environment
Write-Host "🔧 Creating virtual environment..."
python -m venv .venv

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..."
.\.venv\Scripts\Activate.ps1

# Upgrade pip
Write-Host "🔧 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
Write-Host "🔧 Installing dependencies..."
pip install -r requirements-dev.txt

# Install pre-commit hooks
Write-Host "🔧 Installing pre-commit hooks..."
pre-commit install

Write-Host "✅ Bootstrap completed successfully!"
Write-Host ""
Write-Host "To activate the environment in the future, run:"
Write-Host "  .\.venv\Scripts\Activate.ps1"
Write-Host ""
Write-Host "To start development, run:"
Write-Host "  pre-commit run --all-files"
Write-Host "  pytest"