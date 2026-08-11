# Payment Confirmation Email — Implementation Spec

**Status:** Approved for implementation (2026-08-11)
**Owner:** hermes-dev (build) / default (verification)
**App:** Hermes Launch Lab (launch.tonysimons.dev)
**Sender stack:** Resend (already wired for magic links) + Stripe webhook

---

## 1. Goal

When a customer pays for a session, they get a professional, branded confirmation
email within seconds. This is the first real email a paying customer receives —
it must feel as premium as the product: dark, editorial, precise.

Today the only outbound email is the magic link. Stripe does **not** email receipts
in test mode, so this email is also the only confirmation available during
pre-launch testing. It must work in both test and live modes.

## 2. Trigger & placement

**Send site:** `app/api/webhooks/stripe/route.ts`, in the
`checkout.session.completed` handler, **after** the `Payment` upsert and the
`booking → confirmed` update succeed.

**Order of operations in the handler:**

1. Verify signature (existing).
2. Load booking (existing).
3. Upsert `Payment` (existing) — **now also populate `receiptUrl`** (see §6).
4. Transition booking `pending → confirmed`.
5. **Send customer confirmation email — only on the status transition.**
6. **Send admin notification email to Tony** (see §9).
7. Return `200 ok` regardless of email outcome.

### Idempotency / retry safety (non-negotiable)

Stripe retries webhooks until it gets a `200`. The current handler is idempotent
for DB writes (upsert + unconditional update). Email must not double-send on retry:

```ts
const wasAlreadyConfirmed = booking.status === 'confirmed'
// ... existing upsert + update ...
if (!wasAlreadyConfirmed) {
  await sendBookingConfirmation(...)   // fire-and-forget, see §8
  await sendAdminNotification(...)
}
```

On a retry, `booking.status` is already `confirmed` → email is skipped. No
extra `sentAt` column needed. If we later add refund/expired emails, revisit
with a `Payment.emailEvents Json?` column — out of scope today.

## 3. What the email contains

### 3.1 Subject lines (per service, no placeholders left on the table)

| Service | Subject |
|---|---|
| Strategy ($99) | `Your Hermes Strategy Session is confirmed — {Day, Mon D} at {time}` |
| Launch ($299) | `Your Hermes Launch Session is confirmed — {Day, Mon D} at {time}` |
| Custom ($600) | `Your Custom Hermes Build is confirmed — {Day, Mon D} at {time}` |

Subject shows **date + time in the customer's timezone** (booking.timeZone),
e.g. `Your Hermes Launch Session is confirmed — Tue, Aug 18 at 2:00 PM`.

Preheader (hidden preview line): `Paid ${amount}. Here's everything you need for our session.`

### 3.2 Body (draft copy, editable in implementation)

```
┌──────────────────────────────────────────────┐
│  HERMES LAUNCH LAB        (wordmark, crimson) │
├──────────────────────────────────────────────┤
│  You're booked, {firstName}.                  │
│                                              │
│  Your Hermes Launch Session is confirmed for │
│  Tuesday, August 18 at 2:00 PM (Central Time)│
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ SESSION          Hermes Launch Session │  │
│  │ DATE             Tue, Aug 18, 2026     │  │
│  │ TIME             2:00–3:30 PM CT       │  │
│  │ DURATION         90 minutes            │  │
│  │ PAID             $299.00 ✓             │  │
│  │ REFERENCE        HLL-8F3K2A            │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  WHAT HAPPENS NEXT                           │
│  1. A calendar invite is attached — add it   │
│     so the time is locked in.                │
│  2. Nothing to prepare. Bring your questions │
│     and your setup; we handle the rest.      │
│  3. After the session you get 7 days of      │
│     follow-up support on anything we built.  │
│                                              │
│  [  View receipt  ]   [  Manage booking  ]   │
│                                              │
│  Questions? Just reply to this email — it    │
│  lands in Tony's inbox.                      │
│                                              │
│  Hermes Launch Lab · launch.tonysimons.dev   │
│  Terms · Privacy                             │
└──────────────────────────────────────────────┘
```

Personalization hooks:
- **firstName** — from `User.name` (fallback: first word of `Intake.fullName`, then "there").
- **Service copy** — the three bullets in "What happens next" differ per service:
  - Strategy: "You'll leave with a written action plan. Bring your current setup details and goals."
  - Launch: copy above (calendar invite, nothing to prepare, 7-day follow-up).
  - Custom: "We'll scope the build in our first conversation. Watch your inbox — an intake email is on the way." (Intake is part of the flow; confirm copy at build.)
- **Intake-aware line** (when `Booking.intake` exists): "We've got your setup details on file — no need to resend them."
- **Timezone** — always rendered as `{City} Time` (e.g. "Central Time") plus the absolute date, so there's zero ambiguity.

### 3.3 Receipt

- Line item: `Hermes Launch Session — $299.00` / `Paid via Stripe`.
- **View receipt** button → `Payment.receiptUrl` (Stripe hosted receipt; exists in test mode too).
- If `receiptUrl` is null (shouldn't happen after §6), omit the button, keep "Paid ✓".

### 3.4 Links

- **View receipt** → receiptUrl
- **Manage booking** → `{NEXTAUTH_URL}/portal` (portal exists; if booking mgmt is read-only there today, link still lands somewhere useful — verify at build)
- **Terms / Privacy** → existing legal pages (`/legal/...` — reuse current paths)

## 4. Design spec

### 4.1 Layout

- Single column, `max-width: 600px`, centered.
- Table-based layout (email-safe), no flexbox/grid in critical paths.
- **Light-first**: white `#FFFFFF` background, near-black text. The dark app
  aesthetic is carried by a **deep-black header band** (`#020203`) with the
  wordmark, a crimson accent rule, and dark detail chips. Rationale: light
  emails render reliably in every client (Gmail, Outlook, Apple Mail, dark-mode
  inversions); a fully dark email degrades badly in Gmail's forced-light and
  Outlook's HTML engine.
- Dark-mode variant via `@media (prefers-color-scheme: dark)` with
  `color-scheme: light dark` meta — invert body to `#0A0A0C` surface, keep
  tokens (see 4.2). Must be tested in Apple Mail + Gmail app.

### 4.2 Palette (from app tokens, `app/globals.css`)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#F8F9FA` | text on dark surfaces |
| `--bone` | `#E2E8F0` | secondary text on dark |
| `--muted` | `#8E9BAE` | labels, meta |
| `--red-accent` | `#FF2A35` | accent rule, wordmark dot, "Paid ✓", button |
| `--bg` | `#020203` | header band, dark-mode surface |
| `--surface-2` | `#121215` | dark chips |
| white | `#FFFFFF` | light-mode body bg |
| near-black | `#111214` | light-mode text |

Contrast check: `#FF2A35` on white fails AA for body text (~3.2:1) — use it
for **large text / accents / buttons with white text only at ≥18px bold**, and
`#B91C27` (or `#C62B36`) for small crimson text if ever needed. Detail blocks
use near-black on white — AA pass.

### 4.3 Typography

- System stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`.
- H1: 28px/34px, weight 700, letter-spacing -0.02em.
- Section labels: 11px, weight 700, letter-spacing 0.12em, uppercase, muted.
- Body: 15px/24px.
- Monospace for the reference: `SFMono-Regular, Menlo, Consolas, monospace`, 13px.

### 4.4 Components

- **Wordmark:** "HERMES LAUNCH LAB" — 13px, weight 700, letter-spacing 0.18em, white on black band, with a 6px crimson square before it (matches app's red-accent identity).
- **Detail table:** two-column rows, thin `#E5E7EB` separators (dark: `rgba(255,255,255,0.08)`), label muted uppercase 11px, value 14px medium.
- **Buttons:** bulletproof (`<table role="presentation"><a>` pattern), crimson `#FF2A35` bg, white 14px bold text, 12px 28px padding, radius 8px, `mso-padding-alt` for Outlook.
- **Icons:** none — no remote images beyond the wordmark treatment (text-based = deliverability-safe). If a logo image is used later, host on the app domain with absolute URLs, `width/height` set, and `alt`.

## 5. Calendar invite (.ics) — the pro move

Attach a real `.ics` to the confirmation (Resend supports `attachments`).

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hermes Launch Lab//Booking//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:{booking.id}@launch.tonysimons.dev
DTSTAMP:{now UTC}
DTSTART:{startTime UTC, TZID=booking.timeZone}
DTEND:{endTime UTC, TZID=booking.timeZone}
SUMMARY:Hermes Launch Session with Tony Simons
DESCRIPTION:Paid session. Details: launch.tonysimons.dev/portal
ORGANIZER;CN=Hermes Launch Lab:mailto:hello@tonyreviewsthings.com
END:VEVENT
END:VCALENDAR
```

Rules:
- `DTSTART`/`DTEND` in **UTC** with explicit `TZID` (iCal-compliant; never floating times).
- Filename: `hermes-launch-session-{yyyy-mm-dd}.ics` (per-service naming).
- Test in Google Calendar + Apple Calendar + Outlook — wrong TZ handling is the classic failure.

## 6. Receipt URL capture

`Payment.receiptUrl` exists in the schema and is **never populated** — fix it.

In the webhook, expand the charge:

```ts
const full = await stripe.checkout.sessions.retrieve(session.id, {
  expand: ['payment_intent.latest_charge']
})
const receiptUrl = full.payment_intent?.latest_charge?.receipt_url ?? null
```

Store it on the `Payment` upsert (create + update). Works in test mode
(verified: the Aug-10 test charge has a receipt_url).

## 7. Code artifacts

| File | Change |
|---|---|
| `lib/email.ts` | Add `sendBookingConfirmation(booking, service, user, intake, receiptUrl, receiptRef)`, `sendAdminNotification(...)`, `buildBookingIcs(...)`, `renderConfirmationHtml(...)` + plain-text renderer |
| `app/api/webhooks/stripe/route.ts` | Populate receiptUrl, transition-guard the sends (§2), fire-and-forget dispatch (§8) |
| `lib/booking.ts` | Helper `formatBookingDateTime(booking)` using `Intl.DateTimeFormat` + booking.timeZone; `bookingRef(id)` → `HLL-{first 6 of id, upper}` |
| `.env` (prod) | `RESEND_FROM=hello@tonyreviewsthings.com`, `ADMIN_EMAIL=tony@tonyreviewsthings.com` |
| tests | Extend `booking-hold.test.ts`-style source checks: webhook contains transition guard, receiptUrl population, email import; `tests/seo-security.test.ts` must not break |

No Prisma migration needed.

## 8. Reliability & delivery

- **Fire-and-forget:** wrap sends in `Promise.allSettled`-style try/catch with a
  10s timeout (`AbortSignal.timeout(10_000)`). Never await-block the webhook
  past the DB work; webhook returns `200 ok` even if Resend fails.
- **Logging:** `console.error('[email] confirm failed', bookingId, err)` +
  structured log line on success (`[email] confirm sent`, bookingId, resendId).
  Surfaced in Vercel logs; no crash.
- **Mode note:** sends in test mode too (deliberate — it's the only confirmation
  during testing). Log `env: test|live` from key prefix for debugging.
- **From address:** `Hermes Launch Lab <hello@tonyreviewsthings.com>` with
  `Reply-To: Tony Simons <tony@tonyreviewsthings.com>` — replies land in Tony's
  inbox, which is the support channel. Domain is already DKIM/SPF-verified in
  Resend (magic links use it), so **no DNS changes**.
- **Plain-text part:** always send `text/plain` alongside HTML (spam scoring +
  accessibility). Keep the same details; links as bare URLs.
- **No unsubscribe footer** — transactional email, not marketing. Footer states
  "You're receiving this because you booked a session." Terms/Privacy links included.

## 9. Admin notification (internal)

Second email, to `ADMIN_EMAIL`, subject:
`New booking — {Service} — ${amount} — {Day, Mon D} {time}`

Body: booking ref, service, amount, customer name/email, session time (Tony's TZ), **intake summary when present** (os, comfortLevel, hermesInstalled, installMethod, environment, modelProvider, messaging, firstWorkflow, blocker, recordConsent) — this is the pre-session briefing and makes the email actually useful, not noise.

## 10. Verification checklist (pre-launch gate)

- [ ] Real test-card checkout on staging/prod → confirmation arrives in < 10s (test mode; Stripe sends nothing, app email is the proof)
- [ ] Re-run webhook manually twice → exactly one email (idempotency)
- [ ] `receiptUrl` populated on the Payment row; receipt link opens
- [ ] `.ics` imports into Google Calendar + Apple Calendar with correct local time (TZID honored)
- [ ] Renders in Gmail (web+app), Apple Mail, Outlook 2016+ (table layout), mobile 320px
- [ ] Dark-mode variant readable; no contrast failures on detail text
- [ ] Plain-text part complete; SPF/DKIM pass (Resend dashboard)
- [ ] Reply-to routes to Tony's inbox
- [ ] Admin notification arrives with intake summary
- [ ] Broken Resend key (env removed) → webhook still returns 200, booking still confirms

## 11. Out of scope (future, note only)

- 7-day follow-up email (service promise) — separate scheduled job, post-launch.
- Refund/cancellation emails (`Payment.status = refunded` hooks).
- Reschedule confirmation emails (portal-driven changes).
- Rebrand from-address to a `@tonysimons.dev` domain if Resend verification is added there.

## 12. Open decisions (fast, low-stakes)

1. **From address:** `hello@tonyreviewsthings.com` (recommended) vs `noreply@…` vs keeping `tony@…`. — *Default: hello@ + Reply-To tony@.*
2. **Manage booking link** → `/portal` (verify what portal offers logged-in customers at build time).
3. **Custom Build copy** in "What happens next" — needs one line from Tony on the post-purchase flow (intake email exists?).
