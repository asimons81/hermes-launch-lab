import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  bookingReference,
  buildBookingIcs,
  formatDateLine,
  formatHeroLine,
  formatSubjectLine,
  formatTimeLine,
  renderConfirmationHtml,
  renderConfirmationText,
  shortTimeZone,
} from '../lib/email-templates'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

const sample = {
  firstName: 'Jordan',
  serviceName: 'Hermes Launch Session',
  serviceSlug: 'launch',
  durationMin: 90,
  amountUsd: '$299.00',
  reference: 'HLL-8F3K2A',
  subjectLine: 'Your Hermes Launch Session is confirmed — Tue, Aug 18 at 2:00 PM',
  heroLine: 'Tuesday, August 18 at 2:00 PM',
  dateLine: 'Tue, Aug 18, 2026',
  timeLine: '2:00–3:30 PM Central Time',
  timeZoneLabel: 'Central Time',
  intakeKnown: true,
  receiptUrl: 'https://pay.stripe.com/receipts/payment/EXAMPLE',
  portalUrl: 'https://launch.tonysimons.dev/portal',
  baseUrl: 'https://launch.tonysimons.dev',
}

describe('confirmation email HTML template', () => {
  it('renders the approved dark-native brand with dynamic values', () => {
    const html = renderConfirmationHtml(sample)
    expect(html).toContain('You&rsquo;re <em style="font-style:italic;">booked</em>, Jordan.')
    expect(html).toContain('Hermes Launch Session')
    expect(html).toContain('HLL-8F3K2A')
    expect(html).toContain('#020203')
    expect(html).toContain('#14171D')
    expect(html).toContain('rgba(52,211,153,0.15)')
    expect(html).toContain('https://pay.stripe.com/receipts/payment/EXAMPLE')
  })

  it('escapes user-controlled values (no HTML injection)', () => {
    const html = renderConfirmationHtml({
      ...sample,
      firstName: '<script>alert(1)</script>',
      serviceName: 'Launch "Session" & More',
    })
    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&quot;')
    expect(html).toContain('&amp;')
  })

  it('omits the receipt button when receiptUrl is null, keeps Manage booking', () => {
    const html = renderConfirmationHtml({ ...sample, receiptUrl: null })
    expect(html).not.toContain('>View receipt<')
    expect(html).toContain('>Manage booking<')
  })

  it('omits the intake line when no intake was submitted', () => {
    const html = renderConfirmationHtml({ ...sample, intakeKnown: false })
    expect(html).not.toContain('no need to resend them')
  })

  it('is email-safe: no scripts, no external stylesheets, no remote images', () => {
    const html = renderConfirmationHtml(sample)
    expect(html).not.toMatch(/<script/i)
    expect(html).not.toMatch(/<link[^>]+rel=["']stylesheet/i)
    expect(html).not.toMatch(/src=["']https?:\/\//i)
  })

  it('uses per-service "what happens next" copy', () => {
    const strategy = renderConfirmationHtml({ ...sample, serviceSlug: 'strategy', serviceName: 'Hermes Strategy Session' })
    expect(strategy).toContain('Action plan.')
    expect(strategy).not.toContain('7-day follow-up')
    const custom = renderConfirmationHtml({ ...sample, serviceSlug: 'custom' })
    expect(custom).toContain('Scope first.')
  })
})

describe('confirmation email plain-text template', () => {
  it('contains the same details with bare URLs', () => {
    const text = renderConfirmationText(sample)
    expect(text).toContain('You\'re booked, Jordan.')
    expect(text).toContain('HLL-8F3K2A')
    expect(text).toContain('https://pay.stripe.com/receipts/payment/EXAMPLE')
    expect(text).toContain('https://launch.tonysimons.dev/portal')
  })
})

describe('calendar invite (.ics) builder', () => {
  const start = new Date('2026-08-18T19:00:00Z')
  const end = new Date('2026-08-18T20:30:00Z')

  it('emits valid UTC iCalendar with correct DTSTART/DTEND', () => {
    const ics = buildBookingIcs(sample, start, end)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('DTSTART:20260818T190000Z')
    expect(ics).toContain('DTEND:20260818T203000Z')
    expect(ics).toContain('SUMMARY:Hermes Launch Session with Tony Simons')
  })

  it('folds every line at 75 octets (RFC 5545)', () => {
    const ics = buildBookingIcs(sample, start, end)
    for (const line of ics.split('\r\n')) {
      expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75)
    }
  })
})

describe('formatting helpers', () => {
  const start = new Date('2026-08-18T19:00:00Z') // 2:00 PM CT
  const end = new Date('2026-08-18T20:30:00Z')

  it('formats the subject with service + date + time in the booking timezone', () => {
    expect(formatSubjectLine('Hermes Launch Session', start, 'America/Chicago')).toBe(
      'Your Hermes Launch Session is confirmed — Tue, Aug 18 at 2:00 PM'
    )
  })

  it('formats date, time range, and hero line in the booking timezone', () => {
    expect(formatDateLine(start, 'America/Chicago')).toBe('Tue, Aug 18, 2026')
    expect(formatTimeLine(start, end, 'America/Chicago')).toBe('2:00–3:30 PM Central Time')
    expect(formatHeroLine(start, 'America/Chicago')).toBe('Tuesday, August 18 at 2:00 PM')
  })

  it('maps common US zones to friendly labels with a safe fallback', () => {
    expect(shortTimeZone('America/Chicago')).toBe('Central Time')
    expect(shortTimeZone('Europe/London')).toBe('UK Time')
    expect(shortTimeZone('Antarctica/Troll')).toBeTruthy()
  })

  it('builds the HLL- reference from a cuid', () => {
    expect(bookingReference('8f3k2ax9abc')).toBe('HLL-8F3K2A')
  })
})

describe('email wiring (source-level)', () => {
  it('webhook captures the Stripe receipt URL', () => {
    const webhook = read('app/api/webhooks/stripe/route.ts')
    expect(webhook).toMatch(/payment_intent\.latest_charge/)
    expect(webhook).toMatch(/receipt_url/)
    expect(webhook).toMatch(/receiptUrl/)
  })

  it('webhook sends emails only on the pending→confirmed transition (retry-safe)', () => {
    const webhook = read('app/api/webhooks/stripe/route.ts')
    expect(webhook).toMatch(/wasAlreadyConfirmed/)
    expect(webhook).toMatch(/Promise\.allSettled/)
  })

  it('email sender defaults to the tony@ address with reply-to routing', () => {
    const email = read('lib/email.ts')
    expect(email).toMatch(/tony@tonyreviewsthings\.com/)
    expect(email).toMatch(/replyTo/)
    expect(email).toMatch(/withTimeout/)
  })

  it('confirmation attachments ship the .ics', () => {
    const email = read('lib/email.ts')
    expect(email).toMatch(/attachments/)
    expect(email).toMatch(/\.ics/)
  })
})
