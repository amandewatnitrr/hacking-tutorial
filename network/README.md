# Network Protocols — Learning Guide

> **Visual content and explanations sourced from [Protocol Explorer](https://protocol-explorer-alpha.vercel.app)** by [@DilumSanjaya](https://x.com/DilumSanjaya). Interactive animations available at the original site.

A ground-up breakdown of how the internet works — from raw packets to encrypted sessions. Each lesson covers a protocol's purpose, how it works step-by-step, and what the wire actually looks like.

---

## OSI Model Quick Reference

| Layer | Name | Protocols Covered |
|-------|------|-------------------|
| 7 | **Application** | HTTP, HTTPS, DNS, DHCP, SMTP, POP3, IMAP, FTP, SSH |
| 6 | **Presentation** | TLS/SSL |
| 5 | **Session** | — |
| 4 | **Transport** | TCP, UDP |
| 3 | **Network** | IP, ICMP |
| 2 | **Data Link** | Ethernet (frames) |
| 1 | **Physical** | Cables, radio |

---

## Lessons

### Core Transport
| Lesson | Protocol | Key Concept |
|--------|----------|-------------|
| [lesson-04-tcp.md](lesson-04-tcp.md) | TCP | Reliable ordered delivery via seq numbers + ACKs |
| [lesson-05-udp.md](lesson-05-udp.md) | UDP | Fire-and-forget datagrams, no handshake |
| [lesson-06-ip.md](lesson-06-ip.md) | IP | Addressing, routing, NAT, TTL |
| [lesson-09-icmp.md](lesson-09-icmp.md) | ICMP | ping, traceroute, error messages |

### Web
| Lesson | Protocol | Key Concept |
|--------|----------|-------------|
| [lesson-02-http.md](lesson-02-http.md) | HTTP | Request/response, methods, status codes |
| [lesson-03-https.md](lesson-03-https.md) | HTTPS | HTTP over TLS — encryption + certificate validation |
| [lesson-14-tls-ssl.md](lesson-14-tls-ssl.md) | TLS/SSL | Handshake mechanics, cipher suites, session tickets |

### Infrastructure
| Lesson | Protocol | Key Concept |
|--------|----------|-------------|
| [lesson-07-dns.md](lesson-07-dns.md) | DNS | Name → IP, recursive resolution, caching |
| [lesson-08-dhcp.md](lesson-08-dhcp.md) | DHCP | DORA exchange, leases, renewal |

### Remote Access & File Transfer
| Lesson | Protocol | Key Concept |
|--------|----------|-------------|
| [lesson-13-ssh.md](lesson-13-ssh.md) | SSH | Key exchange, host verification, channels |
| [lesson-12-ftp.md](lesson-12-ftp.md) | FTP | Dual-connection model, plaintext, safer alternatives |

### Email
| Lesson | Protocol | Key Concept |
|--------|----------|-------------|
| [lesson-10-smtp.md](lesson-10-smtp.md) | SMTP | Submission + relay, MX records, SPF/DKIM/DMARC |
| [lesson-11-email-retrieval.md](lesson-11-email-retrieval.md) | POP3 & IMAP | Download-and-delete vs. server-side sync |

---

## Attack Surface per Protocol

> Relevant to ethical hacking and CTF contexts.

| Protocol | Common Weaknesses |
|----------|-------------------|
| HTTP | No encryption, MITM, header injection, verb tampering |
| HTTPS | Cert pinning bypass, downgrade to TLS 1.2/1.0, HSTS stripping |
| TCP | SYN flood, sequence prediction, RST injection |
| UDP | Amplification DDoS, spoofed source, no handshake |
| DNS | Cache poisoning, zone transfer, subdomain takeover |
| DHCP | Starvation, rogue server, IP spoofing |
| ICMP | Ping flood, ICMP tunneling, smurf attack |
| SMTP | Open relay, header injection, STARTTLS downgrade |
| POP3/IMAP | Credential brute force, STARTTLS strip |
| FTP | Plaintext creds, bounce attack, PASV bypass |
| SSH | Weak host key, old KEX algorithms, key theft |
| TLS | Downgrade attack, weak cipher, cert validation bypass |

---

*Sequence diagrams: each arrow = one packet on the wire. Timing shown in seconds.*
