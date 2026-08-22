import os
import time
import datetime
import scapy.all as scapy

SCAN_INTERVAL = 10  # seconds between scans


def scan(ip):
    # Create ARP Request/Object
    arp_request = scapy.ARP(pdst=ip, op=1)
    # Create Ethernet frame with broadcast MAC
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    # Combine Ethernet frame and ARP request
    arp_request_broadcast = broadcast / arp_request
    # Send Packet and receive response
    answered, unanswered = scapy.srp(arp_request_broadcast, timeout=2, verbose=False)

    clients = []
    for _, received in answered:
        clients.append({"ip": received.psrc, "mac": received.hwsrc})
    return clients


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def print_table(devices):
    ip_width = max([len("IP Address")] + [len(d["ip"]) for d in devices.values()])
    mac_width = max([len("MAC Address")] + [len(d["mac"]) for d in devices.values()])

    header = f"| {'IP Address'.ljust(ip_width)} | {'MAC Address'.ljust(mac_width)} |"
    separator = f"+{'-' * (ip_width + 2)}+{'-' * (mac_width + 2)}+"

    print(separator)
    print(header)
    print(separator)
    for device in devices.values():
        print(f"| {device['ip'].ljust(ip_width)} | {device['mac'].ljust(mac_width)} |")
    print(separator)
    print(f"Devices found: {len(devices)}")


def continuous_scan(ip_range):
    # Keyed by MAC so a device keeps its row even if its IP changes (DHCP lease renewal)
    devices = {}

    while True:
        clients = scan(ip_range)
        new_devices_found = False

        for client in clients:
            mac = client["mac"]
            if mac not in devices or devices[mac]["ip"] != client["ip"]:
                devices[mac] = client
                new_devices_found = True

        clear_screen()
        print(f"Network Scanner — target: {ip_range}")
        print(f"Last scan: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Next scan in {SCAN_INTERVAL}s (Ctrl+C to stop)\n")

        if devices:
            print_table(devices)
        else:
            print("No devices found yet...")

        if new_devices_found:
            print("\n[+] New device(s) detected and added to the table above.")

        time.sleep(SCAN_INTERVAL)


if __name__ == "__main__":
    input_ip = input("Enter the IP to scan: ")
    # Append /24 to the IP address to scan the entire subnet
    input_ip = input_ip + "/24"
    try:
        continuous_scan(input_ip)
    except KeyboardInterrupt:
        print("\nStopping network scanner.")
