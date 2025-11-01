# Simple auth log analyzer for /var/log/auth.log (Linux)
# Educational: parse log for failed ssh attempts and count by IP
import re
from collections import Counter

def analyze_log(path='/var/log/auth.log'):
    ip_re = re.compile(r'from (\d+\.\d+\.\d+\.\d+)')
    counts = Counter()
    try:
        with open(path, 'r', errors='ignore') as f:
            for line in f:
                if 'Failed password' in line or 'authentication failure' in line:
                    m = ip_re.search(line)
                    if m:
                        counts[m.group(1)] += 1
    except FileNotFoundError:
        print("Log file not found. Run on a Linux system with auth.log or provide a path.")
        return
    for ip, c in counts.most_common():
        print(f"{ip}: {c} failed attempts")

if __name__ == '__main__':
    analyze_log()
