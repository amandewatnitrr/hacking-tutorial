# Getting Started with Ethical Hacking

![](./imgs/b1b55f18288795.562c702fe9883.gif)

- Hacking is getting unauthorized access to a system.
- Hackers generally are of three types:

  - Black Hat: Such hackers generally tend to cause some damage, steal information
  - White Hat: These hakers utilise the hacking knowledge for security/educational purposes
  - Grey Hat: These hackers intrude into systems but don't cause any damage to the sytem, nor steal information.

- Hacking actually do have a really big industry, due to large need of organizations to secure there data, and systems.

## Setup for learning

- For, this purpose we will utilise the concept of Virtual Machines, to replicate various systems.
- Let's discuss each component for this course:

  - Host Machine: This is your main PC or Laptop with it's current OS
    - ![](https://skillicons.dev/icons?i=kali)
  - Hacking Machine: [Kali Linux VM] This is the VM from where attack will be executed.
  - Target Machine: The Machines which we will be trying to hack into.

    - We will be using 2 target machines for this course.

      - ![](https://skillicons.dev/icons?i=windows)
      - Metasploitable

<br/>

### Virtualization

  ![](./imgs/vmw-virtualization-defined.jpg)

- What we are utilising here to have these VMs is called Virtualization. Virtualization allows you to Run Guest OS on top of Hypervisor over Host OS. This is different from concept of Containerizartion, where we run apps over the Docker Engine, and all apps sharing a common Host OS. This is not the case with Virtualization.

- Virtualization allows us to install a number of operating system inside your current OS.
- Each machine has it's own resources and fucntions like a real machine.

  - This mahchine is completely isolated from the Host OS, and hence maikes task of testing much easier.
  - It makes the issues caused due to any issues, easier to fix using th concept of snapshots.

---

# Introduction to Penetration Testing

- In this section, we will maily cover three topics:

  - Pre-Connection Attacks
  - Gaining Access
  - Post Connection Attacks

- Before, diving deep let's revise the basics of the networks.
- Let's try to understand a scenario where there are multiple, client systems, now these client systems actually wnat to have reach to the resources over the internet for which there needs to be a `server`. Let's say for now this resource is internet in our case. So, the router will act as `server` for the clients to reach to the internet. You can also refer to this router as an `access point`
  
- This router or server is the only device, that havse access to the resource or the internet, so none of these clients has direct access to the resource, even after connecting to the network.

- Let's say so all the client are connected to this router, and you search `google.com`. The Client will send a request to the `access point` searching for `google.com`. The router will take this request, and look for `google.com` over the internet.

- It will recieve `google.com` from the internet, and will forward that response to our computer, and as a result we will see the website loading on our browser.

    ![](./imgs/Screenshot%202025-07-21%20at%2011.11.34 AM.png)


## Connecting Wireless adapter to Kali ![](https://skillicons.dev/icons?i=kali)

- Why we need `wireless adapter`:

  - Network Hacking > Gaining Access > WEP Cracking
  - Network Hacking > Gaining Access > WPA/WPA2 Cracking

- The Wireless Adapter must support:

  - Monitor Mode
  - Packet Injection
  - Monitor Mode
  - AP Mode

- The Brand of the Adapter doesn't matter, but it should have either of the chipset:

  - Realtek RTL8812AU
  - Atheros AR9271