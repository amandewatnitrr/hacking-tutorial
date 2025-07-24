# Program to change MAC Address of an interface

import subprocess
def change_mac(interface, new_mac):
    print(f"[+] Changing MAC address of {interface} to {new_mac}")
    # Execute the command to change the MAC address
    subprocess.call(["sudo", "ifconfig", interface, "down"],shell=True)
    subprocess.call(["sudo", "ifconfig", interface, "hw", "ether", new_mac],shell=True)
    subprocess.call(["sudo", "ifconfig", interface, "up"],shell=True)
    print("[+] MAC address changed successfully")
    
# Example usage
if __name__ == "__main__":
    interface = input("Enter the interface name (e.g., eth0, wlan0): ")
    new_mac = input("Enter the new MAC address (format: xx:xx:xx:xx:xx:xx): ")
    change_mac(interface, new_mac)
    print(f"New MAC address for {interface} is {new_mac}")
    # Verify the change
    subprocess.call(["ifconfig", interface],shell=True)
    print(f"[+] Verification complete for {interface}.")