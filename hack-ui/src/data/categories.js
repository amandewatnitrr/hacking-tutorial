export const categories = [
  {
    id: "recon",
    label: "Recon",
    hue: "recon",
    cards: [
      {
        title: "Network scanner",
        tag: "RC.01 · nmap",
        description: "Scan a host or subnet for open ports, running services, and versions.",
        command: "nmap -sV -T4 ",
      },
      {
        title: "Host discovery",
        tag: "RC.02 · netdiscover",
        description: "Sweep the local network to find live hosts and their MAC addresses.",
        command: "netdiscover -i ",
      },
      {
        title: "Subdomain enum",
        tag: "RC.03 · dnsrecon",
        description: "Enumerate subdomains and DNS records for a target domain.",
        command: "dnsrecon -d ",
      },
      {
        title: "Monitor mode toggle",
        tag: "RC.04 · monitor-mode-toggle",
        description: "Switch a wireless adapter between monitor mode and managed mode.",
        command: "cd python-scripts && python3 monitor-mode-toggle.py",
      },
    ],
  },
  {
    id: "mitm",
    label: "MITM / ARP",
    hue: "mitm",
    cards: [
      {
        title: "ARP spoof",
        tag: "MI.01 · arp-scan",
        description: "Map devices on the LAN by MAC and IP before staging an ARP spoof.",
        command: "arp-scan -l",
      },
      {
        title: "Traffic intercept",
        tag: "MI.02 · bettercap",
        description: "Run a man-in-the-middle session to sniff and manipulate live traffic.",
        command: "bettercap -iface ",
      },
    ],
  },
  {
    id: "sqli",
    label: "SQL injection",
    hue: "sqli",
    cards: [
      {
        title: "Lab login form",
        tag: "SQ.01 · sql-injection-lab",
        description: "Open the local vulnerable login form used for SQL injection practice.",
        command: "cd sql-injection-lab && ls",
      },
      {
        title: "Payload set",
        tag: "SQ.02 · sqlmap",
        description: "Automate detection and exploitation of SQL injection against a URL.",
        command: "sqlmap -u ",
      },
    ],
  },
  {
    id: "binexp",
    label: "Binary exploit",
    hue: "binexp",
    cards: [
      {
        title: "Buffer overflow intro",
        tag: "BX.01 · gdb",
        description: "Debug a binary to find and craft a stack buffer overflow.",
        command: "gdb ",
      },
    ],
  },
  {
    id: "crypto",
    label: "Crypto / Hashing",
    hue: "crypto",
    cards: [
      {
        title: "Hash function demo",
        tag: "CR.01 · hash-function",
        description: "Hash sample input with common algorithms to compare digests and collisions.",
        command: "cd python-scripts/hash-function && ls",
      },
      {
        title: "Symmetric encryption",
        tag: "CR.02 · symmetric-encryption",
        description: "Encrypt and decrypt sample data with a symmetric cipher to see key handling.",
        command: "cd python-scripts/symmetric-encryption && ls",
      },
    ],
  },
  {
    id: "socialeng",
    label: "Social Engineering",
    hue: "socialeng",
    cards: [
      {
        title: "Fake webpage",
        tag: "SE.01 · fake-webpage",
        description: "Serve a cloned login page locally to demonstrate credential phishing.",
        command: "cd python-scripts/fake-webpage && ls",
      },
    ],
  },
  {
    id: "spoof",
    label: "Spoofing / Evasion",
    hue: "spoof",
    cards: [
      {
        title: "MAC address change",
        tag: "SP.01 · mac-address-change",
        description: "Change a network interface's MAC address to evade device fingerprinting.",
        command: "cd python-scripts && python3 mac-address-change.py",
      },
    ],
  },
]
