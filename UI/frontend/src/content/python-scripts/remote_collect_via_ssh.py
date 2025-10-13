"""
remote_collect_via_ssh.py

Authoritative listening-sockets collector that runs commands on a target host
over SSH and returns structured JSON describing the listening TCP sockets and
associated process information.

Purpose (educational):
- Demonstrates an *inside-the-host* approach to obtain accurate listening
  service information (PID/program, local IP:port). This complements network
  scanning, which infers services from observed network behavior.
- Uses the system `ssh` command to avoid adding extra Python dependencies.

IMPORTANT SAFETY NOTES:
- This tool executes commands on the remote host via SSH. Only run it against
  machines you own or for which you have explicit written authorization.
- The remote command runs `ss -tlnp` or `netstat -tulpen` (fallback). If your
  environment blocks these commands or requires a different tool, update the
  script accordingly.
"""

from __future__ import annotations

import argparse            # CLI parsing
import subprocess          # run system `ssh` command
import shlex               # shell-quoting if needed
import json                # produce JSON output
import re                  # parse outputs heuristically
import sys                 # exit codes
from typing import List, Dict, Optional

# Commands we will attempt on the remote host (ss preferred, netstat fallback)
SS_CMD = "ss -tlnp"             # modern Linux: list TCP listening sockets with process info
NETSTAT_CMD = "netstat -tulpen" # fallback: older systems may provide netstat

# Basic regex to extract useful fields from `ss`/`netstat` output. Note: output formats
# vary across distros; this parser is intentionally *simple* for demonstration, not exhaustive.
# We'll capture local address (ip:port), the 'LISTEN' marker, PID and program when present.
ADDR_PORT_RE = re.compile(r"([0-9a-fA-F\.\:\*]+):(\d+)$")  # match ip:port at end of token
PID_PROC_RE = re.compile(r"pid=(\d+),\s*fd=\d+.*?name=\"?([^\"]+)\"?", re.I)  # for ss with pid=...,name="proc"
PID_PROC_ALT_RE = re.compile(r"(\d+)/([^\s]+)")            # for netstat "pid/program"

def run_ssh_command(target: str, cmd: str, timeout: int = 20) -> Dict[str, str]:
    """
    Run `ssh target cmd` and return a dict with 'stdout' and 'stderr'.
    We do a simple, non-interactive call and set a timeout to prevent hangs.
    """
    # Build the SSH command as a list to avoid shell injection issues with Python API.
    # We deliberately don't expand user input into shell; we assume `target` is a safe target string
    # in the form user@host or host. In production, validate/normalize it.
    proc = subprocess.run(
        ["ssh", target, cmd],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=timeout,
        check=False,
    )
    return {"stdout": proc.stdout, "stderr": proc.stderr, "returncode": proc.returncode}


def parse_ss_output(stdout: str) -> List[Dict]:
    """
    Attempt to parse `ss -tlnp` output into a list of dicts with:
      - proto, local_ip, port, pid, process, raw_line
    This is a heuristic parser for tutorial purposes; adjust regexes for your distro's format.
    """
    results: List[Dict] = []
    for line in stdout.splitlines():
        # Skip header lines or short lines
        if not line or line.strip().startswith("State"):
            continue

        if "LISTEN" not in line and "LISTEN" not in line.upper():
            # many ss outputs include "LISTEN" in the State column; ignore non-listening lines
            continue

        # split tokens and look for ip:port token (usually 4th or 5th token)
        parts = line.split()
        local_addr_token = None
        for tok in parts:
            if ":" in tok and tok.count(":") < 8:  # naive check to exclude IPv6 full addresses sometimes
                # try match addr:port at end
                m = ADDR_PORT_RE.search(tok)
                if m:
                    local_addr_token = tok
                    break

        port = None
        local_ip = None
        if local_addr_token:
            m = ADDR_PORT_RE.search(local_addr_token)
            if m:
                local_ip = m.group(1)
                try:
                    port = int(m.group(2))
                except Exception:
                    port = None

        pid = None
        process_name = None

        # Try ss-specific "pid=...,fd=" pattern
        m = PID_PROC_RE.search(line)
        if m:
            pid = int(m.group(1))
            process_name = m.group(2)

        # fallback: try to detect pid/program like "1234/nginx"
        if pid is None:
            m2 = PID_PROC_ALT_RE.search(line)
            if m2:
                try:
                    pid = int(m2.group(1))
                except Exception:
                    pid = None
                process_name = m2.group(2)

        results.append({
            "raw_line": line,
            "local_ip": local_ip,
            "port": port,
            "pid": pid,
            "process": process_name,
        })
    return results


def parse_netstat_output(stdout: str) -> List[Dict]:
    """
    Parse `netstat -tulpen` output to extract listening sockets.
    This is also heuristic and suited to many Linux netstat outputs.
    """
    results: List[Dict] = []
    for line in stdout.splitlines():
        if not line:
            continue
        if "LISTEN" not in line and "LISTEN" not in line.upper():
            continue
        parts = line.split()
        # netstat often has local_address as 4th token - try to locate the ip:port
        local_addr_token = None
        for tok in parts:
            if ":" in tok and tok.count(":") < 8:
                m = ADDR_PORT_RE.search(tok)
                if m:
                    local_addr_token = tok
                    break
        port = None
        local_ip = None
        if local_addr_token:
            m = ADDR_PORT_RE.search(local_addr_token)
            if m:
                local_ip = m.group(1)
                try:
                    port = int(m.group(2))
                except Exception:
                    port = None

        pid = None
        process_name = None
        # netstat may show "pid/program" in one of the tail tokens
        for tok in parts[::-1]:
            if "/" in tok:
                m2 = PID_PROC_ALT_RE.search(tok)
                if m2:
                    try:
                        pid = int(m2.group(1))
                    except Exception:
                        pid = None
                    process_name = m2.group(2)
                    break

        results.append({
            "raw_line": line,
            "local_ip": local_ip,
            "port": port,
            "pid": pid,
            "process": process_name,
        })
    return results


def collect_listening_via_ssh(target: str) -> Dict:
    """
    Orchestrates running `ss` (or `netstat` fallback) on the remote target via SSH, parses results,
    and returns a JSON-serializable dict with:
      - used_command: which remote command was run
      - stdout/stderr: raw outputs (for debugging)
      - parsed: list of parsed listening sockets
      - error: optional error message if both commands failed
    """
    # Try 'ss' first (modern)
    r = run_ssh_command(target, SS_CMD)
    stdout = r["stdout"]
    stderr = r["stderr"]
    rc = r["returncode"]

    used = SS_CMD
    parsed = []
    error_msg: Optional[str] = None

    if rc != 0 or not stdout.strip():
        # Try fallback to netstat
        r2 = run_ssh_command(target, NETSTAT_CMD)
        stdout2 = r2["stdout"]
        stderr2 = r2["stderr"]
        rc2 = r2["returncode"]

        if rc2 == 0 and stdout2.strip():
            stdout = stdout2
            stderr = stderr2
            used = NETSTAT_CMD
            parsed = parse_netstat_output(stdout)
        else:
            # both failed — record errors
            error_msg = f"ss failed (rc={rc}, stderr={stderr!r}); netstat failed (rc={rc2}, stderr={stderr2!r})"
            stdout = stdout + "\n" + stdout2
            stderr = stderr + "\n" + stderr2
            parsed = []
    else:
        # parse ss output
        parsed = parse_ss_output(stdout)

    return {
        "target": target,
        "used_command": used,
        "stdout": stdout,
        "stderr": stderr,
        "parsed": parsed,
        "error": error_msg,
    }


def main(argv: Optional[List[str]] = None) -> int:
    """
    CLI entry — parse target, run collection, print JSON to stdout.
    Example:
      python3 python-scripts/remote_collect_via_ssh.py --target user@192.168.1.100
    """
    parser = argparse.ArgumentParser(description="Collect listening sockets from a remote host via SSH (ss/netstat).")
    parser.add_argument("--target", required=True, help="SSH target (user@host or host). Requires ssh access.")
    parser.add_argument("--timeout", type=int, default=20, help="SSH command timeout (seconds)")
    args = parser.parse_args(argv)

    # Quick pre-flight: ensure ssh is available locally
    from shutil import which
    if which("ssh") is None:
        print("Error: 'ssh' not found on local system. Please install OpenSSH client.", file=sys.stderr)
        return 2

    res = collect_listening_via_ssh(args.target)
    # Pretty-print JSON so maintainers can paste into PR/issue if desired
    print(json.dumps(res, indent=2))
    # Exit code: 0 if no error, 1 if we had parsing failure or remote command issues
    return 0 if res.get("error") is None else 1


if __name__ == "__main__":
    raise SystemExit(main())
