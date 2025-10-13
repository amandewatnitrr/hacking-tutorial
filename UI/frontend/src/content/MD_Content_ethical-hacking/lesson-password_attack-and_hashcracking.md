---
title: "Password Attacks & Hash Cracking"
slug: "lesson-password_attack-and_hashcracking"
order: 9
category: "ethical-hacking"
prev: "lesson-fing"
next: "lesson-passwordcracking"
---

 # Lesson 07 — Password Attacks & Hash Cracking (Hashcat & John)

 ## Overview

 This lesson introduces password-based attacks and demonstrates local, safe labs for cracking password hashes using two common tools: Hashcat and John the Ripper. It focuses on practical techniques, defensive measures, and legal/ethical constraints.

 > Important: Only perform these exercises on machines and data you own or where you have explicit permission. Never attempt password cracking on third-party systems without written authorization.

 ## Learning objectives

 - Understand common password attack types: guessing, dictionary, brute-force, rule-based, and hybrid attacks.
 - Learn how to extract and prepare password hashes for cracking (examples: /etc/shadow, exported hashes from a DB dump) in safe, local environments.
 - Run basic Hashcat and John the Ripper jobs against sample hashes and interpret results.
 - Learn defensive controls: strong hashing (bcrypt/argon2), salting, rate-limiting, MFA, and password policies.

 ## Prerequisites

 - Basic command-line skills
 - Python 3 (for small helper scripts)
 - Hashcat or John the Ripper installed (or Docker images if you prefer container runs)
 - A small password wordlist (rockyou or custom)

 If you don't want to install tools locally, use the official Docker images for Hashcat or John.

 ## Lab setup — safe sample hashes

 We'll create a minimal, local sample file with a few hashed passwords using common algorithms. Save the following small Python helper as `make_hashes.py` and run it locally to produce `sample_hashes.txt`.

 ```python
 # make_hashes.py — generate sample password hashes (for local lab only)
 import hashlib
 import bcrypt

 passwords = [
     'password123',
     'hunter2',
     'S3cur3P@ss!',
     'letmein',
 ]

 # SHA1 (insecure, demonstrative)
 with open('sample_hashes.txt', 'w') as f:
     for p in passwords:
         h = hashlib.sha1(p.encode()).hexdigest()
         f.write(f'sha1:{h}:{p}\n')

 # bcrypt (slow, recommended for real systems)
 with open('sample_hashes_bcrypt.txt', 'w') as f:
     for p in passwords:
         bh = bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()
         f.write(f'bcrypt:{bh}:{p}\n')
```

 Run it to create `sample_hashes.txt` and `sample_hashes_bcrypt.txt`.

 ## Lab 1 — Cracking simple SHA1 hashes with Hashcat (demo)

 1. Prepare your wordlist. If you have `rockyou.txt`, use it; otherwise create a tiny `wordlist.txt` with candidate passwords.

 2. Hashcat requires a hash file with one hash per line. Extract the SHA1 column from `sample_hashes.txt` into `sha1-only.txt` (one hash per line).

 3. Run Hashcat in a minimal mode (example uses hash type 100 for raw SHA1):

 ```bash
 # Example (Linux/WSL/PowerShell-friendly):
 hashcat -m 100 -a 0 sha1-only.txt wordlist.txt --show
 ```

 - `-m 100` selects SHA1, `-a 0` is a straight/dictionary attack. `--show` prints cracked hashes.

 Notes:
 - On Windows, use the Hashcat binary or Docker image. For Docker, run the official image and mount the files.
 - Use limits (like `--session` and `--runtime`) to avoid long runs.

 ## Lab 2 — John the Ripper (single mode and wordlist)

 John is simpler to start with for beginners. Prepare a `john_hashes.txt` in a format John expects (one hash per line). Then run:

 ```bash
 john --wordlist=wordlist.txt john_hashes.txt
 john --show john_hashes.txt
 ```

 Use `--rules` to apply mangling rules (prepend/append digits, case changes).

 ## Lab 3 — Hashcat rules and hybrid attacks (brief)

 Hashcat supports powerful rule sets. Example: use the `best64.rule` with a dictionary:

 ```bash
 hashcat -m 100 -a 0 sha1-only.txt wordlist.txt -r rules/best64.rule --show
 ```

 Hybrid attack (mask + wordlist):

 ```bash
 hashcat -m 100 -a 6 sha1-only.txt wordlist.txt ?d?d
 ```

 This appends two digits to each word from the list.

 ## Lab 4 — Cracking bcrypt (why it's harder)

 Bcrypt is intentionally slow and resists GPU acceleration. Use John or Hashcat with the right mode, but expect longer runtimes. Example with John:

 ```bash
 john --wordlist=wordlist.txt sample_hashes_bcrypt.txt
 ```

 Expect bcrypt cracking to be much slower — that's by design.

 ## Defensive measures — how to stop this happening

 - Use strong, slow password hashing algorithms: Argon2, bcrypt, or scrypt. Avoid raw SHA1/MD5 for passwords.
 - Salt all passwords with a unique per-user salt.
 - Enforce strong password policies and use password strength meters at signup.
 - Implement multi-factor authentication (MFA) to reduce impact of compromised passwords.
 - Rate-limit authentication attempts and lock or escalate after repeated failures.
 - Monitor for credential stuffing and leaked credential reuse (breach detection).

 ## Safe practice and legal notes

 - Only test on data you own or are explicitly authorized to test.
 - Treat leaked password dumps as sensitive — do not publish or redistribute.
 - If you find real weak passwords during a sanctioned test, document and report them responsibly.

 ## Optional exercises

 - Add salt and switch the sample hashes to Argon2 (use `argon2-cffi` in Python) and verify how cracking becomes more difficult.
 - Build a small script that converts `/etc/shadow` entries (locally created VM) into John-compatible format and run John against it (do this only in a lab VM).
 - Try a hybrid Hashcat attack combining a wordlist and masks to simulate common user behavior (e.g., appending years).

 ## References

 - Hashcat docs: https://hashcat.net/hashcat/
 - John the Ripper: https://www.openwall.com/john/
 - OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

 ---

### Path

<- [Previous Lesson: Introduction to Network Scanning with Fing](./lesson-fing.md)  |  [Next Lesson: Password Cracking](./lesson-passwordcracking.md) ->

 Updated: 2025-10-07
