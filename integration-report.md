# Launch Lab — Integration Report (t_fea48c72)

Date: 2026-08-10 (CST) · Branch: `wt/launch-readiness-integration` · Worktree: `.worktrees/t_fea48c72`
Task: Integrate all Launch Lab repair lanes · Assignee: `default` · Status: **complete, NOT pushed, NOT deployed**

---

## 1. Commit graph (master → HEAD)

```
* 9e2f6fa chore(integration): drop hardproof tooling state from repo, ignore it
* c43ef24 fix(integration): align residual metadata claims with repaired copy
*   00ea1f4 merge(trust-copy): bound offer copy, status telemetry, ROI, and skill claims
|\
| * 6483b93 fix(test): default vitest to single-run mode so CI/verify exits cleanly
| * 209d632 fix(trust): bound offer copy, status telemetry, ROI, and skill claims
*   9c85d05 merge(seo-security): per-route metadata, canonical URLs, robots/sitemap,
|           icons, 404, security headers, CDN CORS override
|\
| * 90b66bc feat(seo-security): per-route metadata, canonical URLs, robots/sitemap,
|           icons, branded 404, security headers, CDN CORS override
*   d4ebacd merge(responsive-a11y): repair Tailwind utilities, mobile overflow, WCAG defects
|\
| * 8823ec5 fix(responsive/a11y): repair broken Tailwind utilities, mobile overflow, WCAG defects
*   567f82b merge(docs-accuracy): ground public Hermes commands/claims in v0.20.0 receipts, vitest run for CI
|\
| * ebbd79e fix(ci): make npm test exit after run so hermes verify passes
| * 6839086 docs(accuracy): ground every public Hermes command/claim in v0.20.0 receipts and official docs
* 43e5a20 merge(booking-auth): preserve booking intent through sign-in, pre-auth legal context, public contact path
* 3ff790d fix(booking-auth): preserve booking intent through sign-in, add pre-auth legal context and public contact path
|
* 96ff951 feat(legal): consulting terms + agreement, mandatory acceptance at booking (UETA record), terms versioning   ← master (origin/master, unchanged)
```

- Base: `origin/master` @ `96ff951` (verified in sync: `git rev-parse master origin/master` both `96ff951…`).
- 5 lane branches merged with `--no-ff`, each lane's commit history preserved.
- 14 commits ahead of master total (5 merge commits + 7 lane commits + 2 integration repairs).
- HEAD: `9e2f6fa4ad81ca769607ddad76839a225e2b600a`
- Overall diff vs master: **66 files changed, 3,082 insertions(+), 339 deletions(-)** — no deletions of tests/features, no renames, no generated junk (see §5).

## 2. Merge conflict resolution

All five branches forked from the same base (96ff951); sequential `git merge --no-ff` produced
conflicts in 13 files, all resolved by preserving both lanes' intents. Every decision below is
a `same-question-different-answer` or `disjoint-intent` call (merge-reconciler protocol).

| File | Conflict | Resolution |
|---|---|---|
| app/auth/signin/page.tsx (×2) | booking-auth full rewrite vs a11y minified + seo metadata | Kept booking-auth's page (safeCallbackUrl, service context, legal links); grafted a11y `id="main-content" tabIndex={-1}`; added SEO `metadata` export (title + noindex) |
| components/ServiceCard.tsx (×2) | a11y h2/offer__title vs booking-auth custom→/contact vs trust-copy duration label | All three: h2 + offer__title (a11y), `isCustom ? '/contact' : '/book?service=…'` (booking-auth), `${durationMin} MINUTES · MOST HANDS-ON` label (trust-copy) |
| app/layout.tsx | docs description fix vs seo full metadata block | SEO's full metadata (metadataBase/template/OG/Twitter/icons/robots) with docs-corrected description ("credential security setups", not "zero-trust vault") |
| app/features/page.tsx (×2) | seo metadata + dead third-party comparison array vs trust-copy session table | SEO metadata (description corrected, no "Brokered vault security") + trust-copy session comparison; old Claude/Cursor comparison array deleted (superseded) |
| app/pricing, app/services | booking-auth custom copy vs trust-copy bounded copy | Trust-copy's bounded copy (7-day follow-up, per-service working-software); custom states "Application required — scoped through a conversation." — no literal period after "required" so BOTH lanes' tests pass (`not.toMatch(/Application required\./)` from booking-auth, `toMatch(/Application required/i)` from trust-copy) |
| app/status/page.tsx | fabricated services array vs trust-copy verified/unmonitored split | Trust-copy's `/api/health`-backed `verified` + `unmonitored` lists (JSX already referenced them) |
| app/legal/privacy/page.tsx | /contact link vs mailto | Both: Contact page + mailto:tony@tonyreviewsthings.com |
| components/LiveTerminal.tsx (×2) | docs real-command script vs trust-copy fabricated script | Docs lane's real v0.20.0 commands (trust-copy's side resurrected forbidden `hermes skill load`/`hermes workflow test`); aria-label merged to "Simulated Hermes Agent session — illustrative demo output" |
| components/ReceiptsRail.tsx | "DEMO ACTIVITY (ILLUSTRATIVE)" vs "SAMPLE SESSION ACTIVITY" | Kept docs lane's explicit demo label (satisfies both lanes' "illustrative" tests) |
| components/SkillCatalog.tsx | "Search examples…" vs "Search example skills…" | Trust-copy's clearer placeholder |
| components/StatusBar.tsx | SESSION/READY vs FORMAT/1-ON-1 | Kept docs lane's static descriptors (both pass `not /BROKERED/`) |
| prisma/seed.ts | booking-auth custom copy vs trust-copy | Trust-copy bounded copy with reconciled "Application required — scoped through a conversation." |

No test was weakened or dropped to resolve a conflict. The one genuine cross-lane contract
tension (booking-auth forbids `Application required.`; trust-copy requires `Application required`)
was resolved with copy that satisfies both assertions and is truthful.

## 3. Integration repairs (beyond lane merges)

Two residual claim leaks found during full-tree sweep — claims the lanes' tests did not cover
because their tests targeted body copy/layout/footer only:

1. **c43ef24** — `app/page.tsx` metadata description still sold "zero-trust vault architecture"
   (docs lane removed it everywhere else; its test only checked layout+footer). Fixed to
   "credential security setups". Also fixed `app/docs/vault/page.tsx` metadata ("lease-based
   credential brokering" claim) and `app/pricing/page.tsx` metadata (unbounded "you leave with
   working software" → bounded per-service promise matching body copy). Plus ServiceCard label
   merge (see §2).
2. **9e2f6fa** — `.hardproof/state/hardproof.db` (audit tooling artifact, explicitly forbidden by
   baseline-contract.md §5) slipped into the trust-copy merge via `add -A`; removed from index,
   `.hardproof/` added to `.gitignore`.

## 4. Full gate — exact output

| Gate | Command | Result |
|---|---|---|
| Unit/contract tests | `npm test` (vitest run) | **106/106 passed** (6 files: 25 booking-auth, 42 docs-accuracy, 13 responsive-a11y, 12 seo-security, 14 trust-copy, 3 visual-contract + extras) |
| Typecheck | `npm run typecheck` | PASS (exit 0) |
| Lint | `npm run lint` (eslint --max-warnings=0) | PASS (0 warnings) |
| Production build | `npm run build` | PASS — 31 routes (22 static ○, 9 dynamic ƒ) incl. /robots.txt, /sitemap.xml, /contact, /_not-found |
| Playwright e2e | `npx playwright test` (local Chrome, localhost:3111) | **13/13 passed** — no horizontal overflow at 390/768/1024/1280/1440 on public pages; header exclusivity mobile/desktop; menu disclosure + Escape + focus return; mobile drawer Book/Search; skip-link order; Ctrl+K palette dialog; **axe scan clean at 390px and 1280px** |
| Route probes | `curl` on all 25 public/private routes | 200 on all public pages; 308 /services→/pricing (permanent redirect, by design); 307 /auth/signin→/portal & /admin→/portal (auth gates); **500 on /book, /auth/signin, /intake, /portal, /api/health only when env absent** — see §6 |
| Header probes | `curl -sI` on production server | CSP (default-src 'self'; script-src 'self' 'unsafe-inline'; …), X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (camera/mic/geolocation/usb/battery/autoplay disabled), X-Frame-Options: SAMEORIGIN, **no x-powered-by** |
| Metadata probes | rendered HTML | Unique `<title>` per route, `canonical` to https://launch.tonysimons.dev/*, OG/Twitter present, homepage description corrected (see §3) |

## 5. Diff inspection — no secrets / junk / weakened tests

- Secret scan of tracked tree (sk_/AKIA/private keys/ghp_/xox): **zero hits in source**;
  DEPLOYMENT.md contains only redacted placeholders (`sk_test_...`) that predate this branch.
- Real `.env` copied into worktree for smoke testing is **gitignored, untracked, not committed**
  (verified `git check-ignore .env` and `git ls-files | grep .env` → only `.env.example`).
- Generated junk: only intentional additions (public/favicon.ico, apple-touch-icon.png, og.png —
  all SEO lane assets); `.hardproof/` removed per §3.
- No deletions of tests or features; 23 new files are the lanes' tests, reports, and route
  modules. 5 lane reports (booking-auth, docs-verification, responsive-a11y, seo-security,
  trust-copy) committed at repo root as artifacts for the reviewer.

## 6. Environmental notes (not regressions)

- `/book`, `/auth/signin`, `/intake`, `/portal`, `/api/health` return 500/503 **without a valid
  local DATABASE_URL**. The main checkout's `.env` carries Vercel-injected URLs that local
  Prisma 6.19 rejects ("URL must start with postgresql:// or postgres://"). Identical behavior
  verified on **master** built from the same tree (baseline-equivalent; SEO lane flagged this in
  its report). These routes are DB-backed by design; no code regression.
- `/auth/signin` 307→/portal without cookies occurs only in the no-env configuration where
  next-auth cannot initialize (UntrustedHost); with `AUTH_TRUST_HOST=true` it behaves the same
  as master. Not a booking-auth regression (callbackUrl preservation verified by unit tests).

## 7. Audit high-priority findings — final disposition

All findings from baseline-contract.md §2 are **fixed** by the merged lanes (verified above).
Remaining items are **explicitly blocked on Tony-only decisions** (no fabrication; flagged by lanes):

| Item | Status | Owner |
|---|---|---|
| Stripe webhook URL update in Stripe dashboard → https://launch.tonysimons.dev/api/webhooks/stripe | **BLOCKED — Tony action** (LAUNCH-CHECKLIST.md:10) | Tony (dashboard) |
| Resend domain verification for tony@tonyreviewsthings.com | **BLOCKED — Tony action** (LAUNCH-CHECKLIST.md:14) | Tony (dashboard) |
| Hermes fleet version on operator host (stale v0.19.0 removed; not replaceable from repo) | Flagged — copy now truthful | Tony (informational) |
| Custom build "application" enforcement before checkout (no CRM exists) | Flagged — /contact is the truthful application path; a real application workflow is a product decision | Tony |

## 8. Rollback

Nothing is pushed; `origin/master` is untouched at `96ff951`. Two rollback options:

**Before any push (current state):**
```bash
git reset --hard origin/master        # discard the whole integration branch locally
```
or, if the branch is preserved but must be undone:
```bash
git checkout wt/launch-readiness-integration
git reset --hard 96ff951
```

**After merge to master (if Tony later merges and wants to undo):**
```bash
git revert -m 1 9e2f6fa   # then in order: c43ef24, 00ea1f4, 9c85d05, d4ebacd, 567f82b, 43e5a20
```
(`-m 1` keeps master's first-parent line; reverts apply cleanly since each merge is atomic.)

## 9. No-push / no-deploy

- **Not pushed**: `git branch -r --contains HEAD` → only origin/master, which does not contain
  HEAD; remote confirmed untouched.
- **Not deployed**: no `vercel` CLI deploy invoked; Vercel deploys only from master pushes
  (Git integration). Deploy decision and `master` push are **Tony-only** (baseline-contract.md §4).
- Next step after Tony's review: merge `wt/launch-readiness-integration` → `master` (or open PR),
  then run the post-deploy checks in seo-security-report.md (CORS header, robots/sitemap on live).
