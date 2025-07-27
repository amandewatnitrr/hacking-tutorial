# Network Hacking - Gaining Access - WPA/WPA2 Cracking

![](../imgs/06f21a161921919.63cd7887d0a70.gif)

## Introduction to WPA/WPA2 Cracking

- Both WPA and WPA2 are very very similar the only difference is that WPA2 uses AES/CCMP encryption while WPA uses TKIP.
- The WPA/WPA2 protocol is designed to be more secure than WEP, but it can still be vulnerable to certain types of attacks, especially if weak passwords are used.
- Each packet in WPA/WPA2 contains a 256-bit key, which is derived from the pre-shared key (PSK) and the SSID of the network.

## WPS (Wi-Fi Protected Setup) Vulnerability

- But, there's a feature if enabled and misconfigured, can be exploited to recover the key without having to crack the actual encryption.
- The Feature is called **WPS (Wi-Fi Protected Setup)**, which allows users to easily connect devices to a Wi-Fi network without entering the password.
- It was designed to simplify the process of connecting devices such as printers, fax etc. to a Wi-Fi network.
- We can actually see a WPS button on most wireless printers, if this button is pressed, and than we press WPS button on the router, it will automatically connect to the network without needing to enter the password.
- The authentication is done using an 8-digit PIN, which is used to derive the WPA/WPA2 key. So, you can take this as password made up of only numbers, and the length of the password is 8 digits. So, this gives us a relitively small keyspace to brute-force.
- Once, we get this pin, it can be used to recover the actual WPA/WPA2 key, which can then be used to decrypt the traffic on the network.
- In this case, we are not actually cracking the WPA/WPA2 encryption, but rather exploiting a vulnerability in the WPS protocol to recover the key.
 
>[!NOTE]
> This only works if the WPS feature is enabled on the target router and, is not configured to use Push Button Authentication (PBA) mode instead of Normal Pin Authentication (NPA) mode.

- The router will refuse to accept any pin entered if the router is in `Push Button Authentication (PBA)` mode. And, will only work after the WPS button is pressed on the router.

- So, in most routers PBC (Push Button Configuration) is the default mode, and WPS is disabled by default.

- In such a scenario, we will first scan for the WPS enabled networks, using the command:

    ```bash
    root@kali:~# wash --interface wlan0
    BSSID               Ch  dBm  WPS  Lck  Vendor    ESSID
    --------------------------------------------------------------------------------

    WIFI_MAC    1  -04  2.0  Yes  Unknown   WIFI_NAME
    ```

- Hence, now we know we have a WPS enabled network, we can use the `reaver` tool to brute-force the WPS PIN and recover the WPA/WPA2 key.

>[!CAUTION]
> It will not work, and fail in this scenario cause if you LCK (Lock) is set to `Yes`, which means the WPS feature is locked due to too many failed attempts or by default.<br/><br/>
> The attack will also not work if the Router has AP Rate Limiting (ARL) enabled, which limits the number of authentication attempts per second. It may but will take a long time to brute-force the WPS PIN.

- Once, we have the info about the WPS enabled network, we can use the `reaver` tool to brute-force the WPS PIN and recover the WPA/WPA2 key along side `aireplay-ng` to associate with the target network.]

- So, first run the command:

    ```bash
    root@kali:~# reaver --bssid WIFI_MAC --channel <channel_number> --interface wlan0 -vvv --no-associate
    ```

    And, than run the command:

    ```bash
    root@kali:~# aireplay-ng --fakeauth 30 -a WIFI_MAC -h WIRELESS_ADAPTER_MAC wlan0
    ```

- And, this should start trying all possible combinations of the WPS PIN, and once it finds the correct one, it will display the WPA/WPA2 key.