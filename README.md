# Hacking Tutorial

## Overview

This repository is a comprehensive tutorial series for ethical hacking and penetration testing. It is designed for learners who want to understand the principles, tools, and techniques used in network security, ethical hacking, and cybersecurity research. The tutorials cover both theoretical concepts and practical hands-on exercises.

## What You'll Learn

- Network scanning and information gathering
- Pre-connection and post-connection attacks
- Man-in-the-middle (MITM) attacks
- Device discovery and ARP spoofing
- Using tools like Nmap, Netdiscover, ARP Scan, and more
- Python scripting for automating security tasks
- Best practices for ethical hacking and responsible disclosure

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amandewatnitrr/hacking-tutorial.git
   cd hacking-tutorial
   ```

2. **Set up the environment:**
   Follow the detailed setup instructions in [SETUP.md](SETUP.md) to configure your development environment with all required dependencies.

3. **Explore the lessons:**
   - Lessons are organized in the `ethical-hacking/` and `python-for-eth-hacking/` folders.
   - Each lesson contains step-by-step instructions, code samples, and explanations.

4. **Try the scripts:**
   - Example scripts are available in the `python-scripts/` directory.
   - Use a safe, isolated environment (such as a VM or test network) for all practical exercises.

## Resources

- <a href="https://zsecurity.org/download-custom-kali/">Kali Linux VM</a>
- <a href="https://ln5.sync.com/dl/a524d0280/view/default/23995984090004?sync_id=0#fgbzw355-bzuq9n6t-yypf24kv-7rfsi8xu">VMware Workstation</a>
- <a href="https://drive.google.com/file/d/1-TIp1Jnj5avio3v_hpLiWrZgKXIDAZIU/view">Windows 10 VM - Google Drive Server</a>
- <a href="https://ln5.sync.com/dl/69a8cb2b0/view/default/11829848200004?sync_id=0#k2xyv9ke-qevy6hgz-tavwxu3c-78858267">Windows 10 VM - Sync.com Server</a>
- <a href="https://github.com/DhanushNehru/Ultimate-Cybersecurity-Resources">Cybersecurity Resources</a>


## Tutorial Guide

 - [Ethical Hacking for Beginners](./ethical-hacking/lesson-01.md)

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository and create a new branch for your changes.
2. Add new lessons, improve existing content, or submit scripts and tools.
3. Ensure your contributions follow ethical guidelines and do not promote illegal activity.
4. Open a pull request with a clear description of your changes.

## Analytics & Privacy Guidelines

If you want to add analytics or visitor tracking to the site, please follow these guidelines:

- Only use analytics services that respect user privacy, e.g., Plausible or Fathom.
- Do **not** collect sensitive user information.
- Clearly inform users if any tracking is enabled.
- Follow GDPR/CCPA rules if your users are in regions that require them.
- Any analytics code should be added in a separate, well-commented file (e.g., `analytics.js`) and imported only in production.

Example (using Plausible):

```js
// src/analytics.js
if (process.env.NODE_ENV === 'production') {
  (function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://plausible.io/js/plausible.js';
    s.async = true; s.defer = true; s.setAttribute('data-domain', 'yourdomain.com');
    d.head.appendChild(s);
  })();
}
```
## Safety & ethics 

-Only run this lab in an environment you control (local machine, VM, or Docker).
-The lab is intentionally non-actionable: it demonstrates unsafe patterns as strings and provides safe alternatives.
-Do not use the examples to attack third‑party systems. See sql-injection-lab/LICENSE_NOTE.md for details.##

## Security Warning

**Avoid using the `python_crypto` library or any other cryptographic or hacking-related libraries that are unmaintained, deprecated, or suspicious.**

- Always use reputable, well-maintained libraries and tools.
- If you are unsure about a dependency, open an issue or ask before using it.

## Disclaimer

This project is for educational purposes only. All activities described should be performed in controlled, legal environments. The authors are not responsible for any misuse of the information provided.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
