#!/bin/bash

# Activation script for Linux/macOS

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

echo "Virtual environment activated!"
echo "Python path: $(which python)"
echo "Python version: $(python --version)"
echo "Ready for development work."

# Keep the shell open
exec "$SHELL"