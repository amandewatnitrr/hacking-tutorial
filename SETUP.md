# Environment Setup Guide

## Prerequisites

- Python 3.8+ installed
- pip up-to-date: `python -m pip install --upgrade pip`

## Platform-Specific Setup

### Linux / macOS

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

2. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

4. For scapy raw sockets: either run scripts as root or set capabilities (Linux):
   ```bash
   sudo setcap cap_net_raw,cap_net_admin=eip $(which python3)
   ```

### Windows (PowerShell)

1. Create a virtual environment:
   ```powershell
   python -m venv .venv
   ```

2. Activate the virtual environment:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements-dev.txt
   ```

4. Install Npcap (WinPcap-compatible) for packet capture:
   - Download from: https://nmap.org/npcap/
   - Install with WinPcap compatibility mode enabled

## Virtual Environment Activation Shortcuts

We provide helper scripts to make activation easier:

- Linux/macOS: `scripts/activate_venv.sh`
- Windows: `scripts/activate_venv.ps1`

## Troubleshooting

### Common Issues

1. **Permission errors with Scapy**: 
   - Linux/macOS: Use sudo or set capabilities as shown above
   - Windows: Run PowerShell as Administrator

2. **Binary wheel build failures**:
   - Install system-level build tools:
     - Ubuntu/Debian: `sudo apt install build-essential python3-dev`
     - CentOS/RHEL: `sudo yum install gcc python3-devel`
     - macOS: Install Xcode command line tools: `xcode-select --install`

3. **SSL issues**:
   - Update certificates: `pip install --upgrade certifi`
   - Set environment variables if behind corporate firewall:
     ```bash
     export SSL_CERT_FILE=/path/to/certificate.pem
     export REQUESTS_CA_BUNDLE=/path/to/certificate.pem
     ```

4. **pip cache issues**:
   - Clear cache: `pip cache purge` then reinstall

5. **GeoIP database issues**:
   - Download GeoLite2 database from MaxMind
   - Set environment variable: `export GEOIP_DATABASE_PATH=/path/to/GeoLite2-City.mmdb`

## Required System Tools

### Network Tools
- `netdiscover` - Network scanning (Linux)
- `nmap` - Port scanning and network discovery
- `bettercap` - MITM attacks and network analysis

### Installation Commands

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install netdiscover nmap
# For bettercap, follow official installation instructions
```

#### CentOS/RHEL:
```bash
sudo yum install nmap
# For other tools, use equivalent packages or compile from source
```

#### macOS:
```bash
brew install nmap
# For other tools, use Homebrew or compile from source
```

#### Windows:
- Download installers from official websites
- Make sure tools are added to PATH

## Verification

After installation, verify your setup:

```bash
# Check Python version
python --version

# Check pip version
pip --version

# Verify core dependencies
python -c "import scapy, requests, bs4, cryptography, geoip2, urllib3, paramiko; print('All dependencies imported successfully')"
```

## Running Tests

To run the test suite:

```bash
# Activate virtual environment first
source .venv/bin/activate  # Linux/macOS
# or
.\.venv\Scripts\Activate.ps1  # Windows

# Run tests
pytest
```

## Development Workflow

1. Always work within the virtual environment
2. Run linters before committing:
   ```bash
   black .
   isort .
   mypy .
   ```
3. Run security checks:
   ```bash
   pip-audit
   ```
4. Run tests to ensure nothing is broken