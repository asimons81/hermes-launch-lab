# booking-auth-report.md — Repair booking intent, auth handoff, and pre-auth legal context

Task: `t_ad5871d1` · Branch: `wt/launch-booking-auth` · Date: 2026-08-10

## Scope

Fix only the verified conversion defects in the booking → auth handoff and pre-auth legal context:

1. `/book?service=*` redirected anonymous buyers to `/auth/signin` with no callback or service context.
2. The sign-in page had no booking context and no Terms/Privacy/Refund links.
3. `/intake` was generic-gated (redirected to sign-in with no callback) and mislabeled "Diagnostic Intake" in the footer.
4. The Custom build card claimed "Application required" with no visible application flow.
5. The Privacy policy said "contacting Tony" but no public Launch Lab contact path existed.

Auth and payment gates were NOT weakened. Nothing was submitted or sent (no email send, no Stripe session, no DB write — tests are static/unit only).

## Changed files

| File | Change |
|---|---|
| `lib/auth-redirect.ts` | NEW. Dependency-free `safeCallbackUrl()` + `buildSignInUrl()` helpers — the open-redirect-safe callback machinery. |
| `app/book/page.tsx` | Auth gate now redirects via `buildSignInUrl({ callbackUrl: '/book?service=…', service })` preserving booking intent. |
| `app/auth/signin/page.tsx` | Reads `callbackUrl` + `service` search params; shows account-first explanation, selected-service context (name + price resolved from DB by slug, never echoing raw input), Terms/Privacy/Refund links before the magic-link request, and redirects the magic link to the sanitized callbackUrl (signed-in users also go to the safe callback). |
| `app/intake/page.tsx` | Gate now redirects via `buildSignInUrl({ callbackUrl: '/intake' })` so users return to intake after signing in. |
| `app/contact/page.tsx` | NEW. Public contact page (`mailto:tony@tonyreviewsthings.com`) with a no-secrets warning. Static page — no form, no submission. |
| `app/legal/privacy/page.tsx` | "contacting Tony" replaced with a link to the public Contact page. |
| `app/services/page.tsx` | Custom build copy made truthful ("scoped through a conversation — contact Launch Lab to apply"). |
| `app/pricing/page.tsx` | Same truthful custom copy. |
| `components/ServiceCard.tsx` | Custom card links to `/contact` ("Apply via contact") instead of a nonexistent application flow; other cards unchanged. |
| `components/SiteFooter.tsx` | Intake label corrected to "Pre-Session Intake"; added public "Contact" link. |
| `prisma/seed.ts` | Seed custom description aligned with the truthful copy. |
| `tests/booking-auth.test.ts` | NEW. 25 focused tests: callback sanitization unit tests, page-content contracts for all five defects. |

## TDD receipts

### RED — before implementation

Command: `npx vitest run tests/booking-auth.test.ts` (tests written first; `lib/auth-redirect` did not exist)

```
 RUN  v2.1.9 /home/tony/projects/hermes-launch-lab/.worktrees/t_ad5871d1

 ❯ tests/booking-auth.test.ts (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/booking-auth.test.ts [ tests/booking-auth.test.ts ]
Error: Failed to load url ../lib/auth-redirect (resolved id: ../lib/auth-redirect) in /home/tony/projects/hermes-launch-lab/.worktrees/t_ad5871d1/tests/booking-auth.test.ts. Does the file exist?

 Test Files  1 failed (1)
      Tests  no tests
```

(Full transcript preserved at run time; the suite was structurally RED because the safety module did not exist, then remained RED on the content contracts until the page fixes landed.)

### GREEN — after implementation

Command: `npx vitest run tests/booking-auth.test.ts`

```
 RUN  v2.1.9 /home/tony/projects/hermes-launch-lab/.worktrees/t_ad5871d1

 ✓ tests/booking-auth.test.ts (25 tests) 10ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
```

## Full gate (final)

| Command | Result |
|---|---|
| `npm test -- --run` | PASS — 28 tests (3 pre-existing visual-contract + 25 new) |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (zero warnings) |
| `npm run build` | PASS — all routes generated, incl. new `/contact` |

Note: one build attempt failed transiently on Google Fonts network fetch (`fonts.gstatic.com` 404/timeout); immediate retry succeeded and the passing build is the final recorded state. No code change was involved.

## Security reasoning

### No open redirect

`lib/auth-redirect.ts` `safeCallbackUrl()` accepts ONLY same-site absolute paths and rejects everything else with a fallback to `/portal`:

- must start with `/` (blocks `https://…`, `javascript:…`)
- must not start with `//` (blocks protocol-relative `//evil.com`)
- no backslashes (blocks browser path-smuggling `/\evil.com`)
- no colons (blocks scheme injection even after a leading slash, e.g. `/javascript:…`)
- no whitespace/control characters (blocks header/path injection)
- decoded BEFORE validation (blocks `%2F%2Fevil.com` encoded protocol-relative URLs)
- malformed percent-encoding → fallback (never trusted)

The only consumer of a user-supplied callback is NextAuth's `signIn(..., { redirectTo: callbackUrl })`, and it always receives the sanitized value. The sign-in page also redirects already-signed-in users only to the sanitized callback. NextAuth's own callback validation remains in force as defense in depth.

### No injection of raw input

Service context on the sign-in page resolves `service` (a slug) against the DB and renders the stored name/price; a failed lookup degrades to generic copy instead of echoing the raw query param. The booking page encodes the service slug with `encodeURIComponent` when building the callback.

### No weakened gates; no side effects

- `/api/bookings` still requires a session, re-checks availability server-side, and still requires `acceptedTerms=yes` (UETA record) before creating a booking — untouched.
- No route in this change sends email, creates a Stripe session, or writes to the DB. The contact page is static (mailto only) and explicitly warns users not to email secrets.

## Residual limits

- The sign-in page's service-context lookup uses Prisma and depends on DB availability; on failure it renders generic copy (sign-in still works).
- `/contact` is a static email path — no CRM, no ticketing, no acknowledgment loop. If volume grows, a managed contact form/CRM is a separate product decision (out of scope per task constraints).
- Tests are content/unit contracts (repo convention: `tests/visual-contract.test.ts`). They assert page source structure and helper behavior, not a rendered browser session; Playwright E2E for the full magic-link round trip belongs to the integration lane.
- The seed copy update only affects fresh DB seeds (`db:seed` guards on existing rows); an already-seeded production DB keeps its old custom description until re-seeded or edited in the admin.
- The build's Google Fonts fetch depends on network reachability to `fonts.gstatic.com`; transient failures are environmental, not code.

## Commit

Single atomic commit on `wt/launch-booking-auth`; NOT pushed (Tony-only push boundary per baseline contract).
