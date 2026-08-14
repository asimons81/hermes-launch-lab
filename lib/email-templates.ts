/**
 * Hermes Launch Lab — transactional email templates.
 *
 * The confirmation HTML is the APPROVED artifact (email-preview/confirmation-launch.html,
 * dark-native obsidian & crimson, matches live launch.tonysimons.dev). This module
 * parameterizes it: every dynamic value is escaped, every static pixel is byte-identical
 * to the approved preview.
 *
 * Design system (live brand):
 *   obsidian #020203 / titlebar #14171D / pane #0E1014 / footer #0A0A0C /
 *   ink #F8F9FA / bone #E2E8F0 / muted #8E9BAE / crimson #FF2A35 / success #34D399
 */

export type ConfirmationData = {
  firstName: string
  serviceName: string
  serviceSlug: string
  durationMin: number
  amountUsd: string // formatted, e.g. "$299.00"
  reference: string // e.g. "HLL-8F3K2A"
  subjectLine: string
  heroLine: string // "Tuesday, August 18 at 2:00 PM"
  dateLine: string // "Tue, Aug 18, 2026"
  timeLine: string // "2:00–3:30 PM Central Time"
  timeZoneLabel: string // "Central Time"
  intakeKnown: boolean
  receiptUrl: string | null
  portalUrl: string
  baseUrl: string
}

export function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Per-service "What happens next" steps — bold lead-in + body. */
const SERVICE_STEPS: Record<string, { lead: string; body: string }[]> = {
  strategy: [
    { lead: 'Action plan.', body: 'You&rsquo;ll leave with a written plan you can execute right away.' },
    { lead: 'Bring your setup.', body: 'Current tools, pain points, and goals are all I need.' },
    { lead: '60 minutes.', body: 'We&rsquo;ll move fast and keep it practical.' },
  ],
  launch: [
    { lead: 'Complete intake.', body: 'Share your goal and environment context, but never credentials or confidential datasets.' },
    { lead: 'Private Google Meet.', body: 'Meeting details are delivered privately. If hands-on access is useful, you create a one-time attended support code during the call.' },
    { lead: '7-day defect support.', body: 'One email thread covers defects in the agreed configuration for seven calendar days; new scope and provider changes are excluded.' },
  ],
  custom: [
    { lead: 'Scope first.', body: 'We&rsquo;ll define the build in our opening conversation.' },
    { lead: 'Intake email.', body: 'Watch your inbox &mdash; a few scoping questions are on the way.' },
    { lead: '7-day follow-up.', body: 'After the build, 7 days of support on anything we made.' },
  ],
}

const DEFAULT_STEPS = SERVICE_STEPS.launch

function stepsFor(slug: string): { lead: string; body: string }[] {
  return SERVICE_STEPS[slug] ?? DEFAULT_STEPS
}

function stepNumber(n: number): string {
  return String(n).padStart(2, '0')
}

export function renderConfirmationHtml(d: ConfirmationData): string {
  const steps = stepsFor(d.serviceSlug)
  const first = htmlEscape(d.firstName)
  const service = htmlEscape(d.serviceName)
  const hero = htmlEscape(d.heroLine)
  const tzLabel = htmlEscape(d.timeZoneLabel)
  const dateLine = htmlEscape(d.dateLine)
  const timeLine = htmlEscape(d.timeLine)
  const ref = htmlEscape(d.reference)
  const receiptHref = d.receiptUrl ? htmlEscape(d.receiptUrl) : null
  const intakeNote = d.intakeKnown
    ? `<p style="margin:10px 0 0 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; color:#8E9BAE;">We&rsquo;ve got your setup details on file &mdash; no need to resend them.</p>`
    : ''

  const stepsHtml = steps
    .map(
      (s, i) => `<tr style="margin:0; padding:0;">
                  <td width="44" valign="top" bgcolor="#020203" style="width:44px; background-color:#020203; padding:16px 0 14px 0;">
                    <span style="font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:16px; font-weight:700; letter-spacing:0.08em; color:#FF2A35;">${stepNumber(i + 1)}</span>
                  </td>
                  <td valign="top" bgcolor="#020203" style="background-color:#020203; padding:16px 0 14px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:#E2E8F0;"><strong style="font-weight:700; color:#F8F9FA;">${s.lead}</strong> ${s.body}</td>
                </tr>`
    )
    .join('\n')

  const receiptBtn = receiptHref
    ? `<td class="btn-col" align="center" valign="top" bgcolor="#020203" style="background-color:#020203; width:50%; padding:0 6px 0 0;">
                    <table role="presentation" class="btn-table" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%; max-width:248px;">
                      <tr style="margin:0; padding:0;">
                        <td align="center" bgcolor="#FF2A35" style="border-radius:6px; background-color:#FF2A35;">
                          <a href="${receiptHref}" target="_blank" style="display:inline-block; padding:13px 26px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:700; line-height:120%; color:#FFFFFF; text-decoration:none; border-radius:6px; mso-padding-alt:13px 26px;">View receipt</a>
                        </td>
                      </tr>
                    </table>
                  </td>`
    : `<td class="btn-col" align="center" valign="top" bgcolor="#020203" style="background-color:#020203; width:50%; padding:0 6px 0 0;"></td>`

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${htmlEscape(d.subjectLine)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* ---- fluid hybrid: 320px mobile ---- */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .pad-sides       { padding-left: 20px !important; padding-right: 20px !important; }
      .btn-col         { display: block !important; width: 100% !important; padding: 6px 0 !important; }
      .btn-table       { max-width: 100% !important; }
    }
  </style>
</head>
<body bgcolor="#020203" style="margin:0; padding:0; word-spacing:normal; background-color:#020203; color:#F8F9FA; color-scheme:dark; supported-color-schemes:dark; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- ============ HIDDEN PREHEADER ============ -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all; color:#F8F9FA;">Paid ${d.amountUsd}. Here&rsquo;s everything you need for our session.</div>

  <!-- ============ OUTER WRAPPER ============ -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#020203" style="background-color:#020203;">
    <tr style="margin:0; padding:0;">
      <td align="center" bgcolor="#020203" style="background-color:#020203; color:#F8F9FA; padding:0;">

        <!-- ============ 600px CARD ============ -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#020203" style="width:600px; max-width:100%; border-radius:12px; background-color:#020203;">

          <!-- ============ TERMINAL-WINDOW TITLEBAR #14171D ============ -->
          <tr style="margin:0; padding:0;">
            <td bgcolor="#14171D" style="background-color:#14171D; border:1px solid rgba(255,255,255,0.08); border-radius:12px 12px 0 0; padding:14px 20px 16px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
                <!-- row 1: traffic dots + wordmark -->
                <tr style="margin:0; padding:0;">
                  <td width="8" bgcolor="#E53E3E" style="width:8px; height:8px; background-color:#E53E3E; border-radius:50%; font-size:0; line-height:8px; mso-line-height-rule:exactly;">&nbsp;</td>
                  <td width="6" bgcolor="#14171D" style="width:6px; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="8" bgcolor="#FF2A35" style="width:8px; height:8px; background-color:#FF2A35; border-radius:50%; font-size:0; line-height:8px; mso-line-height-rule:exactly;">&nbsp;</td>
                  <td width="6" bgcolor="#14171D" style="width:6px; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="8" bgcolor="#34D399" style="width:8px; height:8px; background-color:#34D399; border-radius:50%; font-size:0; line-height:8px; mso-line-height-rule:exactly;">&nbsp;</td>
                  <td width="14" bgcolor="#14171D" style="width:14px; font-size:0; line-height:0;">&nbsp;</td>
                  <td bgcolor="#14171D" style="white-space:nowrap; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:12px; font-weight:700; letter-spacing:0.14em; color:#F8F9FA; text-transform:uppercase;">TONY SIMONS</td>
                  <td width="8" bgcolor="#14171D" style="width:8px; font-size:0; line-height:0;">&nbsp;</td>
                  <td bgcolor="#14171D" style="white-space:nowrap; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:12px; font-weight:700; letter-spacing:0.14em; color:#FF2A35; text-transform:uppercase;">// LAUNCH LAB</td>
                </tr>
              </table>
              <!-- row 2: paid status (status-bar style, right-aligned) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
                <tr style="margin:0; padding:0;">
                  <td bgcolor="#14171D" align="right" style="padding-top:12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" style="border-collapse:collapse; margin:0; padding:0;">
                      <tr style="margin:0; padding:0;">
                        <td bgcolor="#14171D" style="background-color:rgba(52,211,153,0.15); border-radius:4px; padding:5px 10px; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:10.5px; font-weight:700; letter-spacing:0.12em; color:#34D399; text-transform:uppercase;">&#10003; PAID &mdash; ${d.amountUsd}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ HERO ============ -->
          <tr style="margin:0; padding:0;">
            <td class="pad-sides" bgcolor="#020203" style="background-color:#020203; color:#F8F9FA; padding:40px 44px 0 44px;">
              <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:30px; line-height:38px; font-weight:700; letter-spacing:-0.02em; color:#F8F9FA;">You&rsquo;re <em style="font-style:italic;">booked</em>, ${first}.</h1>
              <p style="margin:14px 0 0 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:#E2E8F0;">Your <strong style="font-weight:700; color:#F8F9FA;">${service}</strong> is confirmed for <strong style="font-weight:700; color:#F8F9FA;">${hero}</strong> (${tzLabel}).</p>
              ${intakeNote}
            </td>
          </tr>

          <!-- ============ DETAIL PANE #0E1014 ============ -->
          <tr style="margin:0; padding:0;">
            <td class="pad-sides" bgcolor="#020203" style="background-color:#020203; padding:28px 44px 0 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0E1014; border:1px solid rgba(255,255,255,0.08); border-radius:10px;">
                <!-- pane header -->
                <tr style="margin:0; padding:0;">
                  <td bgcolor="#0E1014" style="background-color:#0E1014; padding:18px 24px 14px 24px; border-bottom:1px solid rgba(255,255,255,0.05);">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
                      <tr style="margin:0; padding:0;">
                        <td bgcolor="#0E1014" style="background-color:#0E1014; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase;">Booking details</td>
                        <td align="right" bgcolor="#0E1014" style="background-color:#0E1014; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#34D399; text-transform:uppercase;">&#10003; Paid</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- SESSION -->
                <tr style="margin:0; padding:0;">
                  <td width="38%" valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 24px; border-bottom:1px solid rgba(255,255,255,0.05); font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase; white-space:nowrap;">Session</td>
                  <td valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; line-height:20px; color:#F8F9FA;">${service}</td>
                </tr>
                <!-- DATE -->
                <tr style="margin:0; padding:0;">
                  <td width="38%" valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 24px; border-bottom:1px solid rgba(255,255,255,0.05); font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase; white-space:nowrap;">Date</td>
                  <td valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; line-height:20px; color:#E2E8F0;">${dateLine}</td>
                </tr>
                <!-- TIME -->
                <tr style="margin:0; padding:0;">
                  <td width="38%" valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 24px; border-bottom:1px solid rgba(255,255,255,0.05); font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase; white-space:nowrap;">Time</td>
                  <td valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; line-height:20px; color:#E2E8F0;">${timeLine}</td>
                </tr>
                <!-- DURATION -->
                <tr style="margin:0; padding:0;">
                  <td width="38%" valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 24px; border-bottom:1px solid rgba(255,255,255,0.05); font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase; white-space:nowrap;">Duration</td>
                  <td valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; line-height:20px; color:#E2E8F0;">${d.durationMin} minutes</td>
                </tr>
                <!-- PAID -->
                <tr style="margin:0; padding:0;">
                  <td width="38%" valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 24px; border-bottom:1px solid rgba(255,255,255,0.05); font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase; white-space:nowrap;">Paid</td>
                  <td valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 14px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:700; line-height:20px; color:#34D399;">${d.amountUsd} <span style="font-weight:400; color:#8E9BAE;">&middot; paid via Stripe</span></td>
                </tr>
                <!-- REFERENCE -->
                <tr style="margin:0; padding:0;">
                  <td width="38%" valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 16px 24px; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase; white-space:nowrap;">Reference</td>
                  <td valign="top" bgcolor="#0E1014" style="background-color:#0E1014; padding:14px 24px 16px 0; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:13px; font-weight:600; letter-spacing:0.06em; line-height:20px; color:#F8F9FA;">${ref}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ WHAT HAPPENS NEXT ============ -->
          <tr style="margin:0; padding:0;">
            <td class="pad-sides" bgcolor="#020203" style="background-color:#020203; padding:38px 44px 0 44px;">
              <!-- section label: crimson rule + mono uppercase label -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
                <tr style="margin:0; padding:0;">
                  <td width="24" bgcolor="#FF2A35" style="width:24px; height:2px; background-color:#FF2A35; font-size:0; line-height:0;">&nbsp;</td>
                  <td width="12" bgcolor="#020203" style="width:12px; font-size:0; line-height:0;">&nbsp;</td>
                  <td bgcolor="#020203" style="background-color:#020203; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.12em; color:#8E9BAE; text-transform:uppercase;">What happens next</td>
                </tr>
              </table>

              <!-- numbered steps -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
${stepsHtml}
              </table>
            </td>
          </tr>

          <!-- ============ ACTION BUTTONS (bulletproof) ============ -->
          <tr style="margin:0; padding:0;">
            <td class="pad-sides" bgcolor="#020203" style="background-color:#020203; padding:32px 44px 0 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
                <tr style="margin:0; padding:0;">
                  <!-- primary: View receipt -->
${receiptBtn}
                  <!-- ghost: Manage booking -->
                  <td class="btn-col" align="center" valign="top" bgcolor="#020203" style="background-color:#020203; width:50%; padding:0 0 0 6px;">
                    <table role="presentation" class="btn-table" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%; max-width:248px;">
                      <tr style="margin:0; padding:0;">
                        <td align="center" bgcolor="#020203" style="border-radius:6px; background-color:#020203; border:1px solid rgba(255,255,255,0.28);">
                          <a href="${htmlEscape(d.portalUrl)}" target="_blank" style="display:inline-block; padding:13px 26px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; font-weight:700; line-height:120%; color:#F8F9FA; text-decoration:none; border-radius:6px; mso-padding-alt:13px 26px;">Manage booking</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ============ REPLY LINE ============ -->
          <tr style="margin:0; padding:0;">
            <td class="pad-sides" align="center" bgcolor="#020203" style="background-color:#020203; padding:18px 44px 0 44px;">
              <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:14px; font-style:italic; line-height:22px; color:#8E9BAE;">Questions? Just reply to this email &mdash; it lands in Tony&rsquo;s inbox.</p>
            </td>
          </tr>

          <!-- ============ FOOTER #0A0A0C ============ -->
          <tr style="margin:0; padding:0;">
            <td bgcolor="#0A0A0C" style="background-color:#0A0A0C; border-top:1px solid rgba(255,255,255,0.08); border-radius:0 0 12px 12px; padding:28px 44px 30px 44px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
                <tr style="margin:0; padding:0;">
                  <td bgcolor="#0A0A0C" style="background-color:#0A0A0C; font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; font-weight:700; letter-spacing:0.16em; color:#E2E8F0; text-transform:uppercase;">Tony Simons <span style="color:#FF2A35;">// Launch Lab</span></td>
                </tr>
                <tr style="margin:0; padding:0;">
                  <td bgcolor="#0A0A0C" style="background-color:#0A0A0C; padding-top:14px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#8E9BAE;">
                    <a href="${htmlEscape(d.baseUrl)}" target="_blank" style="color:#E2E8F0; text-decoration:underline;">launch.tonysimons.dev</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${htmlEscape(d.baseUrl)}/legal/terms" target="_blank" style="color:#E2E8F0; text-decoration:underline;">Terms</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${htmlEscape(d.baseUrl)}/legal/privacy" target="_blank" style="color:#E2E8F0; text-decoration:underline;">Privacy</a>
                  </td>
                </tr>
                <tr style="margin:0; padding:0;">
                  <td bgcolor="#0A0A0C" style="background-color:#0A0A0C; padding-top:14px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#8E9BAE;">You&rsquo;re receiving this because you booked a session with Hermes Launch Lab. Reference <span style="font-family:SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace; font-size:11px; letter-spacing:0.06em; color:#E2E8F0;">${ref}</span> &middot; Paid ${d.amountUsd}.</td>
                </tr>
                <tr style="margin:0; padding:0;">
                  <td bgcolor="#0A0A0C" style="background-color:#0A0A0C; padding-top:6px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#8E9BAE;">&copy; 2026 Tony Simons &middot; Independent consulting service &middot; Sessions are not recorded.</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /600px card -->

        <!-- spacer below card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; margin:0; padding:0;">
          <tr style="margin:0; padding:0;">
            <td bgcolor="#020203" style="background-color:#020203; height:32px; font-size:0; line-height:0;">&nbsp;</td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
  <!-- /outer wrapper -->

</body>
</html>`
}

export function renderConfirmationText(d: ConfirmationData): string {
  const steps = stepsFor(d.serviceSlug)
  const stepsText = steps
    .map((s, i) => `${i + 1}. ${s.lead.replace(/&rsquo;/g, "'").replace(/&mdash;/g, '—')} ${s.body.replace(/&rsquo;/g, "'").replace(/&mdash;/g, '—')}`)
    .join('\n')
  const intakeLine = d.intakeKnown ? "We've got your setup details on file - no need to resend them." : ''

  return `HERMES LAUNCH LAB
TONY SIMONS // LAUNCH LAB
==========================================

You're booked, ${d.firstName}.

Your ${d.serviceName} is confirmed for ${d.heroLine} (${d.timeZoneLabel}).

${intakeLine}

BOOKING DETAILS
------------------------------------------
SESSION     ${d.serviceName}
DATE        ${d.dateLine}
TIME        ${d.timeLine}
DURATION    ${d.durationMin} minutes
PAID        ${d.amountUsd} (paid via Stripe) - PAID IN FULL
REFERENCE   ${d.reference}

WHAT HAPPENS NEXT
------------------------------------------
${stepsText}

ACTIONS
------------------------------------------
View receipt:    ${d.receiptUrl ?? 'https://launch.tonysimons.dev/portal'}
Manage booking:  ${d.portalUrl}

Questions? Just reply to this email - it lands in Tony's inbox.

------------------------------------------
Hermes Launch Lab - ${d.baseUrl}
Terms:    ${d.baseUrl}/legal/terms
Privacy:  ${d.baseUrl}/legal/privacy

You're receiving this because you booked a session with Hermes Launch Lab.
Reference ${d.reference}. Paid ${d.amountUsd}.
(c) 2026 Hermes Launch Lab`
}

/**
 * Build a calendar invite (.ics) in UTC (Z) — the most robust representation for
 * arbitrary customer timezones: every client converts to the recipient's local
 * time, which matches the timezone the booking was made in.
 */
export function buildBookingIcs(d: ConfirmationData, startUtc: Date, endUtc: Date): string {
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '') // 20260818T190000Z

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hermes Launch Lab//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Hermes Launch Lab',
    'BEGIN:VEVENT',
    `UID:${d.reference.toLowerCase()}@launch.tonysimons.dev`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(startUtc)}`,
    `DTEND:${fmt(endUtc)}`,
    `SUMMARY:${d.serviceName} with Tony Simons`,
    `DESCRIPTION:Paid session.\\nDetails: ${d.baseUrl}/portal\\nReference: ${d.reference}`,
    `ORGANIZER;CN=Hermes Launch Lab:mailto:tony@tonyreviewsthings.com`,
    'SEQUENCE:0',
    'STATUS:CONFIRMED',
    'CLASS:PUBLIC',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  // RFC 5545: fold lines at 75 octets (CRLF + single leading space continuation)
  const crlf = '\r\n'
  const folded: string[] = []
  for (const line of lines) {
    if (Buffer.byteLength(line, 'utf8') <= 75) {
      folded.push(line)
      continue
    }
    let rest = line
    while (Buffer.byteLength(rest, 'utf8') > 75) {
      let cut = 75
      while (cut > 0 && Buffer.byteLength(rest.slice(0, cut), 'utf8') > 75) cut--
      folded.push(rest.slice(0, cut))
      rest = ' ' + rest.slice(cut)
    }
    folded.push(rest)
  }
  return folded.join(crlf) + crlf
}

export function bookingReference(bookingId: string): string {
  return `HLL-${bookingId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}`
}

/** "Tue, Aug 18, 2026" in the booking's timezone */
export function formatDateLine(start: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(start)
}

/** "2:00–3:30 PM Central Time" in the booking's timezone */
export function formatTimeLine(start: Date, end: Date, timeZone: string): string {
  const startParts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).formatToParts(start)
  const endTime = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(end)
  // Drop the start-time meridiem so the range reads "2:00–3:30 PM", not "2:00 PM–3:30 PM"
  const startTime = startParts.filter((p) => p.type !== 'dayPeriod').map((p) => p.value).join('').trim()
  return `${startTime}\u2013${endTime} ${shortTimeZone(timeZone)}`
}

/** "Tuesday, August 18 at 2:00 PM" in the booking's timezone */
export function formatHeroLine(start: Date, timeZone: string): string {
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(start)
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(start)
  return `${date} at ${time}`
}

/** "Central Time" style label; falls back to Intl's long name for unknown zones */
export function shortTimeZone(timeZone: string): string {
  const known: Record<string, string> = {
    'America/Chicago': 'Central Time',
    'America/New_York': 'Eastern Time',
    'America/Denver': 'Mountain Time',
    'America/Los_Angeles': 'Pacific Time',
    'America/Phoenix': 'Arizona Time',
    'America/Anchorage': 'Alaska Time',
    'Pacific/Honolulu': 'Hawaii Time',
    'Europe/London': 'UK Time',
    'Europe/Paris': 'Central European Time',
    'Europe/Berlin': 'Central European Time',
    'UTC': 'UTC',
  }
  if (known[timeZone]) return known[timeZone]
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'long' })
      .formatToParts(new Date())
      .find((p) => p.type === 'timeZoneName')?.value ?? timeZone
  } catch {
    return timeZone
  }
}

/** Subject: "Your Hermes Launch Session is confirmed — Tue, Aug 18 at 2:00 PM" */
export function formatSubjectLine(serviceName: string, start: Date, timeZone: string): string {
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(start)
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(start)
  return `Your ${serviceName} is confirmed \u2014 ${date} at ${time}`
}
