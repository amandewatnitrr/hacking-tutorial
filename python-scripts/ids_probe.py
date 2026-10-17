#!/usr/bin/env python3
"""
ids_probe.py - tiny educational IDS probe.

Passively monitors TCP traffic and writes JSON alerts for port-scan-like SYN
bursts and suspicious plaintext HTTP User-Agent headers. Alerts are appended
to alerts.json next to this script. Webhook posting is optional.

Run only on systems and networks you own or are explicitly authorized to
monitor. Packet capture may require elevated privileges. On Windows, install
Npcap with WinPcap compatibility enabled; on Linux, install libpcap.

Dependencies:
    pip install scapy
    pip install requests  # optional; needed only for --webhook

Run on Windows from an Administrator PowerShell:
    py -3 -m venv venv
    .\\venv\\Scripts\\Activate.ps1
    pip install scapy requests
    python ids_probe.py

Run on Linux:
    python3 -m venv venv && source venv/bin/activate
    pip install scapy requests
    sudo python3 ids_probe.py -i eth0

For a local HTTP User-Agent test, start an HTTP server with:
    python -m http.server 8000 --bind 0.0.0.0
Then send a request with a test User-Agent such as sqlmap from another machine
on your authorized network. Alerts contain JSON records.
"""

from __future__ import annotations

import argparse
import json
import os
import threading
import time
from collections import defaultdict, deque
from datetime import datetime

try:
    from scapy.layers.inet6 import IPv6
    from scapy.all import IP, Raw, TCP, sniff
except Exception as exc:
    raise SystemExit(
        "Scapy is required. Install it with: pip install scapy\n"
        f"Import error: {exc}"
    ) from exc

try:
    import requests
except ImportError:
    requests = None

ALERT_FILE = os.path.join(os.path.dirname(__file__), "alerts.json")
PORT_SCAN_WINDOW = 10
PORT_SCAN_PORT_THRESHOLD = 12
SUSPICIOUS_UA_KEYWORDS = [
    "sqlmap",
    "nikto",
    "acunetix",
    "curl",
    "wget",
    "fuzzer",
    "scanner",
]
WEBHOOK: str | None = None
syn_history: defaultdict[str, deque[tuple[float, int]]] = defaultdict(deque)
file_lock = threading.Lock()


def now_iso() -> str:
    """Return the current UTC time in ISO 8601 format."""
    return datetime.utcnow().isoformat() + "Z"


def write_alert(alert: dict) -> None:
    """Append an alert as a newline-delimited JSON record and optionally post it."""
    alert["detected_at"] = now_iso()
    line = json.dumps(alert, ensure_ascii=False)

    with file_lock:
        os.makedirs(os.path.dirname(ALERT_FILE), exist_ok=True)
        with open(ALERT_FILE, "a", encoding="utf-8") as alert_file:
            alert_file.write(line + "\n")

    print("[ALERT]", alert.get("type"), "-", alert.get("summary", ""))

    if WEBHOOK and requests:
        try:
            requests.post(WEBHOOK, json=alert, timeout=3)
        except Exception as exc:
            print(f"Webhook delivery failed: {exc}")


def check_port_scan(pkt_time: float, src_ip: str, dst_port: int) -> None:
    """Alert when a source sends SYN packets to many ports within the time window."""
    history = syn_history[src_ip]
    history.append((pkt_time, dst_port))

    cutoff = pkt_time - PORT_SCAN_WINDOW
    while history and history[0][0] < cutoff:
        history.popleft()

    distinct_ports = {port for _, port in history}
    if len(distinct_ports) >= PORT_SCAN_PORT_THRESHOLD:
        alert = {
            "type": "port_scan",
            "summary": f"Possible port scan from {src_ip} to {len(distinct_ports)} ports",
            "src_ip": src_ip,
            "unique_ports": sorted(distinct_ports),
            "count": len(distinct_ports),
            "window_seconds": PORT_SCAN_WINDOW,
        }
        history.clear()
        write_alert(alert)


def extract_user_agent(payload_bytes: bytes) -> str | None:
    """Extract a User-Agent header from a plaintext HTTP request payload."""
    text = payload_bytes.decode("utf-8", errors="ignore")
    for line in text.splitlines():
        if line.lower().startswith("user-agent:"):
            return line.split(":", 1)[1].strip()
    return None


def check_http_user_agent(
    payload: bytes, src_ip: str, dst_ip: str, dst_port: int
) -> None:
    """Alert when an HTTP User-Agent contains a configured suspicious keyword."""
    user_agent = extract_user_agent(payload)
    if not user_agent:
        return

    user_agent_lower = user_agent.lower()
    for keyword in SUSPICIOUS_UA_KEYWORDS:
        if keyword in user_agent_lower:
            alert = {
                "type": "suspicious_user_agent",
                "summary": f"Suspicious User-Agent '{user_agent[:80]}' from {src_ip}",
                "src_ip": src_ip,
                "dst_ip": dst_ip,
                "dst_port": dst_port,
                "user_agent": user_agent,
            }
            write_alert(alert)
            return


def packet_handler(pkt) -> None:
    """Inspect a captured IPv4 or IPv6 TCP packet for the configured indicators."""
    pkt_time = time.time()

    def process_tcp(tcp_layer, src_ip: str, dst_ip: str) -> None:
        try:
            flags = int(tcp_layer.flags)
        except (TypeError, ValueError):
            flags = 0

        if flags & 0x02 and not flags & 0x10:
            try:
                dst_port = int(tcp_layer.dport)
            except (TypeError, ValueError):
                return
            check_port_scan(pkt_time, src_ip, dst_port)

        if Raw in pkt:
            try:
                payload = bytes(pkt[Raw].load)
                dst_port = int(tcp_layer.dport)
            except (AttributeError, TypeError, ValueError):
                return
            check_http_user_agent(payload, src_ip, dst_ip, dst_port)

    if TCP not in pkt:
        return

    tcp_layer = pkt[TCP]
    if IP in pkt:
        ip_layer = pkt[IP]
        process_tcp(tcp_layer, ip_layer.src, ip_layer.dst)
    elif IPv6 in pkt:
        ip_layer = pkt[IPv6]
        src_ip = ip_layer.src
        dst_ip = ip_layer.dst
        if src_ip.startswith("::ffff:"):
            src_ip = src_ip.split("::ffff:", 1)[1]
        if dst_ip.startswith("::ffff:"):
            dst_ip = dst_ip.split("::ffff:", 1)[1]
        process_tcp(tcp_layer, src_ip, dst_ip)


def parse_args() -> argparse.Namespace:
    """Parse command-line options for interface selection and thresholds."""
    parser = argparse.ArgumentParser(
        description="Tiny IDS probe - sniff packets and emit simple alerts"
    )
    parser.add_argument(
        "-i",
        "--iface",
        default=None,
        help="Interface to sniff (e.g., eth0, wlan0)",
    )
    parser.add_argument("--webhook", default=None, help="Optional webhook URL")
    parser.add_argument(
        "--port-threshold",
        type=int,
        default=PORT_SCAN_PORT_THRESHOLD,
        help="Number of unique ports to trigger a port-scan alert",
    )
    parser.add_argument(
        "--window",
        type=int,
        default=PORT_SCAN_WINDOW,
        help="Time window in seconds for port-scan detection",
    )
    return parser.parse_args()


def main() -> None:
    """Configure the probe and start packet capture."""
    global WEBHOOK, PORT_SCAN_PORT_THRESHOLD, PORT_SCAN_WINDOW

    args = parse_args()
    WEBHOOK = args.webhook
    PORT_SCAN_PORT_THRESHOLD = args.port_threshold
    PORT_SCAN_WINDOW = args.window

    print(f"Starting tiny IDS probe. Alerts will be written to: {ALERT_FILE}")
    print("Press Ctrl+C to stop. Monitor only networks you are authorized to monitor.")

    try:
        sniff(iface=args.iface, prn=packet_handler, store=False)
    except PermissionError:
        print("Permission denied: run as root / Administrator.")
    except Exception as exc:
        print("Error while sniffing:", exc)


if __name__ == "__main__":
    main()
