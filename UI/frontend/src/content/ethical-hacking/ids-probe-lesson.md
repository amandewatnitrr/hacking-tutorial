---
title: "IDS Probe — Lesson & How-To"
slug: "ids-probe-lesson"
order: 12
category: "ethical-hacking"
prev: "lesson-phising-toolkit"
next: "binary-exploitation"
---

# IDS Probe — Lesson & How-To

<!-- TOC -->

- [IDS Probe — Lesson & How-To](#ids-probe---lesson--how-to)
  - [What is this script?](#what-is-this-script)
  - [Why we need it](#why-we-need-it)
  - [Safety & legal note (read first)](#safety--legal-note-read-first)
  - [Files this lesson refers to](#files-this-lesson-refers-to)
  - [High-level overview — how it works](#high-level-overview---how-it-works)
  - [Example alert format](#example-alert-format)
  - [Demo setup (beginner-friendly walkthrough)](#demo-setup-beginner-friendly-walkthrough)
    - [Step 1 — Create and prepare a Multipass VM](#step-1--create-and-prepare-a-multipass-vm)
    - [Step 2 — Inside VM: set up environment](#step-2--inside-vm-set-up-environment)
    - [Step 3 — Start the IDS probe](#step-3--start-the-ids-probe)
    - [Step 4 — Run a simple HTTP server](#step-4--run-a-simple-http-server)
    - [Step 5 — From your host: trigger test requests](#step-5--from-your-host-trigger-test-requests)
    - [Step 6 — View and copy alerts.json](#step-6--view-and-copy-alertsjson)
  - [Troubleshooting (common issues & fixes)](#troubleshooting-common-issues--fixes)
  <!-- /TOC -->

---

## What is this script?

`ids_probe.py` is a **small, educational Intrusion Detection System (IDS) probe** written in Python using [Scapy].
It listens for IPv4/TCP packets and writes simple JSON alerts to `alerts.json` when it detects:

- suspicious HTTP `User-Agent` headers (examples: `sqlmap`, `nikto`, `curl`, `wget`)
- port-scan–like bursts (many destination ports from one source in a short time)

The goal is **learning** — to show how detection works in a single, simple file.

---

## Why we need it

- IDS tools provide _early warning_ for suspicious network activity.
- This script helps you **understand** what happens under the hood.
- It’s ideal for learning, small demos, or Hacktoberfest-style beginner contributions.

---

## Safety & legal note (read first)

> ⚠️ Run this only on networks and systems you own or where you have explicit permission.
> Packet sniffing requires `sudo` (root) privileges.
> Misuse could be illegal — this is **educational only**.

---

## Files this lesson refers to

- `python-scripts/ids_probe.py` — the IDS probe script.
- `python-scripts/alerts.json` — alert output file created automatically.

---

## High-level overview — how it works

1. **Capture** packets using Scapy.
2. **Detect patterns**:
   - Unusual `User-Agent` headers (often used by scanners/tools)
   - Too many different destination ports from one source (possible port scan)
3. **Alert**:
   - Print a short message in the terminal.
   - Append a JSON object (with timestamp, src/dst, etc.) to `alerts.json` (NDJSON format).

---

## Example alert format

Each alert is written as one line of JSON (NDJSON). Example:

```json
{
  "type": "suspicious_user_agent",
  "summary": "Suspicious User-Agent 'sqlmap/1.0' from 172.28.208.1",
  "src_ip": "172.28.208.1",
  "dst_ip": "172.28.220.131",
  "dst_port": 8000,
  "user_agent": "sqlmap/1.0",
  "detected_at": "2025-10-07T13:31:23.388198Z"
}
```

---

# Demo setup (beginner-friendly walkthrough)

Here’s how to run a safe local demo using **Multipass (Ubuntu VM)**. You’ll open **three terminals** — one for each task (the IDS, the HTTP server, and your host commands).

---

## Step 1 — Create and prepare a Multipass VM

Run on your **host** (Windows / Linux / Mac):

```bash
# Create a small Ubuntu VM
multipass launch --name ids-test --memory 2G --disk 10G

# Open an interactive shell inside the VM
multipass shell ids-test
```

---

## Step 2 — Inside VM: set up environment

Once inside the VM shell, run:

```bash
# Update package list and install Python tools (if not already installed)
sudo apt update && sudo apt install -y python3 python3-pip python3-venv

# Create the project folder where the script will live
mkdir -p ~/hacking-tutorial/python-scripts
cd ~/hacking-tutorial/python-scripts

# (Optional) If you transferred ids_probe.py into /home/ubuntu, move it into the project folder:
# mv /home/ubuntu/ids_probe.py ~/hacking-tutorial/python-scripts/ids_probe.py

# Create and activate a Python virtual environment (inside project)
python3 -m venv venv
source venv/bin/activate

# Upgrade pip and install runtime dependencies
pip install --upgrade pip
pip install scapy requests
```

Notes:

- Using a virtual environment keeps dependencies isolated from the system Python.
- Scapy sometimes requires root to sniff packets — we'll run the script with `sudo` in Step 3.

---

## Step 3 — Start the IDS probe (Window A — keep this open)

In Window A (VM shell that will run the IDS):

```bash
cd ~/hacking-tutorial/python-scripts

# Run the IDS with sudo but use the venv python binary (keeps environment clean)
# This preserves PATH so the venv Python is used while still giving root privileges for packet sniffing.
sudo env "PATH=$PATH" ~/hacking-tutorial/python-scripts/venv/bin/python ids_probe.py
```

You should see output similar to:

```
Starting tiny IDS probe. Alerts will be written to: alerts.json
Press Ctrl+C to stop. Run only on authorized networks.
```

Keep this window open — it prints live alerts and appends to `alerts.json`.

---

## Step 4 — Run a simple HTTP server (Window B — keep this open)

Open Window B (a second VM shell) and run:

```bash
multipass shell ids-test   # open a second shell if not already open
cd ~/hacking-tutorial/python-scripts
python3 -m http.server 8000 --bind 0.0.0.0
```

You should see:

```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

Keep this window open — it logs incoming HTTP GETs and is the target for our test requests.

---

## Step 5 — From your host: trigger test requests (Window C)

On your host machine (PowerShell or terminal), run:

```powershell
# Find VM IP address (on host)
multipass info ids-test | Select-String -Pattern IPv4

# Replace <VM_IP> below with the printed IP (example shown)
$VM_IP = "172.28.220.131"

# Normal request (no alert expected)
curl.exe -4 "http://$VM_IP:8000/"

# Suspicious request that should trigger a User-Agent alert
curl.exe -4 -H "User-Agent: sqlmap/1.0" "http://$VM_IP:8000/"
```

If you are on macOS / Linux just use `curl` instead of `curl.exe`.

Return to Window A (IDS) — you should see a console alert and an entry appended to `alerts.json`.

---

## Step 6 — View and copy alerts.json

In the VM (Window A or a new shell):

```bash
cd ~/hacking-tutorial/python-scripts

# View alerts written by the IDS (NDJSON lines)
sudo cat alerts.json
```

Example NDJSON line:

```
{"type":"suspicious_user_agent","summary":"Suspicious User-Agent 'sqlmap/1.0' from 172.28.208.1","src_ip":"172.28.208.1","dst_ip":"172.28.220.131","dst_port":8000,"user_agent":"sqlmap/1.0","detected_at":"2025-10-07T13:31:23.388198Z"}
```

To copy the file to your Windows host for screenshots or later review:

```powershell
# Run on the host
multipass transfer ids-test:/home/ubuntu/hacking-tutorial/python-scripts/alerts.json C:\Users\<YourName>\Desktop\alerts.json
```

If `alerts.json` is owned by `root` and transfer fails, change ownership inside VM before transfer:

```bash
sudo chown ubuntu:ubuntu alerts.json
```

---

## Troubleshooting (common issues & fixes)

**Permission denied when starting IDS**

→ Run with sudo as shown:

```bash
sudo env "PATH=$PATH" ~/hacking-tutorial/python-scripts/venv/bin/python ids_probe.py
```

**No alerts appear**

→ Confirm the HTTP server logged the GET. If the server logged the GET but IDS didn't: run a packet capture in VM to verify payload reached the interface:

```bash
sudo tcpdump -A -s 0 'tcp port 8000' -c 8
```

**alerts.json not visible on host**

→ The file is inside the VM; use `multipass transfer` (see Step 6) to copy it.

**alerts.json owned by root and won't copy**

→ Change ownership inside VM before transfer:

```bash
sudo chown ubuntu:ubuntu alerts.json
```

**curl error: "No host part"**

→ Ensure `$VM_IP` is set correctly and your URL is `http://$VM_IP:8000/` (not just `http:///`).

**Multipass mounts fail on Windows**

→ Use `multipass transfer` instead; enabling mounts requires extra host configuration.

---

## Final notes

This lesson is intentionally small and focused. If you'd like, I can:

- Review or lint the `ids_probe.py` script itself.
- Add comments inside the script explaining each detection step.
- Extend alerts to include lossless PCAP logging or CSV output.

Tell me which improvement you'd like next.
