---
title: "Answer Key"
slug: "answer-key"
order: 2
category: "safe-practice-questions"
prev: "questions"
next: null
---

# Answer Key – Safe Practice Questions (Multiple Choice)

⚠️ **Safety note:** Answers are educational. Use them to check understanding after attempting the questions yourself.

---

## Reconnaissance
1. B — Active interacts with the target; passive does not interact.  
2. B — theHarvester (tool for passive OSINT).  
3. B — WHOIS returns domain registration and contact details.  
4. B — Scrape only publicly available posts and profiles (do not impersonate).  
5. B — Footprinting = building a profile of a target using public data.  
6. C — Obtain permission when targeting non-owned systems.  
7. B — OSINT = public info; network scanning actively probes services.  
8. B — Cross-check multiple reputable sources.  
9. C — Tighten privacy settings and limit public posts.  
10. A — Company websites, WHOIS, public social profiles.

---

## Scanning
1. A — Network scanning finds hosts/ports; vulnerability scanning finds known flaws.  
2. B — Nmap.  
3. A — Port scan can reveal open ports and associated services.  
4. B — Ping sweep identifies live hosts.  
5. B — Banner grabbing identifies service/version info.  
6. B — Unauthorized scanning may be illegal and disruptive.  
7. A — Use ping sweep in your own lab or with permission.  
8. A — TCP is connection-oriented; UDP is connectionless, so scanning differs.  
9. B — Firewalls can hide or filter ports and responses.  
10. B — Document context and confirm findings safely.

---

## Exploitation
1. B — An exploit leverages a vulnerability to cause unintended behavior.  
2. A — Local requires local access; remote works over a network.  
3. B — Privilege escalation moves to higher privileges.  
4. B — Use isolated lab VMs or CTF platforms with permission.  
5. B — It can be illegal, unethical, and damaging.  
6. B — Buffer overflow = writing more data to buffer than allocated, possible code execution.  
7. A — Input validation ensures only expected data is processed, reducing attacks.  
8. A — SQLi, XSS, CSRF are common web vulnerabilities.  
9. B — Grant minimum privileges necessary.  
10. B — Responsible disclosure: report privately and give time to fix.

---

## Post-Exploitation
1. A — Activities after gaining access to assess/document impact (lab/test).  
2. A — Maintain access, escalate privileges, gather proof (authorized).  
3. A — Installing persistence in sanctioned lab VM for testing.  
4. B — To simulate attacker behavior and assist remediation (in labs).  
5. A — Pivoting uses a compromised host to reach other segments (lab-only).  
6. B — Demonstrate keylogging in isolated labs for defense understanding.  
7. A — Securely copy data in lab to test detection (simulate exfiltration).  
8. A — Document steps, evidence, impact, and remediation (authorized tests).  
9. A — Lateral movement = moving from one host to others in a network.  
10. A — To avoid legal/ethical violations and prevent real damage.

---

## Web Security
1. B — SQLi = injecting malicious SQL to manipulate queries.  
2. A — XSS runs scripts in victim browsers if inputs not sanitized.  
3. A — CSRF tricks an authenticated browser to perform unintended actions.  
4. B — HTTPS encrypts traffic and verifies server identity.  
5. B — Input validation checks/sanitizes inputs to disallow injections.  
6. B — OWASP Juice Shop is a safe local target for learning.  
7. A — Session hijacking takes over a user session by stealing tokens.  
8. A — secure, httpOnly, SameSite are secure cookie attributes.  
9. B — Grant services/users only the permissions they need.  
10. B — Contact owner privately and follow responsible disclosure.

---

## Network Security
1. A — Firewall blocks/filters traffic based on rules.  
2. B — VPN creates an encrypted tunnel for traffic.  
3. A — MitM intercepts/possibly alters communications (lab simulations).  
4. A — ARP spoofing poisons ARP caches to redirect local traffic (lab-only).  
5. B — Test DoS only in isolated lab networks with consent.  
6. A — Symmetric uses same key; asymmetric uses key pair.  
7. A — Capture traffic on networks you control to analyze ethically.  
8. A — Protocols like HTTP, FTP, Telnet can be vulnerable if not secured.  
9. A — Strong auth, patching, and least privilege help prevent unauthorized access.  
10. A — Network segmentation divides networks to limit access and improve security.

---

## Cryptography
1. A — Cryptography secures confidentiality, integrity, and authenticity.  
2. A — Symmetric uses one key; asymmetric uses public/private pair.  
3. B — Hash produces fixed-size digest, usually irreversible.  
4. A — SSL/TLS uses certificates and encryption to secure transit and verify identity.  
5. B — AES is a common symmetric algorithm.  
6. C — RSA is a common asymmetric algorithm.  
7. B — Digital signature verifies authenticity/integrity via private key operations.  
8. A — PKI is the system of keys, certs, and CAs to manage identity and trust.  
9. A — Key exchange methods like Diffie–Hellman let parties agree on shared keys securely.  
10. B — MACs/HMACs or digital signatures detect tampering and protect integrity.
