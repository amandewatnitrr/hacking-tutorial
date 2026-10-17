# Program to switch a wireless adapter between monitor and managed mode

import re
import subprocess
import argparse


def list_wireless_interfaces():
    try:
        output = subprocess.run(["iwconfig"], capture_output=True, text=True).stdout
    except FileNotFoundError:
        print("[-] iwconfig not found. Install wireless-tools (e.g. apt install wireless-tools).")
        return []

    interfaces = []
    for block in output.split("\n\n"):
        lines = block.strip().splitlines()
        if not lines:
            continue
        first_line = lines[0]
        if "no wireless extensions" in first_line:
            continue
        name = first_line.split()[0]
        if name:
            interfaces.append(name)
    return interfaces


def current_mode(interface):
    try:
        output = subprocess.run(["iwconfig", interface], capture_output=True, text=True).stdout
    except FileNotFoundError:
        return None
    match = re.search(r"Mode:(\S+)", output)
    return match.group(1) if match else None


def kill_interfering_processes():
    print("[*] Killing processes that may interfere (airmon-ng check kill)...")
    subprocess.run(["sudo", "airmon-ng", "check", "kill"])


def set_mode(interface, mode):
    print(f"[+] Switching {interface} to {mode} mode")
    if subprocess.run(["sudo", "ifconfig", interface, "down"]).returncode != 0:
        print(f"[-] Failed to bring down interface {interface}. Check the interface name and permissions.")
        return False

    if mode == "monitor":
        kill_interfering_processes()

    if subprocess.run(["sudo", "iwconfig", interface, "mode", mode]).returncode != 0:
        print(f"[-] Failed to set mode. Your adapter/driver may not support {mode} mode.")
        subprocess.run(["sudo", "ifconfig", interface, "up"])
        return False

    if subprocess.run(["sudo", "ifconfig", interface, "up"]).returncode != 0:
        print(f"[-] Failed to bring up interface {interface}. You may need to run: sudo ifconfig {interface} up")
        return False

    print(f"[+] {interface} is now in {mode} mode")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Switch a wireless adapter between monitor and managed mode.")
    parser.add_argument("-i", "--interface", dest="interface", help="Wireless interface to switch (e.g. wlan0)")
    parser.add_argument("-m", "--mode", dest="mode", choices=["monitor", "managed"], help="Target mode")
    args = parser.parse_args()

    interface = args.interface
    if not interface:
        available = list_wireless_interfaces()
        if available:
            print("[*] Wireless interfaces found:")
            for iface in available:
                mode = current_mode(iface)
                print(f"    - {iface}" + (f" (currently {mode})" if mode else ""))
        else:
            print("[*] No wireless interfaces auto-detected — enter the name manually if you know it.")
        interface = input("Enter the wireless interface name (e.g., wlan0): ").strip()

    if not interface:
        print("[-] Interface name cannot be empty.")
        raise SystemExit(1)

    mode = (args.mode or input("Switch to monitor or managed mode? [monitor/managed]: ").strip().lower())

    if mode not in ("monitor", "managed"):
        print(f"[-] Invalid mode: {mode}. Expected 'monitor' or 'managed'.")
        raise SystemExit(1)

    if set_mode(interface, mode):
        subprocess.run(["iwconfig", interface])
        print(f"[+] Verification complete for {interface}.")
