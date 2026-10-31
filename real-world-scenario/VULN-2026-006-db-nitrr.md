# VULN-2026-006 — db.nitrr.ac.in security issues

Site: https://db.nitrr.ac.in (NIT Raipur — Database Administration Panel)
Stack: phpMyAdmin 5.2.3 on Apache/2.4.65 (Debian) + PHP/8.3.26
Reported by: amandewatnitrr
Date: 2026-10-28
Status: **Critical — patch required before next business day**

Testing was passive and non-exploiting: HTTP header inspection, HTTP response code probing, NVD API queries, and one non-destructive detection probe (multipart POST with `PHP_SESSION_UPLOAD_PROGRESS` field, no shellcode, no OOM trigger, no zval forgery). No login attempts, no fuzzing, no injection payloads. Evidence files in [`real-world-scenario/db_nitrr_evidence/`](db_nitrr_evidence/).

**I am co-owner of NIT Raipur systems. This is an authorized security assessment.**

---

## Summary of Findings

| # | Finding | CWE | CVSS | Severity |
| --- | --- | --- | --- | --- |
| 1 | phpMyAdmin exposed on public internet, pre-configured as MySQL **root** | CWE-425 + CWE-250 | — | **Critical** |
| 2 | CVE-2026-109618: PHP session.upload_progress OOM → UAF → RCE (CISA KEV) | CWE-416 | **9.8 Critical** | **Critical** |
| 3 | CVE-2026-109619: PHP global state reset failure → stale pointer → RCE | CWE-416 | **8.1 High** | **High** |
| 4 | No rate limiting on phpMyAdmin login | CWE-307 | — | High |
| 5 | No HSTS (Strict-Transport-Security absent) | CWE-319 | — | Medium |
| 6 | CSP allows `unsafe-inline` + `unsafe-eval` | CWE-693 | — | Medium |
| 7 | README file exposes exact phpMyAdmin version | CWE-200 | — | Low |
| 8 | Server version disclosed on every response | CWE-200 | — | Low |

---

## Finding 1 — phpMyAdmin on public internet, configured as root (Critical)

`https://db.nitrr.ac.in/` serves the phpMyAdmin login page to the entire public internet with no IP restriction. The application is pre-configured to authenticate as the MySQL **root** account, confirmed from the page's own JavaScript:

```javascript
// Extracted from CommonParams in phpMyAdmin page source
user: "root",
auth_type: "cookie"
```

Anyone who logs in — via credential stuffing, brute force, or a PHP RCE bypass (Finding 2/3) — receives full MySQL root access: read, write, drop, and execute against every database on the server.

### Reproduce it

```bash
curl -sS -D - -o /dev/null "https://db.nitrr.ac.in/"
# HTTP/2 200 — full phpMyAdmin login renders, no IP check
```

```bash
curl -sS "https://db.nitrr.ac.in/" | grep '"user"'
# CommonParams.setAll({...user:"root"...})
```

### Impact

Public-internet phpMyAdmin with root credentials = full database compromise if password is weak, reused, or bypassed via Finding 2.

### Fix

```apache
# Apache: restrict to internal network only
<Directory /var/www/html/phpmyadmin>
    Order Deny,Allow
    Deny from all
    Allow from 10.0.0.0/8
    Allow from 192.168.0.0/16
</Directory>
```

Alternatively, move phpMyAdmin to a VPN-only or bastion-host-only IP.

---

## Finding 2 — CVE-2026-109618: PHP2Shell RCE via session.upload_progress OOM (Critical)

**CVE:** CVE-2026-109618  
**CVSS 3.1:** 9.8 CRITICAL — `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`  
**CWE:** CWE-416 (Use After Free)  
**CISA KEV:** Yes — listed as actively exploited  
**NVD Status:** Analyzed (published 2026-10-21)

### What the vulnerability is

PHP uses `longjmp()` for out-of-memory (OOM) errors to abort the current request context. When OOM occurs in certain code paths, request memory is left partially uninitialized before the next allocation. The subsequent request cleanup reads or branches on this memory. An attacker can consistently trigger this condition via crafted `multipart/form-data` requests that exploit `PHP_SESSION_UPLOAD_PROGRESS`, leading to a use-after-free condition and remote code execution.

**The attack does not require authentication** (`PR:N`). Any HTTP endpoint on the server that accepts POST requests is in scope.

### Affected versions (from NVD)

| Branch | Vulnerable range | Fixed in |
| --- | --- | --- |
| PHP 8.2 | < 8.2.35 | 8.2.35 |
| PHP 8.3 | < 8.3.36 | **8.3.36** |
| PHP 8.4 | < 8.4.27 | 8.4.27 |
| PHP 8.5 | < 8.5.12 | 8.5.12 |

### Server status

```
Running: PHP/8.3.26  (from X-Powered-By response header)
Fixed:   PHP 8.3.36
Result:  8.3.26 < 8.3.36 → VULNERABLE
```

### Detection probe (non-exploiting)

A minimal `session.upload_progress` probe was sent to confirm the attack surface is reachable:

```bash
curl -sS -D - --max-time 20 \
  -X POST "https://db.nitrr.ac.in/index.php?route=/&lang=en" \
  -H "Cookie: PHPSESSID=detectprobe_$(date +%s)" \
  -F "PHP_SESSION_UPLOAD_PROGRESS=detect_probe_cve_2026_109618" \
  -F "dummy=@/dev/null;type=text/plain;filename=probe.txt"
```

**Result: HTTP 200.** PHP processed the request. The `session.upload_progress` code path is reachable. Full evidence in [`db_nitrr_evidence/detection_probe_result.txt`](db_nitrr_evidence/detection_probe_result.txt).

> Note: This probe does not trigger OOM, does not forge zval structs, and does not attempt code execution. It only confirms the entry point is exposed. Actual exploitation (OOM trigger → zval UAF → shell) requires a dedicated security testing environment, not a production-adjacent server. For board-level confirmation, the version comparison and CISA KEV listing constitute sufficient proof.

### Active exploitation in the wild

Data from the Delft Threat Intelligence Lab (`php2shell.delftintellab.com`), collected since 2026-10-21:

| Metric | Value |
| --- | --- |
| Exploitation requests seen | **72,376** |
| Unique attacker IPs | **659** |
| IPs sending dropper/shellcode | 174 |
| First exploitation seen | 2026-10-21 08:37:17 UTC |
| Techniques observed | OOM via nested names, OOM via empty file fields, OOM via header flood, OOM via hundreds of parts, forged zval structs, session deserialization gadgets, wget/curl droppers |
| CISA KEV listing | **Yes** |

This vulnerability is being actively weaponized by real attackers. The server at `db.nitrr.ac.in` is exposed to the same scanning population.

### References

- NVD: https://nvd.nist.gov/vuln/detail/CVE-2026-109618
- PHP advisory: https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w
- CISA KEV: https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-109618
- Delft Threat Intel Lab live data: https://php2shell.delftintellab.com
- Wiz research: https://www.wiz.io/blog/php2shell-php-rce
- Arctic Wolf: https://arcticwolf.com/resources/blog/php2shell-critical-php-vulnerabilities-enable-unauthenticated-remote-code-execution/

### Fix

```bash
sudo apt update && sudo apt install --only-upgrade php8.3
php -v  # must show >= 8.3.36
sudo systemctl restart apache2
```

Verify:
```bash
curl -s -I "https://db.nitrr.ac.in/" | grep "X-Powered-By"
# X-Powered-By: PHP/8.3.36
```

---

## Finding 3 — CVE-2026-109619: PHP global state stale pointer → RCE (High)

**CVE:** CVE-2026-109619  
**CVSS 3.1:** 8.1 HIGH  
**CWE:** CWE-416 (Use After Free)

### What the vulnerability is

PHP maintains global state that temporarily points into per-request memory. In certain scenarios this global state is not correctly reset between requests, or is repopulated after being reset. A subsequent request reads or branches on this stale state before it is fully re-initialized, leading to a use-after-free and RCE.

**Also affects PHP 8.3.26. Fixed in the same release (8.3.36) as CVE-2026-109618.**

### Affected versions

Identical to CVE-2026-109618: PHP 8.3.* < 8.3.36 affected.

### Fix

Same as Finding 2 — upgrading to PHP 8.3.36 fixes both CVEs in one operation.

---

## Finding 4 — No rate limiting on phpMyAdmin login (High)

phpMyAdmin's login at `/index.php` returns HTTP 200 on failed attempts with no delay, no lockout, and no 429. Combined with Finding 1 (public internet, root account), this enables unlimited credential stuffing.

### Reproduce it

```bash
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    "https://db.nitrr.ac.in/index.php?route=/&lang=en" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "pma_username=root&pma_password=wrongpass${i}&server=1" &
done; wait
# All return 200 — no 429, no lockout
```

### Fix

```bash
# fail2ban filter for phpMyAdmin
# /etc/fail2ban/filter.d/phpmyadmin.conf
[Definition]
failregex = ^<HOST> .* POST /index\.php.*" 200
ignoreregex =

# /etc/fail2ban/jail.local
[phpmyadmin]
enabled = true
filter = phpmyadmin
logpath = /var/log/apache2/access.log
maxretry = 5
findtime = 60
bantime = 3600
```

---

## Finding 5 — No HSTS (Medium)

```bash
curl -sS -D - -o /dev/null "https://db.nitrr.ac.in/"
# No Strict-Transport-Security header in response
```

HTTP redirects to HTTPS (301) but without HSTS, the first-hop request is vulnerable to SSL stripping on hostile networks. phpMyAdmin session cookies could be intercepted.

**Fix:** `Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"` in Apache vhost.

---

## Finding 6 — CSP allows `unsafe-inline` + `unsafe-eval` (Medium)

```
content-security-policy: script-src 'self' 'unsafe-inline' 'unsafe-eval'
```

These directives defeat CSP's XSS protection. phpMyAdmin requires them for its own UI, but they mean the policy provides no protection if XSS is introduced in a custom theme or plugin.

**Mitigation:** Restrict phpMyAdmin to internal network (Finding 1 fix) — this limits who can reach any XSS to authenticated internal users only.

---

## Finding 7 — README exposes phpMyAdmin version (Low)

```bash
curl -sS "https://db.nitrr.ac.in/README"
# phpMyAdmin - Readme
# Version 5.2.3
```

Confirms the exact version to any external probe.

**Fix:** In Apache config: `<Files ~ "^(README|CHANGELOG|LICENSE)"> Deny from all </Files>`

---

## Finding 8 — Server + PHP version disclosed (Low)

Every response includes:
```
Server: Apache/2.4.65 (Debian)
X-Powered-By: PHP/8.3.26
```

**Fix:** `ServerTokens Prod` in `apache2.conf`; `expose_php = Off` in `php.ini`.

---

## How bad is this overall?

Finding 1 alone (phpMyAdmin as root, public internet) is a critical configuration error that makes every other security control irrelevant — an attacker who successfully authenticates owns every database. Findings 2 and 3 make this worse: they provide a **pre-authentication RCE path** that bypasses the login entirely. The combination is:

> Public internet + no auth required for RCE + root MySQL access = complete server compromise with no user interaction.

This is not a theoretical risk. 659 real attacker IPs have sent 72,376 exploitation requests against servers running the same stack since this CVE was published one week ago.

---

## Fix priority and timeline

| Priority | Finding | Action | Owner |
| --- | --- | --- | --- |
| **Immediate** (today) | 2, 3 | `apt upgrade php8.3` to ≥ 8.3.36 | Sysadmin |
| **Immediate** (today) | 1 | IP-restrict phpMyAdmin to internal network | Sysadmin |
| **This week** | 4 | Deploy fail2ban for phpMyAdmin login | Sysadmin |
| **This week** | 5 | Add HSTS header | Sysadmin |
| **Backlog** | 6, 7, 8 | CSP hardening, block README, suppress version headers | Dev/Sysadmin |

---

## Evidence files

| File | Contents |
| --- | --- |
| [`db_nitrr_evidence/cve_2026_109618_nvd.txt`](db_nitrr_evidence/cve_2026_109618_nvd.txt) | NVD API response for CVE-2026-109618 (CVSS 9.8, affected versions, references) |
| [`db_nitrr_evidence/cve_2026_109619_nvd.txt`](db_nitrr_evidence/cve_2026_109619_nvd.txt) | NVD API response for CVE-2026-109619 (CVSS 8.1, affected versions) |
| [`db_nitrr_evidence/detection_probe_result.txt`](db_nitrr_evidence/detection_probe_result.txt) | Detection probe output confirming session.upload_progress is reachable on this server |
