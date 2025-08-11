# Network Hacking Post Connection Attacks - MITM Attacks

![](../imgs/225813708-98b745f2-7d22-48cf-9150-083f1b00d6c9.gif)

- MITM stands for Man In The Middle. It is a type of attack where the attacker intercepts communication between two parties without their knowledge. The attacker can then eavesdrop on the conversation, modify the data being sent, or even impersonate one of the parties.

#### MITM: Layman sequence

A simple view showing the attacker silently sitting between a client and a server.

```mermaid
sequenceDiagram
    participant C as Client
    participant A as Attacker
    participant S as Server
    C->>A: Sends request (believes it goes to Server)
    A->>S: Forwards request
    S-->>A: Sends response
    A-->>C: Forwards/optionally alters response
    note over A: Can listen and potentially change messages
```

#### MITM: Detailed sequence

A more detailed flow including the network gateway and encryption considerations.

```mermaid
sequenceDiagram
    participant V as Victim/Client
    participant A as Attacker
    participant GW as Gateway/Router
    participant S as Server

    note over V: Attacker positions between Victim and Gateway (e.g., ARP spoofing)
    note over A: (e.g., ARP spoofing)
    A-->>V: ARP reply: "Gateway is at A"
    A-->>GW: ARP reply: "Victim is at A"

    V->>A: Packet intended for Server
    A->>GW: Forwards packet
    GW->>S: Routes to Server
    S-->>GW: Response
    GW-->>A: Forwards response

    alt HTTPS with valid TLS / HSTS
        A-->>V: Pass-through (cannot read/modify content)
        note over V,S: End-to-end encryption protects data integrity/confidentiality
    else HTTP or weak/misconfigured TLS
        A->>A: Decrypts/reads payload
        A-->>V: Optionally modifies response (e.g., injects/edits content)
    end

    note over A: Attacker can still observe metadata (IPs, SNI, timing)
```

