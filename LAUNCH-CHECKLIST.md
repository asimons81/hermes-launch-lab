# LAUNCH CHECKLIST

- [x] All env vars set in production (Vercel: DATABASE_URL, NEXTAUTH_URL, AUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY)
- [x] NEXTAUTH_URL points to https://launch.tonysimons.dev (fixed 2026-08-10)
- [x] DNS pointed to Vercel (A launch.tonysimons.dev → 76.76.21.21, grey-cloud, mirroring hermes.tonysimons.dev)
- [x] TLS certificate issued (Let's Encrypt via Vercel)
- [x] Health endpoint green: https://launch.tonysimons.dev/api/health → {"ok":true}
- [x] Auth gate verified: /book → 307 /auth/signin
- [x] Rollback plan: previous Vercel deployment (Vercel keeps history)
- [ ] Stripe webhook endpoint URL updated in Stripe dashboard to https://launch.tonysimons.dev/api/webhooks/stripe (was hermes.tonysimons.dev)
- [x] Admin user created with role=admin (tony@tonyreviewsthings.com, 2026-08-10)
- [x] Services seeded (3 sessions live via /api/services; db:seed no-op bug fixed in df06665)
- [ ] Test checkout end-to-end in live mode
- [ ] Email domain verified with Resend (sender tony@tonyreviewsthings.com)
- [ ] Privacy/Terms/Refund pages reviewed by counsel
- [ ] Backup strategy documented
