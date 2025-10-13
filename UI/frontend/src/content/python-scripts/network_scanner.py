# This script automates the discovery of devices on a local network using netdiscover.

import subprocess
import sys

def network_scanner(interface, ip_range):
    """
    Runs netdiscover to find all devices on the specified IP range.
    """
    print(f"[+] Starting network scan on {interface} for range {ip_range}...")
    print("[+] Press Ctrl+C to stop the scan.")

    # We use sudo because netdiscover requires root privileges to operate
    command = ["sudo", "netdiscover", "-i", interface, "-r", ip_range]

    try:
        # Execute the command and display output in real-time
        process = subprocess.Popen(command)
        process.wait()
    except KeyboardInterrupt:
        print("\n[+] Scan stopped by user.")
    except FileNotFoundError:
        print("[-] Error: 'netdiscover' command not found. Please ensure it is installed.")
        print("[-] On Kali/Debian, install it with: sudo apt-get install netdiscover")
    except Exception as e:
        print(f"[-] An unexpected error occurred: {e}")

if __name__ == "__main__":
    # Check if running as root, which is required by netdiscover
    if subprocess.run(["id", "-u"]).stdout.strip() != b'0':
         print("[-] This script requires root privileges. Please run it with sudo.")
         sys.exit(1)

    interface_to_scan = input("Enter the network interface to use (e.g., eth0): ")
    range_to_scan = input("Enter the IP range to scan (e.g., 192.168.1.0/24): ")

    if not range_to_scan:
        print("[-] IP range cannot be empty. Exiting.")
    else:
        network_scanner(interface_to_scan, range_to_scan)

