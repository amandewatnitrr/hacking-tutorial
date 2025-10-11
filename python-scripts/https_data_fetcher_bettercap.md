## https_data_fetcher_bettercap.py

### Usage Scenario

This script is a crucial **all-in-one analysis tool** for penetration testers, security auditors, and system administrators. It focuses on combining a comprehensive **Passive Web Security Scan** (HTTP headers, SSL/TLS, forms, technology stack) with an **Active Network Traffic Capture** using the external utility **Bettercap**.

* **What problem does it solve?** It addresses the problem of fragmented security analysis by generating a single, structured report that correlates web application vulnerabilities (e.g., missing security headers, insecure cookies, weak SSL) with on-the-wire network intelligence (DNS queries, TCP connections). This holistic view provides crucial context often missed by static scanners.
* **Who would benefit from using it?** **Ethical Hackers/Penetration Testers** benefit by automating the initial reconnaissance and vulnerability discovery phase. **Security Engineers** use it to continuously monitor and assess the security posture of their web applications and underlying network infrastructure, receiving a prioritized **Vulnerability Score** (0-100) and **Risk Level** (LOW to CRITICAL).

---

### What the Script Does

The Python script acts as a **multi-stage security assessment engine** that integrates web analysis with network sniffing via **Bettercap**.

**The execution flow is:**

1.  **Input:** It requires a mandatory **Target HTTPS URL** (`https://...`) and a **Network Interface** (e.g., `eth0`, `wlan0`) for Bettercap.
2.  **Process - Stage 1 (Passive Web Analysis):** It fetches the URL, parses the HTML with **BeautifulSoup**, analyzes all linked resources, and performs a deep dive into the server's **security posture**. This includes checks on SSL/TLS configuration, HTTP security headers (HSTS, CSP), and cookie security attributes (`Secure`, `HttpOnly`).
3.  **Process - Stage 2 (Active Network Capture):** It spawns the external **Bettercap** process on the specified interface, actively capturing network traffic (DNS, TCP, TLS handshakes) while simultaneously generating controlled test traffic to the target. This gathers network-level intelligence.
4.  **Process - Stage 3 (Analysis and Reporting):** It aggregates all web data and network logs, calculates a **Vulnerability Score** based on proprietary rules, assigns a **Risk Level**, and compiles a final, structured report with prioritized recommendations.

**Output/Side Effects:** The script prints real-time logs and generates a timestamped, comprehensive report file (`.json`, `.csv`, or `.html`) containing all extracted data, scores, and recommendations. **Note:** Requires **root/sudo access** due to the use of Bettercap for packet capture.

---

### Code Explanation

#### Imported Libraries

| Library | Purpose |
| :--- | :--- |
| `subprocess`, `sys`, `os`, `time`, `threading` | Core utilities for managing the script's execution, handling system commands, and concurrent operations (crucial for running Bettercap simultaneously with web fetching). |
| **`requests`**, **`urllib3`** | Essential for making HTTP/HTTPS requests to the target URL and managing connection warnings (e.g., suppressing warnings for skipped SSL verification). |
| **`beautifulsoup4` (`bs4`)** | Used for parsing the HTML content of the target page, enabling extraction of links, forms, scripts, and meta tags for deeper analysis. |
| `json`, `csv`, `re`, `socket`, `ssl`, `hashlib`, `datetime`, `urllib.parse` | Standard libraries for data handling, regular expressions, network socket programming (used in `get_ssl_info`), and date/URL manipulation. |
| **`cryptography`** | Used for advanced analysis of SSL/TLS certificates, including chain validation and public key size assessment. |
| **`geoip2`** | Utilized for IP geolocation analysis of network addresses discovered during the Bettercap capture. |

#### Main Functions

| Function | Parameters | Returns | Purpose |
| :--- | :--- | :--- | :--- |
| **`fetch_https_data`** | `url`, `verify_ssl` | `dict` | Performs the passive web scan: fetches content, parses HTML, extracts all links/forms, detects technologies, and initiates security sub-analyses. |
| **`get_ssl_info`** | `hostname`, `port` | `dict` | Connects directly to the host to perform a deep SSL/TLS certificate analysis, checking for weak versions, key sizes, and expiry dates. |
| **`analyze_cookies`** | `headers` | `dict` | Parses `Set-Cookie` headers to check for security flags (`Secure`, `HttpOnly`, `SameSite`) and assigns severity to missing attributes. |
| **`analyze_csp`** | `headers` | `dict` | Parses and evaluates the Content Security Policy header, identifying the presence of dangerous directives like `unsafe-inline` or `unsafe-eval`. |
| **`start_bettercap`** | `iface` | `subprocess.Popen` | Spawns the Bettercap process with necessary modules activated (e.g., `http.proxy.sslstrip true`, `net.sniff.local true`) for network capture. |
| **`capture_traffic`** | `proc`, `target_url`, `duration`, `deep_scan` | `dict` | Reads and parses Bettercap's real-time output for the specified duration, extracting and structuring network intelligence (DNS, TCP, IP geolocation). |
| **`calculate_vulnerability_score`** | `analysis_data` | `dict` | Applies a rule-based scoring system (deducting points based on issue severity) to assign a final score (0-100) and a **Risk Level** (LOW, MEDIUM, HIGH, CRITICAL). |
| **`analyze_and_report`** | `url_data`, `network_data` | `dict` | The orchestrator function that merges all findings, calculates the score, and compiles the final, structured report with recommendations. |

#### Execution Logic

The script follows a sequential, four-step flow managed by the `main` function (`if __name__ == "__main__":`):

1.  **Initialization and Arguments:** The script first validates all command-line arguments (URL, interface) and parses optional flags like `--no-verify` and `--timeout`.
2.  **HTTPS Web Scan (Passive):** It calls `fetch_https_data()`. If the data retrieval is successful, it proceeds to perform detailed analyses on headers, cookies, CSP, and SSL/TLS configuration using the respective sub-functions.
3.  **Bettercap Capture (Active):** It attempts to start the Bettercap process via `start_bettercap()`. If successful, it enters the `capture_traffic()` phase, where it runs concurrently with the web analysis to gather network logs for the specified duration. The Bettercap process is explicitly terminated before proceeding.
4.  **Reporting and Output:** The collected `url_data` and `network_data` are passed to `analyze_and_report()`. This function generates the final vulnerability score and risk assessment. A summary is printed to the console (`print_summary`), and the full, detailed report is saved to a file using `save_report()` in the user-specified format (JSON, CSV, or HTML).
    
---

### Screenshots

![https_data_fetcher_bettercap.py running](/imgs/https_data_fetcher_bettercap.png)

![https_data_fetcher_bettercap.py running](/imgs/https_data_fetcher_bettercap1.png)

![https_data_fetcher_bettercap.py running](/imgs/https_data_fetcher_bettercap2.png)

![https_data_fetcher_bettercap.py running](/imgs/https_data_fetcher_bettercap3.png)

---

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Script as https_data_fetcher_bettercap.py
    participant OS as Operating System
    participant Bettercap
    participant TargetServer as Target HTTPS Server

    User->>Script: Execute Script <url> <iface> [options]
    Script->>Script: Parse arguments, Start scan timer

    box Analysis Phase 1: Web
        Script->>TargetServer: fetch_https_data() - HTTP Request (requests library)
        TargetServer-->>Script: HTTP Response (Headers & HTML Content)
        Script->>Script: Parse HTML (bs4), analyze headers/cookies/CSP
        Script->>TargetServer: get_ssl_info() - TLS Handshake via socket
        TargetServer-->>Script: SSL Certificate & Handshake Details
        Script->>Script: Check SSL/TLS vulnerabilities (cryptography)
    end

    box Analysis Phase 2: Network
        Script->>OS: start_bettercap() - subprocess.Popen(sudo bettercap -iface...)
        OS->>Bettercap: Launch process with necessary modules
        Bettercap-->>Script: Process Handle/Ready Status
        Script->>Script: Start capture_traffic() thread
        Script->>TargetServer: Generate controlled traffic (e.g., extra requests)
        TargetServer-->>Bettercap: Network Traffic (DNS, TCP, TLS)
        Bettercap->>Script: stdout: Real-time captured events
        Script->>Script: Process Bettercap output & perform GeoIP lookup
        Script->>OS: Terminate Bettercap process
    end

    Script->>Script: analyze_and_report()
    Script->>Script: calculate_vulnerability_score() (Assign Score/Risk Level)
    Script->>User: print_summary() to console
    Script->>OS: save_report(format=...)
    OS-->>Script: Report file saved
    Script->>User: Final confirmation and report path