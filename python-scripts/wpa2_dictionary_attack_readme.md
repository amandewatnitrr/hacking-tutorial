# WPA/WPA2 Dictionary Attack Automation

An educational workflow that demonstrates how to capture a WPA/WPA2 four-way handshake and perform an offline dictionary attack using the aircrack-ng toolkit in a controlled, authorized environment.

> **Warning:** Use strictly on networks you own or have explicit written permission to test. Deauthentication and password cracking are intrusive operations.

---

## What WPA and WPA2 Are

| Protocol | Cipher/Integrity | Handshake | Typical Modes | Key Points |
|----------|-----------------|-----------|---------------|------------|
| **WPA**  | TKIP / MIC      | 4-way     | Personal & Enterprise | Transitional upgrade from WEP (2003); no longer recommended for new deployments. |
| **WPA2** | AES-CCMP        | 4-way     | Personal (PSK) & Enterprise (802.1X/EAP) | Industry baseline since 2004; secure with strong PSK or unique 802.1X credentials. |

*WPA replaced WEP by introducing TKIP and a 4-way handshake but retained compatibility trade-offs that modern attackers can exploit. WPA2 standardized AES-CCMP, still uses the 4-way handshake, and is secure when configured with strong passphrases or WPA2-Enterprise. Capturing that handshake allows offline guessing; long, random passwords or per-user credentials mitigate this risk.*

---

## System Architecture

The diagram illustrates the end-to-end sequence: interface setup, handshake capture, optional deauth, file verification, and offline cracking.

![WPA/WPA2 Flow](images/wpa_dictionary_attack_flow.jpg)

---

## Live Demonstrations

- **Aircrack-ng cracking session** – shows dictionary attack progress and recovered keys:

![Crack Demo](images/wpa_wpa2op.jpg)

- **Capture workflow** – interface setup, deauth prompt, handshake monitoring:

![Capture Demo](images/wpa_wpa2_2op.jpg)

---

## Requirements

- Linux system with wireless adapter supporting monitor mode.  
- Aircrack-ng suite (`airodump-ng`, `aireplay-ng`, `aircrack-ng`).  
- Python 3.x if you use the automation script (steps can be run manually).  
- Sudo privileges for interface configuration.  
- Wordlist of candidate passwords for offline cracking.


---

## Usage Overview

1. **Select Interface & Target**  
   Provide wireless interface (e.g., `wlan0`), target BSSID, and channel.

2. **Enable Monitor Mode**  
   Script (or manual commands) sets interface to monitor mode (`airmon-ng`, `iwconfig`).

3. **Capture Handshake**  
   `airodump-ng` writes a capture file while watching for the "WPA handshake" indicator.

4. **Optional Deauth**  
   With permission, `aireplay-ng --deauth` can force a client reconnect to speed up capture.

5. **Verify Capture**  
   Check that `wpa_handshake_capture-01.cap` exists and contains a valid handshake.

6. **Run Dictionary Attack**  
   Supply a wordlist to `aircrack-ng` to perform offline cracking.

7. **Review Results**  
   Success depends on passphrase entropy; strong random passwords resist dictionary attacks.

---

## Best Practices & Hardening

- Always configure **WPA2-AES (CCMP)**, disable legacy TKIP.  
- Use **long, random passphrases** or deploy **WPA2-Enterprise** with per-user credentials.  
- Monitor for anomalous deauth frames; enable wireless IDS/IPS where possible.  
- Keep firmware and driver updates current to support WPA3 when feasible.

---

## Legal & Ethical Guidelines

- Obtain **explicit written authorization** before testing.  
- Limit tests to the **defined scope and schedule**.  
- Keep detailed **logs** of all actions and notify stakeholders of potential disruptions.  
- Follow all **local laws and organizational policies** regarding wireless security tests.

---

## Educational Value

This project provides a hands-on demonstration of:

1. How WPA/WPA2 handshakes enable secure key generation yet expose offline PSK guessing.  
2. Why deauthentication accelerates capture but is detectable and disruptive.  
3. The critical role of **passphrase strength** or **enterprise authentication** in resisting attacks.  

Ideal for cybersecurity labs, red-team exercises, and blue-team awareness training.

---

**License:** MIT – see `LICENSE` file.


