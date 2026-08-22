#!/usr/bin/env python3
"""
mask_ip_addresses.py

Scans the repository for IPv4 / IPv6 / MAC addresses accidentally left in
tracked files (screenshots-as-text, tool output pasted into a lesson, logs,
notes, etc.) and masks them before you push.

Usage
-----
    # Dry run: report leaks, exit code 1 if any are found (CI / pre-push safe)
    python mask_ip_addresses.py --check

    # Mask in place across all tracked files
    python mask_ip_addresses.py

    # Also mask private/reserved/example ranges and placeholder MACs
    # (RFC1918, loopback, link-local, documentation ranges, ff:ff:ff:ff:ff:ff,
    # 00:11:22:33:44:55, ...) that are skipped by default because this repo
    # intentionally uses them in tutorials (e.g. 192.168.1.1, 10.0.0.0/8)
    python mask_ip_addresses.py --all

    # Only scan currently staged files (handy as a pre-push/pre-commit hook)
    python mask_ip_addresses.py --staged-only

    # Scan a specific file or directory instead of the whole repo
    python mask_ip_addresses.py --path UI/frontend

IPv4 addresses are replaced with "XX.XX.XX.XX".
IPv6 addresses are replaced with "XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX".
MAC addresses are replaced with "XX:XX:XX:XX:XX:XX".

By default, private/reserved/documentation IP ranges and well-known
placeholder/broadcast MACs are left untouched since this is a
hacking/networking tutorial repo and lessons legitimately reference
addresses like 192.168.x.x, 10.x.x.x, 127.0.0.1, fe80::/10,
00:11:22:33:44:55, ff:ff:ff:ff:ff:ff, etc. Pass --all to mask everything,
including those.
"""

import argparse
import ipaddress
import re
import subprocess
import sys
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent

EXCLUDE_DIRS = {
    ".git", ".venv", "venv", "node_modules", ".idea", ".vscode",
    "dist", "build", "__pycache__", ".code-review-graph",
}

IPV4_MASK = "XX.XX.XX.XX"
IPV6_MASK = "XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX"
MAC_MASK = "XX:XX:XX:XX:XX:XX"

# Broad candidates, validated strictly afterwards with the `ipaddress` module
# (and, for MACs, a curated skip-list) so we never mangle things that merely
# *look* like an address (version strings, hashes, etc.) if they fail
# validation.
IPV4_CANDIDATE_RE = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
IPV6_CANDIDATE_RE = re.compile(
    r"(?<![0-9A-Fa-f:.])(?:[0-9A-Fa-f]{0,4}:){2,7}[0-9A-Fa-f]{0,4}(?![0-9A-Fa-f:.])"
)
# Colon- or hyphen-separated MAC (EUI-48), e.g. B4:3D:08:2D:91:41 or
# 00-11-22-33-44-55. Not anchored to a separator so both styles match.
MAC_CANDIDATE_RE = re.compile(
    r"\b(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}\b|\b(?:[0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}\b"
)

# Placeholder/broadcast MACs used deliberately in networking tutorials
# (e.g. spoofing lessons) — not real hardware, safe to leave alone by default.
EXAMPLE_MACS = {
    "00:11:22:33:44:55",
    "ff:ff:ff:ff:ff:ff",
    "00:00:00:00:00:00",
    "de:ad:be:ef:00:00",
}


def is_private_or_reserved(ip_obj) -> bool:
    """True for ranges that are expected to show up in tutorial content."""
    return (
        ip_obj.is_private
        or ip_obj.is_loopback
        or ip_obj.is_link_local
        or ip_obj.is_reserved
        or ip_obj.is_multicast
        or ip_obj.is_unspecified
    )


def is_example_mac(candidate: str) -> bool:
    normalized = candidate.replace("-", ":").lower()
    return normalized in EXAMPLE_MACS


def find_and_mask(text: str, mask_all: bool):
    """Return (new_text, findings) where findings is a list of matched IPs."""
    findings = []

    def repl_v4(m):
        candidate = m.group(0)
        try:
            ip_obj = ipaddress.IPv4Address(candidate)
        except ValueError:
            return candidate
        if not mask_all and is_private_or_reserved(ip_obj):
            return candidate
        findings.append(candidate)
        return IPV4_MASK

    def repl_v6(m):
        candidate = m.group(0)
        if candidate.count(":") < 2:
            return candidate
        try:
            ip_obj = ipaddress.IPv6Address(candidate)
        except ValueError:
            return candidate
        if not mask_all and is_private_or_reserved(ip_obj):
            return candidate
        findings.append(candidate)
        return IPV6_MASK

    def repl_mac(m):
        candidate = m.group(0)
        if not mask_all and is_example_mac(candidate):
            return candidate
        findings.append(candidate)
        return MAC_MASK

    text = IPV6_CANDIDATE_RE.sub(repl_v6, text)
    text = IPV4_CANDIDATE_RE.sub(repl_v4, text)
    text = MAC_CANDIDATE_RE.sub(repl_mac, text)
    return text, findings


def is_probably_text(path: Path) -> bool:
    try:
        with path.open("rb") as f:
            chunk = f.read(8192)
        if b"\x00" in chunk:
            return False
        chunk.decode("utf-8")
        return True
    except (UnicodeDecodeError, OSError):
        return False


def git_tracked_files(root: Path):
    out = subprocess.run(
        ["git", "-C", str(root), "ls-files"],
        capture_output=True, text=True, check=True,
    ).stdout
    return [root / p for p in out.splitlines() if p]


def git_staged_files(root: Path):
    out = subprocess.run(
        ["git", "-C", str(root), "diff", "--cached", "--name-only", "--diff-filter=ACM"],
        capture_output=True, text=True, check=True,
    ).stdout
    return [root / p for p in out.splitlines() if p]


def gather_files(root: Path, staged_only: bool, scan_path: Optional[str]):
    if scan_path:
        target = (root / scan_path).resolve()
        if target.is_file():
            return [target]
        files = git_tracked_files(root)
        return [f for f in files if target in f.parents or f == target]

    files = git_staged_files(root) if staged_only else git_tracked_files(root)
    return [
        f for f in files
        if f.exists() and not any(part in EXCLUDE_DIRS for part in f.parts)
        and f.name != Path(__file__).name
    ]


def main():
    parser = argparse.ArgumentParser(description="Mask IPv4/IPv6/MAC addresses leaked in repo files.")
    parser.add_argument("--check", action="store_true",
                         help="Dry run: report leaks only, don't modify files. Exits 1 if any are found.")
    parser.add_argument("--all", action="store_true",
                         help="Also mask private/reserved/documentation IP ranges and placeholder MACs (skipped by default).")
    parser.add_argument("--staged-only", action="store_true",
                         help="Only scan files staged for commit (git diff --cached).")
    parser.add_argument("--path", default=None,
                         help="Limit the scan to a specific file or directory.")
    args = parser.parse_args()

    try:
        files = gather_files(REPO_ROOT, args.staged_only, args.path)
    except subprocess.CalledProcessError as e:
        print(f"git error: {e}", file=sys.stderr)
        sys.exit(2)

    total_findings = 0
    touched_files = []

    for path in files:
        if not path.is_file() or not is_probably_text(path):
            continue

        original = path.read_text(encoding="utf-8")
        new_text, findings = find_and_mask(original, args.all)

        if not findings:
            continue

        total_findings += len(findings)
        touched_files.append(path)
        rel = path.relative_to(REPO_ROOT)

        if args.check:
            for ip in findings:
                print(f"{rel}: {ip}")
        else:
            path.write_text(new_text, encoding="utf-8")
            print(f"masked {len(findings)} address(es) in {rel}")

    if total_findings == 0:
        print("No leaked IP/MAC addresses found." if not args.all else
              "No IP/MAC addresses found.")
        sys.exit(0)

    if args.check:
        print(f"\n{total_findings} leaked IP/MAC address(es) found across {len(touched_files)} file(s).")
        print("Run `python mask_ip_addresses.py` to mask them, then review the diff.")
        sys.exit(1)

    print(f"\nMasked {total_findings} address(es) across {len(touched_files)} file(s).")
    print("Review the diff (`git diff`) before committing/pushing.")
    sys.exit(0)


if __name__ == "__main__":
    main()
