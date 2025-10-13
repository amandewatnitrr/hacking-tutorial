---
title: "Wireless Adapter Setup & Monitor Mode"
slug: "wireless-setup"
order: 3
category: "Getting Started"
---

# Wireless Adapter Setup & Monitor Mode

## Overview

For wireless network hacking, you'll need a wireless adapter that supports **monitor mode** and **packet injection**. This lesson covers everything you need to know about choosing, connecting, and configuring your wireless adapter.

## Why You Need a Wireless Adapter

Your built-in WiFi card typically doesn't support the advanced features needed for wireless hacking:

### Required Features

✅ **Monitor Mode**: Capture all wireless packets in range  
✅ **Packet Injection**: Send custom packets to networks  
✅ **AP Mode**: Create fake access points  
✅ **Multiple Channels**: Scan across all WiFi channels  

### Use Cases

- **WEP Cracking**: Breaking weak encryption
- **WPA/WPA2 Attacks**: Testing modern security
- **Evil Twin Attacks**: Creating rogue access points
- **Packet Sniffing**: Analyzing network traffic
- **Deauthentication**: Testing network resilience

## Choosing the Right Adapter

### Recommended Chipsets

The chipset matters more than the brand. Look for these:

#### 1. **Realtek RTL8812AU** ⭐ Recommended
- Excellent compatibility
- Dual-band (2.4GHz & 5GHz)
- Good packet injection
- Wide driver support

#### 2. **Atheros AR9271**
- Native Linux support
- Reliable performance
- Single-band (2.4GHz)
- Budget-friendly

#### 3. **Ralink RT3070**
- Good compatibility
- Stable performance
- Affordable
- Single-band

### Popular Adapters

| Adapter | Chipset | Bands | Price Range |
|---------|---------|-------|-------------|
| Alfa AWUS036ACH | RTL8812AU | Dual | $40-60 |
| Alfa AWUS036NHA | AR9271 | Single | $30-40 |
| TP-Link TL-WN722N v1 | AR9271 | Single | $15-25 |
| Panda PAU09 | RT5372 | Single | $15-20 |

⚠️ **Note**: Avoid v2/v3 versions of adapters - they often have different chipsets!

## Connecting Adapter to Kali Linux

### For VMware Workstation

#### Step 1: Enable USB Controller

1. Open VMware Workstation
2. Select your Kali VM
3. Go to **VM → Settings**
4. Click **USB Controller**
5. Select **USB 3.1** (or highest available)
6. Check **Show all USB input devices**
7. Click **OK**

#### Step 2: Connect the Adapter

1. Plug adapter into your host machine
2. Start your Kali VM
3. In VMware menu: **VM → Removable Devices**
4. Find your wireless adapter
5. Click **Connect (Disconnect from Host)**
6. Adapter should now appear in Kali

#### Step 3: Verify Connection

```bash
# Check if adapter is recognized
ifconfig

# You should see wlan0 or similar
# Example output:
wlan0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 00:c0:ca:xx:xx:xx  txqueuelen 1000  (Ethernet)
```

### For VirtualBox

#### Step 1: Install Extension Pack

1. Download VirtualBox Extension Pack
2. File → Preferences → Extensions
3. Click **+** and select downloaded pack
4. Install and restart VirtualBox

#### Step 2: Enable USB

1. Select your Kali VM
2. Settings → USB
3. Enable **USB 3.0 Controller**
4. Click **+** to add USB filter
5. Select your wireless adapter
6. Click **OK**

#### Step 3: Connect

1. Plug in adapter
2. Start Kali VM
3. Devices → USB → Select your adapter
4. Verify with `ifconfig`

### For macOS Users

**Good News**: USB passthrough is automatic on macOS!

1. Plug in the adapter
2. Start your VM
3. Adapter should be automatically recognized
4. Verify with `ifconfig`

## Understanding Wireless Modes

### Managed Mode (Default)

```
┌─────────────┐
│   Device    │
│  (wlan0)    │
└──────┬──���───┘
       │
       │ Only receives packets
       │ addressed to this MAC
       ↓
┌─────────────┐
│   Router    │
└─────────────┘
```

**Characteristics**:
- Normal WiFi operation
- Only receives packets meant for you
- Can't see other devices' traffic
- Limited for hacking purposes

### Monitor Mode (What We Need)

```
┌─────────────┐
│   Device    │
│  (wlan0mon) │
└──────┬──────┘
       │
       │ Captures ALL packets
       │ in range
       ↓
┌─────────────────────────────┐
│  All WiFi Traffic in Range  │
│  • Beacons                  │
│  • Data packets             │
│  • Management frames        │
│  • Other devices' traffic   │
└─────────────────────────────┘
```

**Characteristics**:
- Captures all wireless traffic
- Sees packets from all devices
- Can inject custom packets
- Essential for wireless hacking

## Checking Current Mode

```bash
# Method 1: Using iwconfig
iwconfig

# Example output:
wlan0     IEEE 802.11  ESSID:off/any  
          Mode:Managed  Access Point: Not-Associated   
          Tx-Power=20 dBm   
          Retry short limit:7   RTS thr:off   Fragment thr:off
          Power Management:off

# Method 2: Using iw
iw dev

# Example output:
phy#0
    Interface wlan0
        ifindex 3
        wdev 0x1
        addr 00:c0:ca:xx:xx:xx
        type managed
```

## Enabling Monitor Mode

### Method 1: Using airmon-ng (Recommended)

```bash
# Step 1: Check for interfering processes
sudo airmon-ng check

# Example output:
Found 2 processes that could cause trouble.
Kill them using 'airmon-ng check kill' before putting
the card in monitor mode, they will interfere by changing channels
and sometimes putting the interface back in managed mode

PID Name
1234 NetworkManager
5678 wpa_supplicant

# Step 2: Kill interfering processes
sudo airmon-ng check kill

# Step 3: Enable monitor mode
sudo airmon-ng start wlan0

# Output:
PHY     Interface       Driver          Chipset
phy0    wlan0           rtl8812au       Realtek RTL8812AU

                (mac80211 monitor mode vif enabled for [phy0]wlan0 on [phy0]wlan0mon)
                (mac80211 station mode vif disabled for [phy0]wlan0)

# Step 4: Verify
iwconfig

# You should now see wlan0mon in monitor mode
wlan0mon  IEEE 802.11  Mode:Monitor  Frequency:2.457 GHz  Tx-Power=20 dBm
```

### Method 2: Manual Configuration

```bash
# Step 1: Bring interface down
sudo ifconfig wlan0 down

# Step 2: Kill interfering processes
sudo airmon-ng check kill

# Step 3: Set monitor mode
sudo iwconfig wlan0 mode monitor

# Step 4: Bring interface up
sudo ifconfig wlan0 up

# Step 5: Verify
iwconfig wlan0
```

### Method 3: Using iw (Modern Method)

```bash
# Step 1: Bring interface down
sudo ip link set wlan0 down

# Step 2: Set monitor mode
sudo iw wlan0 set monitor control

# Step 3: Bring interface up
sudo ip link set wlan0 up

# Step 4: Verify
iw dev
```

## Disabling Monitor Mode

When you're done, return to managed mode:

```bash
# Method 1: Using airmon-ng
sudo airmon-ng stop wlan0mon

# Method 2: Manual
sudo ifconfig wlan0mon down
sudo iwconfig wlan0mon mode managed
sudo ifconfig wlan0mon up

# Restart NetworkManager
sudo systemctl start NetworkManager
```

## Testing Your Setup

### Test 1: Capture Beacon Frames

```bash
# Start capturing
sudo airodump-ng wlan0mon

# You should see:
# - List of nearby access points
# - Their channels
# - Signal strength
# - Encryption type
# - Connected clients

# Press Ctrl+C to stop
```

### Test 2: Channel Hopping

```bash
# Monitor mode should allow channel hopping
sudo airodump-ng wlan0mon

# Watch the CH field change automatically
# This confirms monitor mode is working
```

### Test 3: Packet Injection

```bash
# Test injection capability
sudo aireplay-ng --test wlan0mon

# Successful output:
# Trying broadcast probe requests...
# Injection is working!
# Found X APs
```

## Common Issues and Solutions

### Issue: Adapter Not Recognized

**Symptoms**:
- `ifconfig` doesn't show wlan0
- No wireless interface visible

**Solutions**:
```bash
# Check if adapter is detected
lsusb

# Look for your adapter in the list
# If not there, try:
# 1. Reconnect adapter
# 2. Try different USB port
# 3. Check VM USB settings
# 4. Install drivers
```

### Issue: Can't Enable Monitor Mode

**Symptoms**:
- Mode stays as "Managed"
- Error messages when enabling

**Solutions**:
```bash
# Kill all interfering processes
sudo airmon-ng check kill

# Try manual method
sudo ifconfig wlan0 down
sudo iwconfig wlan0 mode monitor
sudo ifconfig wlan0 up

# Check for driver issues
dmesg | grep wlan0
```

### Issue: No Packets Captured

**Symptoms**:
- airodump-ng shows no networks
- Empty capture

**Solutions**:
```bash
# Check if in monitor mode
iwconfig

# Verify channel hopping
sudo airodump-ng wlan0mon

# Try specific channel
sudo airodump-ng -c 6 wlan0mon

# Check antenna is connected
# Ensure you're in range of WiFi networks
```

### Issue: Injection Not Working

**Symptoms**:
- aireplay-ng test fails
- Can't inject packets

**Solutions**:
```bash
# Verify chipset supports injection
sudo aireplay-ng --test wlan0mon

# Update drivers
sudo apt update
sudo apt install realtek-rtl88xxau-dkms

# Try different adapter
# Some chipsets have better injection support
```

## Changing MAC Address

Before starting wireless attacks, change your MAC address:

```bash
# Bring interface down
sudo ifconfig wlan0 down

# Change MAC address
sudo macchanger -r wlan0

# Or set specific MAC
sudo macchanger -m 00:11:22:33:44:55 wlan0

# Bring interface up
sudo ifconfig wlan0 up

# Verify change
macchanger -s wlan0
```

## Best Practices

### 1. Always Use Monitor Mode
- Required for most wireless attacks
- Enables packet capture
- Allows injection

### 2. Kill Interfering Processes
- NetworkManager can interfere
- wpa_supplicant causes issues
- Use `airmon-ng check kill`

### 3. Take Snapshots
- Before enabling monitor mode
- After successful configuration
- Before major changes

### 4. Test Before Attacking
- Verify monitor mode works
- Test packet injection
- Ensure good signal strength

### 5. Return to Managed Mode
- When done practicing
- To use normal WiFi
- Restart NetworkManager

## Quick Reference

### Essential Commands

```bash
# Check interfaces
ifconfig
iwconfig

# Enable monitor mode
sudo airmon-ng start wlan0

# Disable monitor mode
sudo airmon-ng stop wlan0mon

# Scan networks
sudo airodump-ng wlan0mon

# Test injection
sudo aireplay-ng --test wlan0mon

# Change MAC
sudo macchanger -r wlan0
```

## Next Steps

Now that your wireless adapter is configured, you're ready to learn about network basics!

**Continue to**: [Network Basics →](./network-basics.md)

---

## Troubleshooting Checklist

- [ ] Adapter has correct chipset
- [ ] USB passthrough enabled in VM
- [ ] Adapter recognized by Kali (`lsusb`)
- [ ] Interface appears in `ifconfig`
- [ ] Monitor mode enabled successfully
- [ ] Can see networks in airodump-ng
- [ ] Packet injection working
- [ ] MAC address changed

---

**Pro Tip**: Keep your adapter's drivers updated for best performance and compatibility! 📡
