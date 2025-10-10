



## 🛡️ Bettercap Controller

A professional Python automation script for controlling **Bettercap** operations, including device discovery, target selection, and ARP spoofing workflows.

### Features

- **Automated Bettercap Management**: Launches and controls Bettercap as a subprocess
- **Interactive Device Discovery**: Uses `net.probe` to discover network devices automatically
- **User-Friendly Target Selection**: Intuitive interface for selecting attack targets
- **Flexible Attack Configuration**: Supports both simplex and full-duplex ARP spoofing
- **Real-time Output Streaming**: Live display of Bettercap operations and captured data
- **Professional Error Handling**: Comprehensive error management and graceful cleanup

### System Architecture

The script follows a structured workflow with clear separation of concerns and professional error handling.

![Bettercap Controller - System Architecture](images/bettercap_controller_flow_professional.png)

### Execution Flow

1. **Initialization**: Validates arguments and launches Bettercap subprocess
2. **Device Discovery**: Executes `net.probe` to scan the local network
3. **Target Selection**: Parses discovered devices and presents selection interface  
4. **Attack Configuration**: Configures ARP spoofing parameters based on user input
5. **Operation Execution**: Launches coordinated ARP spoofing and packet sniffing
6. **Real-time Monitoring**: Streams live output with proper cleanup handling

### Usage

```bash
# Standard Ethernet interface
python bettercap_controller.py eth0

# Wireless interface  
python bettercap_controller.py wlan0
```

### Live Demonstration

Below is a screenshot from an actual test session showing the script in operation:

![Live Demo Session](images/bettercap_arp_op.jpg)

The demonstration shows:
- **Device Discovery Phase**: Automatic network scanning and device enumeration
- **Interactive Selection**: User-friendly target selection interface
- **Real-time Operations**: Live ARP spoofing and packet capture output
- **Professional Logging**: Structured output with timestamps and status indicators

---

## 📋 System Requirements

### Common Requirements
- **Python 3.x** with standard libraries
- **Linux/Unix environment** (recommended)
- **Administrative privileges** for network operations

### Tool-Specific Requirements

**Port Scanner:**
- No external dependencies (uses built-in `asyncio`)
- Network access to target hosts

**Bettercap Controller:**
- Bettercap installed and accessible via `$PATH`
- Sudo access for network interface operations
- Valid network interface for packet capture

---



## 🎓 Educational Applications

### Network Security Training
- Demonstrates real-world attack vectors in controlled environments
- Illustrates the importance of network segmentation and monitoring
- Shows practical implementation of asynchronous programming
- Provides hands-on experience with professional security tools

### Defensive Security
- Enables testing of network security monitoring capabilities
- Validates effectiveness of port scanning detection systems
- Demonstrates the importance of encrypted protocol usage
- Supports security awareness training programs

---

## 🔧 Core Functionality

### Bettercap Controller

#### Device Discovery Module
```python
def discover_devices(proc):
    """
    Orchestrates network device discovery using Bettercap's net.probe functionality.
    Implements threaded output reading for non-blocking operation.
    """
```

#### Attack Execution Engine
```python
def run_attack(proc, targets, fullduplex):
    """
    Constructs and executes the coordinated attack command sequence.
    Manages real-time output streaming and graceful termination.
    """
```

#### Bettercap Command Integration
- **`net.probe`**: Active network reconnaissance and device enumeration
- **`net.show`**: Device list parsing and metadata extraction  
- **`arp.spoof`**: ARP spoofing attack coordination with configurable parameters
- **`net.sniff`**: Packet capture and real-time traffic analysis

---

## ⚖️ Legal and Ethical Guidelines

### Professional Use Only

These tools are designed for authorized security professionals, educators, and students working in controlled environments. Users must:

- ✅ **Obtain explicit written authorization** before any testing
- ✅ **Use only in isolated laboratory environments** for unauthorized testing
- ✅ **Maintain detailed logs and documentation** of all activities
- ✅ **Follow applicable local, state, and federal laws** regarding network security testing
- ✅ **Respect privacy and confidentiality** of any intercepted data

### Recommended Testing Environment

- Virtual machine networks (VMware, VirtualBox)
- Isolated physical test networks
- Dedicated cybersecurity training laboratories
- Home networks with proper consent from all users

### Security Considerations

#### Authorization Requirements
- **Authorized Networks Only**: Only use on networks you own or have explicit permission to test
- **Laboratory Environment**: Ideal for isolated testing environments and educational labs
- **Documentation**: Maintain proper documentation and approval records

#### Detection and Countermeasures
- **ARP Table Monitoring**: Network administrators can detect ARP spoofing through table analysis
- **Dynamic ARP Inspection**: Enterprise switches can validate ARP traffic automatically
- **Static ARP Entries**: Manual ARP table configuration prevents spoofing attacks
- **Network Monitoring**: Tools like `arpwatch` can identify suspicious ARP behavior

---



Contributions are welcome! Please ensure all contributions:

- Maintain the educational focus and include appropriate security warnings
- Include comprehensive documentation and error handling
- Follow ethical guidelines and legal compliance standards
- Provide clear usage examples and safety instructions

---

## 📄 License

MIT License - See LICENSE file for details

---

**Note**: These tools prioritize education and authorized testing. Always ensure compliance with applicable laws and organizational policies before use. The visual documentation and professional architecture diagrams help users understand both the technical implementation and the ethical considerations involved in network security testing.
