#!/usr/bin/env python3
"""
pcap_forensic_extractor.py
Forensic extractor for PCAP files:
- Extracts HTTP Basic Auth credentials
- Extracts HTTP POST form fields (basic parsing)
- Lists flows that contain likely plaintext credentials (FTP, Telnet)

Usage:
    sudo python3 pcap_forensic_extractor.py capture.pcap

WARNING:
    - Parsing network captures may reveal sensitive data. Keep outputs secure.
    - Requires scapy: pip install scapy
    - Running scapy operations may require root privileges on some systems.
"""

import sys
import base64
from collections import defaultdict
from scapy.all import rdpcap, TCP, Raw

def decode_basic_auth(header_value: str):
    try:
        if header_value.lower().startswith('basic '):
            payload = header_value.split(None, 1)[1]
            decoded = base64.b64decode(payload).decode(errors='replace')
            return decoded  # user:pass
    except Exception:
        pass
    return None

def parse_http_payload(payload: bytes):
    try:
        text = payload.decode('utf-8', errors='ignore')
    except Exception:
        return None
    lines = text.split('\r\n')
    if not lines:
        return None
    first = lines[0]
    headers = {}
    body = ''
    i = 1
    # gather headers
    while i < len(lines) and lines[i]:
        parts = lines[i].split(':', 1)
        if len(parts) == 2:
            headers[parts[0].strip()] = parts[1].strip()
        i += 1
    # body (if any)
    # find blank line index
    try:
        blank = lines.index('', 1)
        body_lines = lines[blank+1:]
        body = '\n'.join(body_lines)
    except ValueError:
        body = ''
    return first, headers, body

def extract_from_pcap(path):
    packets = rdpcap(path)
    http_basic = []
    http_posts = []
    plaintext_flows = defaultdict(list)  # keyed by (src,dst,srcp,dstp)
    for pkt in packets:
        if not pkt.haslayer(TCP):
            continue
        tcp = pkt[TCP]
        key = (pkt[0].src, pkt[0].dst, tcp.sport, tcp.dport)
        if pkt.haslayer(Raw):
            payload = bytes(pkt[Raw].load)
            lower = payload.lower()
            # HTTP
            if b'http/' in lower or b'get ' in lower or b'post ' in lower:
                parsed = parse_http_payload(payload)
                if parsed:
                    first, headers, body = parsed
                    # basic auth
                    auth = None
                    for hname, hval in headers.items():
                        if hname.lower() == 'authorization' and hval.lower().startswith('basic'):
                            decoded = decode_basic_auth(hval)
                            if decoded:
                                http_basic.append((key, decoded, headers))
                    # POST data
                    if first.lower().startswith('post'):
                        if body:
                            http_posts.append((key, body))
            # FTP/Telnet heuristics: look for 'USER'/'PASS' or login prompts
            if b'USER ' in payload or b'PASS ' in payload or b'login:' in lower or b'Password:' in payload:
                plaintext_flows[key].append(payload[:300])
    return http_basic, http_posts, plaintext_flows

def pretty_print(http_basic, http_posts, plaintext_flows):
    if http_basic:
        print("HTTP Basic Auth credentials found:")
        for k, cred, headers in http_basic:
            src, dst, sport, dport = k
            print(f"  {src}:{sport} -> {dst}:{dport}  cred: {cred}")
    else:
        print("No HTTP Basic Auth credentials found.")

    if http_posts:
        print("\nHTTP POST bodies found (first 500 chars):")
        for k, body in http_posts:
            src, dst, sport, dport = k
            print(f"  {src}:{sport} -> {dst}:{dport}")
            print(f"    {body[:500]}")
    else:
        print("\nNo HTTP POST bodies captured (or empty).")

    if plaintext_flows:
        print("\nFlows containing possible plaintext credentials (FTP/Telnet heuristics):")
        for k, snippets in plaintext_flows.items():
            src, dst, sport, dport = k
            print(f"  {src}:{sport} -> {dst}:{dport} (examples)")
            for s in snippets[:3]:
                print("    ", s.decode(errors='replace')[:200])
    else:
        print("\nNo plaintext credential flows detected via heuristics.")

def main():
    if len(sys.argv) != 2:
        print("Usage: sudo python3 pcap_forensic_extractor.py capture.pcap")
        sys.exit(1)
    path = sys.argv[1]
    http_basic, http_posts, plaintext_flows = extract_from_pcap(path)
    pretty_print(http_basic, http_posts, plaintext_flows)

if __name__ == "__main__":
    main()
