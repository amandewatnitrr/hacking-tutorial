#!/usr/bin/env bash
set -euo pipefail

# Helper: create a virtualenv in .venv and install requirements
# Usage: ./scripts/setup_env.sh [--dev]

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

PYTHON=${PYTHON:-python3}

echo "Using Python: $(command -v "$PYTHON" 2>/dev/null || echo 'not found')"

$PYTHON -m venv .venv
# shellcheck disable=SC1091
. .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

if [ "${1:-}" = "--dev" ] || [ -f requirements-dev.txt ]; then
    if [ -f requirements-dev.txt ]; then
        pip install -r requirements-dev.txt
    fi
fi

echo "Setup complete. Activate with: source .venv/bin/activate"
