# Simple educational port scanner
# Ethical use only: scan only hosts you own or have permission to test.
import socket
from datetime import datetime

def scan(target, start=1, end=1024, timeout=0.5):
    open_ports = []
    for port in range(start, end+1):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        try:
            result = s.connect_ex((target, port))
            if result == 0:
                open_ports.append(port)
        except Exception:
            pass
        finally:
            s.close()
    return open_ports

if __name__ == '__main__':
    target = input("Enter target (IP or hostname): ").strip()
    print("Scanning:", target)
    print("Started at", datetime.now())
    ports = scan(target, 20, 1024)
    if ports:
        print("Open ports:", ", ".join(map(str, ports)))
    else:
        print("No open ports found in range.")
