# Setup and Development Environment

This document explains how to create a reproducible Python development environment for this repository, platform-specific notes, and common troubleshooting steps (permissions, binary dependencies, SSL issues, pip wheels vs source builds). It also includes activation snippets for POSIX shells and PowerShell.

> Note: This repository targets Python 3.8 through 3.11 (inclusive). If your system Python is newer (for example 3.12+), create a 3.11 environment with pyenv or conda to ensure compatibility with pre-built wheels and native extensions.

---

## 1. Prerequisites

- Recommended Python: >=3.8 and <=3.11 (choose any 3.8/3.9/3.10/3.11). Use system Python, pyenv, or conda as you prefer.
- pip, setuptools, wheel: keep them up-to-date.
- System packages required for building native extensions (names vary by platform): build-essential / make / gcc, libssl-dev, libpcap-dev, libffi-dev, pkg-config.
- Some scripts call external tools (not available via pip): `netdiscover`, `aircrack-ng` (`aireplay-ng`), `bettercap`, `tcpdump`/`tshark`. Install these with your OS package manager.

### macOS (Homebrew)

```bash
# Install Homebrew if needed: https://brew.sh
brew update
brew install libpcap openssl pkg-config libffi
# Developer tools
xcode-select --install
```

For `aircrack-ng` / `bettercap` / `netdiscover`:

```bash
brew install aircrack-ng bettercap netdiscover
```

You may need to point build tools at Homebrew's OpenSSL. Example environment variables (used by some pip builds):

```bash
export LDFLAGS="-L/opt/homebrew/opt/openssl/lib"
export CPPFLAGS="-I/opt/homebrew/opt/openssl/include"
export PKG_CONFIG_PATH="/opt/homebrew/opt/openssl/lib/pkgconfig"
```

### Debian/Ubuntu

```bash
sudo apt update
sudo apt install -y build-essential python3-dev python3-venv libpcap-dev libssl-dev libffi-dev pkg-config
# Install network tools
sudo apt install -y netdiscover aircrack-ng bettercap tcpdump wireshark
```

### Windows

- Recommended: Use WSL2 (Ubuntu on Windows) for full parity with Linux/macOS instructions.
- If you must use native Windows: install the Visual C++ Build Tools, and consider installing Npcap (replacement for WinPcap) for packet capture functionality.
- PowerShell snippets are provided below for venv activation.

---

## 2. Create a virtual environment (venv)

POSIX (macOS / Linux):

```bash
# from repo root
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

Windows PowerShell (PowerShell Core / Windows PowerShell):

```powershell
# from repo root
python -m venv .venv
# Unblock script execution if needed (administrator or CurrentUser scope):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

Windows CMD (legacy cmd.exe):

```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

Alternative: conda

```bash
conda create -n hacking-tutorial python=3.11
conda activate hacking-tutorial
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

---

## 3. Activation snippets (copy/paste)

POSIX (bash / zsh / sh):

```bash
# activate
source .venv/bin/activate
# deactivate
deactivate
```

fish shell:

```fish
source .venv/bin/activate.fish
```

PowerShell (recommended on Windows):

```powershell
.\.venv\Scripts\Activate.ps1
# if policy blocks, run as admin or:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# deactivate
Deactivate
```

Windows CMD:

```cmd
.\.venv\Scripts\activate.bat
```

---

## 4. Common permission errors and fixes

- "Permission denied" when capturing packets: packet-capture requires root/capabilities.
  - Recommended: run only the external tool (e.g. `airodump-ng`, `netdiscover`) with `sudo` rather than running Python as root.
  - To run certain Python scripts that need raw sockets without sudo, grant capabilities to the Python interpreter (Linux only):

```bash
# Example: allow Python binary to open raw sockets (use with caution)
sudo setcap cap_net_raw,cap_net_admin+eip "$(which python3)"
```

  - Revert with:

```bash
sudo setcap -r "$(which python3)"
```

- "Operation not permitted" on macOS for packet capture: macOS enforces System Integrity and permissions; either run tool with `sudo` or use tools that prompt for permissions (Wireshark/tshark).

- `zsh` / `bash` plugin or venv activation fails: ensure the script is executable and `Set-ExecutionPolicy` for PowerShell is configured on Windows.

---

## 5. Binary dependency / build failures (wheels vs source)

- pip prefers binary wheels. If a wheel is available, pip will download and install it quickly. If a wheel is not available for your platform/Python version, pip builds from source which requires C toolchain and dev headers.

- Common failure pattern:
  - `error: command 'gcc' failed with exit status 1`
  - `cannot find -lssl` / `openssl/ssl.h: No such file or directory`

- Fixes:
  1. Install system dev packages: `libssl-dev`, `libffi-dev`, `libpcap-dev`, `python3-dev`, `build-essential`.
  2. For macOS (Homebrew), set `LDFLAGS`, `CPPFLAGS`, and `PKG_CONFIG_PATH` to point to Homebrew's openssl before pip install.
  3. Prefer installing wheels: `pip install --only-binary=:all: <package>` (will fail if wheel unavailable).
  4. To force source build: `pip install --no-binary :all: <package>`.

- Example: if `scapy` build fails, ensure `libpcap` is installed and that Python dev headers are available.

---

## 6. SSL / certificate issues when pip installing

- If pip fails TLS/SSL handshake, check your OpenSSL version and system certificate store.
- macOS: ensure OpenSSL from Homebrew is used if your Python was built against it; set environment vars described above.
- Windows: ensure Python's `certifi` / Windows certificate store is intact.
- As a temporary workaround (not recommended) you can set `--trusted-host` for pip, e.g.: `pip install --trusted-host pypi.org <pkg>`; prefer fixing certificates instead.

---

## 7. Installing system tools used by scripts

Some functionality in `python-scripts/` calls external binaries. These are NOT installed via pip. Examples and installation hints:

- netdiscover: `brew install netdiscover` or `sudo apt install netdiscover`
- aircrack-ng (contains `aireplay-ng`): `brew install aircrack-ng` or `sudo apt install aircrack-ng`
- bettercap: `brew install bettercap` or `sudo apt install bettercap` (or download binary)

Always read each tool's documentation for device/driver requirements (e.g. monitor mode for Wi-Fi adapters).

---

## 8. Troubleshooting checklist

1. Confirm Python version: `python --version` inside the venv.
2. Upgrade pip/wheel/setuptools then retry install.
3. If a package fails to build, capture the build log and search for missing header errors (e.g. `openssl/ssl.h`) — install the corresponding `-dev` package.
4. For permission/pcap issues, prefer granting capabilities to the specific binary or run the raw tool as root.
5. If pip is hanging on TLS, try `python -m pip install --upgrade pip` and ensure OpenSSL is up-to-date.
6. Use `pip cache remove` if corrupted cache suspected.

---

## 9. Quick install summary (POSIX)

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## 10. Further notes

- If you use `pre-commit`, run `pre-commit install` after activating your venv.
- For reproducible environments, consider using `pip-tools` or `poetry` in a follow-up change.

---

If you'd like, I can also:
- Add a small Makefile target to create and activate the venv and install deps.
- Add a `scripts/` folder with helper activation wrappers for different shells.

