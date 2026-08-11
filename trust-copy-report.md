# Trust Copy Repair Report

Task: t_3085911a — Align offer copy, status telemetry, ROI, and trust claims
Branch: wt/launch-trust-copy
Base: 96ff951 (master)
Date: 2026-08-10

## Method

Test-first: `tests/trust-copy.test.ts` (14 content-contract tests) was written first and
observed RED (14 failed). Source files were then corrected until the suite went GREEN.
Full gate passes: `npm test -- --run` (17 tests), `npm run typecheck`, `npm run lint`,
`npm run build` (31 routes).

## Changed claims and rationale

### 1. Working-software promise vs. Strategy plan-only deliverable
- `app/pricing/page.tsx` — intro said "You leave with working software." over all three
  offers, but Strategy delivers a written action plan only (per its own description and
  FAQ "Strategy sessions do not include installation"). Now: "Launch and Custom sessions
  leave you with working software; Strategy ends with a written action plan."
- `app/page.tsx` — closing CTA promised "turn the starting point into a working system"
  for any session. Now bounded: "Choose a session and leave with working software — or,
  for strategy, a written action plan."
- Kept the hero "Leave with it working." (visual-contract test requires it; it is the
  flagship Launch-session promise).

### 2. Launch Session 90-minute duration missing on pricing
- `components/ServiceCard.tsx` — featured card label was hardcoded "MOST HANDS-ON",
  hiding the duration for the featured Launch card. Now `${durationMin} MINUTES · MOST
  HANDS-ON`, so 90 MINUTES is always visible on /pricing and /services.
- Verified duration values (60/90/120) match `prisma/seed.ts` and `app/api/services`.

### 3. Terms reference support windows not stated on service page
- Terms §1 says "Follow-up and support windows are as stated on the service page", but
  the service pages did not state any window. Now:
  - `app/pricing/page.tsx` and `app/services/page.tsx` Launch description includes
    "7-day follow-up support" (matches seed and the Launch contract).
  - Custom description includes "7-day follow-up support" (matches Consulting Agreement
    §2, which defines the 7-day follow-up window for Custom Builds).
  - `prisma/seed.ts` custom seed aligned so DB descriptions match the pages.
  - Terms page text itself unchanged — it is now truthful.

### 4. Custom application-required copy/path consistency
- Pricing/services already said "Application required." — kept.
- `components/DiagnosticIntake.tsx` — Custom recommendation now states "Application
  required before booking." and the flat-pricing Custom card states "Application
  required." (previously omitted).
- Booking-path gating (requiring an actual application before checkout) is owned by the
  booking/auth lane (t_ad5871d1) and the integration card (t_fea48c72); this lane did
  not duplicate that functionality, only corrected the copy.

### 5. Status telemetry claims not substantiated by `{ok:true}`
`/api/health` only proves the app + database respond (`SELECT 1`). The old status page
claimed Operational for Stripe webhooks, Resend DKIM/SPF, a "Hermes Local Fleet Engine",
99.98% 30-day uptime, a hardcoded 14ms latency, and "Automated uptime telemetry powered
by Vercel Edge" — none of which that endpoint verifies. `LAUNCH-CHECKLIST.md` confirms
Stripe webhook URL and Resend domain verification are still open items.
- `app/status/page.tsx` rewritten:
  - Title "Health check status." instead of "All systems operational."
  - Metrics show only latency (measured, "—" until first poll), status OK/ERROR, last check.
  - Component matrix splits verified (health endpoint, app+database via SELECT 1) from
    explicitly unmonitored (Stripe, Resend, Vercel edge) — no fabricated operational dots.
  - Footer note states the endpoint's actual scope.
- `components/SiteFooter.tsx` — removed unsubstantiated "All Systems Operational" pulse
  pill; replaced with the derivable public contact.
- `app/page.tsx` — hero pill "SYSTEM ACTIVE // HERMES LAUNCH LAB" → "HERMES LAUNCH LAB //
  INDEPENDENT CONSULTING" (removes faux-live claim).
- `components/StatusBar.tsx` — "SESSION: READY / SECURITY: BROKERED" were implied live
  state; replaced with static descriptors "FORMAT: 1-ON-1 / SECURITY: LOCAL-FIRST".

### 6. Stale v0.19.0 display + faux-live activity labels
- `components/LiveTerminal.tsx` — removed "v0.19.0" (version not derivable from repo; no
  substitute invented) and fabricated "55 skills indexed"/"55 total skills" counts. Added
  a visible banner: "SIMULATED DEMO OUTPUT — NOT LIVE TELEMETRY"; aria-label now
  "Simulated Hermes Agent session — illustrative demo output".
- `components/ReceiptsRail.tsx` — aria-label "Live agent activity" → "Illustrative
  session activity sample"; label "SYSTEM ACTIVITY" → "SAMPLE SESSION ACTIVITY" with an
  explicit "Illustrative sample — not live activity." caption.

### 7. ROI calculator's unexplained 60% recovery assumption
- `components/RoiCalculator.tsx` — the 60% automation-efficiency multiplier was invisible.
  Now a visible disclosure states: "Assumes roughly 60% of the repetitive hours you enter
  become automatable with a configured agent — an illustrative estimate, not a guarantee
  of savings."
- `app/pricing/page.tsx` — heading "How much time will Hermes save you?" (implied
  certainty) → "Estimate what a configured agent could save you"; body now says
  "illustrative estimate".

### 8. Category-confused comparison + unverifiable real-skills claims
- `app/features/page.tsx` — removed the "Hermes Consulting vs. Claude Code / Cursor /
  DIY" matrix (comparing a consulting service against third-party products and asserting
  unverifiable capability claims about them). Replaced with a session comparison
  (Strategy/Launch/Custom) grounded in the service descriptions, plus a note that details
  match the pricing page.
- Skill catalog: heading "Inspect & Load Real Skills" → "Browse Example Skills"; copy now
  says manifests are "illustrative, not a live catalog"; `components/SkillCatalog.tsx`
  placeholder "Search 55+ skills..." → "Search example skills...". The catalog was
  previously presented as a real installed catalog (fabricated counts/versions).

### 9. Thin public contact / privacy completeness
- `app/legal/privacy/page.tsx` — added a public contact method (the only derivable
  address in the repo: `tony@tonyreviewsthings.com`, from `lib/email.ts` and
  `LAUNCH-CHECKLIST.md` admin user), a Service Providers section (Vercel, Neon, Stripe,
  Resend — all verifiable from package.json/.env.example/checklist), and intake data
  scope in Data Collected.
- `components/SiteFooter.tsx` — footer now exposes the same contact address.

## Claims explicitly NOT invented
No testimonials, case studies, uptime percentages, guarantees, legal claims beyond the
existing Terms/Agreement/Refund, service windows beyond the 7-day follow-up already
stated in the seed/agreement, or contact details beyond the repo-derivable address.

## Facts flagged for Tony (not chosen by this lane)
- The Hermes version on the fleet host is NOT derivable from this repo; the stale
  "v0.19.0" was removed rather than replaced with a guess.
- Live Stripe webhook URL update and Resend domain verification are still unchecked in
  `LAUNCH-CHECKLIST.md`; the status page now correctly does not claim them operational.
- Booking-path gating for Custom ("Application required" enforced before checkout) is a
  booking/auth lane concern (t_ad5871d1 / integration t_fea48c72), not implemented here.

## Changed files
- app/features/page.tsx, app/legal/privacy/page.tsx, app/page.tsx, app/pricing/page.tsx,
  app/services/page.tsx, app/status/page.tsx, components/DiagnosticIntake.tsx,
  components/LiveTerminal.tsx, components/ReceiptsRail.tsx, components/RoiCalculator.tsx,
  components/ServiceCard.tsx, components/SiteFooter.tsx, components/SkillCatalog.tsx,
  components/StatusBar.tsx, prisma/seed.ts
- tests/trust-copy.test.ts (new)

## Gate results
- npm test -- --run: 17 passed (14 trust-copy + 3 visual-contract)
- npm run typecheck: PASS
- npm run lint: PASS (zero warnings)
- npm run build: PASS (31 routes)

Committed atomically on wt/launch-trust-copy; not pushed. Push/deploy remains a
Tony-only approval gate per the baseline contract.
