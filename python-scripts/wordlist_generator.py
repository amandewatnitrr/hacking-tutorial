"""
wordlist_generator.py — small, safe wordlist generator for local labs

Creates a wordlist by combining base words with simple mangling options:
 - leet substitutions (a->4, e->3, i->1, o->0, s->5)
 - append/prepend years and digits
 - case variants

Usage:
    python wordlist_generator.py --out mylist.txt --bases bases.txt --years 2018-2025 --max-suffix 2

Keep it local. Do not use this against third-party systems.
"""

from __future__ import annotations
import argparse
import itertools
import os
import sys

LEET_MAP = {
    'a': ['a', '4', '@'],
    'e': ['e', '3'],
    'i': ['i', '1', '!'],
    'o': ['o', '0'],
    's': ['s', '5', '$'],
    't': ['t', '7']
}

DEFAULT_BASES = [
    'password', 'admin', 'welcome', 'letmein', 'qwerty', 'password123', 'changeme'
]


def leet_variants(word: str, max_variants: int = 50) -> list[str]:
    """Return a list of leet variants for word up to max_variants items."""
    letters = list(word)
    choices = [LEET_MAP.get(c.lower(), [c]) for c in letters]
    combos = itertools.product(*choices)
    out = []
    for i, comb in enumerate(combos):
        if i >= max_variants:
            break
        candidate = ''.join(comb)
        out.append(candidate)
    return out


def case_variants(word: str) -> list[str]:
    return [word.lower(), word.upper(), word.capitalize()]


def generate(word: str, years: list[str], max_suffix: int) -> list[str]:
    results = set()
    # base case
    results.add(word)
    # leet
    for lv in leet_variants(word, max_variants=100):
        results.add(lv)
    # case
    for cv in list(results):
        for c in case_variants(cv):
            results.add(c)
    # suffixes (digits and years)
    suffixes = []
    for n in range(0, max_suffix + 1):
        if n == 0:
            suffixes.append('')
        else:
            suffixes.extend([str(i).zfill(n) for i in range(0, 10**n)])
    # to keep output small, only use single- and two-digit suffixes generated lazily
    small_suffixes = ['']
    for y in years:
        small_suffixes.append(y)
    for d in range(0, min(100, 10**max_suffix)):
        small_suffixes.append(str(d))

    final = set()
    for base in results:
        for s in small_suffixes:
            candidate = f"{base}{s}"
            final.add(candidate)
            final.add(f"{s}{base}")
    return sorted(final)


def write_wordlist(path: str, words: list[str]) -> None:
    with open(path, 'w', encoding='utf-8') as f:
        for w in words:
            f.write(w + '\n')
    print(f'Wrote {len(words)} entries to {path}')


def parse_years(arg: str) -> list[str]:
    # expected formats: "2018-2020" or "2018,2019,2020" or single year
    if not arg:
        return []
    if ',' in arg:
        return [y.strip() for y in arg.split(',') if y.strip()]
    if '-' in arg:
        start, end = arg.split('-', 1)
        return [str(y) for y in range(int(start), int(end) + 1)]
    return [arg]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description='Simple wordlist generator (lab use only)')
    parser.add_argument('--out', '-o', default='wordlist_generated.txt', help='output file')
    parser.add_argument('--bases', '-b', help='file with base words (one per line)')
    parser.add_argument('--years', '-y', default='2018-2025', help='years or range (e.g. 2018-2025)')
    parser.add_argument('--max-suffix', type=int, default=2, help='max numeric suffix length (0-3 recommended)')
    parser.add_argument('--limit', type=int, default=5000, help='max number of entries to write')
    args = parser.parse_args(argv)

    if args.bases and os.path.exists(args.bases):
        with open(args.bases, 'r', encoding='utf-8') as f:
            bases = [line.strip() for line in f if line.strip()]
    else:
        bases = DEFAULT_BASES

    years = parse_years(args.years)

    words = []
    for b in bases:
        words.extend(generate(b, years, args.max_suffix))

    # dedupe and limit
    final = list(dict.fromkeys(words))[: args.limit]
    write_wordlist(args.out, final)
    return 0


if __name__ == '__main__':
    sys.exit(main())
