## bettercap_arp_spoofing_script.py

### Usage Scenario

This script is a tool designed for **network security assessments** and **penetration testing** in a controlled, authorized environment.

* **What problem does it solve?** It automates the process of setting up an **ARP Spoofing** attack using the powerful `bettercap` framework. This allows a security professional to test the network's resilience to **Man-in-the-Middle (MiTM)** attacks, specifically by intercepting network traffic between a target device and the network's gateway.
* **Who would benefit from using it?** **Ethical Hackers**, **Security Analysts**, and **Cybersecurity Students** would find this script valuable. It provides a quick, interactive way to practice and demonstrate MiTM techniques, network device discovery, and traffic sniffing.

---

### What the Script Does

The Python script acts as a **wrapper** and **orchestrator** for the `bettercap` tool. It provides a simplified, interactive command-line interface (CLI) to perform targeted **ARP Spoofing**.

The execution flow is:

1.  **Input:** It requires the network interface name (e.g., `eth0`, `wlan0`) as a command-line argument.
2.  **Process:** It starts `bettercap` as a background process, sends commands to discover network devices, presents the list to the user, and collects the user's choice for the **target IP(s)** and whether to enable **full-duplex spoofing**.
3.  **Output/Side Effects:** The main effect is the **execution of the `bettercap` tool**, which changes the ARP tables of the target device(s) and the gateway. The script's output is the live, streaming log of the `bettercap` session, including device discovery results and intercepted traffic logs (if any).

---

### Code Explanation

#### Imported Libraries

| Library | Purpose |
| :--- | :--- |
| `subprocess` | To start and manage external processes, specifically running the `bettercap` command. It allows the script to send input (`stdin`) and read output (`stdout`) from the tool. |
| `sys` | To handle system-specific parameters and functions, primarily for accessing command-line arguments (`sys.argv`) and exiting the script (`sys.exit`). |
| `time` | To introduce pauses (`time.sleep`) in the script's execution, giving `bettercap` time to initialize or execute a command before proceeding. |
| `threading` | To run the output reading of the `bettercap` process in a **separate thread**. This prevents the main script from blocking (freezing) while waiting for `bettercap`'s output, allowing for simultaneous input/command sending and output monitoring. |
| `re` | The regular expression module, used in the `discover_devices` function to **parse** the structured output of `bettercap`'s `net.show` command and extract device IP, MAC, and name. |

#### Main Functions

| Function | Parameters | Returns | Purpose |
| :--- | :--- | :--- | :--- |
| `start_bettercap` | `iface` (str): The network interface name. | `proc` (subprocess.Popen object) | Starts the `bettercap` process with `sudo` on the specified interface. Handles `FileNotFoundError` if `bettercap` is not installed. |
| `discover_devices` | `proc` (subprocess.Popen object) | `devices` (list of dicts) | Initiates network discovery (`net.probe on`). It reads and displays `bettercap`'s output concurrently using a thread. After user confirmation, it runs `net.show` and uses a regular expression to parse the output and return a list of discovered devices. |
| `get_user_choices` | `devices` (list of dicts) | `targets_str` (str), `fullduplex` (str) | Presents the discovered devices to the user and prompts them to select one or more targets (by index). It also asks whether to enable full-duplex ARP spoofing. Returns the selected target IPs as a comma-separated string and the boolean choice. |
| `run_attack` | `proc` (subprocess.Popen object), `targets` (str), `fullduplex` (str) | None | Constructs the final `bettercap` command (`set arp.spoof.fullduplex <val>; set arp.spoof.targets <ips>; arp.spoof on; net.sniff on`) and sends it to the running process. It then continuously reads and prints `bettercap`'s live output until the user presses `Ctrl+C`. |
| `main` | None | None | The entry point of the script. Manages the overall workflow by calling the other functions in sequence. |

#### Execution Logic

The script's execution is controlled by the `main()` function, which is called when the script is run (`if __name__ == "__main__":`).

1.  **Argument Check:** It first verifies if a network interface name was provided as a command-line argument (`sys.argv[1]`). If not, it prints the usage instructions and exits.
2.  **Start `bettercap`:** It calls `start_bettercap(iface)` to launch the tool and get the process object (`proc`). It exits if the tool fails to start.
3.  **Discover Devices:** It calls `discover_devices(proc)`. This is the interactive discovery phase where the script waits for the user to press Enter before listing the results. It exits if no devices are found.
4.  **Get User Input:** It calls `get_user_choices(devices)` to display the list of devices and prompt the user to select the target IP(s) and the ARP spoofing mode (full-duplex: `true`/`false`).
5.  **Execute Attack:** It calls `run_attack(proc, targets, fullduplex)` to send the final, constructed attack command to `bettercap`.
6.  **Monitor and Exit:** The `run_attack` function then enters an infinite loop, continuously displaying the attack's real-time output. The script only terminates when the user manually interrupts the process by pressing **`Ctrl+C`** (`KeyboardInterrupt`), which triggers the graceful termination of the `bettercap` process (`proc.terminate()`).

---

### Screenshots

![bettercap_arp_spoofing_script.py running](/imgs/bettercap_arp_spoofing_script.png)

---

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Script as Python Script (main)
    participant OS as Operating System
    participant Bettercap as bettercap Process

    User->>Script: Execute (python script.py <iface>)
    Script->>Script: Check arguments
    Script->>Script: Call start_bettercap(<iface>)
    Script->>OS: Execute: sudo bettercap -iface <iface>
    OS->>Bettercap: Start Process
    Bettercap-->>Script: Return Process Handle (proc)
    Script->>Script: Call discover_devices(proc)

    Note over Script,Bettercap: Start concurrent output reader thread
    Script->>Bettercap: Send: net.probe on
    Script->>User: Print discovery status
    User->>Script: Press Enter
    Script->>Bettercap: Send: net.probe off
    Script->>Bettercap: Send: net.show
    Bettercap-->>Script: Stream output (stdout)
    Script->>Script: Stop output thread
    Script->>Script: Parse output with regex (device_regex)
    Script-->>Script: Return devices list
    Script->>Script: Call get_user_choices(devices)
    Script->>User: Display devices list
    User->>Script: Input target indices & full-duplex choice
    Script-->>Script: Return targets_str, fullduplex
    Script->>Script: Call run_attack(proc, targets, fullduplex)
    Script->>Bettercap: Send final command (set arp.spoof...; arp.spoof on; net.sniff on)
    Bettercap-->>Script: Begin attack/sniffing and stream logs
    Script->>Script: Loop: Print bettercap output
    User->>Script: Press Ctrl+C (KeyboardInterrupt)
    Script->>Bettercap: proc.terminate()
    Script->>OS: Exit