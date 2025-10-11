## deauth_attack.py

### Usage Scenario

This script is a simplified tool designed to perform a basic **Wi-Fi Deauthentication Attack** using the external utility `aireplay-ng`. It is used primarily for **network security assessments** in controlled, authorized environments.

* **What problem does it solve?** It provides a quick, command-line wrapper to force a client device to disconnect from a Wi-Fi Access Point (AP). This is crucial for security testing to determine the network's resilience to **Denial-of-Service (DoS)** attacks at the Wi-Fi layer. Furthermore, it is often a prerequisite step to **capture the WPA/WPA2 4-way handshake** for offline password auditing.
* **Who would benefit from using it?** **Cybersecurity Students**, **Ethical Hackers**, and **Penetration Testers** benefit from this script. It allows for fast execution and demonstration of a fundamental wireless attack technique as part of a comprehensive security review.

---

### What the Script Does

The Python script acts as a **simple wrapper** for the powerful external command-line tool **`aireplay-ng`** (part of the Aircrack-ng suite). Its sole purpose is to execute a deauthentication attack.

The execution flow is:

1.  **Input:** It requires three pieces of information from the user: the **wireless interface name** (e.g., `wlan0mon`), the **Target MAC address** (victim client), and the **Gateway MAC address** (Access Point).
2.  **Process:** It constructs a `sudo aireplay-ng` command string with the provided inputs, setting the deauthentication count to an arbitrarily high number (`100000000`) to sustain the attack indefinitely. It then executes this command using the `subprocess.call` function.
3.  **Output/Side Effects:** The script prints status messages to the console. The main effect is the **execution of the external `aireplay-ng` tool**, which sends the deauthentication packets. The script execution remains blocked until the external process is manually stopped (usually via `Ctrl+C`).

---

### Code Explanation

#### Imported Libraries

| Library | Purpose |
| :--- | :--- |
| `os` | Imported but **not used** in the current implementation. |
| `subprocess` | **Essential.** Used to execute external system commands. It is crucial for running the non-Python utility `aireplay-ng` and waiting for its completion. |

#### Main Functions

| Function | Parameters | Returns | Purpose |
| :--- | :--- | :--- | :--- |
| `deauth_attack` | `interface` (str), `target_mac` (str), `gateway_mac` (str) | None | Constructs the `sudo aireplay-ng` command list using the three MAC/Interface parameters and executes it immediately using `subprocess.call()`. The function blocks (waits) until the command is manually terminated. |

#### Execution Logic

The script's execution begins within the `if __name__ == "__main__":` block, which is the standard entry point.

1.  **Input Collection:** The script prompts the user via the `input()` function to enter the necessary parameters: `interface`, `target_mac`, and `gateway_mac`.
2.  **Status Message:** A message is printed confirming the initiation of the attack with the provided details.
3.  **Attack Execution:** The `deauth_attack()` function is called. This function immediately executes the `aireplay-ng` command with root privileges (`sudo`).
4.  **Blocking/Waiting:** At this point, the Python script **pauses** (`subprocess.call` blocks) and waits for the `aireplay-ng` process to finish. Since the attack is set to run "infinitely," the user must manually stop the attack in the terminal (usually via **`Ctrl+C`**).
5.  **Completion:** Once the `aireplay-ng` process is terminated by the user, the script unblocks and prints the final status message: `[+] Deauthentication attack completed`.
 
---

### Screenshots

---

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Script as Python Script
    participant OS as Operating System
    participant AireplayNG as aireplay-ng Utility

    User->>Script: Execute Script
    Script->>User: Request Interface Name
    User->>Script: Provide 'wlan0mon'
    Script->>User: Request Target MAC
    User->>Script: Provide 'AA:BB:CC:DD:EE:FF'
    Script->>User: Request Gateway MAC
    User->>Script: Provide '11:22:33:44:55:66'
    
    Script->>Script: Call deauth_attack()
    Script->>OS: Execute: subprocess.call(command)
    OS->>AireplayNG: Execute: sudo aireplay-ng --deauth 100000000 ...
    
    Note over Script,AireplayNG: Script waits (blocked) for aireplay-ng to finish.
    
    AireplayNG-->>OS: Sends Deauthentication Packets to Target & AP
    
    User->>AireplayNG: Manual Termination (Ctrl+C)
    
    AireplayNG-->>OS: Process Exit
    OS->>Script: Return from subprocess.call()
    
    Script->>User: Display "[+] Deauthentication attack completed"
    Script->>OS: Exit
