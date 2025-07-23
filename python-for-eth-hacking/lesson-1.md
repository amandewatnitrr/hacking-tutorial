# Writing A MAC Address Changer

  ![](./../imgs/What-is-MAC-Address.jpeg)

- MAC stands for `Media Access Control`. It is a permantent, physical and unique address assigned to netowrk interfaces by the device manufacutrer.
- So, whether you have a wireless card or wired or ether net card, each of them come with a specific address that is unique to the card, so there is no 2 devices in the world with same MAC Address.
- This address will always be the same to this specific device, even if we unplug it from our computer, and connect it to other computer. Than this netowrk device will always have the smae address.
- IP Address is used to identify computer in the netowrk, and communicate between the deivces on the iinternet.
- The MAC Address is used within the netowrk to identify devices and transfer data b/w them. So, each piece of data or packet that is sent within the network contains a source MAC and Destination MAC. Therefore, this packet will flow from the Source MAC to Destination MAC.

## Why change MAC Address??

- Because, this is a unique physical address to each interface, to each netowrk device, and used to identify devices, `changing it will make you anonymous on the netowrk`.
- Let's you impersonate as other device, and allow you to do things you might not be able to do.
- It makes this able to bypass filters and connect netowrks that only specific devices with specific MAC Addresses can only connect to, and also able to hide your identity.

## How to change MAC Address??

- Run `ifconfig` command on the computer. This will list all the interfaces available on the computer. When we say interface, we mean a network card. When we exectue the command it shows `eth0` which is a virtual interface.

    ![](../imgs/Screenshot%202025-07-24%20at%204.58.09 AM.png)

- `eth0` is not real is created by the virtual box, because the VM is set to use a NAT network, by default. It thinks that it is connected to a wired network. All this is done using a Virtual Interface connected to the Virtual Wired Network.
- We can also see `lo` which is also a virtual interface created by `linux`.

- The `ifconfig` command also lists down the detailed information about each of these interfaces.

- Now, to change the MAC Address of the Interface, we must first disable the interface.

  ```shell
  $ ifconfig ${interface_name} down
  ```

  If you don't see any erors, it means the command got executed properly. Now, that the interface is disabled, we can modify it's options. And, the option that we want to modify in our case is the `ether`, which is the MAC Address.

- We can now change the MAC Address using the command:

  ```bash
  $ ifconfig ${interface_name} hw ether ${new_mac_address}
  ```

- Now, we need to again re-enable the interface using the following command:

  ```bash
  $ ifconfig ${interface_name} up
  ```

  If we don't see the error it means the command got exectued properly.

- Now, use `ifconfig` command again to check if the MAC Address has changed again or not. Now, if you look at the `ether` option of the `interface_name` we have been using so far, it's been modified to what we have set.

- Following are the proof for proper execution of these statements:

    ```shell
    root@kali:~# ifconfig
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
            inet 172.16.47.128  netmask 255.255.255.0  broadcast 172.16.47.255
            inet6 fe80::20c:29ff:fee0:ab03  prefixlen 64  scopeid 0x20<link>
            ether 00:0c:29:e0:ab:03  txqueuelen 1000  (Ethernet)
            RX packets 809954  bytes 1184345755 (1.1 GiB)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 70404  bytes 5559742 (5.3 MiB)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
            device interrupt 45  memory 0x3fe00000-3fe20000  

    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
            inet 127.0.0.1  netmask 255.0.0.0
            inet6 ::1  prefixlen 128  scopeid 0x10<host>
            loop  txqueuelen 1000  (Local Loopback)
            RX packets 86  bytes 5923 (5.7 KiB)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 86  bytes 5923 (5.7 KiB)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

    root@kali:~# ifconfig eth0 down
    root@kali:~# ifconfig eth0 hw ether 00:11:22:33:44:55
    root@kali:~# ifconfig eth0 up
    root@kali:~# ifconfig
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
            inet 172.16.47.129  netmask 255.255.255.0  broadcast 172.16.47.255
            inet6 fe80::211:22ff:fe33:4455  prefixlen 64  scopeid 0x20<link>
            ether 00:11:22:33:44:55  txqueuelen 1000  (Ethernet)
            RX packets 809962  bytes 1184347117 (1.1 GiB)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 70422  bytes 5561664 (5.3 MiB)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
            device interrupt 45  memory 0x3fe00000-3fe20000  

    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
            inet 127.0.0.1  netmask 255.0.0.0
            inet6 ::1  prefixlen 128  scopeid 0x10<host>
            loop  txqueuelen 1000  (Local Loopback)
            RX packets 86  bytes 5923 (5.7 KiB)
            RX errors 0  dropped 0  overruns 0  frame 0
            TX packets 86  bytes 5923 (5.7 KiB)
            TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

    ```