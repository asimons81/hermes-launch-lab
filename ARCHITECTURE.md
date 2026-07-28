# HERMES LAUNCH LAB — Architecture

**Stack**
- Next.js 15 (App Router)
- TypeScript (strict)
- Prisma + PostgreSQL
- Auth.js (email magic links)
- Stripe (checkout + webhooks)
- Resend (transactional email)
- Zod (validation)
- Lucide icons

**Why this stack**
Single deployable unit. Type safety end-to-end. Minimal moving parts. Proven for solo SaaS.

**Data model summary**
- Users (customers + admin)
- Services (editable pricing/description)
- Bookings (service + time + status)
- Payments (Stripe-linked, idempotent)
- Intakes (structured form, secrets warning)
- Applications (custom build, care)
- Notes (customer-visible vs internal)

**Authorization model**
- Server-side only. Middleware + route handlers check session + role.
- Customer records filtered by userId. No client-side trust.

**Booking approach**
Native availability slots table for launch. Fixtures labeled "TEST". Swap to external provider later without schema change.

**Payment approach**
Stripe Checkout Sessions created server-side. Webhook updates Payment + Booking status. Never trust redirect.

**Email approach**
Resend abstraction. Templates in `lib/email/templates`. All transactional.

**Design system**
Editorial-technical. Inter + IBM Plex Mono. Slate/ink palette. 4px grid. No gradients, no glass, no pills. Dense but scannable.

**Deployment target**
Vercel (hermes.tonysimons.dev). Postgres on Neon or Vercel Postgres. DNS + SSL handled by Vercel.

**Credentials required (never committed)**
DATABASE_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, AUTH_SECRET, NEXTAUTH_URL
