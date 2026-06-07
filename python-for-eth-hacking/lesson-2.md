# Writing a Network Scanner in Python

---
- [Writing a Network Scanner in Python](#writing-a-network-scanner-in-python)
  - [Introduction to ARP (Address Resolution Protocol)](#introduction-to-arp-address-resolution-protocol)

---

- Information gathering is a crucial step in the ethical hacking process. It involves collecting data about the target system or network to identify potential vulnerabilities and attack vectors. One common tool used for information gathering is a network scanner, which can help you discover active hosts, open ports, and services running on a network.

- Let's say we are connected to a network and want to find out which devices are connected to it. We can use a network scanner to send out requests to all the IP addresses in the network range and see which ones respond. This can help us identify potential targets for further testing.

- Mainly, people don't write their own network scanners because there are already many powerful and well-established tools available, such as Nmap, netdiscover, and Angry IP Scanner. These tools have been developed and refined over many years, and they offer a wide range of features and capabilities that can be difficult to replicate in a custom-built scanner.

- This will help you understand how network scanner works so that we have a deeper understanding on how networks work in general.

## Introduction to ARP (Address Resolution Protocol)

>[!IMPORTANT]
> ARP (Address Resolution Protocol) is a network protocol used to map an IP address to a physical MAC address on a local area network (LAN). It allows devices to communicate with each other by translating IP addresses into MAC addresses, which are necessary for data transmission on a LAN.
> <br>
> When a device wants to communicate with another device on the same LAN, it sends an ARP request to the network, asking for the MAC address associated with the target IP address. The device that owns the target IP address responds with an ARP reply, providing its MAC address. This process allows the sender to establish a connection and transmit data to the correct destination on the network.

```python
import scapy.all as scapy

def scan(ip):
    arp_request = scapy.arping(ip)



if __name__ == "__main__":
    ip = input("Enter the IP to scan: ")
    # For scanning a range of IP addresses, you can use: XX.XX.XX.XX/24
    scan(ip)
```

The output of the above code will be:

```shell
Enter the IP to scan:
XX.XX.XX.XX/24
Begin emission:
Finished to send 1 packets.
*
Received X packets, got X answers, remaining X packets
  XX:XX:XX:XX:XX:XX XX.XX.XX.XX
```

