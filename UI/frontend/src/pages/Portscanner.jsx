import React from 'react';
import './LessonStyles.css';

const Portscanner = () => {
  return (
    <div className="lesson-page">
      <h1>Writing a port scanner</h1>
      <div className="lesson-content">
        <section>
          <h2>Quick definitions</h2>
            <ul>
            <li><strong>IP</strong> — Internet Protocol address (IPv4/IPv6) that identifies a host.</li>
            <li><strong>Port</strong> — numeric endpoint on a host that services listen on (eg 80 for HTTP, 22 for SSH).</li>
            <li><strong>IP scanning</strong> — discover which hosts in a range are alive.</li>
            <li><strong>Port scanning</strong> — probe a host to find which ports are open.</li>
            </ul>
        </section>

        <section>
          <h2>Why learn scanning?</h2>
          <ul>
          <li>Inventory devices and services on your network.</li>
          <li>Verify firewall rules and exposure.</li>
          <li>Find misconfigurations that can be hardened.</li>
          <li>Practice defensive tooling in a lab.</li>
          </ul>
        </section>

        <section>
          <h2>High-level approach</h2>
          <ol>
          <li><strong>Discover hosts</strong> — ARP, ICMP ping sweep, or TCP/UDP probes.</li>
          <li><strong>Choose scan type</strong> — connect scan, UDP, service detection, timing adjustments.</li>
          <li><strong>Interpret results</strong> — open, closed, filtered.</li>
          </ol>

          <h2>Practical Approach</h2>
          <h3>Find your own ip</h3>
          <div className="code-block">
            <pre>ifconfig</pre>
          </div>
          
          <h4>OR</h4>

          <div className="code-block">
            <pre>ip addr show</pre>
          </div>

          <h3>Install Nmap</h3>

          <div className="code-block">
            <pre>sudo apt update <br></br>sudo apt install -y nmap</pre>
          </div>

          <h3>Nmap primer</h3>
          <p>Discover live hosts on LAN</p>
          
          <div className="code-block">
            <pre>nmap -sn [your ip address]</pre>
          </div>
          <p>-sn = host discovery only</p>   

          <h3>Full TCP port range on localhost</h3>

          <div className="code-block">
            <pre>nmap -sT -p 1-65535 127.0.0.1</pre>
          </div>
          
          <p>-sT performs full TCP handshakes</p>

          <h3>Service/version detection</h3>
          <p>Install ssh to see a real open port while testing:</p>

          <div className="code-block">
            <pre> sudo apt update <br></br> sudo apt install -y openssh-server <br></br>sudo systemctl enable --now ssh</pre>
          </div>

          <p>Now let us detect this open ssh port using nmap</p>

          <div className="code-block">
            <pre>nmap -sT -sV --top-ports 50 [your ip address]</pre>
          </div>
        </section>

        <section>
          <h2>Minimal Python probe</h2>
          <p>local_probe.py</p>
          
          <div className="code-block">
            <pre>

{`#!/usr/bin/env python3

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
print("[+] Done")`}

            </pre>
          </div>
        </section>

        <section>
          <h2>Important Notes</h2>
          <div className="warning-box">
            <h3>⚠️ Important Considerations</h3>
            <ul>
              <li><strong>Legal Use Only:</strong> Only perform scans on systems you own or have explicit written authorization to test.</li>
              <li><strong>Validate Results:</strong> Verify open ports and reported services manually to reduce false positives before acting.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portscanner;
