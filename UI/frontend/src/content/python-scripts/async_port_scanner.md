---
title: "Async Port Scanner"
slug: "async_port_scanner"
order: 3
category: "python-scripts"
prev: "network_scanner.py"
next: "asyncio_port_scanner_readme"
---

## async_port_scanner.py

### Use Case Scenario

This script is a foundation for **network reconnaissance** and **vulnerability assessment**.

* **What problem does it solve?**
    It efficiently determines which **TCP ports** are **open** on one or more target hosts. Crucially, it goes beyond a simple *open/closed* check by attempting to retrieve a **service banner** (the initial data a service sends upon connection) and then performs a basic analysis (fingerprinting) to identify the application running on that port (e.g., HTTP, SSH, MySQL).
* **Who benefits from using it?**
    1.  **Ethical Hackers / Penetration Testers:** For quickly enumerating open services on a target to narrow down potential attack vectors.
    2.  **System Administrators:** For auditing their own network security posture, ensuring only intended ports are accessible.
    3.  **Beginner Developers / Cybersecurity Students:** The script is heavily commented and uses **`asyncio`**, providing a practical, high-performance example of concurrent network programming.

---

### What the Script Does

The script executes a **concurrent TCP port scan** across a defined list of hosts and ports, reporting open ports, the grabbed banner, and the likely service running.

1.  **Input:**
    * **Targets (`--hosts` or `--hosts-file`):** A list of IP addresses or domain names.
    * **Ports (`--ports`):** A list or range of TCP ports to check (e.g., `22,80,443,1000-1024`).
    * **Parameters:** Scan configuration (e.g., `--concurrency`, `--timeout`).
2.  **Process:**
    * It uses **`asyncio`** to launch many connection attempts simultaneously, limited by the `--concurrency` setting.
    * For each open port, it attempts a basic **banner grab**. If no banner is immediately received, it attempts simple probes (e.g., an HTTP `HEAD` request or a newline `\r\n`) to provoke a response.
    * The collected banner is analyzed using pre-defined **regular expression (regex) rules** to identify the service (e.g., finding "SSH-2.0" identifies it as SSH). If no banner is available, it falls back to a standard port-to-service mapping (e.g., port 22 is SSH).
3.  **Output / Side Effects:**
    * **Standard Output (stdout):** A human-readable, single-line summary for every open port found.
    * **Optional JSON File (`--output`):** A comprehensive JSON file containing the full structured results for all ports scanned (open and closed).

---

### Code Explanation

#### Imported Libraries

| Library | Purpose |
| :--- | :--- |
| `argparse` | Used to parse command-line arguments (e.g., `--hosts`, `--ports`) for configuring the scan. |
| `asyncio` | The core library for **concurrent and asynchronous I/O operations**, enabling the scanner to handle hundreds of connections simultaneously without waiting for one to finish before starting the next. |
| `json` | Used to format and output the scan results into a structured JSON file. |
| `logging` | Provides flexible event logging (info/debug messages) to help the user monitor the scanner's internal operations. |
| `re` | **Regular Expressions** are used for the **fingerprinting** logic to match patterns within the raw service banners. |
| `datetime` | Used to timestamp the scan results. |

#### Main Functions

| Function/Method | Purpose | Parameters & Returns |
| :--- | :--- | :--- |
| `parse_port_list` | Parses a string like `"22,80,8000-8010"` into a sorted list of integer port numbers. | **Params:** `port_string` (`str`). **Returns:** `List[int]`. |
| `_fingerprint` | Analyzes a raw banner and/or port number to determine the likely service(s) running. It prioritizes regex matches on the banner. | **Params:** `port` (`int`), `banner` (`bytes`). **Returns:** `List[str]` of service names. |
| `AsyncPortScanner.__init__` | Initializes the scanner with concurrency limits, timeout, and banner read size. | **Params:** `timeout`, `concurrency`, `read_bytes`. **Returns:** `None` (constructor). |
| `AsyncPortScanner._grab_banner` | Attempts to read data from a socket stream within the defined timeout. | **Params:** `reader` (`asyncio.StreamReader`). **Returns:** `bytes` (the raw banner). |
| `AsyncPortScanner.scan_port` | **The core asynchronous scan logic.** Attempts to connect, grabs the banner (with optional probes), closes the connection, and structures the result. Handles all connection errors and timeouts. | **Params:** `host` (`str`), `port` (`int`). **Returns:** `Dict[str, Any]` (structured result for one port). |
| `AsyncPortScanner.scan_multiple`| Creates a list of `scan_port` tasks for all combinations of hosts and ports, runs them concurrently using `asyncio.gather`, and collects all results. | **Params:** `hosts` (`List[str]`), `ports` (`List[int]`). **Returns:** `List[Dict[str, Any]]`. |
| `cli` | The command-line interface entry point. Parses CLI arguments, sets up the logger, executes the scan by calling `asyncio.run(_run())`, and prints/saves the final results. | **Params:** `argv` (`Optional[List[str]]`). **Returns:** `int` (exit code). |

#### Execution Logic

The script's execution flow is managed by the standard Python entry point:

1.  **`if __name__ == "__main__":`**
    * It calls `SystemExit(cli())`, which immediately transfers control to the **`cli()`** function.
2.  **`cli()` Function Execution:**
    * **Argument Parsing:** `argparse` processes the command-line inputs (hosts, ports, settings).
    * **Host/Port Collection:** Host lists are generated from the provided arguments (`--hosts` or `--hosts-file`). Ports are parsed using `parse_port_list`.
    * **Scanner Instantiation:** An instance of `AsyncPortScanner` is created, passing the configured `timeout`, `concurrency`, and `read_bytes` settings.
    * **Asynchronous Kickoff:** The `_run` inner asynchronous function is defined, which simply calls the core scanning logic: `scanner.scan_multiple(hosts, ports)`.
    * **Blocking Start:** The line `results = asyncio.run(_run())` is the pivotal step. It starts the `asyncio` event loop and waits for the entire scan (`_run`) to complete before continuing.
    * **Result Reporting:** Once the scan is complete, the `cli()` function iterates over the `results` list. It prints a summary to the console for every port where `"open": True` was found.
    * **Output File:** If the `--output` argument was provided, the complete `results` list is serialized and saved as a JSON file.
    * **Exit:** The function returns `0`, signaling a successful exit to the operating system.

---

### Screenshots

![async_por_scanner.py running](/imgs/async_port_scanner.jpg)

---

### Sequence Diagram

This diagram illustrates the main flow of a scan operation, from user input to final output.

```mermaid
sequenceDiagram
    participant User
    participant CLI as async-port-scanner CLI (cli)
    participant ASC as AsyncPortScanner
    participant Hosts as Target Host(s)

    User->>CLI: Execute script with args (--hosts, --ports)
    CLI->>CLI: Parse arguments and load hosts/ports
    CLI->>ASC: new AsyncPortScanner(concurrency, timeout, read_bytes)
    CLI->>CLI: Define _run() (calls scan_multiple)
    CLI->>CLI: asyncio.run(_run()) (Starts Event Loop)

    loop for each Host and Port combination
        ASC->>ASC: Acquire Semaphore (limit concurrency)
        ASC->>Hosts: asyncio.open_connection(host, port)
        alt Connection Successful (Port Open)
            Hosts-->>ASC: Return (reader, writer)
            ASC->>ASC: Call _grab_banner(reader)
            ASC->>Hosts: Attempt initial read/probes (e.g., HEAD /)
            Hosts-->>ASC: Return banner data
            ASC->>ASC: _fingerprint(port, banner)
            ASC->>ASC: Close writer/connection
            ASC->>CLI: Return structured result (open: true, banner, services)
        else Connection Refused / Timeout
            ASC->>CLI: Return structured result (open: false, error)
        end
        ASC->>ASC: Release Semaphore
    end

    CLI->>CLI: Process results (print open ports to stdout)
    alt Output File Requested
        CLI->>CLI: Write all results to --output JSON file
    end
    CLI-->>User: Display output and Exit (0)