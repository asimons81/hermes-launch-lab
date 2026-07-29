# HERMES LAUNCH LAB — Upgrade Plan

## Goal
Turn vague landing into sharp, information-dense site that sells Hermes Agent + explains what it actually is.

## Phase 1: Content & Messaging (high impact, low code)
- Replace hero with single sentence: "Hermes Agent runs your entire fleet from one Arch Linux box."
- Add "What is Hermes?" section (3 short paragraphs max)
  - Fleet commander model (you + agents)
  - Skills as persistent memory
  - Local-first, no cloud lock-in
- Add "How it works" 4-step visual (no animation, just numbered boxes)
- Replace pricing copy with concrete deliverables (what you get for $X/month)
- Add "Fleet in action" section (3-5 real screenshots from your Arch box)

## Phase 2: Information Architecture
- Top nav: Home | Features | Pricing | Docs | Login
- Footer: Legal + status + GitHub link
- Add /docs route stub (MDX or simple pages) for:
  - Quickstart
  - Skills reference
  - Vault usage
  - Cron & loops
- Add public /status page (simple uptime + last deploy)

## Phase 3: Technical Upgrades
- Add real demo booking flow (service selection → calendar → Stripe)
- Wire Resend transactional emails for booking confirmations
- Add admin dashboard (protected) to manage services, view bookings
- Add intake form for custom Hermes builds (secrets warning + structured output)
- Implement waitlist if we hit capacity (simple email capture + DB table)
- Add feature flag system (simple env-based) for staged rollout

## Phase 4: Polish & Conversion
- Add testimonials section (3 real quotes from you + early users)
- Add "Compared to..." table (Claude Code, Cursor, Aider, raw terminal)
- Add FAQ accordion (8-10 questions)
- Add trust signals: "Runs on Arch", "Tailscale only", "Stripe + Resend"
- Mobile-first responsive pass (current layout is desktop-heavy)

## Phase 5: Ops & Measurement
- Add Vercel Analytics + simple custom events (booking started, checkout completed)
- Add error boundary + 500 page
- Add health check endpoint for uptime monitoring
- Add changelog route (auto-populated from commits or manual MD)

## Dependencies / Risks
- Need real screenshots (use computer_use on your Arch box)
- Need 3-5 early user quotes
- Stripe live mode already configured — do not touch test keys
- Docs content must be accurate or it hurts credibility

## Next Step
Approve this plan or specify changes. Once approved, I will break into tickets and start Phase 1.