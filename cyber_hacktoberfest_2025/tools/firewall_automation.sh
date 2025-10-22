#!/bin/bash
# Simple ufw automation script - run on Debian/Ubuntu
# Usage: sudo ./firewall_automation.sh allow|deny port
if [ $# -lt 2 ]; then
  echo "Usage: $0 allow|deny port"
  exit 1
fi

ACTION=$1
PORT=$2

if ! command -v ufw >/dev/null 2>&1; then
  echo "ufw not installed. Install with: sudo apt install ufw"
  exit 1
fi

sudo ufw $ACTION $PORT
sudo ufw status
