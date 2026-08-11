# SEO, Social Metadata, Icons, 404, and Security Headers — Verified Report

Task: t_5eb48836 · Lane C · Branch: wt/launch-seo-security · 2026-08-10/11
Canonical origin: `https://launch.tonysimons.dev` (DEPLOYMENT.md + live DNS verified)

---

## 1. Verified gaps at baseline (live probes + source inspection)

| Gap | Baseline evidence | Status |
|---|---|---|
| favicon 404 | `GET /favicon.ico` → 404; no `public/`, no `app/icon.*`; layout referenced `/favicon.ico` | FIXED |
| robots/sitemap 404 | `GET /robots.txt`, `/sitemap.xml` → 404; no `app/robots.ts` / `app/sitemap.ts` | FIXED |
| Duplicate route titles | Single global metadata block; all 14 public routes rendered the same title | FIXED |
| Missing canonical/OG/Twitter/social image | No `metadataBase`, `openGraph`, `twitter`, no social asset | FIXED |
| Unbranded 404 | Next default 404, no brand/recovery | FIXED |
| Missing security headers | next.config had no `headers()` | FIXED |
| x-powered-by exposure | `poweredByHeader` not disabled | FIXED |
| Wildcard CORS on HTML | Live HTML responses carried `access-control-allow-origin: *` (Vercel CDN layer; source grep found zero `cors`/`allow-origin` matches) | FIXED at CDN config |

---

## 2. Exact response headers now served (local `next start`, production build)

`GET /` (and all HTML documents + 404s):

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), usb=(), battery=(), autoplay=()
X-Frame-Options: SAMEORIGIN
```

`x-powered-by: Next.js` is no longer emitted (`poweredByHeader: false`).
No `Access-Control-Allow-Origin` is emitted from the app itself; `vercel.json`
overrides the CDN-injected wildcard with the canonical origin (see §5).

### CSP compatibility evidence (why it won't break the runtime)
Built HTML (`.next/server/app/pricing.html` and others) shows the real runtime surface:
- Inline RSC bootstrap + payload scripts (`self.__next_f.push(...)`) → `script-src 'unsafe-inline'`
- All JS chunks, CSS, and next/font woff2 files served from `/_next/static/*` → `'self'`
- React inline `style={...}` attributes throughout → `style-src 'unsafe-inline'`
- No external scripts, images, frames, or connects in the app (`grep fetch/https` = same-origin `/api/*` only)
- Stripe checkout and Resend auth are **server-side** (redirect + API calls), so no client CSP allowance needed; `form-action 'self'` keeps the booking/signin forms working while blocking off-site form exfiltration.
- Dev mode relaxes only `connect-src` (`ws:` for HMR); production CSP is strict.

Real-browser verification (headless Chromium, 8 public routes + signin + portal):
**0 `securitypolicyviolation` events**, all titles/H1s/nav render. The only page
error observed is a **pre-existing** React #418 hydration text mismatch on
`/status` (client `new Date()` in state) — unrelated to this lane, flagged for Lane A/B.

---

## 3. Route receipts (local production server, after `npm run build && npm start`)

### Static assets (were 404, now 200)
```
GET /favicon.ico          → 200 image/x-icon (16/32/48 ICO)
GET /apple-touch-icon.png → 200 image/png (180×180)
GET /og.png               → 200 image/png (1200×630 social card)
```

### robots.txt
```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /auth
Disallow: /book
Disallow: /intake
Disallow: /portal

Sitemap: https://launch.tonysimons.dev/sitemap.xml
```

### sitemap.xml (14 indexable URLs from the actual public route inventory)
```
https://launch.tonysimons.dev/            (weekly, 1.0)
https://launch.tonysimons.dev/pricing     (monthly, 0.8)
https://launch.tonysimons.dev/features    (monthly, 0.8)
https://launch.tonysimons.dev/faq         (monthly, 0.8)
https://launch.tonysimons.dev/status      (monthly, 0.8)
https://launch.tonysimons.dev/docs        (monthly, 0.8)
https://launch.tonysimons.dev/docs/quickstart (monthly, 0.8)
https://launch.tonysimons.dev/docs/skills (monthly, 0.8)
https://launch.tonysimons.dev/docs/vault  (monthly, 0.8)
https://launch.tonysimons.dev/docs/cron   (monthly, 0.8)
https://launch.tonysimons.dev/legal/agreement (monthly, 0.8)
https://launch.tonysimons.dev/legal/privacy   (monthly, 0.8)
https://launch.tonysimons.dev/legal/refund    (monthly, 0.8)
https://launch.tonysimons.dev/legal/terms     (monthly, 0.8)
```
Excluded: `/services` (permanent redirect → `/pricing`, next.config.ts), `/admin`,
`/api/*`, `/auth/*`, `/book*`, `/intake`, `/portal` (auth-gated/noindex).

### Per-route metadata (all unique; title template `%s — Hermes Launch Lab`)
| Route | Title | Canonical |
|---|---|---|
| / | Hermes Launch Lab — Tony Simons Independent Studio (absolute) | `/` |
| /pricing | Pricing & Services | `/pricing` |
| /features | What is Hermes Agent | `/features` |
| /faq | FAQ | `/faq` |
| /status | System Status (via `app/status/layout.tsx` — page is a client component) | `/status` |
| /docs | Documentation | `/docs` |
| /docs/quickstart | Quickstart Guide | `/docs/quickstart` |
| /docs/skills | Skills Reference & Manifests | `/docs/skills` |
| /docs/vault | Vault & Credential Security | `/docs/vault` |
| /docs/cron | Autonomous Cron & Background Loops | `/docs/cron` |
| /legal/terms | Terms of Service | `/legal/terms` |
| /legal/privacy | Privacy Policy | `/legal/privacy` |
| /legal/refund | Refund & Cancellation Policy | `/legal/refund` |
| /legal/agreement | Consulting Agreement | `/legal/agreement` |

Home `<head>` receipts:
```
<title>Hermes Launch Lab — Tony Simons Independent Studio</title>
<meta name="description" content="Hands-on 1-on-1 Hermes Agent consulting, ..." />
<link rel="canonical" href="https://launch.tonysimons.dev" />
<meta property="og:title" content="Hermes Launch Lab — Tony Simons Independent Studio" />
<meta property="og:site_name" content="Hermes Launch Lab" />
<meta property="og:url" content="https://launch.tonysimons.dev" />
<meta property="og:image" content="https://launch.tonysimons.dev/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://launch.tonysimons.dev/og.png" />
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

### 404 (branded)
`GET /nonexistent-xyz` → 404, branded page: "ERROR 404 / Signal lost." with
Return home (/), See pricing (/pricing), Browse docs (/docs) links. Headers same
security set as documents.

### noindex on private routes
`/book`, `/book/cancel`, `/book/success`, `/intake`, `/portal`, `/admin`,
`/auth/signin`, `/auth/verify` → `robots: noindex, nofollow` in metadata.

---

## 4. Files changed (atomic commit, not pushed)

```
app/layout.tsx                 metadataBase, title template, OG/Twitter, icons, robots
app/page.tsx                   home metadata + canonical
app/pricing/page.tsx           metadata + canonical
app/features/page.tsx          metadata + canonical
app/faq/page.tsx               metadata + canonical
app/status/layout.tsx          NEW — metadata for client-rendered status page
app/docs/page.tsx              metadata + canonical
app/docs/quickstart/page.tsx   metadata + canonical
app/docs/skills/page.tsx       metadata + canonical
app/docs/vault/page.tsx        metadata + canonical
app/docs/cron/page.tsx         metadata + canonical
app/legal/terms/page.tsx       metadata + canonical
app/legal/privacy/page.tsx     metadata + canonical
app/legal/refund/page.tsx      metadata + canonical
app/legal/agreement/page.tsx   metadata + canonical
app/book/page.tsx              noindex metadata
app/book/cancel/page.tsx       noindex metadata
app/book/success/page.tsx      noindex metadata
app/intake/page.tsx            noindex metadata
app/portal/page.tsx            noindex metadata
app/admin/page.tsx             noindex metadata
app/auth/signin/page.tsx       noindex metadata
app/auth/verify/page.tsx       noindex metadata
app/robots.ts                  NEW — robots.txt from public routes
app/sitemap.ts                 NEW — sitemap.xml from public routes (14 URLs)
app/not-found.tsx              NEW — branded 404 with recovery links
next.config.ts                 poweredByHeader: false + security headers() (CSP etc.)
vercel.json                    NEW — override CDN wildcard ACAO → canonical origin
public/favicon.ico             NEW — 16/32/48 ICO brand mark
public/apple-touch-icon.png    NEW — 180×180
public/og.png                  NEW — 1200×630 social card
tests/seo-security.test.ts     NEW — 12 contract tests (RED → GREEN)
```

---

## 5. Wildcard CORS — root cause and fix

- **Not in source**: grep of the tree found zero `cors`/`access-control`/`allow-origin`.
- **Live evidence**: every HTML/static response from Vercel carried
  `access-control-allow-origin: *` (plus OPTIONS preflights answer
  `access-control-allow-methods: OPTIONS, GET, HEAD`), while `/api/health`
  (a serverless function) did **not** — i.e., the header is injected by the
  Vercel CDN/static layer, not by Next.js.
- **No dependency requires CORS**: all client fetches are same-origin
  (`/api/availability`, `/api/health`); Stripe checkout and Resend magic links
  are server-side redirects/APIs.
- **Fix**: added `vercel.json` placing `Access-Control-Allow-Origin:
  https://launch.tonysimons.dev` at the CDN edge, which per Vercel docs/knowledge
  base overrides the platform default for matching routes. No wildcard is emitted
  by the app itself (verified on local production server — no ACAO header at all).
  **Post-deploy check for Tony**: after the next Vercel deploy, re-run
  `curl -sI https://launch.tonysimons.dev/ | grep -i access-control` — expect
  `https://launch.tonysimons.dev`, never `*`.

---

## 6. Gates (all run fresh after implementation)

| Gate | Command | Result |
|---|---|---|
| Contract tests (new) | `npx vitest run tests/seo-security.test.ts` | PASS — 12/12 (RED observed first: 11 fail / 1 pass) |
| Unit suite | `npm test -- --run` | PASS — 15/15 (2 files) |
| Typecheck | `npm run typecheck` | PASS |
| Lint | `npm run lint` | PASS (`--max-warnings=0`) |
| Production build | `npm run build` | PASS — `/robots.txt` and `/sitemap.xml` now in route inventory |
| Local HTTP smoke | `npm run build && npm start` + curl | PASS — headers/assets/routes above |
| Browser CSP smoke | headless Chromium (Playwright + system Chrome) | PASS — 0 CSP violations on 10 routes |

Commit: `feat(seo-security): per-route metadata, canonical URLs, robots/sitemap, icons, branded 404, security headers, CDN CORS override` (local only, not pushed — per baseline authority boundary, master push is Tony's gate).

## 7. Notes / handoff
- `/status` metadata lives in `app/status/layout.tsx` (server layout) because the
  page itself is `'use client'` and Next forbids metadata exports from client
  components. Layout adds no visual wrapper.
- Pre-existing `/status` hydration mismatch (React #418, client-time in state)
  is out of this lane's scope — surfaced for Lane A.
- `vercel.json` is a new repo file; Vercel will pick it up on next deploy.
  Existing `.vercel/project.json` (local, gitignored) is untouched.
- Social image and icons generated from brand tokens (`#020203` bg, `#FF2A35`
  accent) via SVG → rsvg-convert/ImageMagick; sources are reproducible.
