# Build Notes — Hermes Launch Lab Confirmation Email (Launch preview)

Sample data (Launch session): Jordan Reyes · Hermes Launch Session $299.00 / 90 min ·
Tue, Aug 18, 2026 · 2:00–3:30 PM Central Time · ref HLL-8F3K2A.
Preview only — nothing in this folder is wired to the app. Real `receiptUrl` comes from Stripe at runtime.

## v2 — dark-first re-theme (2026-08-11)

- Re-themed `confirmation-launch.html` from light-first to **dark-native obsidian & crimson**,
  matching the corrected brand source of truth (`BRAND-RESEARCH.md`) and the live
  launch.tonysimons.dev build.
- Why: the live brand is dark — page bg `#020203`, terminal-window motif, crimson `#FF2A35`
  accents. The email should be the brand itself, not a light approximation. Dark-native emails
  also avoid Gmail's auto-inversion of light emails entirely (`supported-color-schemes: dark`).
- What changed: header is now a terminal-window titlebar (`#14171D`, three traffic dots,
  text-only wordmark), card/body `#020203`, detail pane `#0E1014`, footer `#0A0A0C`; the
  light-theme defaults and the `prefers-color-scheme: dark` override block were removed — dark
  is the only theme. Every visible cell has explicit bg + text color for Outlook. Copy, links,
  structure, and the `.txt`/`.ics` files are unchanged.

## Design decisions

- **Light-first with dark brand band.** White body + near-black `#111214` text (AA pass) with a
  `#020203` header band, crimson `#FF2A35` accent rule, and a dark matte detail pane
  (`#121215`, hairline `rgba(255,255,255,0.08)`). Fully dark emails degrade badly in Gmail's
  forced-light and Outlook's Word engine; the dark identity lives in the band + pane instead.
- **Text-only wordmark** on the dark band: `TONY SIMONS` in warm-white mono with `// LAUNCH LAB`
  in crimson, preceded by a 10px crimson square (styled `<td>`, no image). Zero external assets
  = deliverability-safe. Georgia stands in for Instrument Serif (not email-safe).
- **Type system:** Georgia (display), system sans (body), SFMono/Menlo/Consolas stack for
  uppercase letterspaced micro-labels, reference, and wordmark. Section labels 10.5–11px,
  letter-spacing 0.14–0.18em — the signature editorial cue.
- **Contrast discipline:** body near-black on white; `#FF2A35` used only at large sizes /
  buttons / rules / wordmark segment (3.2:1 on white, so never for small text). Small crimson
  accents (numbered steps, footer wordmark) use darker `#B91C27`; small green text on light
  uses `#047857`-adjacent muted tones, with `#34D399` reserved for dark surfaces (AA on
  `#020203`/`#121215`). Muted labels on white use `#5B6572` (darkened `#8E9BAE` for AA).
- **Dark mode:** `color-scheme: light dark` meta + `@media (prefers-color-scheme: dark)`
  overrides flip the body to `#0A0A0C`, ink to `#F8F9FA`, muted to `#8E9BAE`, hairlines to
  `rgba(255,255,255,0.08)`. The embedded `<style>` block exists only for dark-mode + fluid
  overrides; every visible element carries full inline styles (light theme is the default).
- **Bulletproof buttons:** table+`<a>` pattern, `bgcolor` attrs for Outlook, `border-radius`
  (ignored gracefully by Word), `mso-padding-alt:13px 26px` on the anchor so Outlook honors
  padding. Primary = crimson/white (View receipt), ghost = hairline near-black border (Manage
  booking) that flips to warm-white in dark mode.
- **Fluid hybrid:** 600px card with `max-width:100%` + a `max-width:620px` media query that
  stretches the container, trims side padding 44→20px, and stacks the two buttons full-width.
  Verified mentally at 320px: wordmark line and TIME value wrap cleanly; no fixed-width row
  exceeds the viewport.
- **Paid indicator:** green `✓ PAID — $299.00` on the dark band + `✓ PAID` in the pane header +
  green `$299.00` value row + green `#34D399` throughout on dark surfaces.

## Email-client compatibility notes

| Client | Behavior |
|---|---|
| Gmail (web) | Renders inline styles; ignores `<style>`-based dark query and applies its own auto-darkening — light-first design keeps it readable either way. No remote assets to break. |
| Gmail (app) | Honors `prefers-color-scheme` + `supported-color-schemes`; fluid media query handles 320px. |
| Apple Mail | Full `@media` support incl. dark mode; `mso-hide:all` preheader is invisible; Georgia + system stacks render natively. |
| Outlook desktop | Word engine: tables + `bgcolor` + `mso-padding-alt` carry the design; border-radius degrades to square corners, `@media` ignored (fixed 600px is fine). |
| Outlook web / mobile | Table layout holds; fluid query applies on mobile where supported. |
| All | No `<script>`, no `<link>` stylesheets, no `<img>`/external images, no hover-dependent info, no form elements. |

Known trade-offs: `rgba(...)` hairlines on the pane render solid-ish in Outlook (acceptable);
Gmail web auto-darkening may invert the white areas (expected, tested pattern).

## What changes per service

| | Strategy ($99) | Launch ($299, this preview) | Custom ($600) |
|---|---|---|---|
| Service name | Hermes Strategy Session | Hermes Launch Session | Custom Hermes Build |
| Subject | `Your Hermes Strategy Session is confirmed — {Day, Mon D} at {time}` | `... Launch Session ...` | `Your Custom Hermes Build is confirmed — {Day, Mon D} at {time}` |
| Duration row | 45 minutes (confirm at build) | 90 minutes | TBD — set at build from booking |
| Amount / paid | $99.00 | $299.00 | $600.00 |
| "What happens next" copy | "You'll leave with a written action plan. Bring your current setup details and goals." (spec §3.2 — confirm exact bullets at build) | Calendar invite / nothing to prepare / 7-day follow-up (this preview) | "We'll scope the build in our first conversation. Watch your inbox — an intake email is on the way." |
| .ics filename | `hermes-strategy-session-{yyyy-mm-dd}.ics` | `hermes-launch-session-{yyyy-mm-dd}.ics` | `hermes-custom-build-{yyyy-mm-dd}.ics` |
| .ics SUMMARY | Hermes Strategy Session with Tony Simons | Hermes Launch Session with Tony Simons | Custom Hermes Build with Tony Simons |

Invariants across services: ref prefix `HLL-` (from `bookingRef(id)`), crimson/obsidian design
tokens, `hello@tonyreviewsthings.com` from + Reply-To tony@, `View receipt` button **omitted
when `receiptUrl` is null** (keep `✓ PAID`), timezone always rendered as `{City} Time` in the
customer's TZ, intake-aware line only when `Booking.intake` exists.

## .ics notes

- `DTSTART;TZID=America/Chicago:20260818T140000` / `DTEND ...T153000` — local-time form with
  explicit TZID (equals 19:00–20:30Z); includes a full `VTIMEZONE` block for Outlook desktop
  TZ resolution. CRLF line endings, RFC 5545. Test import in Google Calendar, Apple Calendar,
  and Outlook before launch (classic TZ-failure spot).
- `DTSTAMP` is the generation timestamp; production should stamp at send time.
- No `ATTENDEE` — METHOD:PUBLISH + ORGANIZER only, so clients treat it as an event, not an
  invite-response loop.
