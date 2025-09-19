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

- A normal communication looks like this where the client communicates to the server via the gateway, and the thus the data obtained in response is as expected. The attacker can intercept this communication and modify the data being sent or received, if not securely encrypted with HTTPS or other secure protocols.

- In case, when a attacker gains access to the network, they can perform a MITM attack by intercepting the communication between the client and the server, the response from the server to the client is modified or altered, and the client receives the modified response. This can lead to various attacks such as data theft, session hijacking, or injecting malicious content into the communication.

## ARP Spoofing or ARP Poisoning

- It allows us to redirect the flow of packets in the network. So, instead of the packets going to the intended device, they go to the attacker, allowing them to intercept, modify, or even drop the packets.
  
  So, any request made by the client or the response from the server will have to flow through the attacker, allowing them to perform a MITM attack. This allows us to read the information, modify it or drop it, and even inject malicious content into the communication.

- The reason this is possible is ARP is not really secure. To understand this, we need to have some knowledge about what ARP is.

> [!IMPORTANT]
> 
> - ARP stands for Address Resolution Protocol, which is used to map IP addresses to MAC addresses in a local network. 
> - ARP spoofing or ARP poisoning is a technique used by attackers to send false ARP messages over a local area network (LAN).
> - This allows the attacker to associate their MAC address with the IP address of another device, effectively redirecting traffic intended for that device to themselves.

- How this actually works is, let's say we have Systems `A`, `B`, `C`, and `D`. Let's say A wants to communicate with C. For this purpose it needs to know the MAC address of C, so that it can communicate with the client.
  
  So, what the client does is it uses the ARP Protocol. Basically, it sends an ARP Request to all the clients on the network saying "Who has XX.XX.XX.XX??". So, all the devices will ignore the packet except the one that has the IP address XX.XX.XX.XX, which is C in this case. As, a result `C` will respond with an ARP Response, and will say "I have XX.XX.XX.XX, and my MAC address is XX:XX:XX:XX:XX:XX". Now, `A` has the MAC address of `C`, and it can communicate with it. So, this is how ARP works.

- Each computer has it's own ARP Table, which links IP Address on the same network to their MAC Addresses. YOu can get it on Kali Linux by using the command:
  
  ```bash
  root@kali:~# arp -a
  ```
  
  For example:
  
  ```bash
  root@kali:~# arp -a
  _gateway (IP_1) at MAC_1 [ether] on eth0
  _gateway (IP_2) at MAC_2 [ether] on wlan0
  ? (IP_3) at MAC_3 [ether] on eth0
  ```

- If we do the same on windows we get the following output:

  ```cmd
  C:\Users\IEUser>arp -a
  
  Interface: Interface_IP --- 0x7
    Internet Address      Physical Address      Type
    IP_1                  MAC_1                 dynamic
    IP_2                  MAC_2                 dynamic
    IP_3                  MAC_3                 static
  ```

  We can clearly see that it's mapping the IP addresses to their MAC addresses respectively. This MAC Address can be easily modified by using the ARP Protocol.

- So, what we can do is we will exploit the ARP Protocol, and send 2 ARP responses. One to the client and one to the gateway. The ARP response to the client will say "The MAC address of the gateway is XX:XX:XX:XX:XX:XX", and the ARP response to the gateway will say "The MAC address of the client is XX:XX:XX:XX:XX:XX". This way, we can redirect the flow of packets in the network, and perform a MITM attack.

### Why ARP Spoofing is Possible

- ARP is a stateless protocol, meaning it does not verify the authenticity of the sender. This allows attackers to send false ARP messages without any verification.

- Client accepts the response even if they didnot make the request. This means that if an attacker sends a false ARP response, the client will accept it without verifying if it was expecting a response.

## Intercepting Traffic using ARP Spoofing

- In order to do so, we need to know the IP addresses of the client and the gateway. We can use the `netdiscover` tool to find the IP addresses of the devices on the network.

  ```bash
  root@kali:~# netdiscover -i wlan0
  ```

  Once, the IP addresses are known, we can use the `arpspoof` tool to send the false ARP responses to the client and the gateway.

  ```bash
  root@kali:~# arpspoof -i <interface_name> -t client_ip gateway_ip
  ```

  ```bash
  root@kali:~# arpspoof -i <interface_name> -t gateway_ip client_ip
  ```

  It would look something like this:

  ![](../imgs/Screenshot%20(6).png)
  ![](../imgs/Screenshot%20(7).png)

- As, you can clearly see the MAC Address of the gateway has been changed to the MAC Address of the attacker. This means that all the packets that are intended for the gateway will now be sent to the attacker.

- Now we need to allow packets to be forwarded. This can be done by enabling IP forwarding on the attacker's machine.

  ```bash
  root@kali:~# echo 1 > /proc/sys/net/ipv4/ip_forward
  ```

### Why use `arpspoof` ??

- We could have used `ettercap` to perform the ARP spoofing, but the reason we are using `arpspoof` is because it is a lightweight tool that does not have a GUI. This means that it does not consume a lot of resources, and it is easier to use in a script.

## Bettercap basics

