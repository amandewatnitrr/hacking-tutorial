import React from 'react';
import './LessonStyles.css';

const MacChanger = () => {
  return (
    <div className="lesson-page">
      <h1>Writing A MAC Address Changer</h1>
      <div className="lesson-content">
        <section>
          <h2>What is a MAC Address?</h2>
          <p>MAC stands for <strong>Media Access Control</strong>. It is a permanent, physical and unique address assigned to network interfaces by the device manufacturer.</p>
          
          <p>So, whether you have a wireless card or wired or ethernet card, each of them come with a specific address that is unique to the card, so there are no 2 devices in the world with the same MAC Address.</p>
          
          <p>This address will always be the same to this specific device, even if we unplug it from our computer, and connect it to another computer. Then this network device will always have the same address.</p>
          
          <ul>
            <li><strong>IP Address:</strong> Used to identify computers in the network, and communicate between the devices on the Internet.</li>
            <li><strong>MAC Address:</strong> Used within the network to identify devices and transfer data between them.</li>
          </ul>
          
          <p>Each piece of data or packet that is sent within the network contains a source MAC and Destination MAC. Therefore, this packet will flow from the Source MAC to Destination MAC.</p>
        </section>

        <section>
          <h2>Why change MAC Address?</h2>
          <p>Because this is a unique physical address to each interface, to each network device, and used to identify devices, changing it will make you anonymous on the network.</p>
          
          <h3>Benefits of MAC Address Changing:</h3>
          <ul>
            <li><strong>Anonymity:</strong> Makes you anonymous on the network</li>
            <li><strong>Impersonation:</strong> Lets you impersonate another device</li>
            <li><strong>Bypass Filters:</strong> Allows you to bypass MAC-based access controls</li>
            <li><strong>Network Access:</strong> Connect to networks that only allow specific MAC addresses</li>
            <li><strong>Hide Identity:</strong> Helps hide your identity during penetration testing</li>
          </ul>
        </section>

        <section>
          <h2>How to change MAC Address?</h2>
          
          <h3>Step 1: Check Current Interfaces</h3>
          <p>Run the <code>ifconfig</code> command on the computer. This will list all the interfaces available on the computer. When we say interface, we mean a network card.</p>
          
          <div className="code-block">
            <pre>ifconfig</pre>
          </div>
          
          <p>When we execute the command it shows <code>eth0</code> which is a virtual interface. <code>eth0</code> is not real. It is created by the virtual box, because the VM is set to use a NAT network, by default.</p>
          
          <p>We can also see <code>lo</code> which is also a virtual interface created by linux.</p>

          <h3>Step 2: Disable the Interface</h3>
          <p>To change the MAC Address of the Interface, we must first disable the interface.</p>
          
          <div className="code-block">
            <pre>ifconfig [interface_name] down</pre>
          </div>
          
          <p>If you don't see any errors, it means the command got executed properly.</p>

          <h3>Step 3: Change the MAC Address</h3>
          <p>Now that the interface is disabled, we can modify its options. The option that we want to modify is the <code>ether</code>, which is the MAC Address.</p>
          
          <div className="code-block">
            <pre>ifconfig [interface_name] hw ether [new_mac_address]</pre>
          </div>

          <h3>Step 4: Re-enable the Interface</h3>
          <p>Now, we need to again re-enable the interface using the following command:</p>
          
          <div className="code-block">
            <pre>ifconfig [interface_name] up</pre>
          </div>
          
          <p>If we don't see any errors, it means the command got executed properly.</p>

          <h3>Step 5: Verify the Change</h3>
          <p>Use the <code>ifconfig</code> command again to check if the MAC Address has changed. Look at the <code>ether</code> option of the interface you modified.</p>
        </section>

        <section>
          <h2>Complete Example</h2>
          <h3>Changing eth0 MAC Address</h3>
          <div className="code-block">
            <pre>
{`# Check current MAC address
ifconfig

# Disable the interface
sudo ifconfig eth0 down

# Change MAC address
sudo ifconfig eth0 hw ether 00:11:22:33:44:55

# Enable the interface
sudo ifconfig eth0 up

# Verify the change
ifconfig eth0`}
            </pre>
          </div>
        </section>

        <section>
          <h2>Automating with Python</h2>
          <p>We can create a Python script to automate this process:</p>
          
          <div className="code-block">
            <pre>
{`#!/usr/bin/env python3

import subprocess
import optparse
import re

def get_arguments():
    parser = optparse.OptionParser()
    parser.add_option("-i", "--interface", dest="interface", 
                     help="Interface to change its MAC address")
    parser.add_option("-m", "--mac", dest="new_mac", 
                     help="New MAC address")
    (options, arguments) = parser.parse_args()
    if not options.interface:
        parser.error("[-] Please specify an interface")
    elif not options.new_mac:
        parser.error("[-] Please specify a new MAC address")
    return options

def change_mac(interface, new_mac):
    print("[+] Changing MAC address for " + interface + " to " + new_mac)
    subprocess.call(["ifconfig", interface, "down"])
    subprocess.call(["ifconfig", interface, "hw", "ether", new_mac])
    subprocess.call(["ifconfig", interface, "up"])

options = get_arguments()
change_mac(options.interface, options.new_mac)`}
            </pre>
          </div>
        </section>

        <section>
          <h2>Important Notes</h2>
          <div className="warning-box">
            <h3>⚠️ Important Considerations</h3>
            <ul>
              <li><strong>Legal Use Only:</strong> Only use MAC address changing for legitimate purposes</li>
              <li><strong>Temporary Change:</strong> MAC address changes are temporary and reset on reboot</li>
              <li><strong>Valid Format:</strong> Ensure the new MAC address follows the correct format (XX:XX:XX:XX:XX:XX)</li>
              <li><strong>Network Issues:</strong> Changing MAC address might cause temporary network connectivity issues</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MacChanger;