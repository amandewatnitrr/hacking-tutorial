#!/bin/bash

# Bootstrap script for Linux/macOS
# Sets up the entire development environment with one command

echo "🚀 Starting bootstrap process..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
if [[ $(echo "$PYTHON_VERSION < 3.8" | bc -l) -eq 1 ]]; then
    echo "❌ Python version is too old. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python version: $PYTHON_VERSION"

# Create virtual environment
echo "🔧 Creating virtual environment..."
python3 -m venv .venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
echo "🔧 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "🔧 Installing dependencies..."
pip install -r requirements-dev.txt

# Install pre-commit hooks
echo "🔧 Installing pre-commit hooks..."
pre-commit install

echo "✅ Bootstrap completed successfully!"
echo ""
echo "To activate the environment in the future, run:"
echo "  source .venv/bin/activate"
echo ""
echo "To start development, run:"
echo "  pre-commit run --all-files"
echo "  pytest"