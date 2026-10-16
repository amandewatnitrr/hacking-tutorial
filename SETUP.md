# Setup Guide

How to get this repository's Python tooling running on Windows, macOS, or Linux.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Install](#quick-install)
- [Virtual Environments](#virtual-environments)
- [OS-Specific Notes](#os-specific-notes)
- [Scapy, Npcap, and Packet-Capture Permissions](#scapy-npcap-and-packet-capture-permissions)
- [Dependency Files](#dependency-files)
- [Testing](#testing)
- [Linting, Formatting, and Auditing](#linting-formatting-and-auditing)
- [Troubleshooting](#troubleshooting)
- [Dependency Contribution Policy](#dependency-contribution-policy)

## Prerequisites

- **Python 3.8 or newer** — Python 3.10+ is recommended. Check with `python3 --version` (or `py -3 --version` on Windows).
- **pip** — usually bundled with Python; upgrade with `python3 -m pip install --upgrade pip`.
- **git**
- Optional, only for specific scripts:
  - **libpcap** (Linux/macOS) or **Npcap** (Windows) — required by Scapy when sniffing packets. See [Scapy permissions](#scapy-npcap-and-packet-capture-permissions).
  - **Bettercap** — only for the Bettercap-based scripts in `python-scripts/`.
  - **Docker** — only for the containerized variant of `sql-injection-lab/`.

## Quick Install

```bash
git clone https://github.com/amandewatnitrr/hacking-tutorial.git
cd hacking-tutorial

python3 -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1

pip install -r requirements.txt     # runtime deps for the Python scripts
pip install -r requirements-dev.txt # + test/lint/audit tooling (optional)
```

For the SQL injection lab specifically:

```bash
pip install -r sql-injection-lab/requirements.txt
cd sql-injection-lab && python -m app.run   # then open http://127.0.0.1:8000
```

## Virtual Environments

Always work inside a virtual environment so the tutorial's dependencies don't
pollute your system Python.

Manual steps:

```bash
python3 -m venv .venv                       # create
source .venv/bin/activate                   # activate (bash/zsh, macOS/Linux)
.venv\Scripts\Activate.ps1                  # activate (Windows PowerShell)
deactivate                                  # deactivate (any OS, while activated)
```

Helper scripts (do the create-if-missing + activate dance for you):

```bash
# bash / zsh — must be *sourced*, otherwise the activation is lost
source scripts/activate_venv.sh
```

```powershell
# Windows PowerShell — must be *dot-sourced*
. .\scripts\activate_venv.ps1
```

Both accept an optional path argument if you want the venv somewhere other
than `.venv` in the repo root. The scripts refuse to run when executed as a
subprocess (which cannot affect your shell) and tell you the right command.

## OS-Specific Notes

| Topic | macOS / Linux | Windows |
|---|---|---|
| Interpreter command | `python3` | `python` or `py -3` |
| Create venv | `python3 -m venv .venv` | `py -3 -m venv .venv` |
| Activate (bash/zsh) | `source .venv/bin/activate` | n/a (use PowerShell or Git Bash) |
| Activate (PowerShell) | `.venv/bin/Activate.ps1` | `.venv\Scripts\Activate.ps1` |
| Deactivate | `deactivate` | `deactivate` |
| Packet capture | libpcap + root/`CAP_NET_RAW` | [Npcap](https://npcap.com/) (WinPcap-compatible) |
| Shell for helper script | `source scripts/activate_venv.sh` | `. .\scripts\activate_venv.ps1` |

Notes:

- On recent Debian/Ubuntu, the system Python is [PEP 668](https://peps.python.org/pep-0668/)-protected; creating a venv first avoids `error: externally-managed-environment`.
- Fish shell users: activate with `source .venv/bin/activate.fish` (the helper script targets bash/zsh).
- The PowerShell helper may require `Set-ExecutionPolicy -Scope Process RemoteSigned` if script execution is restricted on your machine.

## Scapy, Npcap, and Packet-Capture Permissions

Scapy itself installs fine without special permissions (a plain `pip install`),
but several scripts in `python-scripts/` **sniff or send packets**, which the
OS restricts:

- **Windows** — install [Npcap](https://npcap.com/) in WinPcap-compatible mode. Without it, `scapy.all` fails with "no libpcap provider" style errors. During install, enable "Install Npcap in WinPcap API-compatible Mode".
- **Linux** — install libpcap (`sudo apt install libpcap0.8` or your distro's equivalent). Run capture/ARP scripts with `sudo`, or grant the interpreter capabilities, e.g. `sudo setcap cap_net_raw,cap_net_admin=eip $(readlink -f $(which python3))` (only inside labs you control).
- **macOS** — libpcap ships with the system; access to BPF devices (`/dev/bpf*`) requires root. Use `sudo` for capture scripts and expect Gatekeeper/quarantine prompts on downloaded binaries.

**Rules of engagement** (see also `README.md` → Safety & Ethics):

- Only run privileged scripts in isolated labs/VMs/networks you own.
- Never point ARP-spoofing, deauth, or scanning tools at third-party systems.
- CI deliberately runs only **import/compile smoke checks and unit tests** — it never executes the privileged packet-capture scripts.

## Dependency Files

| File | Contents |
|---|---|
| `requirements.txt` | Runtime dependencies of the Python scripts (import name → PyPI name mapping is documented inline) |
| `requirements-dev.txt` | Everything in `requirements.txt` plus pytest, black, isort, pre-commit, pip-audit, mypy |
| `sql-injection-lab/requirements.txt` | `-r ../requirements.txt` plus Flask and pytest for the lab |
| `.pre-commit-config.yaml` | Hook definitions used by `pre-commit` |

## Testing

The SQL injection lab ships smoke tests (Flask test client, no network access):

```bash
pip install -r sql-injection-lab/requirements.txt
cd sql-injection-lab
python -m pytest -v
```

CI (`.github/workflows/ci.yml`) runs these tests on Python 3.9–3.14, plus
dependency install, import smoke checks, byte-compilation of the lab and
helper scripts, and the `mask_ip_addresses.py --check` gate from
`CONTRIBUTING.md`.

## Linting, Formatting, and Auditing

```bash
pip install -r requirements-dev.txt

# One-time hook install per clone (run on staged files at commit time)
pre-commit install
pre-commit run --all-files     # optional full run

# Or run the tools directly
black .
isort --profile black .

# Audit installed dependencies for known vulnerabilities
pip-audit

# Type checking (opt-in; only the lab app is typed enough to be useful)
mypy sql-injection-lab/app
```

`mypy` is intentionally **not** enforced in CI: the standalone tutorial scripts
are untyped teaching material, and the lab app has no established typing
baseline. `black`/`isort` are likewise enforced only through pre-commit on the
files you touch — the existing codebase is not wholesale reformatted.

## Troubleshooting

**`error: externally-managed-environment` (PEP 668)**
You pip-installed into a distro Python. Create and activate a venv first
(`python3 -m venv .venv && source .venv/bin/activate`).

**`source: can't read scripts/activate_venv.sh: No such file or directory`**
You are not at the repo root, or you *executed* the script (`./scripts/...`).
It must be sourced: `source scripts/activate_venv.sh`.

**PowerShell: `activate_venv.ps1 cannot be loaded because running scripts is disabled`**
Run `Set-ExecutionPolicy -Scope Process RemoteSigned`, then dot-source again:
`. .\scripts\activate_venv.ps1`.

**Scapy: `OSError: No libpcap provider detected`**
Install Npcap (Windows) or libpcap (Linux/macOS) — see
[Scapy permissions](#scapy-npcap-and-packet-capture-permissions). Importing
Scapy works without it; only live capture/sniffing needs libpcap.

**`PermissionError` opening `/dev/bpf*` (macOS/Linux)**
Packet capture needs elevated privileges. Use `sudo` (lab machines only) or
grant capabilities as described above.

**`geoip2` warnings: "geoip2 not installed – IP geolocation will be limited"**
`geoip2` (and `cryptography`) are optional at runtime in
`https_data_fetcher_bettercap.py`; the script degrades gracefully. Installing
root `requirements.txt` provides both.

**`bettercap: command not found`**
Only the Bettercap-based scripts need it (`sudo apt install bettercap` on
Debian/Kali). The rest of the repo does not.

**`SyntaxError: invalid syntax` / `<<<<<<< HEAD` in `python-scripts/ids_probe.py`**
Known pre-existing issue: that file (and its copy under
`UI/frontend/src/content/python-scripts/`) contains committed, unresolved
merge-conflict markers from a past merge. It is excluded from the pre-commit
black/isort/merge-conflict hooks (see `.pre-commit-config.yaml`). If you want
to help, resolving that conflict into one coherent script makes a good PR.

**Pip resolves different versions than a teammate's**
Expected: bounds in `requirements.txt` are ranges, and pip picks the newest
release compatible with *your* Python version (e.g. Python 3.8/3.9 get older
`requests`/`cryptography` releases than Python 3.12). This is intentional to
keep 3.8 working.

## Dependency Contribution Policy

Before adding a dependency to any requirements file:

1. **Confirm it's third-party and actually imported.** Standard-library modules
   and files inside this repo never go in `requirements.txt`.
2. **Map the import name to the PyPI name.** They often differ
   (`bs4` → `beautifulsoup4`, `PIL` → `pillow`, `cv2` → `opencv-python`).
   Verify the package on https://pypi.org — do not guess.
3. **Put it in the right file**: script runtime deps → `requirements.txt`;
   lab-only deps → `sql-injection-lab/requirements.txt`; test/lint/audit
   tooling → `requirements-dev.txt`.
4. **Add compatible version bounds** (e.g. `>=X,<Y`), not a copy-pasted pin
   from a blog post. Check the newest release whose `Requires-Python` allows
   Python 3.8; use environment markers (like the `cryptography` entry) when a
   newer major version has dropped 3.8.
5. **Don't add unused, implied, or transitive dependencies.** If `requests`
   already pulls in `urllib3` for you, only list `urllib3` if the code
   imports it directly (and say why in a comment).
6. **Verify in a fresh venv**: `python3 -m venv /tmp/check && source
   /tmp/check/bin/activate && pip install -r requirements.txt && cd
   sql-injection-lab && python -m pytest && deactivate`.
7. Justify the dependency in your PR description (what uses it, why stdlib
   isn't enough).
