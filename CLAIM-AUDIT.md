# Claim Audit — Conversion & Proof Upgrade Plan (UPGRADE-PLAN.md)

Task: t_befd9049
Auditor: hermes-researcher
Audit date: 2026-08-11
Scope: Every factual, statistical, performance, or testimonial claim in
`UPGRADE-PLAN.md`. No production changes made (read-only audit + this package).

## Verdict summary

| # | Claim (plan line) | Source-backed? | Confidence | Action |
|---|---|---|---|---|
| C1 | "Hermes Agent runs your entire fleet from one Arch Linux box" (hero, L7) | Partial | Medium | Reword — supported in spirit, "Arch" is deployment detail not a Hermes claim |
| C2 | Fleet commander model (you + agents) (L9) | Yes | High | Keep |
| C3 | Skills as persistent memory (L10) | Yes | High | Keep |
| C4 | Local-first, no cloud lock-in (L11) | Yes | Medium-High | Keep, soften "no lock-in" |
| C5 | Stripe booking flow (L27) | Yes (code) | High | Keep |
| C6 | Resend transactional emails (L28) | Partial | Medium | Keep code, flag delivery unverified |
| C7 | Trust signal "Stripe + Resend" (L38) | Partial | Medium | Flag Resend delivery unverified |
| C8 | Trust signal "Runs on Arch" (L38) | Yes (infra, internal) | Medium | Keep but confirm against host |
| C9 | Trust signal "Tailscale only" (L38) | **No** | **Low** | **Needs removal / external verification** |
| C10 | "Stripe live mode already configured — do not touch test keys" (L50) | **Contradicted** | **Low** | **Correct — Stripe is in TEST mode** |
| C11 | Status page "simple uptime + last deploy" (L24) | No source | Low | Add only real telemetry; never fabricate |
| C12 | Testimonials "3 real quotes from you + early users" (L35) | No | Low | Needs real quotes; none exist in repo |
| C13 | "Fleet in action" 3-5 real screenshots (L14) | Obtainable | Medium | Capture genuinely via computer_use |
| C14 | "Compared to..." table (Claude Code, Cursor, Aider, terminal) (L36) | Risk | Low | Remove or scope to verifiable differences |
| C15 | Pricing "concrete deliverables … for $X/month" (L13) | Internal | Medium | Match to seed; "per month" mismatches session pricing |

---

## Claim-by-claim evidence

### C1 — Hero: "Hermes Agent runs your entire fleet from one Arch Linux box"
Status: **PARTIAL** — keep, but reword.
- Supported: Hermes is an autonomous agent that "spawns isolated subagents for
  parallel workstreams" (delegation) and runs on a Linux host. The docs say it
  "lives wherever you put it — a $5 VPS, a GPU cluster, or serverless
  infrastructure" and supports 6 terminal backends including local and SSH.
- Unsupported in the literal wording: the docs never name "Arch Linux" as a
  documented platform (they say "Linux / macOS / WSL2 / Android"). "Arch" here
  is Tony's deployment fact, not a documented Hermes capability. "Fleet from
  one box" is defensible via subagent delegation.
- Source: https://hermes-agent.nousresearch.com/docs (accessed 2026-08-11):
  "Delegates & parallelizes — Spawn isolated subagents for parallel
  workstreams"; "Runs anywhere, not just your laptop — 6 terminal backends:
  local, Docker, SSH, Daytona, Singularity, Modal."
- Recommendation: reword to a documented form, e.g. "Hermes runs your whole
  agent fleet from one Linux box" — and keep "Arch" only as a deployment note
  if the host genuinely runs Arch (it does: host kernel 7.1.3-arch2-2).

### C2 — Fleet commander model (you + agents)
Status: **SUPPORTED** — High confidence.
- Docs: "Delegates & parallelizes — Spawn isolated subagents for parallel
  workstreams"; a "closed learning loop" with agent-curated memory and
  self-improvement. The "you + agents" commander framing is a fair description
  of the delegation model.
- Source: https://hermes-agent.nousresearch.com/docs (2026-08-11).

### C3 — Skills as persistent memory
Status: **SUPPORTED** — High confidence.
- Docs: "Skills System | Procedural memory the agent creates and reuses";
  "autonomous skill creation, skill self-improvement during use."
- Source: https://hermes-agent.nousresearch.com/docs (2026-08-11).

### C4 — Local-first, no cloud lock-in
Status: **SUPPORTED, soften** — Medium-High confidence.
- Docs: "Runs anywhere, not just your laptop — 6 terminal backends: local,
  Docker, SSH, Daytona, Singularity, Modal"; "It's not tied to your laptop."
  Local backend exists and the agent is not bound to a single cloud.
- Caveat: "no cloud lock-in" is a strong absolute. It is not locked to one
  cloud (works with Nous Portal, OpenRouter, OpenAI, any endpoint), but model
  serving still relies on external providers. Recommend "local-first, works
  with your own providers" over "no cloud lock-in".
- Source: https://hermes-agent.nousresearch.com/docs (2026-08-11).

### C5 — Real demo booking flow (service selection → calendar → Stripe)
Status: **SUPPORTED (code)** — High confidence.
- Repo evidence: `package.json` (stripe ^14.23.0), `app/api/bookings/route.ts`
  (Stripe Checkout creation), `app/api/webhooks/stripe/route.ts` (webhook with
  `constructEvent`), `prisma/schema.prisma` (Payment model), `.env.example`
  and `DEPLOYMENT.md` (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET). Services are
  seeded (3 sessions, 60/90/120 min) per `prisma/seed.ts`.
- Source: repo paths above (worktree branch wt/t_befd9049, 2026-08-11).

### C6 — Wire Resend transactional emails for booking confirmations
Status: **PARTIAL** — code exists, delivery unverified.
- Repo: `package.json` (resend ^4.0.1), `lib/email.ts`, `lib/email-templates.ts`,
  `tests/email-confirmation.test.ts`, `PAYMENT-CONFIRMATION-EMAIL-SPEC.md`.
- Caveat: `LAUNCH-CHECKLIST.md` line 14 "Email domain verified with Resend
  (sender tony@tonyreviewsthings.com)" is **unchecked**; `integration-report.md`
  lists "Resend domain verification" as **BLOCKED — Tony action**. Emails may
  not deliver in production until the domain is verified.
- Source: `LAUNCH-CHECKLIST.md`, `integration-report.md`, repo code (2026-08-11).

### C7 — Trust signal "Stripe + Resend"
Status: **PARTIAL** — both are genuinely integrated in code, but Resend
delivery is unverified (see C6). Presenting "Stripe + Resend" as a trust badge
is accurate about stack presence, not about end-to-end deliverability.
- Source: repo `package.json` + `integration-report.md` (2026-08-11).

### C8 — Trust signal "Runs on Arch"
Status: **SUPPORTED (internal, infra fact)** — Medium confidence.
- The fleet host runs Arch Linux (host kernel 7.1.3-arch2-2 in the session
  environment). This is a true deployment fact but is only verifiable
  internally (against the box), not from a public primary source. Confirm
  against the live host before publishing as a public trust signal.
- Source: host environment (internal), 2026-08-11.

### C9 — Trust signal "Tailscale only"
Status: **UNSUPPORTED** — needs removal or external verification.
- Zero evidence in the repo: no Tailscale/Tailnet config, no reference in any
  code file, docs file, checklist, or report (the only match is the plan line
  itself). No public primary source was found asserting the fleet is
  Tailscale-only.
- Flag for removal unless Tony confirms the network is genuinely
  Tailscale-only and it can be cited (e.g. Tailscale admin console / network
  diagram). Do not publish this badge on faith.

### C10 — Risk: "Stripe live mode already configured — do not touch test keys"
Status: **CONTRADICTED** — must be corrected.
- `DEPLOYMENT.md` line 5: `STRIPE_SECRET_KEY=sk_test_...` — the configured key
  is a **TEST** key, not live.
- `LAUNCH-CHECKLIST.md` line 13 "Test checkout end-to-end in live mode" is
  **unchecked**; line 10 Stripe webhook URL update is **unchecked**.
- So Stripe is in TEST mode and live checkout is unverified. The claim "live
  mode already configured" is false as written. Correct to: "Stripe is in test
  mode; live flip and webhook URL update are still open items."
- Source: `DEPLOYMENT.md`, `LAUNCH-CHECKLIST.md` (2026-08-11).

### C11 — Public /status page "simple uptime + last deploy"
Status: **NO SOURCE — fabricate risk.**
- A prior lane (`trust-copy-report.md`) explicitly removed fabricated uptime
  claims (a fake "99.98% 30-day uptime", a hardcoded "14ms latency", "All
  systems operational") because `/api/health` only proves app + database
  respond (`SELECT 1`). No real uptime telemetry source is configured.
- If the status page is built, it must show only measured data (current
  `/api/health` latency) and the actual last-deploy timestamp. Do not invent an
  uptime percentage.
- Source: `trust-copy-report.md` §5, `app/status/page.tsx`,
  `tests/trust-copy.test.ts` (2026-08-11).

### C12 — Testimonials "3 real quotes from you + early users"
Status: **NO SOURCE — needs real quotes.**
- `trust-copy-report.md`: "No testimonials … invented." There are no
  testimonials in the repo and no early-user quotes on record. The plan
  correctly requires "real quotes," but none exist yet.
- These are testimonials: they require attributable, genuine user statements
  before publication. If no real early-user quotes can be obtained, this
  section must be removed rather than filled with invented praise.
- Source: `trust-copy-report.md` (2026-08-11).

### C13 — "Fleet in action" 3-5 real screenshots from your Arch box
Status: **OBTAINABLE** — capture genuinely.
- Plan explicitly requires "real screenshots" via computer_use on the Arch
  box. This is achievable. Every image must be an actual capture; do not
  synthesize. Verify each is genuine before publishing.

### C14 — "Compared to..." table (Claude Code, Cursor, Aider, raw terminal)
Status: **RISK — remove or scope.**
- `trust-copy-report.md` §8 previously **removed** a category-confused
  comparison matrix ("Hermes Consulting vs. Claude Code / Cursor / DIY") on the
  grounds that it compared a consulting service against third-party products
  and asserted unverifiable capability claims about them.
- Re-adding a comparison table invites the same problem: performance/capability
  claims about Claude Code, Cursor, and Aider require their own primary sources
  (their official docs/repos), and a consulting service is not directly
  comparable to the tools themselves. Either remove the table or scope it to
  clearly documented, verifiable feature differences with primary sources for
  each product.
- Source: `trust-copy-report.md` §8 (2026-08-11).

### C15 — Pricing copy "concrete deliverables (what you get for $X/month)"
Status: **INTERNAL — align to seed.**
- Services and deliverables exist (`prisma/seed.ts`, `app/api/services`,
  `app/pricing/page.tsx`): three sessions at 60/90/120 minutes with defined
  outcomes. Keep copy grounded in the seed so page/DB/pricing stay consistent
  (the trust-copy lane already enforced this alignment).
- Caveat: the plan says "for $X/month" but the current offer is **session-based,
  one-time**, not a monthly subscription. Use "for $X" (per session) or change
  the business model; do not imply recurring pricing that does not exist.
- Source: `prisma/seed.ts`, `app/pricing/page.tsx` (2026-08-11).

---

## Claims in the plan that are NOT factual/statistical/testimonial
(recorded for completeness, no source needed — they are implementation tasks,
not claims): "How it works 4-step visual", top nav IA, /docs route, admin
dashboard, intake form, waitlist, feature flags, FAQ accordion, Vercel
Analytics custom events, error boundary/500 page, health check endpoint,
changelog route, "Docs content must be accurate" (a constraint, not a claim).

## Primary sources inspected
1. https://hermes-agent.nousresearch.com/docs — Hermes Agent Documentation
   (accessed 2026-08-11).
2. Repo files (worktree wt/t_befd9049, 2026-08-11): UPGRADE-PLAN.md,
   DEPLOYMENT.md, LAUNCH-CHECKLIST.md, trust-copy-report.md,
   integration-report.md, package.json, prisma/seed.ts, app/api/bookings/route.ts,
   app/api/webhooks/stripe/route.ts, app/status/page.tsx,
   tests/trust-copy.test.ts, app/pricing/page.tsx.

## Confidence legend
High = primary source directly supports. Medium-High = primary + minor caveat.
Medium = supported with a caveat / internal-only source. Low = unsupported,
contradicted, or would-be-fabricated.
