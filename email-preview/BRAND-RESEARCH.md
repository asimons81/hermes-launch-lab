# Launch Lab Confirmation Email — Brand Research Packet (CORRECTED)

Compiled 2026-08-11 from the **LIVE deployed CSS** of launch.tonysimons.dev and tonysimons.dev (local repos lag the deployed build). Both sites share ONE brand system: **Obsidian & Crimson**. There is no copper variant anymore — tonysimons.dev live is crimson too.

## 1. Brand DNA (both sites, confirmed live)

- **Dark, editorial, premium.** Near-black obsidian backgrounds, warm-white ink, hairline borders, crimson accent, terminal-window motif. Unapologetically dark.
- Launch Lab live CSS: page bg `#020203`, panels `#0A0A0C`/`#121215`, raised inputs/footer/terminal `#0E1014`, titlebars `#14171D`, crimson `#FF2A35`.
- tonysimons.dev live CSS: same system — `#020203` bg, `#0a0a0c`/`#121215` surfaces, crimson `#ff2a35`, chrome-accent `#c0c0c8`.
- Voice: precise, confident, independent studio. Mono uppercase micro-labels, editorial serif headlines, hairlines, matte panes.

## 2. Color tokens (LIVE, authoritative)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#020203` | page/email background — near-black obsidian |
| `--surface` | `#0A0A0C` | raised dark panel |
| `--surface-2` | `#121215` | deeper panel / chips |
| raised pane / input / footer | `#0E1014` | terminal, inputs, footer, detail panes |
| titlebar / status bar | `#14171D` | terminal titlebar, status bars |
| `--ink` | `#F8F9FA` | primary text (warm white) |
| `--bone` | `#E2E8F0` | secondary text |
| `--muted` | `#8E9BAE` | labels, meta, captions |
| `--muted-2` | `#8798AD` (launch) / `#48566A` (tony) | fainter meta |
| `--red-accent` / `--crimson` | `#FF2A35` | THE accent — buttons, emphasis |
| `--gold-bright` | `#FF4D57` | crimson hover/bright variant |
| terminal red dot | `#E53E3E` | traffic-light dot red |
| `--green` | `#34D399` | success / paid states |
| `--line` | `rgba(255,255,255,0.05)` | hairline borders |
| `--line-strong` | `rgba(255,42,53,0.25)` | crimson-tinted hairline |
| `--red-soft` | `rgba(255,42,53,0.08)` | subtle crimson tint fill |
| chrome accent | `#C0C0C8` | secondary chrome text (tonysimons.dev) |

## 3. Type system (confirmed live on both)

- **Display / headlines:** Instrument Serif 400 (normal + italic). NOT email-safe → **Georgia, 'Times New Roman', serif** in email; note Instrument Serif in comments.
- **Body / UI:** Plus Jakarta Sans → email-safe `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`.
- **Mono labels:** JetBrains Mono → email-safe `SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`. Signature cue: mono, uppercase, letterspaced (0.12–0.18em), muted, 11–12px — used for SESSION / DATE / TIME / PAID / REFERENCE labels, wordmark, status.

## 4. Component patterns (live)

- **Wordmark (`components/BrandMark.tsx`):** `TONY SIMONS` + `// LAUNCH LAB` in **crimson** — mono, uppercase, ~12px, 0.14em tracking.
- **Terminal motif:** the site is full of terminal windows — titlebar with three traffic dots (red `#E53E3E`, amber `#FF2A35`/gold, green `#34D399`), mono text, `#0E1014` body, `#14171D` titlebar, crimson-tinted border. Use this in the email header: titlebar dots + wordmark = instant brand recognition.
- **Primary button:** crimson `#FF2A35` bg, white text, 13px 600, radius 6px (site hover: crimson glow). Email: same, bulletproof table+<a>, `mso-padding-alt`.
- **Ghost/secondary:** transparent, hairline border, warm-white text; crimson hover (email: static outline style).
- **Hairlines:** 1px `rgba(255,255,255,0.05)` separators; crimson `rgba(255,42,53,0.25)` for emphasis lines.
- **Paid/success:** green `#34D399` with `rgba(52,211,153,0.15)` tint chips.

## 5. Email design decisions (CORRECTED — dark-first, brand-native)

- **The email is DARK.** Body `#020203`, text `#F8F9FA`/`#E2E8F0`, crimson accents — exactly like the site. This is the brand; clients now render dark emails fine (Gmail app/web, Apple Mail, Outlook.com, new Outlook). It also avoids Gmail's light-email auto-inversion entirely.
- 600px max, table-based, inline CSS only, zero JS, zero external resources.
- `<meta name="color-scheme" content="dark">` + `supported-color-schemes` on root + `@media (prefers-color-scheme: light)` overrides ONLY where a light-preference client needs legibility — but the default is dark-on-dark everywhere.
- **Every single table cell gets explicit background + text color** (Outlook desktop needs cell-level colors; no relying on body bg).
- Buttons bulletproof; no hover-dependent critical info; no external images (text-only wordmark).
- Contrast: `#F8F9FA`/`#E2E8F0` on `#020203`/`#0E1014` passes AA comfortably; `#8E9BAE` on `#020203` ~4.6:1 (AA for normal text); crimson `#FF2A35` on `#020203` ~3.6:1 — use for large text/accents/buttons only, small crimson text → `#FF5C64`-class bright or keep muted.
- Plain-text part + `.ics` + receipt link + portal link. Read the full spec for content/copy: `~/projects/hermes-launch-lab/PAYMENT-CONFIRMATION-EMAIL-SPEC.md` (spec §4 was drafted light-first for safety; the CORRECTED direction is dark-first per live brand — content/copy sections 3, 5–9 stand unchanged).

## 6. Sample data for the preview (Launch session)

- Customer: **Jordan Reyes** (sample customer — approval preview; not Tony's real data)
- Service: **Hermes Launch Session** — $299.00 · 90 minutes
- Date: **Tuesday, August 18, 2026 · 2:00–3:30 PM Central Time** (America/Chicago)
- Reference: **HLL-8F3K2A**
- Receipt link: `https://pay.stripe.com/receipts/payment/EXAMPLE` (placeholder)
- Portal link: `https://launch.tonysimons.dev/portal`
- Intake line: "We've got your setup details on file — no need to resend them."
- Subject: `Your Hermes Launch Session is confirmed — Tue, Aug 18 at 2:00 PM`
- Preheader: `Paid $299.00. Here's everything you need for our session.`
- `.ics`: Hermes Launch Session with Tony Simons · DTSTART 2026-08-18T19:00:00Z · DTEND 2026-08-18T20:30:00Z · TZID America/Chicago · UID booking@launch.tonysimons.dev

## 7. Deliverables (this build)

All in `~/projects/hermes-launch-lab/email-preview/`:
- `confirmation-launch.html` — self-contained dark obsidian preview (inline CSS, sample data)
- `confirmation-launch.txt` — plain-text version
- `hermes-launch-session-2026-08-18.ics` — calendar invite sample
- `BUILD-NOTES.md` — design decisions, email-client notes, what changes per service

Do NOT modify anything outside `email-preview/`. No webhook, no lib/email.ts, no deploy — preview-only until approved.
