# Program to change MAC Address of an interface

import random
import subprocess


def generate_random_mac():
    # First byte: locally administered (bit 1 set) and unicast (bit 0 clear)
    first_byte = random.randint(0, 255) & 0xFE | 0x02
    rest = [random.randint(0, 255) for _ in range(5)]
    return ":".join(f"{b:02x}" for b in [first_byte] + rest)


def change_mac(interface, new_mac):
    print(f"[+] Changing MAC address of {interface} to {new_mac}")
    # Execute the command to change the MAC address
    subprocess.call(["sudo", "ifconfig", interface, "down"])
    subprocess.call(["sudo", "ifconfig", interface, "hw", "ether", new_mac])
    subprocess.call(["sudo", "ifconfig", interface, "up"])
    print("[+] MAC address changed successfully")


# Example usage
if __name__ == "__main__":
    interface = input("Enter the interface name (e.g., eth0, wlan0): ")
    new_mac = input("Enter the new MAC address (format: xx:xx:xx:xx:xx:xx), or press Enter to generate one: ").strip()
    if not new_mac:
        new_mac = generate_random_mac()
        print(f"[*] No MAC address provided. Generated: {new_mac}")
    change_mac(interface, new_mac)
    print(f"New MAC address for {interface} is {new_mac}")
    # Verify the change
    subprocess.call(["ifconfig", interface])
    print(f"[+] Verification complete for {interface}.")