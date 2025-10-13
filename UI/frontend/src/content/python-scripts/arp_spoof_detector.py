# ARP Spoof Detector
# This script sniffs network traffic and detects potential ARP spoofing attacks.

from scapy.all import sniff, ARP
import sys
import subprocess


def get_mac(ip):
    """
    Returns the MAC address for a given IP address by sending an ARP request.
    This function is not used in the main sniffing loop to avoid flooding,
    but it's a good utility for establishing a baseline.
    """
    from scapy.all import arping
    try:
        # arping returns a tuple of lists (answered, unanswered)
        answered, _ = arping(ip, verbose=0)
        if answered:
            return answered[0][1].hwsrc
    except Exception as e:
        print(f"[-] Error getting MAC for {ip}: {e}")
    return None

def process_packet(packet):
    """
    This function is called for each packet sniffed by Scapy.
    It checks if the packet is an ARP response and looks for anomalies.
    """
    # Check if the packet is an ARP packet and is a response ("is-at")
    if packet.haslayer(ARP) and packet[ARP].op == 2:
        try:
            real_mac = get_mac(packet[ARP].psrc)
            response_mac = packet[ARP].hwsrc

            if real_mac and real_mac != response_mac:
                print(f"[!] ALERT: ARP Spoofing Detected!")
                print(f"[*] IP Address: {packet[ARP].psrc}")
                print(f"[*] Real MAC:   {real_mac}")
                print(f"[*] Fake MAC:   {response_mac}\n")

        except Exception as e:
            # Pass on errors that might occur during sniffing
            pass

def main():
    print("[+] Starting ARP spoof detector...")
    print("[+] Sniffing for ARP packets. Press Ctrl+C to stop.")
    try:
        # Sniff indefinitely, calling process_packet for each packet
        sniff(store=False, prn=process_packet)
    except KeyboardInterrupt:
        print("\n[+] Detector stopped by user.")
    except Exception as e:
        print(f"[-] An error occurred: {e}")
        print("[-] Please ensure you are running this script with root privileges.")
        print("[-] Also, make sure Scapy is installed (`pip install scapy`).")

if __name__ == "__main__":
     if subprocess.run(["id", "-u"]).stdout.strip() != b'0':
         print("[-] This script requires root privileges. Please run it with sudo.")
         sys.exit(1)
     main()
     