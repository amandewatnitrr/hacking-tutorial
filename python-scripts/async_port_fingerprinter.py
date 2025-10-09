#!/usr/bin/env python3
"""
async_port_fingerprinter.py
Asynchronous port scanner + banner grabber + simple service fingerprinting.

Usage:
    python3 async_port_fingerprinter.py target [--ports 20-1024] [--timeout 1.0] [--concurrency 200]

Examples:
    python3 async_port_fingerprinter.py example.com --ports 22,80,443,3306
    python3 async_port_fingerprinter.py 192.168.1.0/24 --ports 22-1024

Notes:
    - IPv4 only for CIDR scanning in this script.
    - Some banners require a service-specific probe (this script sends basic probes only).
    - Run responsibly and with permission.
"""

import argparse
import asyncio
import socket
import ipaddress
import re
from typing import List, Tuple, Optional

DEFAULT_PORTS = [21, 22, 23, 25, 53, 80, 110, 143, 443, 587, 3306, 3389, 8080]

FINGERPRINTS = {
    'ssh': re.compile(rb'^SSH-'),
    'http': re.compile(rb'HTTP/|Server:'),
    'mysql': re.compile(rb'mysql|MariaDB', re.IGNORECASE),
    'rdp': re.compile(rb'RDP|Remote Desktop', re.IGNORECASE),
    'smtp': re.compile(rb'SMTP|ESMTP', re.IGNORECASE),
}

async def tcp_connect(host: str, port: int, timeout: float) -> Optional[bytes]:
    try:
        reader, writer = await asyncio.wait_for(asyncio.open_connection(host, port), timeout)
        # Try to read an initial banner (non-blocking)
        try:
            banner = await asyncio.wait_for(reader.read(1024), 0.8)
        except asyncio.TimeoutError:
            banner = b''
        # if banner empty, send small probe for common services
        if not banner:
            probes = {
                80: b"GET / HTTP/1.1\r\nHost: %s\r\nUser-Agent: scanner\r\nConnection: close\r\n\r\n" % host.encode(),
                443: b"\r\n",
                21: b"\r\n",
                25: b"HELO example.com\r\n",
                110: b"\r\n",
            }
            probe = probes.get(port, None)
            if probe:
                writer.write(probe)
                await writer.drain()
                try:
                    banner = await asyncio.wait_for(reader.read(2048), 1.0)
                except asyncio.TimeoutError:
                    banner = b''
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:
            pass
        return banner
    except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
        return None

def fingerprint_banner(banner: bytes) -> List[str]:
    found = []
    if not banner:
        return found
    for name, regex in FINGERPRINTS.items():
        if regex.search(banner):
            found.append(name)
    # quick heuristic for HTTP presence
    if b'HTTP/' in banner or b'Server:' in banner:
        if 'http' not in found:
            found.append('http')
    return found

async def scan_target(host: str, ports: List[int], timeout: float, sem: asyncio.Semaphore):
    results = []
    async with sem:
        tasks = []
        for port in ports:
            tasks.append(asyncio.create_task(scan_port(host, port, timeout)))
        results = await asyncio.gather(*tasks)
    return [r for r in results if r]

async def scan_port(host: str, port: int, timeout: float):
    banner = await tcp_connect(host, port, timeout)
    if banner is None:
        return None
    fingerprints = fingerprint_banner(banner)
    return {
        'host': host,
        'port': port,
        'open': True if banner is not None else False,
        'banner_preview': banner[:300].decode(errors='replace') if banner else '',
        'fingerprints': fingerprints
    }

def parse_ports(ports_arg: str) -> List[int]:
    ports = set()
    for part in ports_arg.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            start, end = part.split('-', 1)
            ports.update(range(int(start), int(end) + 1))
        else:
            ports.add(int(part))
    return sorted(p for p in ports if 1 <= p <= 65535)

def expand_targets(target_arg: str) -> List[str]:
    # Accept single host, comma-separated hosts, or a CIDR
    targets = []
    for part in target_arg.split(','):
        p = part.strip()
        if '/' in p:
            try:
                net = ipaddress.ip_network(p, strict=False)
                for ip in net.hosts():
                    targets.append(str(ip))
            except ValueError:
                continue
        else:
            targets.append(p)
    return targets

async def main_async(args):
    targets = expand_targets(args.target)
    ports = parse_ports(args.ports) if args.ports else DEFAULT_PORTS
    sem = asyncio.Semaphore(args.concurrency)
    all_results = []
    for t in targets:
        print(f"Scanning {t} (ports: {len(ports)}) ...")
        res = await scan_target(t, ports, args.timeout, sem)
        for r in res:
            print(f"{r['host']}:{r['port']} - open. fingerprints: {r['fingerprints']}")
            preview = r['banner_preview'].splitlines()
            if preview:
                print("  banner:", preview[0][:200])
        all_results.extend(res)
    return all_results

def cli():
    parser = argparse.ArgumentParser(description="Async port scanner + banner fingerprinter")
    parser.add_argument('target', help="target host, CIDR or comma-separated list (e.g. 10.0.0.1,192.168.1.0/28)")
    parser.add_argument('--ports', default=None, help="ports list: e.g. 22,80,443 or 1-1024")
    parser.add_argument('--timeout', type=float, default=1.0, help="connect/read timeout in seconds")
    parser.add_argument('--concurrency', type=int, default=200, help="concurrent connection limit")
    args = parser.parse_args()
    asyncio.run(main_async(args))

if __name__ == "__main__":
    cli()
