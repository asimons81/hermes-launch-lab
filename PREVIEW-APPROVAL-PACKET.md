# Hermes Launch Lab — Conversion & Proof Preview Packet

**Branch:** `feature/launch-lab-conversion-proof`

**Status:** local preview ready; no push, no Vercel production deployment, and no live-payment change performed.

## What changed

- Added a public **About Tony** route at `/about`, with canonical, Open Graph, Twitter metadata, sitemap inclusion, and direct public navigation.
- Repositioned the homepage around real proof before the session-selection diagnostic:
  - source-backed public cards for Hermes Vault, NexusOS, and Hardproof;
  - direct 1:1 session framing;
  - an explicit choose → prepare → build/verify path.
- Reframed `/features` as **What Tony Builds with Hermes**.
- Expanded Pricing and FAQ so a buyer can understand direct ownership, Strategy vs. Launch vs. Custom scope, access boundaries, outcomes, and booking flow before checkout.
- Added owned project imagery and an editorial founder portrait candidate for the local preview.
- Preserved test-mode Stripe, booking/auth/payment/database implementation, pricing, legal boundaries, and independent/Nous disclosure.
- Added conversion contracts and Playwright coverage for `/about`, public source links, conversion-path ordering, navigation, and responsive widths.

## Truth boundaries

- No customer testimonials, logos, client outcomes, vanity metrics, fabricated uptime, third-party comparison table, or generated product UI were added.
- Project cards link to public repositories rather than claiming customer case studies.
- The founder image is a **preview candidate only**. Tony must approve it before any production release.
- The local preview uses a dummy unreachable database URL. Public marketing pages render and test correctly; local `/book` cannot run against a dummy DB by design. The live test-mode booking loop is a separate verified surface and was not modified.

## Verification receipts

| Gate | Result |
|---|---|
| Unit/contract suite | 144/144 passed |
| Typecheck | passed |
| Lint | passed, zero warnings |
| Production build | passed; `/about` statically generated |
| Browser suite | 17/17 Playwright passed |
| Browser accessibility | axe serious/critical violations: none on homepage at 390px and 1280px |
| Responsive checks | no horizontal overflow across new conversion routes at 375/1280; legacy route matrix passes 390/768/1024/1280/1440 |
| Browser readback | `/about` title, canonical, proof links, and all four images loaded successfully |
| Production CSP preview | strict CSP: no `unsafe-eval`; Stripe hosted checkout remains allowed in `form-action` |
| Claim review | `CLAIM-AUDIT.md` committed locally; no prohibited claim patterns found in modified public surfaces |

## Local preview

- About Tony: `http://127.0.0.1:3111/about`
- Homepage: `http://127.0.0.1:3111/`
- Pricing: `http://127.0.0.1:3111/pricing`

The Desktop preview pane is currently open to `/about`.

## Required Tony decisions

1. **Portrait selection:** Candidate B (direct gaze) is currently used in the local preview. Candidate A/B comparison is stored locally under `.artifacts/preview/portrait-candidates-a-b.png`; Candidate B passed visual QA as the stronger option. Approve B, select A, or request a real-photo fallback.
2. **Preview approval:** after reviewing the local preview, authorize a push to the feature branch / Vercel preview only. Production deployment remains a separate explicit decision.
3. **Live payments:** remains separate. Stripe is still test mode and no live key/webhook transition is included in this work.

## Rollback

No production surface changed. The current production rollback baseline remains the latest Vercel production deployment on `master`; this feature branch is local-only.

## Files added or materially changed

- `app/about/page.tsx`
- `app/page.tsx`, `app/pricing/page.tsx`, `app/faq/page.tsx`, `app/features/page.tsx`, `app/sitemap.ts`
- `components/FounderPortrait.tsx`, `ProjectProofGrid.tsx`, `EngagementSteps.tsx`
- `components/SiteHeader.tsx`, `SiteFooter.tsx`, `CommandPalette.tsx`, `ReceiptsRail.tsx`
- `lib/project-proof.ts`
- `public/media/tony-founder-portrait.webp`, `public/media/projects/*`
- `tests/conversion-proof.test.ts`, `tests/e2e/conversion-path.dom.spec.ts`, `tests/seo-security.test.ts`
- `next.config.ts` (development-only CSP compatibility; production CSP remains strict)
- `CLAIM-AUDIT.md`

**Do not push or deploy until the two review decisions above are recorded.**
