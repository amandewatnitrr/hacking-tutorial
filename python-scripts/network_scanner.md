# Network Scanner Script — Documentation

## Usage scenario
- Quick discovery of devices on a local network (home, lab, small office) when you have shell access and `netdiscover` installed.
- Useful for network inventory, troubleshooting connectivity issues, or finding active hosts before authorized testing.
- Run on a machine with root privileges (the script expects elevated permissions).
- **Do not** scan networks you do not own or have explicit permission to scan — obtain authorization first.

## What it does
- Prompts the user for a network interface (e.g., `eth0`, `wlan0`) and an IP range (e.g., `192.168.1.0/24`).
- Checks (attempts to) whether the script is running with root privileges and exits if not.
- Builds and executes the command `sudo netdiscover -i <interface> -r <ip_range>` as a subprocess.
- Streams `netdiscover`'s real-time ARP discovery output to the terminal so you can see discovered hosts.
- Handles common interruptions and errors:
  - Gracefully stops on `Ctrl+C` (KeyboardInterrupt).
  - Prints an informative message if `netdiscover` is not installed.
  - Reports unexpected exceptions.


## Code Explanation

- ### Top-level purpose
This Python script wraps the external command-line tool `netdiscover` to perform ARP/network discovery on a given interface and IP range.

- ### Components & flow
  1. Imports:
   - `subprocess` for running shell commands.
   - `sys` for exiting the program.

  2. network_scanner(interface, ip_range):
   - Builds the command list: ["sudo", "netdiscover", "-i", interface, "-r", ip_range]
   - Prints start messages to the console.
   - Starts the command as a subprocess using subprocess.Popen(command).
   - Waits for the process to finish with process.wait().
   - Handles:
     - KeyboardInterrupt (Ctrl+C) to allow graceful stop.
     - FileNotFoundError to detect missing `netdiscover` binary and print install suggestions.
     - Generic Exception to report unexpected errors.
  
  3. __main__ guard:
   - Attempts to check whether the script is running as root using:
       subprocess.run(["id", "-u"]).stdout.strip() != b'0'
     However, this check is flawed because subprocess.run by default does not capture stdout. As written, `.stdout` will be `None` and accessing `.strip()` raises an AttributeError in many Python versions.
   - Prompts the user for network interface and IP range.
   - Validates that the IP range is not empty and then calls network_scanner().

- ### Important notes and suggested fixes
- Root check fix:
    Use `subprocess.run(["id", "-u"], capture_output=True, text=True).stdout.strip() != '0'`
  or simpler:
    `import os` then `if os.geteuid() != 0: ...`
- subprocess.Popen without redirected I/O:
    - Current code launches `netdiscover` with inherited stdio, which is fine if you want interactive real-time output in the terminal.
    - If you want to capture and process output in Python, pass stdout=subprocess.PIPE and iterate over process.stdout.
- Using "sudo" inside the `command` list:
    - If the script is already run with sudo/root, prefacing with "sudo" is redundant. If you want to always run `netdiscover` as root, ensure the script itself checks for root and either re-invokes with sudo or exits with an instructive message.
- Input validation:
    - The script asks for interface and range but does not validate their formats. Consider simple checks for non-empty interface and a naive CIDR pattern for the range.
- Error handling:
    - The `except FileNotFoundError` will catch if `sudo` or `netdiscover` is not found. The user message suggests how to install `netdiscover` on Debian/Kali systems.

### Example corrected root check (recommended)
Use:
```python
import os
if os.geteuid() != 0:
    print("[-] This script requires root privileges. Please run it with sudo.")
    sys.exit(1)

```
---

## Sequence diagram 

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Script
    participant OS
    participant Netdiscover as netdiscover process

    User->>Script: Run script (python script.py)
    Script->>OS: Check UID (is script root?)
    OS-->>Script: UID returned
    alt not root
        Script->>User: Print "requires root" and exit
    else root
        Script->>User: Prompt "Enter interface"
        User-->>Script: Provide interface
        Script->>User: Prompt "Enter IP range"
        User-->>Script: Provide IP range
        Script->>Script: Build command ["sudo","netdiscover","-i",iface,"-r",range]
        Script->>OS: Spawn subprocess (Popen) to run command
        OS->>Netdiscover: start netdiscover
        Netdiscover-->>User: Streamed scan output (ARP results)
        loop scanning
            Netdiscover-->>Script: prints to stdout (inherited terminal)
        end
        alt user presses Ctrl+C
            User->>Script: KeyboardInterrupt (SIGINT)
            Script->>Netdiscover: receive signal / user terminates
            Script-->>User: Print "Scan stopped by user."
        else netdiscover finishes normally
            Netdiscover-->>Script: process exit
            Script-->>User: end
        end
    end
