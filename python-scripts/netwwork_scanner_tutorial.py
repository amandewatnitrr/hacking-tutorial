import scapy.all as scapy

def scan(ip):
    arp_request = scapy.ARP(ip)



if __name__ == "__main__":
    ip = input("Enter the IP to scan: ")
    scan(ip)