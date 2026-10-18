# UI Revamp & Direct Content Sourcing — Design

## Intent

Full visual rebrand of `UI/frontend` (color theme, typography, layout, component
styling) and a change to how lesson content reaches the UI: read markdown
directly from the repo-root topic folders instead of a duplicated copy living
inside `UI/frontend/src/content`.

## Why

- Current theme (navy `#0b1220` background + neon green `#00ff88` accent,
  Inter font) — user wants it replaced entirely: color, layout, font, vibe.
- The content copy has already drifted from the source of truth. Example:
  `UI/frontend/src/content/ethical-hacking/` is missing files that exist in
  root `ethical-hacking/` (`encryption-CrashCourse.md`, `lesson-dns.md`,
  `lesson-sni.md`, the `caplets/` folder). Several root topic folders aren't
  wired into the UI at all: `cybersecurity-architecture`,
  `cli-editors-tutorials`, `FMEA Fundamentals`.

## Reference

[offsec.com](https://www.offsec.com) chosen by user as the visual reference.
Tokens extracted directly from the live page:

| Token | Value | Use |
|---|---|---|
| Background | `#1c1822` | near-black, purple-tinted |
| Primary accent | `#6619D0` | primary buttons, links |
| Secondary accent | `#00BFCB` | outline buttons, hover states |
| Highlight text | `#B183F0` | emphasized inline text |
| Font | Inter (same as current) | body + headings |
| Heading weight | 600 | h1 ~48px |
| Buttons | pill radius `9999px` (primary, filled), `1.5px` outline (secondary) | CTA style |
| Hero | radial gradient glow behind bold headline, muted supporting copy | page-top treatment |

## Goals

1. **Theme overhaul** — replace the CSS custom properties in
   `src/index.css` (`--bg-*`, `--accent-green*`, `--border-color`, light-theme
   equivalents) with an OffSec-inspired violet/cyan-on-near-black palette.
   Light mode gets an equivalent treatment (cream/white bg, same accents,
   not just an inverted dark theme).
2. **Component restyle** — `Navbar`, `Sidebar`, `LessonTemplate`,
   `ThemeToggle`, `LessonPage` pick up the new palette, pill-shaped buttons,
   and OffSec's spacing/radius language. Sidebar active-link state moves from
   green to violet.
3. **Direct content sourcing** — `src/utils/markdownloader.js`'s
   `import.meta.glob` calls point at the repo-root topic folders (reachable
   via a relative path up from `UI/frontend`), not at `src/content`. No more
   copy-and-drift. This includes images: replace the current flat-copy hack
   (`LessonTemplate.jsx`'s `transformMarkdownUrl` remaps `imgs/`-prefixed
   `<img>` src by basename into a single manually-populated
   `UI/frontend/public/imgs/`) with a real per-folder image glob
   (`import.meta.glob('<root>/<category>/**/*.{png,jpg,jpeg,gif,webp}')`)
   and a URL rewrite that resolves each markdown file's image references
   relative to its own folder. No basename collisions, no third copy of
   image assets to keep in sync.
4. **Add missing categories** — wire in `cybersecurity-architecture`,
   `cli-editors-tutorials`, `FMEA Fundamentals` as new lesson categories,
   same pattern as existing ones where the pattern fits:
   `cybersecurity-architecture` and `FMEA Fundamentals` are flat `*.md`
   folders, handled identically to existing categories.
   `cli-editors-tutorials` is shaped differently — its lesson content
   (`emacs/NOVICE.md`) is one level down, with a top-level `README.md`
   (folder docs, not a lesson) and an `assets/images/` subfolder alongside
   it. Its glob recurses one level into subfolders and explicitly excludes
   `README.md` from the lesson list.
5. **Retire the duplicate** — delete `UI/frontend/src/content`'s markdown/
   image copies once the direct-read path is confirmed working (kept in git
   history regardless).

## Non-goals / anti-goals

- Not touching `sql-injection-lab` or `hack-ui` — both are separate
  standalone apps (own `package.json`/build), not lesson markdown trees.
- Not touching `docs/` (PDFs + legal) — not markdown, out of scope for the
  lesson reader.
- Not editing lesson content/markdown text itself.
- Not changing framework or build tool — stays Vite + React, no Tailwind
  migration.
- Not cloning offsec.com's marketing page structure (hero copy, nav items) —
  borrowing palette/typography/component language only, applied to this
  app's existing shape (sidebar + lesson reader).

## Constraints

- Markdown in root topic folders references local images (e.g.
  `ethical-hacking/image.png`, `python-scripts/images/...`). Those paths
  must keep resolving once the source root moves — image globbing needs the
  same root-relative treatment as the markdown globbing.
- Vite's dev-server `fs.allow` defaults to the project root
  (`UI/frontend`); reading from folders two levels up (repo root) needs that
  allowlist widened in `vite.config.js`.
- `FMEA Fundamentals` has a space in its folder name — needs correct
  quoting/escaping in glob patterns.
- Open question (needs user answer, see below): whether the Vercel
  deployment's "Root Directory" project setting is scoped to `UI/frontend`.
  `vercel.json` runs `cd UI/frontend && npm install && npm run build`,
  which assumes the checkout handed to that build already contains the
  full repo (so the root topic folders are present to glob). Vite's
  `import.meta.glob` inlines matches at **build** time regardless of dev
  `fs.allow` — if Vercel's dashboard scopes the project root to
  `UI/frontend` only, the root topic folders won't exist in that checkout
  and production would silently ship with missing/empty lesson content,
  even though local dev works fine. This can't be determined by reading
  the repo; it needs confirming against the actual Vercel project config.

## Left to the builder (flagged as my calls)

- Full palette beyond the 4 extracted tokens (hover/focus/disabled states,
  code-block colors, scrollbar, etc.) — filled in to stay consistent with
  the OffSec tokens above.
- Sidebar icon/label text for the 3 new categories.
- Console-warn (not hard-fail) if an allowlisted root folder is missing at
  build time — matches the existing debug-logging style in
  `markdownloader.js`.
- `UI/frontend/src/content` deletion happens after the new source is
  confirmed working in the browser, as a separate cleanup step.

## Size

Project with a written design. Next step: `superpowers:writing-plans` for a
component-by-component execution plan.
