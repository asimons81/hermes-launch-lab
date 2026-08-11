# Responsive & Accessibility Repair Report

**Task:** t_1a490abe — Repair responsive CSS and accessibility defects
**Branch:** wt/launch-responsive-a11y (worktree `.worktrees/t_1a490abe`)
**Baseline:** 96ff951 (feat(legal): consulting terms + agreement)
**Status:** All defects fixed, tests first (RED observed), full gate green. Not pushed.

---

## 1. Test-first evidence (RED before GREEN)

### 1.1 Static DOM/contract tests — `tests/responsive-a11y-contract.test.ts` (13 tests)

Written before source repair. Baseline run against `96ff951`:

```
Test Files  1 failed (1)
     Tests  12 failed | 1 passed (13)
```

The 12 failing assertions mapped 1:1 to the audited defects:

| Failing contract test | Defect it pins |
| --- | --- |
| generates Tailwind utilities so hidden/md:flex/md:hidden work | `globals.css` had **no `@tailwind` directives at all** → utilities never emitted |
| aligns the responsive md breakpoint with the site design breakpoint (900px) | `tailwind.config.ts` left `md` at Tailwind default 768px vs custom 900px |
| has a skip-to-content link and a matching main-content target | No skip link in `SiteHeader`; no `id="main-content"` on any page `<main>` |
| declares menu disclosure semantics on the hamburger and drawer | No `aria-expanded`/`aria-controls`, no drawer id/label |
| gives the command palette proper dialog semantics and labelled search | Palette rendered as plain divs; unlabelled input |
| labels the ROI sliders | Range inputs had no explicit labels |
| matches the brand accessible name to its visible text | `BrandMark` aria-label said "Hermes Launch Lab home", visible text is "TONY SIMONS // LAUNCH LAB" |
| adds explicit type="button" to non-submit interactive buttons | Many buttons omitted `type` (default submit) |
| keeps heading hierarchy without skips on audited pages | ServiceCard h3 under h1, TopoGraph h4, portal/admin/terms h3 sections |
| defines accessible contrast tokens (>= 4.5:1) | `--muted-2`/`--faint` #48566A = 2.78:1 vs `--bg` |
| defines a global focus-visible indicator | No `:focus-visible` rule anywhere |
| does not rely on opacity alone to mute essential text | `.receipt` dimmed to opacity 0.6 |

After repair:

```
Test Files  2 passed (2)
     Tests  16 passed (16)   (13 a11y contract + 3 visual contract)
```

### 1.2 Browser e2e — `tests/e2e/responsive-a11y.dom.spec.ts` (13 tests)

Baseline run against the un-repaired app (Playwright + system Chrome 150):

```
10 failed, 3 passed
```

Failures: no-overflow at 390px and 768px, mobile header exclusivity, desktop
header exclusivity, menu disclosure/Escape/focus, mobile drawer actions, skip
link, command palette dialog, axe scan at 390px and 1280px.

Baseline measurements captured from the failing run:

| Viewport | Overflowing pages (scrollWidth vs vw) |
| --- | --- |
| 390 | `/` 624, `/pricing` 624, `/features` 624, `/docs` 624, `/docs/quickstart` 806, `/faq` 624, `/status` 624 (footer 4-col inline grid + docs sidebar) |
| 768 | `/docs/quickstart` 814 (docs sidebar + min-content code blocks) |
| 1024/1280/1440 | no overflow |

Baseline axe scan (homepage):

```
color-contrast  serious  10 nodes  (.cockpit__note, header Search button, .receipt__time, .receipt__type--cron, …)
heading-order   serious  1 node    (h4 — topo detail skipping h3)
```

After repair:

```
13 passed (41.9s)  — all viewport, header, disclosure, skip-link, palette, axe tests green
```

---

## 2. Root causes found and fixed

### 2.1 `hidden`/`md:flex`/`md:hidden` utilities were never generated
`app/globals.css` imported **no Tailwind directives** (no `@tailwind base/components/utilities`), so every utility class in the JSX (`hidden`, `md:flex`, `md:hidden`) was inert. Desktop nav + hamburger coexisted because neither hide/show rule applied. Fix: added `@tailwind utilities;` at the top of `globals.css` (utilities only — deliberately not `base`, to avoid preflight resets changing the brand design).

### 2.2 Breakpoint mismatch
The custom CSS used 900px/720px breakpoints while Tailwind's `md` stayed at its default 768px. Fix: `tailwind.config.ts` now sets `screens.md = '900px'`, aligning `md:flex`/`md:hidden` with the site's design breakpoint. Also removed the redundant compound `(max-width: 900px), (max-width: 720px)` selector (720 ⊂ 900) and dropped the unlayered `.site-nav { display: none }`/`display:flex` rules that fought the layered utilities (unlayered CSS beats `@layer` utilities).

### 2.3 Mobile page overflow
- **Footer:** `SiteFooter.tsx` had an inline `gridTemplateColumns: '2fr 1fr 1fr 1fr'` that cannot be overridden by a stylesheet media query, so the footer never collapsed (624px on every page at 390px). Fix: moved the 4-column layout into `.site-footer__grid` in CSS; the `@media (max-width: 900px)` collapse now applies.
- **Docs layout:** `DocsLayout.tsx` grid `240px 1fr` + sticky sidebar overran the viewport; code blocks pushed min-content width. Fix: added `.docs-layout`/`.docs-layout__aside` classes with a `1fr` collapse at ≤900px and `min-width: 0` on grid children so `<pre>` blocks scroll instead of blowing out the grid.
- **Status metrics:** `repeat(3, 1fr)` metrics row overran at 390px (425px). Fix: `.status-metrics` collapses to 1 column at ≤720px.
- **Header at 1024–1150px:** brand + nav + actions exceeded the shell by ~26px. Fix: tightened `.site-header__inner`/`.site-nav` gap, font-size and letter-spacing, and hid the secondary "← STUDIO PORTFOLIO" pill (still present in the mobile drawer) below 1150px.
- Also made `.roi-grid`, `.proof-strip__grid`, `.fit-panel` collapse at ≤720px.

Final viewport sweep (documentElement.scrollWidth == viewport width on every route):

| width | / | /pricing | /features | /docs | /docs/quickstart | /faq | /status | /legal/terms | /services |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | 390 | 390 | 390 | 390 | 390 | 390 | 390 | 390 | 390 |
| 768 | 768 | 768 | 768 | 768 | 768 | 768 | 768 | 768 | 768 |
| 1024 | 1024 | 1024 | 1024 | 1024 | 1024 | 1024 | 1024 | 1024 | 1024 |
| 1280 | 1280 | 1280 | 1280 | 1280 | 1280 | 1280 | 1280 | 1280 | 1280 |
| 1440 | 1440 | 1440 | 1440 | 1440 | 1440 | 1440 | 1440 | 1440 | 1440 |

### 2.4 WCAG contrast (>= 4.5:1 for essential normal text)
Computed with the WCAG 2.x relative-luminance formula against `--bg #020203`:

| Token | Before | Ratio | After | Ratio |
| --- | --- | --- | --- | --- |
| `--ink` | #F8F9FA | 19.67 | unchanged | 19.67 |
| `--muted` | #8E9BAE | 7.36 | unchanged | 7.36 |
| `--muted-2` | #48566A | **2.78** | #8798AD | 7.04 |
| `--faint` | #48566A | **2.78** | #8798AD | 7.04 |

`.receipt` opacity 0.6 removed (opacity alone was muting essential text); receipts now render at full opacity with the same border/pill styling.

### 2.5 Focus visibility
Added a global `:focus-visible` rule (`outline: 2px solid var(--gold); outline-offset: 2px`) covering buttons, links, inputs, and the skip link.

### 2.6 Skip link
`SiteHeader` now renders `<a href="#main-content" class="skip-link">Skip to content</a>` as the first focusable element; every public `<main>` (home, features, pricing, faq, status, portal, admin, book, intake, services, legal layout, DocsLayout, auth/verify) carries `id="main-content" tabIndex={-1}` so the target receives focus.

### 2.7 Menu disclosure semantics + focus management
Hamburger now has `aria-expanded={menuOpen}` + `aria-controls="mobile-menu"`; the drawer has `id="mobile-menu"`, `role="navigation"`, `aria-label="Mobile navigation"`. A window `keydown` handler closes on Escape and returns focus to the toggle; nav clicks close the drawer.

### 2.8 Command palette dialog semantics
Palette overlay now has `role="dialog"`, `aria-modal="true"`, `aria-label="Command palette"`; the search input is labelled (`aria-label="Search commands"`); rows became real `<button type="button">` elements (keyboard reachable); the trigger element is remembered on open and focus is restored on close/Escape.

### 2.9 Brand accessible name
`BrandMark` aria-label changed from "Hermes Launch Lab home" to "Tony Simons // Launch Lab home", matching the visible "TONY SIMONS // LAUNCH LAB" text.

### 2.10 ROI sliders
Both range inputs got explicit `aria-label`s ("Repetitive hours spent per week", "Hourly rate or engineering value") in addition to the visible labels.

### 2.11 Heading hierarchy
- `ServiceCard` h3 → h2 (under page h1)
- `TopoGraph` h4 → h3 (CSS selector updated too)
- `/features` pillar h3s → h2
- `/portal` card h3s → h2
- `/admin` "Recent Sessions" h3 → h2
- `/legal/terms` section h3s → h2 (10 headings)

### 2.12 Explicit button types
`type="button"` added to every non-submit button: SiteHeader (Search + hamburger), CommandPalette rows, LiveTerminal (AUTO/INTERACTIVE/presets/reset), SkillCatalog (category/inspect/copy/close), DiagnosticIntake (options/back/skip/start-over), DocsLayout copy, TopoGraph nodes, `/status` Ping. Legitimate `type="submit"` (sign-in form, intake form, sign-out) untouched.

### 2.13 Reduced motion preserved
The existing `@media(prefers-reduced-motion:reduce)` block is untouched; `LiveTerminal`'s reduced-motion short-circuit still renders the full session instantly. Pinned by `tests/visual-contract.test.ts` (both `@media(max-width:720px)` and `@media(prefers-reduced-motion:reduce)` still present).

---

## 3. Final gate (run on this worktree against a clean dev server)

```
npm test -- --run      PASS — 16 tests (13 a11y contract + 3 visual contract)
npm run typecheck      PASS — tsc --noEmit, exit 0
npm run lint           PASS — eslint . --max-warnings=0, exit 0, zero warnings
npm run build          PASS — prisma generate + next build, 31 routes
npx playwright test    PASS — 13/13 (overflow @390/768/1024/1280/1440, header exclusivity,
                          menu disclosure, mobile drawer, skip link, command palette, axe)
```

After-audit axe (homepage, rules: color-contrast, heading-order, label, button-name,
link-name, landmark-one-main, region): **zero serious/critical violations at 390px and 1280px.**

Note on a mid-run operator check: one re-audit pass showed transient overflow on
`/docs/quickstart` @390 because `npm run build` had clobbered the dev server's `.next`;
after restarting the dev server with a clean `.next`, all routes measured
`scrollWidth == viewport width` again and the e2e suite stayed 13/13. The 13/13 e2e
result is the authoritative signal.

---

## 4. Files changed (single atomic commit, not pushed)

- `app/globals.css` — @tailwind utilities, contrast tokens, focus-visible, skip-link, receipt opacity, footer grid, docs-layout/responsive classes, header band tightening, media-query cleanup
- `tailwind.config.ts` — md = 900px
- `components/SiteHeader.tsx` — skip link, disclosure semantics, Escape/focus, type=button
- `components/BrandMark.tsx` — accessible name match
- `components/RoiCalculator.tsx` — labelled sliders + roi-grid
- `components/CommandPalette.tsx` — dialog semantics, labelled input, focus restore, button rows
- `components/SiteFooter.tsx` — inline grid override removed
- `components/DocsLayout.tsx` — main id, docs-layout classes, type=button
- `components/LiveTerminal.tsx` — type=button, gold-bright active state
- `components/SkillCatalog.tsx` — type=button
- `components/DiagnosticIntake.tsx` — type=button
- `components/TopoGraph.tsx` — h3, type=button
- `components/ServiceCard.tsx` — h2
- `app/page.tsx`, `app/features/page.tsx`, `app/pricing/page.tsx`, `app/faq/page.tsx`, `app/status/page.tsx`, `app/portal/page.tsx`, `app/admin/page.tsx`, `app/book/page.tsx`, `app/intake/page.tsx`, `app/services/page.tsx`, `app/legal/layout.tsx`, `app/legal/terms/page.tsx`, `app/auth/verify/page.tsx` — main-content targets, heading fixes, type=button
- `tests/responsive-a11y-contract.test.ts` (new) — 13 static contract tests
- `tests/e2e/responsive-a11y.dom.spec.ts` (new) — 13 browser tests
- `playwright.config.ts` (new) — local Chrome, baseURL localhost:3111
- `responsive-a11y-report.md` (this file)

Design identity preserved: no redesign — same cockpit/editorial layout, palette, fonts,
brand colors; only tokens/utilities/labels/semantics adjusted. Reduced-motion behavior
unchanged.
