# Linux Security Basics

## File permissions
- `ls -l` to view permissions.
- `chmod 700 file` to restrict access.

## SSH hardening
- Edit `/etc/ssh/sshd_config`:
  - `PermitRootLogin no`
  - `PasswordAuthentication no` (use keys)
  - Optionally change `Port 2222`
- Use `ssh-copy-id` to install public keys.

## Firewall (ufw)
```bash
sudo apt update && sudo apt upgrade
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw status
```

## System updates & monitoring
- Use automatic security updates where appropriate.
- Monitor logs in `/var/log/` and consider tools like `fail2ban` to prevent brute-force.
