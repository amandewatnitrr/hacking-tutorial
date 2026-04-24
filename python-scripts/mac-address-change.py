# Program to change MAC Address of an interface

import re
import random
import subprocess
import argparse


MAC_REGEX = re.compile(r"^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$")


def generate_random_mac():
    # First byte: locally administered (bit 1 set) and unicast (bit 0 clear)
    first_byte = random.randint(0, 255) & 0xFE | 0x02
    rest = [random.randint(0, 255) for _ in range(5)]
    return ":".join(f"{b:02x}" for b in [first_byte] + rest)


def is_valid_mac(mac):
    return bool(MAC_REGEX.match(mac))


def change_mac(interface, new_mac):
    print(f"[+] Changing MAC address of {interface} to {new_mac}")
    if subprocess.run(["sudo", "ifconfig", interface, "down"]).returncode != 0:
        print(f"[-] Failed to bring down interface {interface}. Check the interface name and permissions.")
        return False
    if subprocess.run(["sudo", "ifconfig", interface, "hw", "ether", new_mac]).returncode != 0:
        print(f"[-] Failed to set MAC address. Ensure the address is valid and you have sufficient permissions.")
        subprocess.run(["sudo", "ifconfig", interface, "up"])
        return False
    if subprocess.run(["sudo", "ifconfig", interface, "up"]).returncode != 0:
        print(f"[-] Failed to bring up interface {interface}. You may need to run: sudo ifconfig {interface} up")
        return False
    print("[+] MAC address changed successfully")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Change the MAC address of a network interface.")
    parser.add_argument("-i", "--interface", dest="interface", help="Interface whose MAC Address is to be changed")
    parser.add_argument("-m", "--mac", dest="new_mac", help="New MAC Address")
    args = parser.parse_args()

    interface = args.interface or input("Enter the interface name (e.g., eth0, wlan0): ").strip()
    if not interface:
        print("[-] Interface name cannot be empty.")
        raise SystemExit(1)

    new_mac = args.new_mac or input("Enter the new MAC address (format: xx:xx:xx:xx:xx:xx), or press Enter to generate one: ").strip()
    if not new_mac:
        new_mac = generate_random_mac()
        print(f"[*] No MAC address provided. Generated: {new_mac}")
    elif not is_valid_mac(new_mac):
        print(f"[-] Invalid MAC address format: {new_mac}. Expected format: xx:xx:xx:xx:xx:xx")
        raise SystemExit(1)

    if change_mac(interface, new_mac):
        print(f"[+] New MAC address for {interface} is {new_mac}")
        subprocess.run(["ifconfig", interface])
        print(f"[+] Verification complete for {interface}.")