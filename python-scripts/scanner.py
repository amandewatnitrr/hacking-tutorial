#!/usr/bin/env python3
"""
secret_scanner.py
Scan a directory recursively for potential secrets:
 - AWS Access Key IDs / Secrets
 - Google API key-like patterns
 - Private key PEM blocks
 - High-entropy strings (possible tokens)
 - JWT-looking strings (3 parts, base64)

Usage:
    python3 secret_scanner.py /path/to/repo --ext .py,.js --entropy 4.0

Notes:
    - This scanner produces false positives; treat findings as suspicious and verify manually.
    - Good to run locally or in CI to prevent accidental secret commits.
"""

import os
import re
import math
import argparse
from base64 import b64decode

# Regex patterns
PATTERNS = {
    'aws_access_key_id': re.compile(r'AKIA[0-9A-Z]{16}'),
    'aws_secret_access_key_like': re.compile(r'(?i)aws(.{0,20})?(secret|secret_key|secretaccesskey).{0,50}["\']?([A-Za-z0-9/+=]{40,})["\']?'),
    'google_api_key': re.compile(r'AIza[0-9A-Za-z\-_]{35}'),
    'private_key_block': re.compile(r'-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----'),
    'jwt_like': re.compile(r'([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)'),
}

EXT_WHITELIST = {'.py', '.js', '.ts', '.java', '.go', '.rb', '.txt', '.env', '.sh', '.json', '.yaml', '.yml'}

def shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    probs = [float(data.count(c)) / len(data) for c in set(data)]
    return -sum(p * math.log2(p) for p in probs)

def is_high_entropy_string(s: str, threshold: float) -> bool:
    # consider only strings longer than 20 chars for entropy test
    if len(s) < 20:
        return False
    e = shannon_entropy(s)
    return e >= threshold

def scan_file(path: str, entropy_threshold: float):
    findings = []
    try:
        with open(path, 'r', errors='ignore') as f:
            data = f.read()
    except Exception:
        return findings
    for name, pattern in PATTERNS.items():
        for m in pattern.finditer(data):
            snippet = m.group(0)
            findings.append((name, snippet[:200]))
    # entropy scanning: look for long token-like strings (alphanumeric + /+=-_)
    token_regex = re.compile(r'([A-Za-z0-9_\-+/=]{20,})')
    for m in token_regex.finditer(data):
        token = m.group(0)
        if is_high_entropy_string(token, entropy_threshold):
            findings.append(('high_entropy_token', token[:200]))
    # JWT special check: try base64 decode header
    for m in PATTERNS['jwt_like'].finditer(data):
        jwt = m.group(1)
        parts = jwt.split('.')
        if len(parts) == 3:
            # quick attempt to decode header
            try:
                header = parts[0] + '=' * (-len(parts[0]) % 4)
                b = b64decode(header.encode(), validate=False)
                findings.append(('jwt', jwt[:200]))
            except Exception:
                pass
    return findings

def scan_path(root: str, ext_filter=None, entropy_threshold=4.0):
    results = {}
    for dirpath, dirs, files in os.walk(root):
        # skip .git by default
        if '.git' in dirs:
            dirs.remove('.git')
        for fname in files:
            if ext_filter:
                _, ext = os.path.splitext(fname)
                if ext and ext.lower() not in ext_filter:
                    continue
            full = os.path.join(dirpath, fname)
            f_findings = scan_file(full, entropy_threshold)
            if f_findings:
                results[full] = f_findings
    return results

def pretty_print(results):
    if not results:
        print("No candidate secrets found.")
        return
    print("Potential secrets detected (verify manually):\n")
    for path, items in results.items():
        print(f"{path}:")
        for kind, snippet in items:
            print(f"  - {kind}: {snippet}")
        print()

def main():
    parser = argparse.ArgumentParser(description="Scan directory for potential secrets")
    parser.add_argument('path', help="Path to scan")
    parser.add_argument('--ext', default=None, help="Comma-separated list of file extensions to scan (e.g. .py,.js). Default: common code/text ext")
    parser.add_argument('--entropy', type=float, default=4.0, help="Entropy threshold for high-entropy token detection (default 4.0)")
    args = parser.parse_args()
    ext_filter = None
    if args.ext:
        ext_filter = set(e.strip().lower() for e in args.ext.split(',') if e.strip())
    else:
        ext_filter = EXT_WHITELIST
    results = scan_path(args.path, ext_filter, args.entropy)
    pretty_print(results)

if __name__ == "__main__":
    main()
