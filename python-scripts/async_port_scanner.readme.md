# Asynchronous Port Scanner (Simple)

A small, educational port scanner written in Python that demonstrates:

- **Asynchronous networking** using `asyncio` (no external dependencies). 
- **Banner grabbing**: reading the short messages services often send when you connect.
- **Basic service fingerprinting**: using simple pattern matches to guess common services (HTTP, SSH, SMTP, MySQL, etc.).

> **Warning:** Only scan hosts/networks you own or are authorized to test.

---

## What it does (short)

The scanner connects to one or more hosts and ports concurrently, attempts to read service banners, and applies simple rules to identify likely services. It prints open ports with any banners and guessed service names.

---

## Key concepts (basic)

### asyncio in Python

`asyncio` is Python's built-in framework for asynchronous I/O. It lets you run many network operations concurrently without threads by using `async` functions and an event loop. This is ideal for port scanning because connections spend most of their time waiting for network I/O.

### Banner grabbing

When you connect to some services (SSH, SMTP, FTP, etc.), they immediately send a short "banner"—a line or two identifying the software. Banner grabbing reads that initial data (or sends a lightweight probe like an HTTP `HEAD`) to get identifying information.

### Basic service fingerprinting

Fingerprinting uses simple pattern matching (e.g., regular expressions) on the banner text to guess the running service. If no banner is present, the scanner falls back to a common port-to-service mapping (e.g., port 22 → SSH) as a heuristic.

---

## How the code performs these three things

Below is a brief explanation of how the repository's code implements each feature. Function and variable names refer to the example `port_scanner.py` / `async_port_scanner.py` implementation.

### 1) Asynchronous scanning (`asyncio`)

- The scanner defines asynchronous functions (coroutines) using `async def`, for example `scan_port` and `scan_multiple`.
- Network I/O uses `asyncio.open_connection(...)` (returns `reader`/`writer`) so TCP connects and reads do not block the whole program.
- A semaphore (`asyncio.Semaphore`) limits the maximum number of concurrent connections (default: 200) to avoid exhausting file descriptors or overwhelming the local machine.
- The top-level runner uses `asyncio.gather(...)` and `asyncio.run(...)` to schedule and run many scan coroutines concurrently and wait for all of them to complete.

**Why this matters:** using `asyncio` allows thousands of short-lived network operations to run efficiently in a single process without the overhead of threads or processes.

### 2) Banner grabbing

- After a successful TCP connect, the scanner attempts a passive read from the remote service using a helper like `_grab_banner(reader)` which calls `await reader.read(n)` within a timeout.
- For common HTTP ports (80, 8080, etc.) the scanner actively sends a lightweight `HEAD` request (e.g., `HEAD / HTTP/1.0
Host: localhost

`) and then reads the response. This coerces many HTTP servers to return headers.
- As a last-ditch probe the scanner may send a newline (`
`) to prompt text-based services to respond.
- Banner bytes are decoded safely (e.g., `.decode('utf-8', errors='replace')`) for human-readable output and stored in the scan result.

**Why this matters:** banners often contain product names and versions that are quick to parse and rarely require complex protocol handling.

### 3) Basic service fingerprinting

- The scanner contains a small set of compiled regular expressions (`FINGERPRINTS`) that are matched against the raw banner bytes (patterns are compiled with `rb"..."` for byte matching and `re.I` for case-insensitive matching).
- The fingerprinting function (e.g., `_fingerprint(port, banner)`) checks these regexes first and, if any match, returns friendly service names like `HTTP`, `SSH`, `SMTP`, `MySQL`, `RDP`.
- If no banner matched, the function falls back to a port-to-service map (`PORT_SERVICE_MAP`) which provides likely service names based on conventional ports (a heuristic only).
- The scanner returns one or more candidate service names per open port; these should be treated as best guesses, not authoritative identifications.

**Why this matters:** simple regex fingerprinting is fast and effective for many cases; it also provides a clean base to expand with more signatures or a signature database (e.g., inspired by nmap's probes).

---

## Usage (example)

```bash
python port_scanner.py --hosts 127.0.0.1 --ports 22,80,443
```

This will scan the listed ports on `127.0.0.1`, print open ports, any banners, and a guessed service name.

---

## Notes

- This is an educational tool — not a production scanner.
- For encrypted services (HTTPS, IMAPS), consider using a TLS handshake to inspect certificates instead of expecting plaintext banners.
- Improve fingerprinting by adding more patterns or using protocol-specific probes for UDP/TCP services.

---

---

## When it can be used

This scanner is intended for **educational, testing, and inventory purposes**. Typical legitimate uses include:

- **Network inventory**: discover which services are running on known hosts in your lab or datacenter.
- **Authorized penetration testing**: as a quick initial reconnaissance step when you have written permission from the network owner.
- **Classroom / learning environments**: teach students how network services respond, how banner grabbing works, and how to interpret results.
- **Automated CI checks for dev/staging**: detect unintended services exposed in test environments (e.g., accidental database ports left open).
- **Debugging**: quickly check whether a service is listening and what banner it advertises during development.

Avoid using this tool on networks you do not own or without explicit authorization. Improper use can trigger alerts, violate acceptable use policies, or be illegal.

---

## Final code flow (high-level)

Below is the high-level sequence the scanner follows when executed:

1. **CLI parsing**: the script parses command-line arguments (`--hosts`, `--ports`, `--concurrency`, `--timeout`, `--output`, `--verbose`).
2. **Host & port expansion**: hosts are read from `--hosts` or `--hosts-file`; the port expression (e.g., `1-1024,8080`) is parsed into a concrete list of integers.
3. **Scanner initialization**: an `AsyncPortScanner` instance is created with the chosen `timeout`, `concurrency`, and `read_bytes` settings.
4. **Task creation**: for every host × port pair a coroutine task is prepared by calling `scan_port(host, port)` (these are scheduled but respect the scanner's semaphore when actually running).
5. **Concurrent execution**: `asyncio.gather(...)` runs all scheduled `scan_port` coroutines concurrently, and a semaphore limits how many connections run at once.
6. **Per-port behavior (`scan_port`)**:
   - Acquire semaphore to respect concurrency limits.
   - Attempt `asyncio.open_connection(host, port)` within the configured timeout.
   - If connect fails or times out, record the error/closed state and proceed.
   - On connect success:
     - Try a passive read for an immediate banner via `_grab_banner(reader)`.
     - If no banner and the port looks like HTTP, send a lightweight `HEAD` probe and read again.
     - If still no banner, send a newline to coax some services.
     - Close the connection cleanly.
     - Decode and store the banner (if any).
     - Run `_fingerprint(port, banner)` to produce candidate service labels.
7. **Collect results**: when all tasks complete, `scan_multiple` returns a list of result dicts for every host/port scanned.
8. **Output**: the CLI prints a concise one-line summary for each open port (host:port open -> services=... banner=...), and optionally writes the full results list to JSON if `--output` was supplied.

This flow favors safety (timeouts, semaphore), clarity (structured result dicts), and extensibility (separate fingerprinting and probing logic).

---

License: MIT

