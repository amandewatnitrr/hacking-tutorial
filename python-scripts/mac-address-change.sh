#!/bin/sh
# Program to change MAC Address of an interface
# POSIX-compliant: works with both sh and bash on Linux and macOS

set -eu

MAC_REGEX='^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$'

# Generate a random byte (0-255) using /dev/urandom — works on Linux and macOS
random_byte() {
    od -An -N1 -tu1 /dev/urandom | awk '{print $1}'
}

generate_random_mac() {
    b1=$(( ($(random_byte) & 0xFE) | 0x02 ))
    b2=$(random_byte)
    b3=$(random_byte)
    b4=$(random_byte)
    b5=$(random_byte)
    b6=$(random_byte)
    printf "%02x:%02x:%02x:%02x:%02x:%02x" "$b1" "$b2" "$b3" "$b4" "$b5" "$b6"
}

is_valid_mac() {
    echo "$1" | grep -qE "$MAC_REGEX"
}

change_mac() {
    interface="$1"
    new_mac="$2"

    echo "[+] Changing MAC address of ${interface} to ${new_mac}"

    if ! sudo ifconfig "${interface}" down; then
        echo "[-] Failed to bring down interface ${interface}. Check the interface name and permissions."
        return 1
    fi

    if ! sudo ifconfig "${interface}" hw ether "${new_mac}"; then
        echo "[-] Failed to set MAC address. Ensure the address is valid and you have sufficient permissions."
        sudo ifconfig "${interface}" up
        return 1
    fi

    if ! sudo ifconfig "${interface}" up; then
        echo "[-] Failed to bring up interface ${interface}. You may need to run: sudo ifconfig ${interface} up"
        return 1
    fi

    echo "[+] MAC address changed successfully"
    return 0
}

# ── Argument parsing ──────────────────────────────────────────────────────────
interface=""
new_mac=""

while getopts ":i:m:h" opt; do
    case $opt in
        i) interface="$OPTARG" ;;
        m) new_mac="$OPTARG" ;;
        h)
            echo "Usage: $0 [-i interface] [-m mac_address]"
            echo "  -i  Network interface (e.g. eth0, wlan0)"
            echo "  -m  New MAC address in xx:xx:xx:xx:xx:xx format (optional, auto-generated if omitted)"
            exit 0
            ;;
        :) printf "[-] Option -%s requires an argument.\n" "$OPTARG" >&2; exit 1 ;;
        \?) printf "[-] Unknown option: -%s\n" "$OPTARG" >&2; exit 1 ;;
    esac
done

# ── Interface ─────────────────────────────────────────────────────────────────
if [ -z "$interface" ]; then
    printf "Enter the interface name (e.g., eth0, wlan0): "
    read -r interface
fi

if [ -z "$interface" ]; then
    echo "[-] Interface name cannot be empty."
    exit 1
fi

# ── MAC address ───────────────────────────────────────────────────────────────
if [ -z "$new_mac" ]; then
    printf "Enter the new MAC address (format: xx:xx:xx:xx:xx:xx), or press Enter to generate one: "
    read -r new_mac
fi

if [ -z "$new_mac" ]; then
    new_mac="$(generate_random_mac)"
    echo "[*] No MAC address provided. Generated: ${new_mac}"
elif ! is_valid_mac "$new_mac"; then
    echo "[-] Invalid MAC address format: ${new_mac}. Expected format: xx:xx:xx:xx:xx:xx"
    exit 1
fi

# ── Execute ───────────────────────────────────────────────────────────────────
if change_mac "${interface}" "${new_mac}"; then
    echo "[+] New MAC address for ${interface} is ${new_mac}"
    ifconfig "${interface}"
    echo "[+] Verification complete for ${interface}."
fi
