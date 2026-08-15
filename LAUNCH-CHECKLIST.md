# LAUNCH CHECKLIST

- [x] All env vars set in production (Vercel: DATABASE_URL, NEXTAUTH_URL, AUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY)
- [x] NEXTAUTH_URL points to https://launch.tonysimons.dev (fixed 2026-08-10)
- [x] DNS pointed to Vercel (A launch.tonysimons.dev → 76.76.21.21, grey-cloud, mirroring hermes.tonysimons.dev)
- [x] TLS certificate issued (Let's Encrypt via Vercel)
- [x] Health endpoint green: https://launch.tonysimons.dev/api/health → {"ok":true}
- [x] Auth gate verified: /book → 307 /auth/signin
- [x] Rollback plan: previous Vercel deployment (Vercel keeps history)
- [x] Stripe webhook endpoint URL updated in Stripe dashboard to https://launch.tonysimons.dev/api/webhooks/stripe (was hermes.tonysimons.dev) — endpoint recreated live we_1U4hXBKkt9jvIttyKBUFpBVs on 2026-08-15; Vercel prod env swapped to live keys; signed-event verify HTTP 200
- [x] Admin user created with role=admin (tony@tonyreviewsthings.com, 2026-08-10)
- [x] Services seeded (3 sessions live via /api/services; db:seed no-op bug fixed in df06665)
- [ ] Test checkout end-to-end in live mode (webhook signature path verified 2026-08-15; live flip + Tony gate approved 2026-08-15 kanban t_5f09e800; full purchase flow remaining — real-card test, refundable)
- [ ] Email domain verified with Resend (sender tony@tonyreviewsthings.com)
- [ ] Privacy/Terms/Refund pages reviewed by counsel
- [ ] Backup strategy documented
