export const categories = [
  {
    id: "recon",
    label: "Recon",
    hue: "recon",
    cards: [
      { title: "Network scanner", tag: "RC.01 · nmap", command: "nmap -sV -T4 " },
      { title: "Host discovery", tag: "RC.02 · netdiscover", command: "netdiscover -i " },
      { title: "Subdomain enum", tag: "RC.03 · dnsrecon", command: "dnsrecon -d " },
    ],
  },
  {
    id: "mitm",
    label: "MITM / ARP",
    hue: "mitm",
    cards: [
      { title: "ARP spoof", tag: "MI.01 · arp-scan", command: "arp-scan -l" },
      { title: "Traffic intercept", tag: "MI.02 · bettercap", command: "bettercap -iface " },
    ],
  },
  {
    id: "sqli",
    label: "SQL injection",
    hue: "sqli",
    cards: [
      { title: "Lab login form", tag: "SQ.01 · sql-injection-lab", command: "cd sql-injection-lab && ls" },
      { title: "Payload set", tag: "SQ.02 · sqlmap", command: "sqlmap -u " },
    ],
  },
  {
    id: "binexp",
    label: "Binary exploit",
    hue: "binexp",
    cards: [
      { title: "Buffer overflow intro", tag: "BX.01 · gdb", command: "gdb " },
    ],
  },
  {
    id: "python",
    label: "Python scripting",
    hue: "python",
    cards: [
      { title: "Hash function demo", tag: "PY.01 · hash-function", command: "cd python-scripts/hash-function && ls" },
      { title: "Symmetric encryption", tag: "PY.02 · symmetric-encryption", command: "cd python-scripts/symmetric-encryption && ls" },
      { title: "Fake webpage", tag: "PY.03 · fake-webpage", command: "cd python-scripts/fake-webpage && ls" },
      { title: "MAC address change", tag: "PY.04 · mac-address-change", command: "cd python-scripts && python3 mac-address-change.py" },
    ],
  },
]
