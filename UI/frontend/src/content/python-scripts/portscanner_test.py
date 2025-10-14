#!/usr/bin/env python3
"""
python-scripts/portscanner_test.py

A self-contained demo that starts lightweight local test servers (HTTP, SSH-like,
SMTP greeting, and a MySQL-like handshake), runs the AsyncPortScanner against them,
and prints the JSON results and a short human-readable summary.

Purpose for learners:
- Demonstrates how to run the async scanner in a safe, local environment.
- Shows how banner-grabbing works against services that proactively send greetings,
  and against HTTP where we send a light HEAD probe.
- Provides easy-to-copy commands to reproduce the proof-of-work for a PR.

IMPORTANT:
- This demo binds to localhost (127.0.0.1) on ports above 1024 (no root required).
- Only run on your machine or in an isolated VM. Do not point this demo at external targets.
"""

from __future__ import annotations

import asyncio
import json
from typing import Dict, List
from async_port_scanner import AsyncPortScanner  # imports the scanner implemented in the repo


# -----------------------
# Lightweight test server handlers
# -----------------------
# Each handler is intentionally minimal: they send a small banner (or respond to a request)
# then close. This simulates common server greeting behavior without running full server stacks.

async def http_server(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    """
    Simulate an HTTP server: read incoming request (if any), respond with a short HTTP response.
    Many real HTTP servers don't send data until a request is made, so this handler samples that behavior.
    """
    try:
        # Try to read any incoming data (the scanner will probe with HEAD). We wait briefly.
        _ = await asyncio.wait_for(reader.read(1024), timeout=0.5)
    except Exception:
        # no incoming data or timeout; that's fine — we'll still send a response when asked
        pass

    response = b"HTTP/1.1 200 OK\r\nServer: DummyHTTP/1.0\r\nContent-Length: 2\r\n\r\nOK"
    writer.write(response)
    await writer.drain()
    writer.close()
    try:
        await writer.wait_closed()
    except Exception:
        pass


async def ssh_server(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    """
    Simulate an SSH server banner: SSH servers usually send a banner immediately on connect.
    Example: "SSH-2.0-OpenSSH_8.0"
    """
    writer.write(b"SSH-2.0-OpenSSH_8.0p1 Demo\r\n")
    await writer.drain()
    # small sleep to allow scanner to read the banner before we close
    await asyncio.sleep(0.05)
    writer.close()
    try:
        await writer.wait_closed()
    except Exception:
        pass


async def smtp_server(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    """
    Simulate SMTP greeting: servers commonly send a 220 greeting immediately after connect.
    """
    writer.write(b"220 localhost ESMTP DemoPostfix\r\n")
    await writer.drain()
    try:
        # optionally read a client greeting/commands (not required for demo)
        _ = await asyncio.wait_for(reader.read(1024), timeout=0.5)
    except Exception:
        pass
    writer.close()
    try:
        await writer.wait_closed()
    except Exception:
        pass


async def mysql_like_server(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    """
    Simulate a MySQL-like handshake by sending a small binary blob containing 'mysql'.
    Real MySQL handshake is binary; this simplified blob is enough for our fingerprint regex.
    """
    # 0x0a starts MySQL protocol version string in real handshake; include "mysql_native_password"
    writer.write(b"\x0a5.7.33\x00\x00\x00\x00mysql_native_password")
    await writer.drain()
    await asyncio.sleep(0.05)
    writer.close()
    try:
        await writer.wait_closed()
    except Exception:
        pass


# -----------------------
# Demo runner
# -----------------------

async def start_servers(port_map: Dict[int, callable]) -> List[asyncio.AbstractServer]:
    """
    Start asyncio servers for each (port -> handler) pair on localhost and return the server objects.
    We return the servers so the caller can close them cleanly when done.
    """
    servers: List[asyncio.AbstractServer] = []
    for port, handler in port_map.items():
        server = await asyncio.start_server(handler, "127.0.0.1", port)
        servers.append(server)
    return servers


async def run_demo() -> None:
    """
    Main demo flow:
    1. Start test servers on pre-defined ports.
    2. Instantiate AsyncPortScanner and run a scan against localhost ports.
    3. Print JSON results and a concise terminal summary.
    4. Cleanly shut down demo servers.
    """
    # choose ports > 1024 to avoid needing root
    ports = [9001, 9002, 9003, 9004]
    port_map = {
        9001: http_server,
        9002: ssh_server,
        9003: smtp_server,
        9004: mysql_like_server,
    }

    print("Starting demo servers on localhost:", ports)
    servers = await start_servers(port_map)

    # show where servers are listening (helpful when debugging)
    for s in servers:
        for sock in s.sockets:
            print("Listening on", sock.getsockname())

    # instantiate the scanner with a short timeout (demo is local and fast)
    scanner = AsyncPortScanner(timeout=1.0, concurrency=100, read_bytes=2048)

    print("Running scanner against localhost demo ports...")
    results = await scanner.scan_multiple(["127.0.0.1"], ports)

    # print the full JSON result (useful as proof-of-working logs)
    print("\n=== JSON Results ===")
    print(json.dumps(results, indent=2))

    # print a compact human-readable summary for the terminal
    print("\n=== Summary (open ports) ===")
    for r in results:
        if r.get("open"):
            print(f" - {r['host']}:{r['port']} -> services={r.get('services')} banner={r.get('banner')!r}")

    # gracefully stop demo servers
    for s in servers:
        s.close()
        await s.wait_closed()

    print("\nDemo finished. Servers stopped.")


if __name__ == "__main__":
    # Run the demo. Use asyncio.run() to create an event loop and execute the coroutine.
    try:
        asyncio.run(run_demo())
    except KeyboardInterrupt:
        print("Demo aborted by user.")

