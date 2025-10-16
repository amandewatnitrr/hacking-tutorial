# IP & Port Scanning
<img src="/imgs/main.jpg" width="1920" height="1080" style="object-fit:cover;">

* **IP** stands for `Internet Protocol`. an IP address (IPv4 or IPv6) identifies a host on a network so packets can be routed to it.
* **Ports** are numeric endpoints on a host that services listen on (for example, 80 for HTTP, 22 for SSH). A single IP can host many services distinguished by port numbers.
* **IP scanning** discovers active hosts on a network (which IPs respond).
* **Port scanning** probes a specific host to determine which ports are open (which services might be reachable).
* Scanning is used by system administrators and security testers to map networks, verify firewall rules, and discover unintended exposed services. It is also a common reconnaissance step in attacks. DISCLAIMER: **only perform scans on systems you own or are explicitly authorized to test**.


---

## Why learn scanning?

* To inventory devices and services on your own network.
* To verify that firewall rules and service exposure match security policy.
* To find misconfigurations or unintended open services that could be hardened.
* To practice defensive tooling and incident response in controlled lab environments.

---

## High-level approach

1. **Discover hosts (IP discovery)**
   Methods include ARP queries on a local network, ICMP ping sweeps, and crafted TCP/UDP probes. On routed networks not under your control, many hosts will drop ICMP so discovery techniques vary.

2. **Choose scan type (port probing strategy)**

   * **Connect scan** - attempt to establish a TCP connection to the target port and observe success/failure. Simple and reliable
   * **UDP scan** - send UDP packets and infer open/closed from responses or lack thereof (slow and noisy).
   * **Version/service detection** - after finding open ports, probe them in a safe way to identify the service and version (helps prioritize fixes).
   * **Timing and stealth** - adjust probe rate and timing to reduce load or evade simplistic detection

3. **Interpret results**

   * Open ports usually indicate a listening service.
   * Filtered/closed results can mean a firewall or host that drops probes.
   * Combine scans with banner/version checks and authenticated checks (where authorized) to assess risk.
     
---

## How to scan

* this guide assumes you have Kali or Debian based VM

### 1) Find your own IP

```bash
ip addr show
```
OR
```bash
ifconfig
```

What to look for

* Pick the IPv4 address that belongs to your machine and note the subnet (e.g., `192.168.1.15/24 in the screenshot`).

![OUTPUT1](/imgs/port-scanning1.png)

---

### 2) Install nmap

What is `nmap`

* `nmap` is a widely used network scanner for host discovery, port scanning, and basic service/version detection. It's ideal for learning because it includes multiple scan modes and safe defaults.

Install 

```bash
sudo apt update
sudo apt install -y nmap
```
---

### 3) Quick nmap primer

A) Discover live hosts on your LAN

```bash
# replace 192.168.1.15/24 with the subnet you found in step 1
nmap -sn 192.168.1.15/24
```
* `-sn` = host discovery only 

![OUTPUT2](/imgs/port-scanning1.png)

B) Full port range on localhost

```bash
nmap -sT -p 1-65535 127.0.0.1
```
* `-sT` performs full TCP handshakes and is easy to understand for beginners.
* Slow but useful to see everything listening on your own machine.

![OUTPUT3](/imgs/port-scanning1.png)

### Before we proceed, install & start an SSH server so that we can see a real port open in the scan
```bash
sudo apt update
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

C) Service/version detection 
```bash
nmap -sT -sV --top-ports 50 192.168.1.15
```

* `-sV` probes services to guess software/version.

![OUTPUT4](/imgs/port-scanning1.png)

---

## 5) Minimal Python Implementation `local_probe.py`

```python
# local_probe.py
import socket, ipaddress, sys

def is_allowed_target(ip):
    try:
        addr = ipaddress.ip_address(ip)
        return addr.is_private or ip == "127.0.0.1"
    except ValueError:
        return False

target = input("Target IP (127.0.0.1 or private range): ").strip()
if not is_allowed_target(target):
    print("Refusing non-private target. Use only localhost or private IPs.")
    sys.exit(1)

ports_in = input("Enter ports (comma separated, e.g. 22,80,443): ").strip()
try:
    ports = [int(p) for p in ports_in.split(",") if p.strip()]
except ValueError:
    print("Invalid port list")
    sys.exit(1)

timeout = 0.8
for p in ports:
    if not (0 < p < 65536):
        print(f"port {p}: invalid")
        continue
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((target, p))
        print(f"port {p}: open")
    except socket.timeout:
        print(f"port {p}: filtered/timeout")
    except ConnectionRefusedError:
        print(f"port {p}: closed")
    except Exception as e:
        print(f"port {p}: error {e}")
    finally:
        s.close()
print("[+] Done")
```

---

### 6) Interpretation & next steps

* `open` = service accepted the connection
* `closed` = host reachable but no service on that port
* `filtered` = firewall or device dropped the probe

### 7) Final safety & etiquette reminders

* Get written permission to scan non‑owned systems
* Use low timing templates (`-T2`) on shared networks
* Notify admins if scanning production or shared infrastructure to avoid false alarms
* Always document scans and findings and remediate responsibly

---

