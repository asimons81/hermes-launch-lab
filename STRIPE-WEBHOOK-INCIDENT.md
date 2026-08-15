# Stripe Webhook Incident — 2026-08-15 (RESOLVED)

## Email received
Stripe alert: 48 failed live-mode deliveries to
`https://launch.tonysimons.dev/api/webhooks/stripe` since 2026-08-12 04:18:36 UTC.
Auto-disable of endpoint scheduled 2026-08-21 04:18:36 UTC if unfixed.

## Root cause (verified 2026-08-15)
**Test/live mismatch.** The Stripe account had a LIVE webhook endpoint
(`we_1U38jqKkt9jvIttyrjeWXJYA`, created ~Aug 11) pointing at the Launch Lab URL,
but Vercel production env still carries TEST-mode keys
(`STRIPE_SECRET_KEY=sk_test_...`, verified via `vercel env pull`).

Every live event failed signature verification in
`app/api/webhooks/stripe/route.ts` → HTTP 400 → Stripe counted 48 failures.

## Impact assessment (live account, read-only API check)
- 10 live checkout sessions, **all expired** (abandoned carts, $299–$500, never paid)
- 0 payment intents, 0 charges → **no real money moved, nothing unfulfilled**
- Handler logic is sound (refund guardrails, idempotent upserts, email dedupe) — it
  will work correctly once secrets are swapped.

## Resolution (2026-08-15, approved by Tony)
1. Deleted the broken live endpoint (we_1U38jqKkt9jvIttyrjeWXJYA) via Stripe API.
2. **Recreated** live endpoint → `we_1U4hXBKkt9jvIttyKBUFpBVs` (enabled,
   url=https://launch.tonysimons.dev/api/webhooks/stripe, events =
   checkout.session.completed + checkout.session.expired). Fresh one-shot whsec captured.
3. Swapped Vercel production env: `STRIPE_SECRET_KEY` → `sk_live_...` (from Hermes
   Vault `stripe / launch-lab-live`) and `STRIPE_WEBHOOK_SECRET` → new live whsec.
   (Stored as sensitive-type; not readable back — verified end-to-end instead.)
4. Deployed production: dpl_HeYCXKJHryBr1ewDD1iTCJTU4PTi → launch.tonysimons.dev.
5. **Verified**: signed test event (stripe.webhooks.generateTestHeaderString with the
   new whsec) POSTed to live URL → **HTTP 200, body `ok`**. Signature path confirmed.

## Checklist status
- [x] Root cause identified (test keys on server vs live endpoint)
- [x] Failing endpoint removed (reversible)
- [x] Live endpoint recreated with fresh one-shot whsec
- [x] Vercel prod env swapped to live keys
- [x] Deployed + signed-event verification (HTTP 200)
- [x] Go-live gate approved by Tony 2026-08-15 (kanban t_5f09e800) + live state
      re-verified 12:49 UTC-5: endpoint enabled we_1U4hXBKkt9jvIttyKBUFpBVs,
      Vercel prod env live, vault sk_live present, handler healthy
- [ ] Full live checkout E2E test (LAUNCH-CHECKLIST item 13) — remaining; webhook
      signature path already proven with signed event; E2E requires a real card +
      real charge (no $1 test mode in code), so it is a Tony-in-the-loop step
