
# 🛡️ Bettercap Controller (automated)

This document describes `bettercap_arp_spoofing_script_auto.py` — an automated Python controller that manages a Bettercap subprocess, discovers hosts, lets the operator select targets interactively, and then configures ARP spoofing and packet sniffing.

The README below focuses on the script's actual behavior and implementation details (parsing logic, subprocess management, and interactive workflow).

---

## Key features

- Starts Bettercap (via `sudo bettercap -iface <iface>`) and manages its stdin/stdout
- Threads stdout reading to stream live output while keeping the CLI responsive
- Strips ANSI escape codes from Bettercap output before parsing or display
- Parses discovered hosts from both log-style messages and the formatted `net.show` table
- Interactive selection of one or more targets by index
- Supports setting `arp.spoof.fullduplex` and `arp.spoof.targets` and enables `net.sniff`
- Graceful termination and basic error handling

---

## What the script does (detailed)

1. Validates that a network interface argument was provided on the command line.
2. Launches Bettercap using `sudo bettercap -iface <iface>` via `subprocess.Popen`.
   - If `bettercap` is not found the script prints an error and exits.
3. Starts a background thread that continuously reads Bettercap's stdout and appends each line to an in-memory buffer while also printing it live to the console.
4. Sends `net.probe on` to Bettercap to start host discovery; the operator can press Enter when they want to stop discovery.
5. Sends `net.probe off` and `net.show` to obtain a summary of discovered hosts, waits briefly, and then stops the background reader.
6. Parses the captured output using two complementary parsers:
   - `parse_devices_log` — searches log-style lines for endpoint detection messages and extracts IP, MAC, name and vendor (it strips ANSI codes before regex matching).
   - `parse_devices_table` — parses the box-drawn `net.show` table (rows beginning with `│`) to extract IP, MAC, name and vendor columns (also strips ANSI codes).
7. De-duplicates combined results and prints a numbered list of discovered devices.
8. Prompts the operator to select one or more devices by index (for example `0` or `1,3`) and to choose whether to enable full-duplex spoofing (`y`/`n`).
9. Sends a single Bettercap command that sets `arp.spoof.fullduplex`, `arp.spoof.targets`, enables `arp.spoof` and `net.sniff`.
10. Streams Bettercap output until the operator hits Ctrl+C; on KeyboardInterrupt the script attempts to terminate the Bettercap subprocess.

---

## Important implementation notes

- The script strips ANSI escape sequences from Bettercap output before parsing (this avoids parsing errors caused by color codes).
- Two parsing strategies are used because Bettercap output format can vary across versions: both log entries and a rendered table are supported.
- The script uses `sudo` to start Bettercap in the `start_bettercap` function. If you prefer not to run the script with sudo, adjust invocation accordingly.

---

## Usage

Run the script with Python 3 and pass the network interface name (use sudo if required by your system):

```bash
sudo python3 python-scripts/bettercap_arp_spoofing_script_auto.py <network_interface>
```

Example:

```bash
sudo python3 python-scripts/bettercap_arp_spoofing_script_auto.py wlan0
```

On start the script will show Bettercap's live output. Follow the prompts to review discovered hosts and select targets.

---

## Requirements

- Python 3.x (no third-party packages required)
- Bettercap installed and available on the PATH
- Sudo/privileged access for network interface operations

---

## Limitations and suggested improvements

- Parsing is best-effort — different Bettercap versions or localized output may require tweaks to the regex or table parsing logic.
- The script currently terminates Bettercap on KeyboardInterrupt. A safer cleanup sequence would explicitly disable `arp.spoof` before exit.
- Consider adding an explicit check for `sudo` availability and clearer instructions when running without elevated privileges.
- Add an option to save discovery results and sniffed packets to a timestamped log or pcap file.
- Optionally implement a non-interactive mode that accepts targets and fullduplex as CLI flags for automation.

---

## Safety and legal notice

This tool performs ARP spoofing and packet capture. Only run it in environments where you have explicit authorization (lab networks, VMs, or systems you own). Unauthorized use is illegal and unethical.
