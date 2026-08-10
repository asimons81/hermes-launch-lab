# DEPLOYMENT

## Required env vars
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
AUTH_SECRET=...
NEXTAUTH_URL=https://launch.tonysimons.dev

## Steps
1. `npm run db:push`
2. `npm run db:seed`
3. `npm run build`
4. Deploy to Vercel
5. Add Stripe webhook: https://launch.tonysimons.dev/api/webhooks/stripe
6. Configure custom domain + SSL (automatic on Vercel)
7. Seed admin user via Prisma Studio or script

## Health check
GET /api/health returns 200 when DB connected.
