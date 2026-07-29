# Hermes Launch Lab — The Undeniable Redesign

> **For Hermes:** Implement task-by-task using subagent-driven-development. Each phase is independently shippable.

**Goal:** Transform the site from a well-built SaaS template into a living artifact that proves competence through its own design language. The page should BE the product, not describe the product.

**Creative method:** Edward de Bono's Lateral Provocations (PO operators). Five operators run against every assumption the current page makes. First 5 safe ideas explicitly refused (more sections, animated cards, video backgrounds, testimonial carousels, bento grids).

**Architecture:** Next.js 15 App Router, React 19, CSS custom properties, `next/font`. Zero new runtime dependencies. All motion is CSS-first (transform/opacity only). All interactivity is React state. No WebGL, no animation libraries, no paid services.

---

## 1. The Concept: Terminal-Native Atelier

The site adopts the visual language of a Hermes Agent desktop session. Not a skin — a coherent design system where every element speaks the tool's native dialect.

**Core principle:** The medium is the argument. A visitor who scrolls this site should feel like they've stepped inside a well-configured Hermes instance. The design itself is the proof of competence.

**What changes:**
- The page stops being a vertical scroll brochure and becomes a **layered operational surface**.
- The hero stops describing the service and **demonstrates it** with a live simulated agent session.
- The pricing section stops being passive cards and becomes an **interactive diagnostic**.
- A live **receipts rail** proves the system runs and produces real artifacts.
- The entire chrome (nav, footer, section transitions) adopts terminal/IDE vocabulary.

**What stays:**
- Dark canvas, brass/gold accent (deepened and disciplined).
- The business logic: Stripe, auth, booking, Prisma, API routes — untouched.
- The offer: three session tiers, same prices, same booking flow.
- Honest copy. No fabricated proof, no fake metrics, no unverified credentials.

---

## 2. Done Criteria

- [ ] First viewport delivers the full pitch without scrolling (cockpit principle).
- [ ] Hero contains a live, looping simulated agent session terminal — not static copy.
- [ ] Pricing section offers an interactive diagnostic path with a "just show me pricing" escape hatch.
- [ ] A receipts rail shows realistic, technically precise agent activity.
- [ ] Design language is terminal-native: monospace headlines, window-chrome panes, sidebar nav, status indicators.
- [ ] Every motion respects `prefers-reduced-motion`.
- [ ] Mobile is intentionally composed at 390px and 360px — not allowed to collapse.
- [ ] All existing auth, booking, Stripe, Prisma, and API behavior is unchanged.
- [ ] `npm run typecheck`, `npm run lint`, `npm run build` all pass.
- [ ] No new runtime dependencies added.

---

## 3. Component Architecture

### New components to create

| Component | Purpose | Complexity |
|---|---|---|
| `components/LiveTerminal.tsx` | Hero right-column: looping simulated agent session with typewriter effect | Medium (~250 lines) |
| `components/DiagnosticIntake.tsx` | Interactive triage replacing static pricing cards | Medium (~200 lines) |
| `components/ReceiptsRail.tsx` | Live-updating strip of agent activity receipts | Low (~100 lines) |
| `components/TopoGraph.tsx` | CSS/SVG node graph showing a configured system topology | Medium (~150 lines) |
| `components/WindowPane.tsx` | Reusable wrapper giving any content block terminal window chrome | Low (~40 lines) |
| `components/StatusBar.tsx` | Persistent bottom or top bar showing system status (OS detected, session ready) | Low (~50 lines) |

### Components to modify

| Component | Change |
|---|---|
| `app/page.tsx` | Full restructure: cockpit hero → receipts rail → diagnostic → topology → closing |
| `app/globals.css` | New token layer for terminal vocabulary; new component styles; keep existing tokens |
| `components/SiteHeader.tsx` | Convert to sidebar rail (desktop) / condensed bar (mobile) |
| `components/BrandMark.tsx` | Refine: monospace wordmark with terminal cursor blink |
| `components/SystemMap.tsx` | Replace with `TopoGraph` or absorb into hero terminal |

### Untouched

- `app/api/**` — all routes
- `lib/**` — auth, booking, email, db, admin, portal, intake
- `prisma/**` — schema and seed
- `app/book/**` — booking flow
- `app/auth/**` — auth flow
- Stripe webhook and all business logic

---

## 4. Design System: Terminal Vocabulary

### New CSS tokens (added to `:root`)

```
--pane-bg: rgba(17,18,16,.92);
--pane-border: rgba(213,174,100,.18);
--pane-radius: 0px;           /* sharp corners = terminal aesthetic */
--term-green: #82bd93;
--term-amber: #d5ae64;
--term-dim: #71736d;
--cursor-blink: 1s steps(2) infinite;
--type-speed: 30ms;          /* per-character typewriter delay */
--scan-line: rgba(242,240,233,.015);
```

### Typography shift

- Headlines shift toward monospace at large sizes (using existing `--mono` / Geist Mono). Not everywhere — the hero H1 stays Geist Sans for impact, but section headings, labels, and interactive elements go mono.
- Body copy stays Geist Sans for readability.
- The visual tension between sans headlines and mono labels/interactive elements IS the design language.

### Window chrome pattern

Every major content block gets wrapped in a "pane" — a container with:
- A title bar (mono, 10px, uppercase, with a traffic-light or status dot)
- Sharp corners (0px radius — terminals don't round)
- A subtle inner border
- Optional scanline texture overlay (extremely subtle, `prefers-reduced-motion` kills it)

### Motion rules

- Typewriter effect: CSS `steps()` animation, pausable, disabled under reduced-motion (text appears instantly).
- Receipts rail: fade-in/fade-out via opacity transitions, 400ms.
- Diagnostic transitions: slide + fade between steps, 200ms.
- No parallax, no scroll-triggered animations, no spring physics. Motion serves comprehension, not spectacle.

---

## 5. Homepage Restructure

### Current flow (linear scroll)
```
Hero (copy + static card) → Proof strip → "What is Hermes" 3-col → Pricing 3 cards → Process 3 steps → Fit panel → CTA → Footer
```

### New flow (layered operational surface)
```
COCKPIT (100vh)
├── Left: Compressed headline + single CTA + trust microcopy
├── Right: LiveTerminal (looping simulated session)
└── Bottom: StatusBar (OS-agnostic, "Session ready")

RECEIPTS RAIL (scroll reveal)
├── Live-cycling agent activity receipts
└── "This system runs. Here's what it produces."

DIAGNOSTIC (replaces pricing)
├── Interactive triage: OS? Goal? Experience? Timeline?
├── Result: personalized recommendation + rationale
└── Escape hatch: "Just show me pricing →" → flat card view

TOPOLOGY (replaces "What is Hermes" + process)
├── TopoGraph: interactive node graph of a configured system
├── Your Machine → Hermes Core → Skills/Vault/Cron → Output
└── Hover nodes for descriptions

CLOSING
├── Single high-contrast CTA pane
└── Footer with independent-service disclosure
```

---

## 6. Implementation Phases

### Phase 1: Terminal Design System Foundation
**Files:** `app/globals.css`, `app/layout.tsx`

1. Add terminal vocabulary tokens to `:root`.
2. Add `.pane`, `.pane__titlebar`, `.pane__body`, `.status-bar`, `.receipt`, `.terminal-line` utility classes.
3. Add typewriter keyframes and reduced-motion overrides.
4. Add scanline texture utility (optional, subtle).
5. Run typecheck + build. No visual changes yet — just the system.

### Phase 2: WindowPane + StatusBar components
**Files:** Create `components/WindowPane.tsx`, `components/StatusBar.tsx`

1. `WindowPane`: wraps children in terminal window chrome (title bar + status dot + body).
2. `StatusBar`: persistent bar showing contextual status text.
3. Both are server-compatible (no client state needed for v1).
4. Write contract assertions (renders title, renders children, has correct aria).

### Phase 3: LiveTerminal (the hero centerpiece)
**Files:** Create `components/LiveTerminal.tsx`

1. Client component with `useState` + `useEffect`.
2. Script: a realistic Hermes session transcript (~15-20 lines of typed output).
   - User input lines (prefixed with `>` or `$`).
   - Agent response lines (tool calls, confirmations, results).
   - Completion state: `✓ Workflow tested · Session complete`.
3. Typewriter effect: characters appear at `--type-speed` interval.
4. Loop: after completion, hold 3s, clear, restart.
5. Reduced-motion: text appears instantly, no typewriter.
6. Transcript must use real Hermes vocabulary: `hermes setup`, skill names, vault operations, cron jobs. NOT generic "Processing... Done."

### Phase 4: Hero restructure (the cockpit)
**Files:** Modify `app/page.tsx`, `components/SystemMap.tsx`

1. Hero becomes `min-height: 100vh` with two columns.
2. Left: compressed headline (shorter than current), single CTA, one-line trust note.
3. Right: `LiveTerminal` inside a `WindowPane`.
4. Bottom: `StatusBar` spanning full width.
5. Remove the old `SystemMap` component (absorbed into terminal).
6. Below cockpit: `ReceiptsRail`.

### Phase 5: ReceiptsRail
**Files:** Create `components/ReceiptsRail.tsx`

1. Static JSON array of 8-12 realistic receipt entries.
2. Each entry: timestamp, action type (skill/vault/cron/workflow), description, status.
3. Component cycles through them on a 4s interval (fade in, hold, fade out).
4. Visually: thin horizontal strip, mono type, status dots.
5. Reduced-motion: show all entries statically, no cycling.

### Phase 6: DiagnosticIntake
**Files:** Create `components/DiagnosticIntake.tsx`

1. Client component, multi-step inline form.
2. Questions (one at a time, smooth transition):
   - "What OS are you running?" → Windows / macOS / Linux / Not sure yet
   - "What's your main goal?" → Research / Coding / Content / Operations / Just exploring
   - "How deep do you want to go?" → Just want to understand / Ready to set up / Need a full build
3. Result screen: personalized recommendation (which session + why + what to prepare).
4. "Just show me pricing →" link at every step — skips to flat pricing view.
5. CTA on result screen links directly to `/book?service=<recommended>`.

### Phase 7: TopoGraph
**Files:** Create `components/TopoGraph.tsx`

1. CSS Grid or SVG node graph.
2. Nodes: Your Machine → Hermes Core → {Skills, Vault, Cron} → Live Output.
3. Each node is a small pane with a label and one-line description.
4. Hover/tap reveals extended description (CSS `:hover` + mobile tap state).
5. Connecting lines drawn with CSS borders or inline SVG paths.
6. This replaces both the "What is Hermes Agent?" section and the "What happens in a session" process section.

### Phase 8: Header conversion to sidebar rail
**Files:** Modify `components/SiteHeader.tsx`, `app/globals.css`

1. Desktop: convert horizontal nav to a left sidebar rail (fixed, ~60px wide).
   - Icon-only links (Features, Pricing, Docs, FAQ, Portal).
   - BrandMark at top.
   - Book CTA at bottom (vertical text or icon).
2. Mobile: condensed top bar with horizontal scroll nav (existing behavior, refined).
3. Main content shifts right to accommodate sidebar on desktop.

### Phase 9: Closing + polish
**Files:** Modify `app/page.tsx`, `components/SiteFooter.tsx`

1. Closing section becomes a single high-contrast `WindowPane` with the final CTA.
2. Footer gets terminal treatment (mono labels, status indicators).
3. Run full visual QA at 1440, 1024, 768, 390, 360.

### Phase 10: Build, verify, deploy gate
1. `npm run typecheck` — zero errors.
2. `npm run lint` — zero errors.
3. `npm run build` — production build succeeds.
4. Screenshot all breakpoints.
5. Verify auth/booking/Stripe flow untouched and functional.
6. Present to Tony for approval before deploy.

---

## 7. Transcript Script (for LiveTerminal)

This is the content that types out in the hero. It must be technically realistic — real Hermes vocabulary, real command syntax, real latency patterns. Generic "Processing..." text will undermine the entire concept.

```
$ hermes setup
→ Detecting environment... Linux 7.1.3 (x86_64)
→ Installing Hermes Agent v0.19.0... ✓
→ Loading skill catalog... 55 skills indexed ✓

$ hermes skill load hermes-vault
→ Vault initialized. Policy: brokered, lease-based.
→ Credential leases: 0 active, 3 available.

$ hermes cron create "Daily content radar"
→ Schedule: every 2h · Deliver: telegram
→ First run queued. ✓

$ hermes workflow test "booking-pipeline"
→ Stripe webhook... ✓ verified
→ Email relay... ✓ confirmed
→ Prisma connection... ✓ alive
→ ✓ Workflow tested. Session complete.
```

This loops. Each line types at ~30ms/char. Total runtime ~35s, then 3s hold, then clear and restart.

---

## 8. Receipts Data (for ReceiptsRail)

Static JSON. Each entry must be structurally real — these are things Hermes actually produces.

```json
[
  { "time": "14:32", "type": "skill", "text": "hermes-vault loaded · policy verified", "status": "ok" },
  { "time": "14:28", "type": "cron", "text": "content-radar deployed · first run queued", "status": "ok" },
  { "time": "14:15", "type": "workflow", "text": "booking-pipeline tested · Stripe webhook confirmed", "status": "ok" },
  { "time": "14:02", "type": "vault", "text": "credential lease issued · provider: openrouter", "status": "ok" },
  { "time": "13:47", "type": "skill", "text": "github-pr-workflow loaded · 12 steps indexed", "status": "ok" },
  { "time": "13:30", "type": "cron", "text": "deal-hunter executed · 3 candidates found", "status": "ok" },
  { "time": "13:12", "type": "workflow", "text": "intake-form tested · validation passed", "status": "ok" },
  { "time": "12:58", "type": "vault", "text": "lease renewed · provider: anthropic", "status": "ok" }
]
```

---

## 9. Risk Table

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Terminal aesthetic alienates non-technical buyers | Medium | Medium | Copy stays human and accessible inside the terminal shell. Design says "expert," words say "I'll guide you." |
| LiveTerminal looks fake/generic | Medium | High | Script from real Hermes session transcripts. Use actual command syntax, actual tool names, actual latency. |
| Diagnostic adds friction to pricing | Medium | Medium | "Just show me pricing →" escape hatch on every step. Diagnostic is default path, not only path. |
| Cockpit feels cramped at 100vh | Medium | Medium | Art-direct spacing precisely. Screenshot and iterate. This is where the design earns its keep. |
| Sidebar nav breaks mobile | Low | High | Mobile keeps horizontal condensed bar. Sidebar is desktop-only. Test at 390px and 360px. |
| Typewriter animation hurts performance | Low | Low | CSS-first, `steps()` animation, transform/opacity only. Disable under reduced-motion. |
| Scope creep into backend changes | Medium | High | Explicitly leave all API/auth/Stripe/Prisma untouched. Visual pass only. |
| Existing pages look inconsistent | High | Medium | Apply terminal vocabulary to header/footer first. Page-by-page conversion follows. |

---

## 10. What This Is Not

- Not a theme toggle. Dark-native, one mode, excellent.
- Not WebGL, 3D, or canvas animation. CSS and SVG only.
- Not a live backend connection for the terminal or receipts. v1 is simulated/static, architected to accept real data later.
- Not a copy rewrite (beyond hero compression and diagnostic questions). The offer and tone stay.
- Not new pricing, new routes, or new business logic.
- Not deployed without Tony's explicit approval.

---

## 11. Fresh-Session Pickup

1. Read this plan in full.
2. Re-check `git status --short --branch`.
3. Run `npm run typecheck && npm run build` to confirm clean baseline.
4. Start with Phase 1 (terminal design tokens). Each phase is independently verifiable.
5. After Phase 4 (cockpit hero), screenshot and evaluate before continuing — this is the make-or-break moment.
6. Stop after Phase 10 for Tony's approval before any deploy.
