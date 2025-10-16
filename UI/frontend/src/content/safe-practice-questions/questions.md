---
title: "Practice Questions"
slug: "questions"
order: 1
category: "safe-practice-questions"
prev: null
next: "answer-key"
---

# Safe Practice Questions – Ethical Hacking (Multiple Choice)

⚠️ **Safety note:** These questions are for learning only. Never attempt tests on systems you do not own or have explicit permission to test. Practice in isolated labs, VMs, or sanctioned CTF environments.

---

## Reconnaissance

1. What is the difference between active and passive reconnaissance?  
A. Active gathers only public info; passive alters the target.  
B. Active interacts with the target; passive does not interact.  
C. Active is illegal; passive is always legal.  
D. Active uses only social media; passive uses only tools.

2. Which tool is commonly used for passive information gathering?  
A. Nmap  
B. theHarvester  
C. Metasploit  
D. sqlmap

3. What information does a WHOIS lookup typically provide?  
A. Running processes on a server  
B. Domain registration and contact details  
C. Encrypted network traffic  
D. User passwords

4. Which is a safe way to use social media for reconnaissance?  
A. Attempt to brute-force accounts to find info  
B. Scrape only publicly available posts and profiles  
C. Send friend requests from fake accounts to access private info  
D. Phish users for credentials

5. What is footprinting?  
A. Deleting logs after an attack  
B. Building a profile of a target using publicly available data  
C. Exploiting a buffer overflow on a server  
D. Creating malware for persistence

6. Which is a key legal/ethical consideration during reconnaissance?  
A. Only collect hidden or private data  
B. Never document findings  
C. Obtain permission when targeting non-owned systems  
D. Publish raw data immediately

7. How does OSINT differ from network scanning?  
A. OSINT uses paid tools only; network scanning is free  
B. OSINT collects public info; network scanning actively probes services  
C. OSINT is illegal; network scanning is legal  
D. They are the same

8. How can you verify the reliability of gathered information?  
A. Use a single source and assume it’s correct  
B. Cross-check multiple reputable sources  
C. Ignore timestamps on the data  
D. Rely only on social media posts

9. Which action helps protect your personal info from reconnaissance?  
A. Posting full address on public profiles  
B. Using default passwords on accounts  
C. Tightening privacy settings and limiting public posts  
D. Sharing work email on every forum

10. Examples of publicly available reconnaissance sources include:  
A. Company websites, WHOIS, public social profiles  
B. Encrypted VPN traffic of others  
C. Password databases from phishing  
D. Internal corporate databases (no permission)

---

## Scanning

1. Network scanning vs vulnerability scanning — main difference?  
A. Network scanning finds hosts/ports; vulnerability scanning searches for known flaws.  
B. They are identical processes.  
C. Vulnerability scanning finds hosts; network scanning finds software versions.  
D. Network scanning only runs on web apps.

2. Which is a popular network scanning tool?  
A. Wireshark (only)  
B. Nmap  
C. Photoshop  
D. Notepad

3. What can a port scan reveal?  
A. Open ports and associated services  
B. Encrypted file contents  
C. Usernames and passwords  
D. Physical location coordinates

4. Purpose of a ping sweep is to:  
A. Encrypt network traffic  
B. Identify live hosts on a subnet  
C. Steal credentials  
D. Install malware

5. What is banner grabbing used for?  
A. Stealing cookies  
B. Identifying service/version information from network services  
C. Hiding network traces  
D. Performing SQL injection

6. Why must scanning be performed ethically and legally?  
A. Scanning always improves performance  
B. Unauthorized scanning may be illegal and disruptive  
C. Scanning has no impact so rules don’t matter  
D. It guarantees exploitation

7. How can you identify live hosts safely?  
A. Use ping sweep in your own lab or with permission  
B. Attempt random TCP connections to public IPs at large scale  
C. Brute-force ports across a country block  
D. Scan ISP infrastructure without consent

8. TCP vs UDP scanning — key difference?  
A. TCP is connection-oriented; UDP is connectionless (so scanning behaves differently)  
B. UDP always reports open ports accurately  
C. TCP cannot be used in scanning  
D. There is no difference

9. Firewalls affect scanning by:  
A. Never blocking any traffic  
B. Potentially hiding or filtering ports and responses  
C. Making all services visible  
D. Encrypting scan results

10. Responsible interpretation of scan results includes:  
A. Assuming every open port is exploitable without verification  
B. Documenting context and confirming findings in a safe environment  
C. Publishing raw scans publicly immediately  
D. Ignoring false positives

---

## Exploitation

1. What is an exploit?  
A. A backup utility  
B. Code or technique that leverages a vulnerability to achieve an unintended behavior  
C. A debug log file  
D. A firewall rule

2. Local vs remote exploit — main difference?  
A. Local needs local access; remote can be performed over a network  
B. Remote requires physical presence  
C. Local always uses SQL injection  
D. No difference

3. What is privilege escalation?  
A. Reducing user rights  
B. Moving from lower-level to higher-level privileges on a system  
C. Encrypting files for backup  
D. Blocking access to services

4. Where should you practice exploitation safely?  
A. Production servers of companies you don’t own  
B. Isolated lab VMs or CTF platforms with permission  
C. Random public websites  
D. Corporate email servers without consent

5. Why never exploit systems without permission?  
A. It’s always harmless  
B. It can be illegal, unethical, and cause damage  
C. It improves the system automatically  
D. It’s required for audits

6. What is a buffer overflow?  
A. A type of network scan  
B. When a program writes more data to a buffer than it can hold, possibly allowing arbitrary code execution  
C. An encryption algorithm  
D. A firewall technique

7. How does input validation help prevent exploitation?  
A. It ensures only proper, expected data is processed, reducing attack surface  
B. It slows the system intentionally  
C. It allows arbitrary commands  
D. It obfuscates stack traces

8. Which are common web application vulnerabilities?  
A. SQLi, XSS, CSRF  
B. JPEG compression errors only  
C. Typo correction features  
D. Changing CSS styles

9. Principle of least privilege means:  
A. Give users maximum permissions always  
B. Grant only the minimum privileges necessary for a role or process  
C. Avoid using access controls  
D. Share admin passwords with everyone

10. What is responsible disclosure?  
A. Publicly releasing exploit code immediately  
B. Reporting discovered vulnerabilities privately to the owner and giving time to fix before public disclosure  
C. Selling vulnerabilities to attackers  
D. Ignoring discovered issues

---

## Post-Exploitation

1. What does post-exploitation refer to?  
A. Activities after gaining access to assess and document impact (in a lab/test)  
B. Scanning phase only  
C. Writing exploits only  
D. Building hardware

2. Typical goals of post-exploitation include:  
A. Maintain access, escalate privileges, and gather proof of concept data (in authorized engagements)  
B. Publishing user passwords publicly  
C. Destroying evidence on production systems you don’t own  
D. Automatically patching the target

3. How might an attacker maintain access (in lab context)?  
A. By installing persistence mechanisms in a sanctioned lab VM for testing  
B. By stealing physical devices in the field  
C. By posting credentials on a forum  
D. By shutting down services

4. Why is cleaning traces important in ethical labs?  
A. To cover illegal activity in the real world  
B. To simulate attacker behavior for remediation and reporting (only in labs)  
C. Because traces speed up the system  
D. It prevents logging

5. What is pivoting?  
A. Using a compromised host to reach other network segments (in a controlled lab)  
B. Rotating encryption keys  
C. A web development technique  
D. A UI animation

6. Keylogging in lab context is:  
A. Installing a keylogger on others without consent  
B. Demonstrating how keylogging works in isolated lab environments for defensive understanding  
C. Sending keys over the network for fun  
D. Monitoring production systems without authorization

7. What is data exfiltration (safe simulation)?  
A. Securely copying data between two authorized lab machines to test detection  
B. Transferring stolen data to public forums  
C. Encrypting backups only on production systems  
D. Mass emailing confidential files

8. How should findings be documented after post-exploitation?  
A. With clear steps, evidence, impact, and remediation recommendations (for authorized tests)  
B. By publishing exploit code and victim info online  
C. By deleting all notes  
D. With vague, unsourced claims

9. What is lateral movement?  
A. Moving from one compromised host to others within a network (lab-only practice)  
B. Physical movement of devices between rooms  
C. Rebooting a server  
D. Changing file permissions randomly

10. Why must post-exploitation be tested only in isolated environments?  
A. To avoid legal and ethical violations and to prevent real-world damage  
B. Because it’s ineffective otherwise  
C. To make results public instantly  
D. Because it’s not useful

---

## Web Security

1. What is SQL Injection (SQLi)?  
A. A method for optimizing databases  
B. Injection of malicious SQL through input to manipulate database queries  
C. An encryption technique  
D. A CSS styling issue

2. Cross-Site Scripting (XSS) allows attackers to:  
A. Run malicious scripts in victims’ browsers if inputs are not properly sanitized  
B. Improve site performance  
C. Encrypt user data automatically  
D. Transfer files between servers

3. What is Cross-Site Request Forgery (CSRF)?  
A. Forcing a user’s browser to perform unintended actions on a trusted site they’re authenticated to  
B. A network sniffing technique  
C. A form of SQLi only  
D. A server-side caching method

4. How does HTTPS protect users?  
A. By hiding server uptime  
B. By encrypting traffic between client and server and verifying server identity  
C. By compressing images automatically  
D. By preventing all bugs

5. What is input validation for web apps?  
A. Allowing any input without checks  
B. Checking and sanitizing input to ensure it conforms to expected formats and disallow injections  
C. Automatically making input uppercase  
D. Storing raw input in logs without checks

6. Which is a safe tool to test web app security in a lab?  
A. sqlmap against live production without permission  
B. OWASP Juice Shop in a local environment  
C. Targeting random websites  
D. Posting login attempts publicly

7. What is session hijacking?  
A. Taking over a user session by stealing or guessing session tokens (in labs used to learn defenses)  
B. Renting flight seats online  
C. A database tuning method  
D. A CSS animation

8. Secure cookie attributes include:  
A. secure, httpOnly, SameSite  
B. public, writable, shareable  
C. large, small, medium  
D. transparent, opaque, vivid

9. Principle of least privilege for web apps means:  
A. Grant no permissions to anyone  
B. Give services and users only the permissions they need to function  
C. Make everyone admin for convenience  
D. Avoid authentication entirely

10. How should you report a web vulnerability ethically?  
A. Publish details immediately on social media  
B. Contact the site owner privately and follow responsible disclosure practices  
C. Sell the information to the highest bidder  
D. Ignore it

---

## Network Security

1. What does a firewall do?  
A. Blocks or filters network traffic based on rules to protect networks  
B. Encrypts all emails automatically  
C. Speeds up CPU performance  
D. Scans for SQLi

2. What is a VPN?  
A. A local-only file viewer  
B. Virtual Private Network that creates an encrypted tunnel for traffic  
C. A type of firewall hardware only  
D. A password manager

3. Man-in-the-Middle (MitM) attack involves:  
A. Intercepting or altering communications between two parties (in lab simulations)  
B. Improving latency automatically  
C. Direct file copying between two folders only  
D. Formatting hard drives

4. ARP spoofing is used to:  
A. Poison ARP caches to redirect local traffic (lab-only for learning)  
B. Encrypt files with AES  
C. Create user accounts  
D. Backup databases

5. Safe simulation of DoS attacks requires:  
A. Testing against production websites you don’t own  
B. Performing tests only in isolated lab networks with consent  
C. Targeting ISP infrastructure randomly  
D. Running attacks on school networks without consent

6. Symmetric vs asymmetric encryption difference:  
A. Symmetric uses same key for encrypt/decrypt; asymmetric uses a key pair (public/private)  
B. Symmetric is always slower than asymmetric  
C. They are the same concept  
D. Asymmetric uses passwords only

7. Packet sniffing ethically is:  
A. Capturing traffic on networks you control to analyze protocols and detect issues  
B. Intercepting encrypted data from strangers on public Wi‑Fi without consent  
C. Selling captured data online  
D. Ignoring privacy concerns

8. Common network protocols with vulnerabilities include:  
A. HTTP, FTP, Telnet (if not secured)  
B. PNG and JPG only  
C. CSS and HTML only  
D. All image formats

9. Protecting against unauthorized access includes:  
A. Using strong authentication, patching, and least privilege  
B. Leaving default credentials unchanged  
C. Disabling logging entirely  
D. Publishing passwords in README

10. What is network segmentation?  
A. Dividing a network into zones to limit access and improve security  
B. Merging all networks into one flat network  
C. Removing all routers  
D. Disabling firewalls

---

## Cryptography

1. Purpose of cryptography is to:  
A. Secure confidentiality, integrity, and sometimes authenticity of data  
B. Slow down communications only  
C. Replace all passwords with plain text  
D. Remove encryption entirely

2. Symmetric vs asymmetric encryption — correct statement:  
A. Symmetric uses one key; asymmetric uses a public/private key pair  
B. Symmetric uses different keys per message only  
C. Asymmetric uses the same key for both sides  
D. They are interchangeable without consequence

3. What is a hash function used for?  
A. Encrypting data with a reversible key  
B. Producing a fixed-size digest representing input data (usually irreversible)  
C. Compressing images losslessly  
D. Managing network routing

4. How does SSL/TLS secure communication?  
A. By using certificates and encryption to protect data in transit and verify server identity  
B. By increasing bandwidth only  
C. By converting all text to uppercase  
D. By removing cookies

5. Example of a common symmetric algorithm:  
A. RSA  
B. AES  
C. SHA-256  
D. ECDSA

6. Example of a common asymmetric algorithm:  
A. AES  
B. SHA-1  
C. RSA  
D. MD5

7. What is a digital signature?  
A. A method to compress files  
B. A cryptographic mechanism to verify authenticity and integrity of data using private key operations  
C. A type of firewall rule  
D. A malware technique

8. Public Key Infrastructure (PKI) provides:  
A. A system of keys, certificates, and CAs to validate identities and manage certificates  
B. A VPN replacement only  
C. A file server structure  
D. A web hosting service

9. Key exchange methods (safe description) do:  
A. Allow parties to establish shared keys securely, e.g., Diffie–Hellman (lab study)  
B. Send keys in clear text over public channels intentionally  
C. Duplicate private keys across users  
D. Eliminate the need for encryption

10. Cryptographic protocols protect data integrity by:  
A. Using checksums only (no cryptography)  
B. Applying MACs/HMACs or digital signatures to detect tampering  
C. Storing plaintext only  
D. Disabling authentication
