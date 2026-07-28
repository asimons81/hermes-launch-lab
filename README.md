# README

Hermes Launch Lab — production SaaS for Hermes Agent consulting.

## Local dev
```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Stack
Next.js 15 + Prisma + PostgreSQL + Stripe + Resend + Auth.js

## Design
Editorial-technical. No gradients, no glass, no AI slop. 4px grid. Inter + IBM Plex Mono.

## Credentials
Never commit secrets. Use env vars only.
