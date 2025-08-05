# Network Hacking Post Connection Attacks - Information Gathering

![](../imgs/212749447-bfb7e725-6987-49d9-ae85-2015e3e7cc41.gif)


## Discovering Devices Connected to the Same Network

- Information Gathering is one of the most important steps when it comes to hacking or penetration testing. If you think of it you can't really gain acccess to a system, if you don't have enough information about it.

- So, let's say we are connected to the network, and one of the devices connected to the network is our target. Now, for us to hack into the target, first we need to discover all of the connected clients to this network, get their MAC Address, their IP Address, and than from there try to maybe gather more information or run some attacks in order to gain access to the target.

- Their are a number of programs that will do this for us. Examples of these programs are:

  - **Nmap**: A powerful network scanning tool that can discover hosts and services on a computer network.
  - **Netdiscover**: A simple tool for network address discovery, useful for identifying live hosts on a network.
  - **ARP Scan**: A command-line tool that uses ARP requests to discover devices on a local network.

- Right now, we will use `Netdiscover` to discover devices connected to the same network.

  Let's say we have some IP of the inet `10.0.2.16`, and we can only access the IPs on the same subnet. So, IPs on the same subnet start with `10.0.2.x`, where `x` can be any number from `0` to `254`. `254` is the last IP in the subnet.

  ```bash
  root@kali:~# netdiscover -r XX.XX.XX.1/24
  ```

    > [!NOTE]
    > `XX.XX.XX.1/24` is the way in which we can specify IP for the whole subnet. The `/24` means that the first 24 bits of the IP address are fixed, which corresponds to the subnet mask.

- You will get the following output:

    ```
    Currently scanning: Finished!   |   Screen View: Unique Hosts                                                       
                                                                                                                        
    4 Captured ARP Req/Rep packets, from 4 hosts.   Total size: 240                                                     
    _____________________________________________________________________________
    IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
    -----------------------------------------------------------------------------
    XXX.XX.XX.X     XX:XX:XX:XX:XX:XX      1      60  Unknown vendor                                                    
    XXX.XX.XX.X     XX:XX:XX:XX:XX:XX      1      60  VMware, Inc.                                                      
    XXX.XX.XX.XXX   XX:XX:XX:XX:XX:XX      1      60  VMware, Inc.                                                      
    XXX.XX.XX.XXX   XX:XX:XX:XX:XX:XX      1      60  VMware, Inc.                   
    ```

- And, right now we have a list of all the connected clients to the same network. We can also use this method to discover clients connected to the same wifi network.

  >[!IMPORTANT]
  > If there's any issue with the command, use the option `-c` to specify the number of packets to send, and `-i` to specify the interface you want to use. For example:

  ```bash
  root@kali:~# netdiscover -r XX.XX.XX.1/24 -c 10 -i <interface_name/>
  ```


## Gathering Sensitive Information about Connected Devices

- 