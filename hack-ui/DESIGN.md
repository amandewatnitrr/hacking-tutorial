---
name: hack-ui
description: A reference-desk console for one Raspberry Pi — drawer-tab categories opening onto ivory index cards.
colors:
  page-bg: "#ebe3cf"
  rail-bg: "#ddd2b3"
  card-bg: "#fffdf7"
  card-border: "#c9bd9e"
  ink: "#3a3226"
  ink-muted: "#5c4f36"
  stamp: "#8a2e2e"
  stamp-ink: "#fffaf2"
  hue-recon: "#2f6f63"
  hue-recon-bg: "#dce9e2"
  hue-mitm: "#335a80"
  hue-mitm-bg: "#dbe4ee"
  hue-sqli: "#8a6a1d"
  hue-sqli-bg: "#efe5cc"
  hue-binexp: "#6a3f74"
  hue-binexp-bg: "#e6dce9"
  hue-python: "#3f6e2e"
  hue-python-bg: "#dfe8d6"
typography:
  title:
    fontFamily: "Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "0.02em"
  body:
    fontFamily: "Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
  label:
    fontFamily: "Public Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.06em"
  mono-label:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Cascadia Mono, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
rounded:
  tag: "4px"
  card: "10px"
spacing:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "24px"
components:
  index-card:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "14px 16px"
  drawer-tab-active:
    backgroundColor: "{colors.stamp}"
    textColor: "{colors.stamp-ink}"
  theme-toggle:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "5px 12px"
---

# Design System: hack-ui

## Overview

**Creative North Star: "The Reference Desk"**

hack-ui is a lookup-and-act console for one specific machine, built to feel like a librarian's card catalog rather than a SaaS admin panel or a neon hacker terminal. The world is paper, ink, and a single rubber-stamp red: categories live as drawer tabs down the side, each tab carrying its own full-strength accent hue instead of a shared grey-plus-accent scheme, and the active category is marked the way a librarian stamps a card — one warm red, reserved for that single job. The main surface is ivory index cards sitting on faint graph-paper ruling, which is structural (a real background grid under every category's cards), not decorative texture.

This is deliberately a departure from this repo's own neon/terminal branding (`#1a1a2e` / `#0f3460` / `#e94560`): PRODUCT.md records that choice as intentional, not an oversight. The system stays calm and legible, dense enough for a solo operator's working console, and carries no icons, no system/display typefaces, and no invented chrome — every surface so far is shell only (navigation, theme, and a status line), with action-wiring explicitly future work.

**Key Characteristics:**
- Ivory card stock with ink-brown text, never pure black/white.
- One accent hue per category, each with its own full-strength text color and pale tint background.
- Stamp-red reserved exclusively for the active/selected state.
- Faint graph-paper ruling as literal structure under the card grid.
- Self-hosted Public Sans (humanist sans) paired with JetBrains Mono for call-number-style tags.

## Colors

The palette is warm and paper-toned at rest, with each category holding one committed, saturated accent — never a shared neutral-plus-accent scheme.

### Primary
- **Stamp Red** (`#8a2e2e`): the single reserved accent. Used only for the active drawer tab's background and its light-mode focal state; nothing else in the system may use it. Dark mode lifts it to `#c2504a` for contrast against the dark card stock.

### Secondary — Category Hues (one per category, not a shared accent)
- **Recon Green** (`#2f6f63` on `#dce9e2`): Recon category tab text/background tint.
- **MITM Blue** (`#335a80` on `#dbe4ee`): MITM / ARP category tab.
- **SQLi Ochre** (`#8a6a1d` on `#efe5cc`): SQL injection category tab.
- **Bin-Exploit Plum** (`#6a3f74` on `#e6dce9`): Binary exploitation category tab.
- **Python Olive** (`#3f6e2e` on `#dfe8d6`): Python scripting category tab.

Each hue has a corresponding dark-mode counterpart (e.g. Recon Green lifts to `#6fb3a0` on `#203a32`) so the same category stays identifiable and legible across themes; see `.impeccable/design.json` → `colorMeta` for the full light/dark pairs.

### Neutral
- **Card Stock Ivory** (`#fffdf7`, dark: `#2a2317`): index card background.
- **Rail Linen** (`#ddd2b3`, dark: `#262015`): top bar and drawer rail background.
- **Page Cream** (`#ebe3cf`, dark: `#1e1a12`): page background behind everything.
- **Card Border** (`#c9bd9e`, dark: `#473c28`): 1px borders on cards, rail, top bar, theme toggle.
- **Ink** (`#3a3226`, dark: `#ecddc0`): primary text.
- **Ink Muted** (`#5c4f36`, dark: `#a1927a`): secondary text — subtitles, tags, headings, status line.

### Named Rules
**The One Stamp Rule.** Stamp-red (`--stamp`) marks exactly one thing at a time: the active drawer tab. It never appears as a generic brand accent, button color, or link color elsewhere in the system.

**The Own-Hue Rule.** Each tool category owns one accent hue (text + tint-background pair) used only on its own unselected drawer tab. Categories never borrow each other's hue, and no category shares a hue with another.

## Typography

**Body Font:** Public Sans (self-hosted, weights 400/500/600; fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`)
**Label/Mono Font:** JetBrains Mono (self-hosted, weights 400/500; fallback `ui-monospace, "SF Mono", "Cascadia Mono", Consolas, monospace`)

**Character:** A humanist working sans paired with a mono for anything catalog-like (tags, call numbers, status text) — legible and utilitarian, with no display/headline face anywhere in the shipped shell.

### Hierarchy
- **Title** (600, 15px): the `hack-ui` wordmark in the top bar.
- **Body/Title** (500, 14px): index card title line — the primary readable content of the grid.
- **Label** (600, 13px, letter-spacing 0.06em, uppercase): the active-category heading above the card grid; also the drawer-tab text at 12px/0.04em (vertical in the full rail, horizontal in the ≤640px layout).
- **Mono-label** (400, 11–12px, `font-family: var(--font-mono)`): index-card call-number tag lines, the top-bar subtitle, and the status strip.

### Named Rules
**The No-Display-Face Rule.** There is no display or hero type role in this system. Every text element sits in the 11–15px range; scale comes from weight and letter-spacing, not from a larger size step.

## Layout

The shell is a column: a slim top bar, then a flex row of drawer rail + main content. The drawer rail is a fixed 60px column of vertical drawer tabs (`writing-mode: vertical-rl`) at full width, each tab a minimum 108px tall; the active tab grows (`flex-grow: 1.15`) rather than changing size via padding. The main area renders the active category's cards over a literal graph-paper background (`linear-gradient` ruling at a 24px × 24px cell, `--rule-line` at low opacity) — the ruling is structural ground, present behind every category, not a one-off decoration.

Card grid: `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))`, `gap: 14px`, inside `padding: 20px 24px` on the main area. Top bar padding is `14px 20px`.

**Responsive break at 640px:** the drawer rail rotates from a vertical column to a horizontal, scrollable row; tab text switches to `horizontal-tb`; the active-tab indicator switches from flex-grow expansion to an `inset box-shadow` bottom rule instead (since flex-grow reads as height, not width, in the horizontal layout); the top-bar subtitle is dropped.

## Elevation & Depth

The system is flat at rest. Depth only appears as a response to interaction, never as ambient decoration: index cards carry a faint 1px-equivalent resting shadow, lift 2px on hover (`transform` only, no added shadow), and on `:active` take a stronger shadow plus a 1px downward press — a tactile click response, not a hover glow. The theme toggle button is also flat at rest and only picks up a shadow on hover.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 1px 2px rgba(58, 50, 38, 0.08)`; dark: `rgba(0,0,0,0.4)`): default index-card and theme-toggle-hover shadow.
- **Card Press** (`box-shadow: 0 3px 8px rgba(58, 50, 38, 0.18)`; dark: `0 3px 10px rgba(0,0,0,0.55)`): index-card `:active` only — the tactile stamp-down feedback.

### Named Rules
**The Press-Not-Hover Rule.** Hover lifts (`translateY(-2px)`) without adding shadow; shadow escalation is reserved for `:active`. Depth change signals a committed click, not a passive mouse-over.

## Shapes

Two radius steps only: a 10px card radius (`--radius-card`) for index cards, and a 4px tag radius (`--radius-tag`) for the theme toggle button. Every bordered surface (cards, rail, top bar, theme toggle) uses a single 1px solid border in `--card-border`. There is no clipping, no asymmetric corners, and no decorative silhouette — the form language is a plain rectangle with two consistent radius values.

## Components

### Buttons
- **Theme Toggle:** rectangular, 4px radius (`--radius-tag`), 1px border, `padding: 5px 12px`, text label reads the *target* state ("dark" while light, "light" while dark). Flat at rest; picks up the Card Rest shadow on hover; presses down 1px on `:active`.
- **Drawer Tab:** full-bleed rectangle (no radius), vertical text in the full-width rail. Unselected tabs show their own category hue as text color over a pale tint background on hover; the active tab is filled Stamp Red with `--stamp-ink` text and grows via `flex-grow`, not size change.

### Cards / Containers
- **Index Card:** the signature component. Ivory card stock (`--card-bg`), 10px radius, 1px border, `padding: 14px 16px`, Card Rest shadow at rest. Contains a title line (14px/500) and a mono call-number tag line (11px, `--ink-muted`) — the catalog-card metaphor made literal. Hover lifts; active presses with Card Press shadow.

### Navigation
- **Drawer Rail:** the category navigation, styled as library drawer tabs rather than a sidebar list. Full rail: vertical text, one tab per category, each ~108px tall minimum, one accent hue per tab. ≤640px: collapses to a horizontal scrollable tab strip with horizontal text and an inset-shadow active indicator instead of growth.

### Signature Component: Graph-Paper Ground
The main content area always renders a literal ruled-paper grid (24px cells, `--rule-line` at ~7–12% opacity depending on theme) behind the active category's card grid. This is a structural constant of the surface, not a per-page decoration — any new view added to this shell should sit on the same ruling.

## Do's and Don'ts

### Do:
- **Do** give every new tool category its own full-strength hue + pale-tint background pair (follow the `--hue-<name>` / `--hue-<name>-bg` pattern), distinct from every other category's.
- **Do** keep the graph-paper ruling under any new main-area content; it is the surface's structural ground.
- **Do** reserve Stamp Red (`#8a2e2e` / dark `#c2504a`) for the single active/selected state; it is not an available accent for new components.
- **Do** keep depth responses tied to interaction state (hover = lift only, active = shadow + press) rather than ambient shadows at rest.

### Don't:
- **Don't** introduce a display/hero type size; this system's scale tops out at 15px and gets its emphasis from weight and letter-spacing, not size.
- **Don't** add glyph icons or icon fonts; the shipped shell has none, and the catalog metaphor is carried entirely by typography and color.
- **Don't** use a neon/terminal-cyberpunk palette anywhere in this surface; PRODUCT.md records that departure from the repo's own branding as deliberate.
- **Don't** give two categories the same hue, and don't use a category hue for anything other than its own unselected drawer tab.
