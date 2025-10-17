# ARP Spoof Detector — Overview, Usage, Code Explanation, and Sequence Diagram

## 🛡️ What It Does (High-Level)
This Python script **sniffs ARP traffic** on the local network and detects possible **ARP spoofing attacks** by comparing MAC addresses obtained passively from sniffed ARP replies with those obtained via active ARP requests.  
If a mismatch is detected, it alerts the user to a potential spoofing attempt.

---

## 💡 Usage Scenario
- **When to Use:**  
  Use this tool on a system connected to a LAN (home, office, or lab network) to monitor for ARP spoofing or **Man-in-the-Middle (MITM)** attacks.
  
- **Why:**  
  Attackers can impersonate devices by sending false ARP responses that map their MAC address to another IP, allowing packet interception or redirection.

- **Requirements:**  
  - Python 3  
  - `scapy` library (`pip install scapy`)  
  - Root privileges (needed for sniffing packets)

- **How to Run:**
  ```bash
  sudo python3 arp_detector.py
## Sequence Diagram — ARP Spoof Detector (Code Flow)

    sequenceDiagram
    participant User
    participant Script as ARP_Script
    participant Sniffer
    participant Handler as process_packet
    participant ARPUtil as get_mac/arping
    participant Console

    User->>Script: sudo python3 arp_detector.py
    Script->>Console: Print startup messages
    Script->>Sniffer: Start sniff(store=False, prn=process_packet)
    Sniffer-->>Handler: Pass each captured packet
    Handler->>Handler: Check if packet has ARP layer and op == 2
    alt Is ARP reply
        Handler->>ARPUtil: arping(packet[ARP].psrc)
        ARPUtil-->>Handler: Return real_mac (or None)
        Handler->>Handler: response_mac = packet[ARP].hwsrc
        alt real_mac exists and real_mac != response_mac
            Handler->>Console: Print ALERT with IP, Real MAC, Fake MAC
        else
            Handler->>Console: Ignore (no alert)
        end
    else
        Handler->>Sniffer: Ignore non-ARP packets
    end
    User->>Script: Ctrl+C (stop)
    Script->>Console: Print "Detector stopped by user."
    Script->>User: Exit program



---

## 🧩 ARP Spoof Detector — Code Explanation

### 🔹 Imports
```python
from scapy.all import sniff, ARP
import sys
import subprocess
scapy.all.sniff → Used to capture network packets in real time.

scapy.all.ARP → Provides ARP protocol support for identifying ARP layers.

sys → For system exit when required.

subprocess → Used to check if the script is running with root privileges.
```
 🔹 Function: get_mac(ip) 
```python
 def get_mac(ip):
     from scapy.all import arping
     try:
         answered, _ = arping(ip, verbose=0)
         if answered:
            return answered[0][1].hwsrc
    except Exception as e:
        print(f"[-] Error getting MAC for {ip}: {e}")
    return None
```
**Purpose:**
Actively sends an ARP request to get the MAC address for a given IP address.

**Explanation:**
Uses Scapy’s arping() function to send ARP requests on the network.

**arping()** returns two lists: answered and unanswered.

If a response is received, the function extracts the MAC address from the response.

On failure, prints an error and returns None.

Notes:
Since it sends packets actively, calling this too often could cause unnecessary ARP traffic.

Used here for verification to check whether the sniffed MAC matches the real MAC.

🔹 Function: process_packet(packet)
```python

def process_packet(packet):
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
            pass
```
**Purpose:**

Checks each sniffed ARP packet to detect potential spoofing attacks.

**Explanation:**

*packet.haslayer(ARP)** — Confirms that the captured packet is an ARP packet.

*packet[ARP].op == 2** — Ensures the packet is an ARP reply ("is-at").

*real_mac = get_mac(packet[ARP].psrc)** — Actively fetches the legitimate MAC for the IP address.

*response_mac = packet[ARP].hwsrc** — Extracts the MAC address from the ARP packet’s source field.

**Comparison:**

If the MAC from the ARP reply doesn’t match the real MAC, an alert is displayed.

**Notes:**

The script ignores errors silently (pass), preventing it from crashing.

In a real-world setup, logging these errors would be more helpful.

🔹 Function: main()
```python
def main():
    print("[+] Starting ARP spoof detector...")
    print("[+] Sniffing for ARP packets. Press Ctrl+C to stop.")
    try:
        sniff(store=False, prn=process_packet)
    except KeyboardInterrupt:
        print("\n[+] Detector stopped by user.")
    except Exception as e:
        print(f"[-] An error occurred: {e}")
        print("[-] Please ensure you are running this script with root privileges.")
        print("[-] Also, make sure Scapy is installed (`pip install scapy`).")
```
**Purpose:**

Runs the packet sniffer and continuously checks for ARP spoofing packets.

**Explanation:**

Prints a startup message to the console.

*sniff()* captures packets on the network indefinitely.

*store=False* prevents memory overload by not storing packets.

*prn=process_packet* calls the process_packet() function for every sniffed packet.

*KeyboardInterrupt* allows safe termination with Ctrl+C.

Handles errors such as missing permissions or Scapy installation issues.

🔹 Root Privilege Check
```python
if __name__ == "__main__":
     if subprocess.run(["id", "-u"]).stdout.strip() != b'0':
         print("[-] This script requires root privileges. Please run it with sudo.")
         sys.exit(1)
     main()
```

**Purpose:**

Ensures the script is run with root privileges, which are required for packet sniffing.

**Issue:**

subprocess.run() doesn’t capture output unless specified.

stdout will be None, causing an error.

✅ Fixed Version:
```python
import os
if os.geteuid() != 0:
    print("[-] Please run as root (sudo).")
    sys.exit(1)
main()
```
🔹 Example Output
```less
[+] Starting ARP spoof detector...
[+] Sniffing for ARP packets. Press Ctrl+C to stop.
[!] ALERT: ARP Spoofing Detected!
[*] IP Address: 192.168.1.10
[*] Real MAC:   00:11:22:33:44:55
[*] Fake MAC:   aa:bb:cc:dd:ee:ff
```
 🔹 Improvements Suggested 

Cache MAC results: avoid calling get_mac() for every ARP reply.

Log alerts: store detected events in a file for analysis.

Add interface selection: monitor a specific network interface.

Throttle lookups: limit active ARP requests per IP per time window.

🔹 Summary

This ARP Spoof Detector monitors ARP replies on a network.
It actively validates each reply by checking if the MAC in the response matches the real MAC of the device.
If not, it raises an alert indicating potential ARP spoofing activity.
