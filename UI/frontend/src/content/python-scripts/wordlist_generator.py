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

# Mapping used to create simple "leetspeak" variants. Keys are letters and values
# are candidate replacements used when generating permutations. We include a few
# common substitutions but keep this small to avoid explosion of combinations.
LEET_MAP = {
    'a': ['a', '4', '@'],
    'e': ['e', '3'],
    'i': ['i', '1', '!'],
    'o': ['o', '0'],
    's': ['s', '5', '$'],
    't': ['t', '7']
}

# Default base words used when no `--bases` file is provided. These are simple
# example words suitable for local lab demonstrations (do not use real leaked
# passwords).
DEFAULT_BASES = [
    'password', 'admin', 'welcome', 'letmein', 'qwerty', 'password123', 'changeme'
]


def leet_variants(word: str, max_variants: int = 50) -> list[str]:
    """Generate up to ``max_variants`` leetspeak permutations for ``word``.

    - word: input string to transform (e.g. "password").
    - max_variants: safety cap to avoid combinatorial explosion.

    Implementation details:
    - For each character, look up the replacement options in ``LEET_MAP``.
    - Use itertools.product to iterate the Cartesian product of choices.
    - Stop after ``max_variants`` results to keep output manageable.

    Returns a list of generated strings.
    """
    # Convert the word into a list of characters so we can map each char to
    # its replacement choices (or itself if no entry exists in LEET_MAP).
    letters = list(word)
    choices = [LEET_MAP.get(c.lower(), [c]) for c in letters]

    # combinations is an iterator yielding tuples with one choice per input
    # character. We join each tuple into a string to create a candidate.
    combos = itertools.product(*choices)
    out: list[str] = []
    for i, comb in enumerate(combos):
        # safety cut-off to prevent huge lists
        if i >= max_variants:
            break
        candidate = ''.join(comb)
        out.append(candidate)
    return out


def case_variants(word: str) -> list[str]:
    """Return common case variations for ``word``.

    Produces lower-case, upper-case and capitalized variants. We keep this
    minimal to avoid too many duplicates and to produce realistic candidates.
    """
    return [word.lower(), word.upper(), word.capitalize()]


def generate(word: str, years: list[str], max_suffix: int) -> list[str]:
    """Produce a small list of mangled variants for a single base ``word``.

    Steps and important variables:
    - results: a set collecting base, leet and case variants for the word.
    - small_suffixes: a curated suffix list (empty, provided years, 0..N digits)
      used to avoid generating enormous suffix lists for large ``max_suffix``.
    - final: the set of all base+suffix and suffix+base permutations.

    Returns a sorted list of candidates.
    """
    results: set[str] = set()
    # base case: include the original word
    results.add(word)

    # Add leet variants (may produce many combinations; limited by leet_variants)
    for lv in leet_variants(word, max_variants=100):
        results.add(lv)

    # For each generated variant so far, add simple case variations
    for cv in list(results):
        for c in case_variants(cv):
            results.add(c)

    # Build a small suffix list. For safety we don't generate every possible
    # N-digit suffix; instead we include provided years and a short range of
    # numeric suffixes (0..99 or up to 10**max_suffix) to keep lists useful but
    # bounded.
    small_suffixes: list[str] = ['']
    for y in years:
        small_suffixes.append(y)
    # include up to 100 numeric suffixes or up to 10**max_suffix (whichever is smaller)
    for d in range(0, min(100, 10**max_suffix)):
        small_suffixes.append(str(d))

    final: set[str] = set()
    # Combine each variant with each suffix, both as suffix and prefix
    for base in results:
        for s in small_suffixes:
            candidate = f"{base}{s}"
            final.add(candidate)
            final.add(f"{s}{base}")
    return sorted(final)


def write_wordlist(path: str, words: list[str]) -> None:
    """Write the list of ``words`` to ``path`` (one entry per line).

    - path: output file path
    - words: list of strings to write
    """
    with open(path, 'w', encoding='utf-8') as f:
        for w in words:
            f.write(w + '\n')
    # print a short summary so the user knows how many entries were written
    print(f'Wrote {len(words)} entries to {path}')


def parse_years(arg: str) -> list[str]:
    """Parse the ``--years`` argument into a list of year strings.

    Supported formats:
    - '2018-2020'  -> ['2018','2019','2020']
    - '2018,2020'  -> ['2018','2020']
    - '2020'       -> ['2020']

    Returns an empty list if arg is falsy.
    """
    if not arg:
        return []
    if ',' in arg:
        # explicit list separated by commas
        return [y.strip() for y in arg.split(',') if y.strip()]
    if '-' in arg:
        # a range like 2018-2025
        start, end = arg.split('-', 1)
        return [str(y) for y in range(int(start), int(end) + 1)]
    # single year
    return [arg]


def main(argv: list[str] | None = None) -> int:
    """Parse arguments, build variants for each base word and write the wordlist.

    Important args and variables:
    - --out: output path
    - --bases: optional file path containing base words (one per line)
    - --years: years to append (or range) used by parse_years
    - --max-suffix: numeric suffix length (0,1,2 recommended)
    - --limit: cap the number of written entries to avoid huge lists
    """
    parser = argparse.ArgumentParser(description='Simple wordlist generator (lab use only)')
    parser.add_argument('--out', '-o', default='wordlist_generated.txt', help='output file')
    parser.add_argument('--bases', '-b', help='file with base words (one per line)')
    parser.add_argument('--years', '-y', default='2018-2025', help='years or range (e.g. 2018-2025)')
    parser.add_argument('--max-suffix', type=int, default=2, help='max numeric suffix length (0-3 recommended)')
    parser.add_argument('--limit', type=int, default=5000, help='max number of entries to write')
    args = parser.parse_args(argv)

    # Load bases from file if provided, otherwise use DEFAULT_BASES
    if args.bases and os.path.exists(args.bases):
        with open(args.bases, 'r', encoding='utf-8') as f:
            bases = [line.strip() for line in f if line.strip()]
    else:
        bases = DEFAULT_BASES

    # years: parse into a list like ['2018','2019',...]
    years = parse_years(args.years)

    words: list[str] = []
    # For each base word generate its variants and extend the main list
    for b in bases:
        words.extend(generate(b, years, args.max_suffix))

    # dedupe while preserving order, then apply the user-specified limit
    final = list(dict.fromkeys(words))[: args.limit]
    write_wordlist(args.out, final)
    return 0


if __name__ == '__main__':
    sys.exit(main())
