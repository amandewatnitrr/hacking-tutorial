#!/usr/bin/env bash
# Create (if needed) and activate the project virtual environment.
#
# This script must be *sourced* so that the activation affects your current
# shell (running it as a subprocess would activate and then immediately
# discard the environment):
#
#   source scripts/activate_venv.sh        # bash / zsh
#   . scripts/activate_venv.sh             # POSIX sh — run from the repo root
#
# Optional argument: path to the virtual environment (default: .venv in the
# repository root).
#
# Deactivate later with:  deactivate

# --- guard: must be sourced, not executed -----------------------------------
_sourced=1
if [ -n "${BASH_VERSION-}" ]; then
    # bash: BASH_SOURCE[0] equals $0 only when the file is executed
    if [ "${BASH_SOURCE[0]}" = "$0" ]; then
        _sourced=0
    fi
elif [ -n "${ZSH_VERSION-}" ]; then
    # zsh sets $0 to this file's name even when it is sourced
    # (FUNCTION_ARGZERO), so use ZSH_EVAL_CONTEXT: it contains the token
    # "file" only while a sourced file is running.
    case ":${ZSH_EVAL_CONTEXT-}:" in
        *:file:*) ;;       # sourced
        *) _sourced=0 ;;   # executed
    esac
fi
if [ "$_sourced" -eq 0 ]; then
    echo "activate_venv.sh: this script must be sourced, not executed." >&2
    echo "  Run:  source scripts/activate_venv.sh" >&2
    return 1 2>/dev/null || exit 1
fi

# --- locate repo root and venv ----------------------------------------------
_script_path="${BASH_SOURCE[0]:-$0}"
case "$_script_path" in
    activate_venv.sh|*/activate_venv.sh)
        _repo_root="$(cd "$(dirname "$_script_path")/.." && pwd)" ;;
    *)
        # Shell doesn't expose the sourced file's path (e.g. dash);
        # assume the current directory is the repo root.
        _repo_root="$(pwd)" ;;
esac
_venv_dir="${1:-$_repo_root/.venv}"

if [ ! -d "$_venv_dir" ]; then
    echo "[activate_venv] creating virtual environment at $_venv_dir"
    if ! python3 -m venv "$_venv_dir"; then
        echo "activate_venv.sh: failed to create a virtual environment." >&2
        echo "  Is Python 3 ('python3 -m venv') installed and on PATH?" >&2
        unset _sourced _script_path _repo_root _venv_dir
        return 1 2>/dev/null || exit 1
    fi
fi

# shellcheck disable=SC1091
. "$_venv_dir/bin/activate"

echo "[activate_venv] activated $_venv_dir ($(python --version 2>&1), $(command -v python))"
echo "  Install dependencies:  pip install -r requirements.txt"
echo "  Dev tools:             pip install -r requirements-dev.txt"
echo "  Deactivate:            deactivate"

unset _sourced _script_path _repo_root _venv_dir
