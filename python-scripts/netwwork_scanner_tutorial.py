import scapy.all as scapy

def scan(ip):
    # Create ARP Request/Object
    arp_request = scapy.ARP(pdst=ip, op=1)
    arp_request.show()
    # Create Ethernet frame with broadcast MAC
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    # Combine Ethernet frame and ARP request
    arp_request_broadcast = broadcast/arp_request
    arp_request_broadcast.show()
    print(arp_request_broadcast.summary())

input_ip = input("Enter the IP to scan: ")
# Append /24 to the IP address to scan the entire subnet
input_ip = input_ip + "/24"
scan(input_ip)