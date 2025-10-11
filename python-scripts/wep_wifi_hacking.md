## wep_wifi_hacking.py

### Usage Scenario
This script is a classic example used in **ethical hacking and network security education**. Its primary utility is to demonstrate the well-known **vulnerabilities of the WEP (Wired Equivalent Privacy) encryption protocol**.

* **What problem does it solve?** It automates the complex, multi-step process required to capture enough **Initialization Vectors (IVs)** from a WEP-encrypted network to successfully crack its security key. This procedure highlights the critical weaknesses of WEP, which is a deprecated and insecure standard.
* **Who would benefit from using it?**
    * **Network Security Professionals (Penetration Testers)**: To conduct authorized security assessments on networks they own or have permission to test, validating the absence of WEP or the necessity of upgrading to WPA/WPA2/WPA3.
    * **Students and Educators**: To learn hands-on about wireless network security, packet capturing, replay attacks, and how tools from the **Aircrack-ng suite** function when orchestrated together.

---

### What the Script Does
The script orchestrates a **WEP key cracking attack** by automating the simultaneous use of several tools from the **Aircrack-ng suite** (`airodump-ng`, `aireplay-ng`, `aircrack-ng`) via Python's `subprocess` and `threading` modules.

The overall flow is:
1.  **Input:** The script requires the **wireless interface name** (e.g., `wlan0mon`) as a command-line argument.
2.  **Setup:** It puts the specified wireless interface into **monitor mode**.
3.  **Discovery:** It scans the area for nearby WEP-encrypted access points using `airodump-ng`.
4.  **Targeting:** The user interactively selects a target WEP network from the discovered list (BSSID, Channel, ESSID).
5.  **Attack Orchestration:** It starts four key processes in separate, parallel threads: **Packet Capture**, **Fake Authentication**, **ARP Replay Attack** (to generate traffic/IVs), and **Key Cracking**.
6.  **Output/Side Effects:** The main output is the **WEP encryption key** printed to the console once `aircrack-ng` successfully finds it. It creates temporary capture files (e.g., `wep_capture-01.cap`) which are actively analyzed and then cleaned up upon successful completion or termination.

---

### Code Explanation

#### Imported Libraries
| Library | Purpose |
| :--- | :--- |
| `os` | Used for basic file system interaction, primarily to **clean up** old capture files (`os.remove`) before and after the attack. |
| `subprocess` | **Crucial** for executing external command-line programs (the Aircrack-ng suite tools and system utilities like `ifconfig`) and managing their execution. |
| `re` | Used for **Regular Expressions** to parse and extract relevant information (BSSID, Channel, ESSID) from the raw text output of the `airodump-ng` scan. |
| `threading` | **Essential** for the attack to work efficiently. It enables the **concurrent execution** of multiple, independent attack steps (capture, injection, cracking) simultaneously. |
| `sys` | Used for system-level functions, mainly to read **command-line arguments** (the wireless interface name) and to exit the script gracefully. |
| `time` | Used to introduce **pauses** (`time.sleep`) in the script's execution flow, ensuring a necessary delay between starting concurrent attack threads. |

#### Main Functions
| Function | Parameters | Purpose |
| :--- | :--- | :--- |
| `set_monitor_mode` | `interface` (str) | Executes shell commands (`ifconfig`, `iwconfig`) to change the specified wireless adapter into **monitor mode**, which is required for injection and capturing. |
| `find_wep_networks` | `interface` (str) | Runs `sudo airodump-ng` for a brief period, parses the output using regex, and returns a list of **WEP-encrypted networks**. |
| `select_target` | `networks` (list) | Displays the list of discovered networks and handles the user's interactive selection of the target AP. |
| `run_airodump` | `interface`, `bssid`, `channel`, `filename` | Starts `airodump-ng` in the background to **capture IVs** for the specific target and save them to a `.cap` file. |
| `run_fake_auth` | `interface`, `bssid` | Runs `aireplay-ng --fakeauth` to establish an association with the target AP, a step often required for successful packet injection. |
| `run_arp_replay` | `interface`, `bssid` | Runs `aireplay-ng --arpreplay` to actively **inject ARP request packets**. This forces the AP to generate new IVs at a high rate, accelerating the cracking process. |
| `run_aircrack` | `filename` | Runs `aircrack-ng` in a **continuous loop** against the captured file (`filename-01.cap`). It checks the output repeatedly until the "KEY FOUND!" string is matched. |
| `main` | None | The entry point. It manages setup, discovery, target selection, and the **multi-threaded launch** and graceful termination of all attack components. |

### Execution Logic
1.  **Initialization:** The script first checks if the user provided the necessary wireless interface name as a command-line argument.
2.  **Interface Setup:** It calls `set_monitor_mode()` to prepare the wireless card.
3.  **Target Selection:** It calls `find_wep_networks()` and then `select_target()` to identify the BSSID and Channel of the network to be attacked.
4.  **Pre-Attack Cleanup:** It removes any residual capture files from previous attempts (`wep_capture-01.*`) to ensure the cracker works with fresh data.
5.  **Thread Orchestration:** This is the simultaneous launch of the attack:
    * Four `Thread` objects (`dumper`, `auth`, `arp`, `cracker`) are instantiated for the four main attack functions.
    * They are started sequentially: `dumper` $\rightarrow$ `auth` $\rightarrow$ `arp` $\rightarrow$ `cracker`, with a `time.sleep(5)` delay between some of them to ensure the packet capture and authentication have a head start.
    * The main script then calls **`cracker.join()`**, which **blocks** the main program until the `run_aircrack` thread successfully finds the key and terminates.
6.  **Termination and Cleanup:** A `try...finally` block ensures that:
    * If the key is found, or the user presses `Ctrl+C`, the `finally` block executes.
    * It uses **`sudo killall`** to forcefully stop all active `airodump-ng`, `aireplay-ng`, and `aircrack-ng` processes running in the background.
    * A final cleanup removes all remaining `.cap`, `.csv`, and related capture files.

---

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Script as wep_wifi_hacking.py
    participant OS as Operating System / Shell
    participant Aircrack as Aircrack-ng Suite

    User->>Script: Execute Script (Interface Name)
    Script->>Script: Check Arguments / Clean Old Files
    Script->>OS: Run: Set Interface to Monitor Mode
    OS-->>Script: Status: Monitor Mode Active

    Script->>Aircrack: Run: airodump-ng (Scan WEP Networks)
    Aircrack-->>Script: Scan Output (BSSIDs, Channels)
    Script->>User: Display Networks
    User->>Script: Select Target Network (BSSID, Channel)
    
    par Multi-Threaded Attack Launch
        Script->>Aircrack: Thread 1: run_airodump (Start Packet Capture)
        Script->>Aircrack: Thread 2: run_fake_auth (Authenticate to AP)
        Script->>Aircrack: Thread 3: run_arp_replay (Inject Packets / Generate IVs)
        Script->>Aircrack: Thread 4: run_aircrack (Start Cracker Loop)
    end
    
    Script->>Script: Main thread waits (cracker.join())
    
    loop Until "KEY FOUND!"
        Note over Aircrack: airodump-ng saves IVs to .cap file
        Note over Aircrack: aireplay-ng actively generates IVs
        Aircrack->>Aircrack: aircrack-ng continuously checks .cap file
    end

    Aircrack-->>Script: Key Found! (aircrack-ng output)
    Script->>User: Display WEP Key
    
    alt User Interrupt (Ctrl+C)
        User->>Script: Interrupt Execution
    end

    Script->>OS: Run: killall (Stop all Aircrack processes)
    OS-->>Script: Processes Terminated
    Script->>Script: Final File Cleanup
    Script->>OS: Exit
                  
---

### Screenshots

![wep_wifi_hacking.py running](/imgs/wep_wifi_hacking.png)