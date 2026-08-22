# Contributor License Agreement and Developer Certificate of Origin

Contributions to this repository are subject to the [Individual](doc/legal/individual_contributor_license_agreement.md), depending on where the contribution is made and on whose behalf unless otherwise agreed in writing:

- By submitting code contributions as an individual to the `main` branch of this repository, you agree to the [Individual Contributor License Agreement](doc/legal/individual_contributor_license_agreement.md).

_This notice should stay as the first item in the `CONTRIBUTING.md` file._

## Code of Conduct

[View the documentation](https://about.gitlab.com/community/contribute/code-of-conduct/) to find the latest information.

## How to Contribute

1. **Search existing issues** – you might find someone already working on it.
2. **Open an issue** for new bugs or feature requests with steps to reproduce and expected behavior.
3. For **small fixes**, you can open a PR directly.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/amandewatnitrr/hacking-tutorial.git
cd hacking-tutorial/UI/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Masking Leaked IP / MAC Addresses

Before pushing, run [`mask_ip_addresses.py`](./mask_ip_addresses.py) from the repo root. It scans tracked files for IPv4, IPv6, and MAC (EUI-48) addresses and masks any that look like real, public, or otherwise leaked addresses (e.g. pasted from a terminal, a log, an `ip a`/`ifconfig`/`arp -a` dump, or a screenshot transcribed into a lesson).

By default it **leaves private/reserved/documentation IP ranges and placeholder MACs alone** (`192.168.0.0/16`, `10.0.0.0/8`, `172.16.0.0/12`, `127.0.0.0/8`, `fe80::/10`, `2001:db8::/32`, `00:11:22:33:44:55`, `ff:ff:ff:ff:ff:ff`, `00:00:00:00:00:00`, etc.), since this repo's lessons legitimately use those in examples. Real hardware MACs (e.g. a NIC's actual vendor-prefixed address like `B4:3D:08:2D:91:41`) are treated as leaks and masked by default.

```bash
# Dry run — lists any leaked IPs and exits non-zero if it finds one (good pre-push gate)
python3 mask_ip_addresses.py --check

# Mask them in place, then review the diff before committing
python3 mask_ip_addresses.py
git diff

# Only check files staged for commit
python3 mask_ip_addresses.py --check --staged-only

# Also mask private/example ranges (rarely needed — only if you pasted a real internal IP)
python3 mask_ip_addresses.py --all
```

IPv4 addresses are replaced with `XX.XX.XX.XX`, IPv6 with `XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX:XXXX`, and MAC addresses with `XX:XX:XX:XX:XX:XX`. Always re-read the diff afterward — the script errs on the side of not touching addresses it can't confidently classify (e.g. IPv4-mapped IPv6 like `::ffff:192.168.1.1` is left as-is beyond its embedded IPv4 part).
