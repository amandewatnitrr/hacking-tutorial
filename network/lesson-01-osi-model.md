# The OSI Model — Why Networks Have Layers

## What Is the OSI Model?

The **Open Systems Interconnection (OSI) model** breaks network communication into 7 layers. Each layer has one job and talks only to the layers immediately above and below it. When data travels from an application to the wire, it passes down all 7 layers — each one wrapping the payload with its own header. The receiver unwraps in reverse.

This layering means you can swap out Ethernet for Wi-Fi, or HTTP for WebSocket, without redesigning everything else.

---

## The 7 Layers

```
┌─────────────────────────────────────────────────────┐
│  7 · Application    HTTP, HTTPS, DNS, SMTP, SSH     │  ◄── you work here
├─────────────────────────────────────────────────────┤
│  6 · Presentation   TLS/SSL, encoding, compression  │
├─────────────────────────────────────────────────────┤
│  5 · Session        RPC, NetBIOS, PPTP              │
├─────────────────────────────────────────────────────┤
│  4 · Transport      TCP, UDP                        │  ◄── port numbers
├─────────────────────────────────────────────────────┤
│  3 · Network        IP, ICMP, OSPF, BGP             │  ◄── IP addresses
├─────────────────────────────────────────────────────┤
│  2 · Data Link      Ethernet, Wi-Fi (802.11), ARP   │  ◄── MAC addresses
├─────────────────────────────────────────────────────┤
│  1 · Physical       Cables, fiber, radio, voltages  │  ◄── bits on wire
└─────────────────────────────────────────────────────┘
```

| Layer | Name | PDU | Addresses | Key Protocols |
|-------|------|-----|-----------|---------------|
| 7 | Application | Message | — | HTTP, HTTPS, DNS, SMTP, IMAP, POP3, FTP, SSH, DHCP |
| 6 | Presentation | Message | — | TLS/SSL, MIME, JPEG, MP4 |
| 5 | Session | Message | — | RPC, PPTP, NetBIOS |
| 4 | Transport | Segment (TCP) / Datagram (UDP) | Port numbers | TCP, UDP |
| 3 | Network | Packet | IP addresses | IPv4, IPv6, ICMP, BGP, OSPF |
| 2 | Data Link | Frame | MAC addresses | Ethernet, 802.11 (Wi-Fi), ARP |
| 1 | Physical | Bit | — | Copper, fiber, radio, DSL |

PDU = Protocol Data Unit (the name for the data chunk at each layer).

---

## Encapsulation: Down the Stack

When a browser sends `GET /index.html`:

```
Layer 7: HTTP message         GET /index.html HTTP/1.1\r\nHost: example.com\r\n\r\n
Layer 6: TLS record           [TLS header] [encrypted HTTP message] [16-byte tag]
Layer 4: TCP segment          [TCP header: src:52345 dst:443 seq:...] [TLS record]
Layer 3: IP packet            [IP header: src:1.2.3.4 dst:5.6.7.8] [TCP segment]
Layer 2: Ethernet frame       [Eth header: src:aa:bb dst:cc:dd type:0x0800] [IP packet] [FCS]
Layer 1: Bits                 10100011 01011001 ...
```

Each layer adds its header at the front (and sometimes a trailer at the back). The receiver strips them in reverse order.

---

## Layer by Layer

### Layer 1 — Physical

Bits on a medium. Defines voltage levels, timing, cable types, connectors.

- Copper: 5V/0V or differential signaling
- Fiber: light pulses
- Wi-Fi: radio waves, amplitude/phase encoding

No addresses. No error correction at this level — just 0s and 1s.

### Layer 2 — Data Link

Hops between directly connected nodes. Frames are addressed by **MAC address** (hardware address, 6 bytes, e.g., `aa:bb:cc:dd:ee:ff`).

- Ethernet: dominant wired protocol
- 802.11: Wi-Fi
- ARP: resolves IP address to MAC on the same subnet

A **switch** operates at Layer 2 — it reads the destination MAC and forwards the frame to the right port.

### Layer 3 — Network

Routing packets across networks. Addressed by **IP address**.

- IPv4: 32-bit addresses (`192.168.1.1`)
- IPv6: 128-bit addresses (`2001:db8::1`)
- ICMP: error messages (ping, traceroute, TTL exceeded)
- BGP/OSPF: routing protocols

A **router** operates at Layer 3 — it reads the destination IP, looks up its routing table, and forwards the packet toward the next hop.

### Layer 4 — Transport

End-to-end delivery between processes. Addressed by **port number**.

- **TCP**: reliable, ordered, connection-oriented. Three-way handshake, sequence numbers, retransmission.
- **UDP**: fast, unreliable, connectionless. No handshake, no retransmit.

Port 80 = HTTP, port 443 = HTTPS, port 22 = SSH. Ports below 1024 are well-known.

### Layer 5 — Session

Manages the lifecycle of conversations (open, checkpoint, close). Largely invisible in modern web stacks — TCP handles most of this.

### Layer 6 — Presentation

Data formatting, encryption, compression. TLS sits here: it encrypts Layer 7 data before it reaches TCP.

### Layer 7 — Application

User-facing protocols: HTTP, DNS, SMTP, SSH. This is where you work as a developer.

---

## TCP/IP Model vs OSI Model

In practice, engineers use the **TCP/IP model** (4 layers):

```
OSI                    TCP/IP
─────────────────────────────────
7 Application    ┐
6 Presentation   ├──► Application
5 Session        ┘
4 Transport      ───► Transport
3 Network        ───► Internet
2 Data Link      ┐
1 Physical       ┘──► Network Access
```

TCP/IP collapses OSI's top 3 layers into one (Application) and the bottom 2 into one (Network Access). The model you use in code — sockets, ports, IP addresses — is TCP/IP.

---

## Protocols in This Course — Mapped to OSI

| Protocol | Layer | Lesson |
|----------|-------|--------|
| HTTP | 7 Application | [Lesson 02](lesson-02-http.md) |
| HTTPS | 7 Application | [Lesson 03](lesson-03-https.md) |
| TCP | 4 Transport | [Lesson 04](lesson-04-tcp.md) |
| UDP | 4 Transport | [Lesson 05](lesson-05-udp.md) |
| IP | 3 Network | [Lesson 06](lesson-06-ip.md) |
| DNS | 7 Application | [Lesson 07](lesson-07-dns.md) |
| DHCP | 7 Application | [Lesson 08](lesson-08-dhcp.md) |
| ICMP | 3 Network | [Lesson 09](lesson-09-icmp.md) |
| SMTP | 7 Application | [Lesson 10](lesson-10-smtp.md) |
| POP3 / IMAP | 7 Application | [Lesson 11](lesson-11-email-retrieval.md) |
| FTP | 7 Application | [Lesson 12](lesson-12-ftp.md) |
| SSH | 7 Application | [Lesson 13](lesson-13-ssh.md) |
| TLS/SSL | 6 Presentation | [Lesson 14](lesson-14-tls-ssl.md) |

---

## Security Angle: Layer Attacks

Each layer has its own attack surface:

| Layer | Attacks |
|-------|---------|
| 1 Physical | Cable tap, rogue access point, signal jamming |
| 2 Data Link | ARP spoofing, MAC flooding, VLAN hopping |
| 3 Network | IP spoofing, ICMP flood, TTL manipulation, route poisoning |
| 4 Transport | SYN flood, RST injection, port scanning, session hijack |
| 5–6 | TLS downgrade, BEAST/CRIME/POODLE |
| 7 Application | SQLi, XSS, SSRF, header injection, DNS cache poisoning |

Defence-in-depth = protect every layer, not just the top.

---

## Quick Quiz

| Q | A |
|---|---|
| What layer does a switch operate at? | Layer 2 (Data Link) |
| What layer does a router operate at? | Layer 3 (Network) |
| What addresses does Layer 2 use? | MAC addresses |
| What addresses does Layer 3 use? | IP addresses |
| What addresses does Layer 4 use? | Port numbers |
| TCP or UDP: reliable? | TCP |
| TLS sits at which OSI layer? | Layer 6 (Presentation) |
| What wraps what at Layer 3? | IP header wraps TCP segment |
