# Educational, commented asynchronous TCP port scanner with banner grabbing
# and simple regex-based fingerprinting. This file is intentionally verbose
# with comments to help learners understand why each block exists and how
# the scanner works.
#
# IMPORTANT: Only run this scanner against hosts/networks you own or are
# explicitly authorized to test. Misuse can be illegal.
from __future__ import annotations

import argparse         # small, standard library CLI parser
import asyncio          # core async I/O library used for concurrency
import json             # to optionally emit results in JSON format
import logging          # lightweight logging for debug/info output
import re               # regular expressions used for banner fingerprinting
from datetime import datetime
from typing import List, Dict, Any, Optional

# -----------------------
# Module-level constants
# -----------------------
# A short, human-readable logger to help learners see internal messages.
logger = logging.getLogger("async_port_scanner")

# Maximum bytes we attempt to read when grabbing a banner.
# Many service banners are short (a few hundred bytes), so this keeps memory use low.
DEFAULT_READ_BYTES = 1024

# Default concurrency - how many simultaneous TCP connect attempts will be allowed.
# High concurrency speeds up large scans but may be aggressive for some networks.
DEFAULT_CONCURRENCY = 200

# -----------------------
# Fingerprinting rules
# -----------------------
# Each tuple is (compiled_regex, friendly_service_name).
# Regexes are applied to raw banner bytes (not decoded), so we compile with rb"...".
# Learners: fingerprinting is heuristic — it matches known banner patterns but is not perfect.
FINGERPRINTS = [
    (re.compile(rb"^HTTP/|^GET |^POST |Server:", re.I), "HTTP"),         # HTTP server responses
    (re.compile(rb"^SSH-", re.I), "SSH"),                                # SSH banner like "SSH-2.0-OpenSSH_..."
    (re.compile(rb"mysql|MySQL", re.I), "MySQL"),                        # MySQL handshake often includes "mysql"
    (re.compile(rb"^220 .*SMTP", re.I), "SMTP"),                         # SMTP greeting lines often start with "220"
    (re.compile(rb"^RFB \d\.\d", re.I), "RDP"),                          # RDP/VNC style greeting (RFB)
    (re.compile(rb"^220"), "SMTP"),                                      # fallback SMTP-ish greeting
]

# Port -> likely service mapping used when no banner is present.
# This is a simple fallback only — port numbers are conventional but not authoritative.
PORT_SERVICE_MAP = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    3306: "MySQL",
    3389: "RDP",
    5900: "VNC",
    8080: "HTTP-Alt",
}

# -----------------------
# Helper functions
# -----------------------


def parse_port_list(port_string: str) -> List[int]:
    """
    Convert a port expression like "22,80,8000-8010" to a sorted list of ints.
    Learners: this is a simple parser — it supports commas and single hyphen ranges.
    """
    ports = set()
    for part in port_string.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            # range specified: expand inclusive
            start, end = part.split("-", 1)
            ports.update(range(int(start), int(end) + 1))
        else:
            ports.add(int(part))
    return sorted(ports)


def _fingerprint(port: int, banner: bytes) -> List[str]:
    """
    Determine likely service names from a banner and/or port number.

    Steps:
    1. Try regex fingerprints on the banner (most reliable if banner present).
    2. If none match, fall back to common port -> service guesses.
    3. Guarantee at least one returned label (e.g., "unknown").
    """
    results: List[str] = []
    if banner:
        for pattern, name in FINGERPRINTS:
            # pattern.search works on bytes because we compiled rb"..."
            if pattern.search(banner):
                results.append(name)

    # fallback to known ports (conventional)
    if not results and port in PORT_SERVICE_MAP:
        results.append(PORT_SERVICE_MAP[port])

    if not results:
        results.append("unknown")

    # deduplicate while preserving order
    seen = set()
    unique = []
    for r in results:
        if r not in seen:
            seen.add(r)
            unique.append(r)
    return unique


# -----------------------
# Core scanning class
# -----------------------


class AsyncPortScanner:
    """
    Encapsulates scanning configuration & behavior.

    - timeout: per-connection timeout (seconds)
    - concurrency: maximum simultaneous connections
    - read_bytes: how many bytes to attempt to read for banner grabbing
    """

    def __init__(self, timeout: float = 2.0, concurrency: int = DEFAULT_CONCURRENCY, read_bytes: int = DEFAULT_READ_BYTES):
        # per-connection timeout in seconds (affects how long we wait to connect/read)
        self.timeout = timeout
        # semaphore limits concurrency so we don't open unlimited sockets at once
        self.semaphore = asyncio.Semaphore(concurrency)
        # how many bytes to read when attempting to grab banner data from a socket
        self.read_bytes = read_bytes

    async def _grab_banner(self, reader: asyncio.StreamReader) -> bytes:
        """
        Try to read up to `self.read_bytes` bytes from the given StreamReader.
        We wrap the read in a timeout (self.timeout) to avoid hanging indefinitely.
        Returns raw bytes (may be empty if nothing received).
        """
        try:
            data = await asyncio.wait_for(reader.read(self.read_bytes), timeout=self.timeout)
            return data or b""
        except Exception:
            # On timeout or other read error just return empty bytes
            return b""

    async def scan_port(self, host: str, port: int) -> Dict[str, Any]:
        """
        Attempt to connect to host:port, grab a banner if available, fingerprint it,
        and return a structured result dictionary.

        The function is resilient: connection refusals/timeouts are handled and the
        result will simply indicate the port is closed/filtered.
        """
        # structured result we will return — useful for JSON output and tests
        result: Dict[str, Any] = {
            "host": host,
            "port": port,
            "open": False,
            "banner": "",
            "services": [],
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }

        try:
            # limit concurrency with semaphore to prevent resource exhaustion
            async with self.semaphore:
                # asyncio.open_connection is a high-level API returning (reader, writer)
                # It resolves DNS and performs the TCP handshake asynchronously.
                reader, writer = await asyncio.wait_for(asyncio.open_connection(host, port), timeout=self.timeout)
                result["open"] = True

                # Many services send a short banner immediately after connect (e.g., SSH, SMTP).
                # Try reading first without sending anything.
                banner = await self._grab_banner(reader)

                # For HTTP-like ports, servers typically don't send a banner until we issue a request.
                # We send a light, harmless HEAD request to coax a response (low-impact).
                if not banner and port in (80, 8080, 8000, 8001):
                    try:
                        writer.write(b"HEAD / HTTP/1.0\r\nHost: localhost\r\n\r\n")
                        await writer.drain()  # ensure data is sent before we attempt to read
                        banner = await self._grab_banner(reader)
                    except Exception:
                        # If the probe fails, ignore and continue; do not crash the scanner
                        pass

                # If still no banner, sending a newline sometimes triggers text-based services to respond
                if not banner:
                    try:
                        writer.write(b"\r\n")
                        await writer.drain()
                        banner = await self._grab_banner(reader)
                    except Exception:
                        pass

                # Close connection politely. Closing ensures we free up sockets on both ends.
                try:
                    writer.close()
                    # wait for the close handshake in asyncio-compatible manner
                    await writer.wait_closed()
                except Exception:
                    # not critical, best-effort
                    pass

                # If we received bytes, decode for human-readable output. Use replace errors
                # so that binary or partial data won't raise exceptions.
                if banner:
                    result["banner"] = banner[:1024].decode("utf-8", errors="replace")
                # Fingerprint based on banner (preferred) or port fallback
                result["services"] = _fingerprint(port, banner)
        except asyncio.TimeoutError:
            # connect/read timed out -> port likely filtered or host is slow. We keep open=False.
            logger.debug("timeout scanning %s:%s", host, port)
        except (ConnectionRefusedError, OSError) as e:
            # common case: connection refused -> closed port or unreachable network
            logger.debug("connection refused or os error for %s:%s -> %s", host, port, e)
        except Exception as e:
            # unexpected errors are captured in the result for debugging by maintainers
            logger.exception("unexpected error scanning %s:%s", host, port)
            result["error"] = str(e)

        return result

    async def scan_multiple(self, hosts: List[str], ports: List[int]) -> List[Dict[str, Any]]:
        """
        Scan all combinations of hosts x ports concurrently and return results as a list.
        For large scans you may want to chunk hosts/ports to limit memory/ge resource usage.
        """
        tasks = []
        for h in hosts:
            for p in ports:
                tasks.append(self.scan_port(h, p))
        # asyncio.gather runs all tasks concurrently and collects results
        results = await asyncio.gather(*tasks)
        return results


# -----------------------
# Simple command-line interface
# -----------------------


def cli(argv: Optional[List[str]] = None) -> int:
    """
    Command-line entry point. Parse arguments, run the scan, and optionally print/save results.
    This CLI is intentionally minimal for learning; you can extend it (e.g., add rate limiting).
    """
    parser = argparse.ArgumentParser(prog="async-port-scanner", description="Async port scanner with banner grabbing & basic fingerprinting")
    parser.add_argument("--hosts", type=str, help="Comma-separated host list (e.g. 127.0.0.1,example.com)")
    parser.add_argument("--hosts-file", type=str, help="File with one host per line")
    parser.add_argument("--ports", type=str, default="1-1024", help="Ports to scan (e.g. 22,80,8000-8010). Default: 1-1024")
    parser.add_argument("--concurrency", type=int, default=DEFAULT_CONCURRENCY, help=f"Max concurrent connections (default {DEFAULT_CONCURRENCY})")
    parser.add_argument("--timeout", type=float, default=2.0, help="Per-connection timeout in seconds")
    parser.add_argument("--read-bytes", type=int, default=DEFAULT_READ_BYTES, help=f"Bytes to read when grabbing banners (default {DEFAULT_READ_BYTES})")
    parser.add_argument("--output", type=str, help="Path to write JSON results (optional)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose logging")
    args = parser.parse_args(argv)

    # configure logging level for learners to see info/debug messages when requested
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(asctime)s %(levelname)-8s %(name)s - %(message)s")

    # collect hosts either from command-line or file
    hosts: List[str] = []
    if args.hosts:
        hosts += [h.strip() for h in args.hosts.split(",") if h.strip()]
    if args.hosts_file:
        with open(args.hosts_file, "r", encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if line and not line.startswith("#"):
                    hosts.append(line)

    if not hosts:
        parser.error("Please provide --hosts or --hosts-file")

    # parse ports into a list of ints
    ports = parse_port_list(args.ports)

    # instantiate scanner with provided settings
    scanner = AsyncPortScanner(timeout=args.timeout, concurrency=args.concurrency, read_bytes=args.read_bytes)

    async def _run():
        # the actual async runner that returns results
        return await scanner.scan_multiple(hosts, ports)

    # Run the async runner and collect results synchronously here in main thread
    results = asyncio.run(_run())

    # Print results to stdout in a human-friendly way and optionally store JSON
    for r in results:
        if r.get("open"):
            # learners: this line prints a compact one-line summary per open port
            print(f"{r['host']}:{r['port']} open -> services={r.get('services')} banner={r.get('banner')!r}")

    if args.output:
        # write full JSON results to a file if requested
        with open(args.output, "w", encoding="utf-8") as fh:
            json.dump(results, fh, indent=2)

    return 0


# -----------------------
# Module entry
# -----------------------
if __name__ == "__main__":
    # This allows `python async_port_scanner.py --hosts 127.0.0.1 --ports 22` from terminal.
    raise SystemExit(cli())
