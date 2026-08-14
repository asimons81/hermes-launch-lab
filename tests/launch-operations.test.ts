import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { containsLikelySecret } from '../lib/submission-security'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('launch geography and service controls', () => {
  it('allows only Strategy and Launch through self-service booking', () => {
    const route = read('app/api/bookings/route.ts')
    expect(route).toMatch(/isBookableService/)
    expect(route).toMatch(/purchaseCountry !== 'US'/)
    expect(route).toMatch(/acceptedUsOnly/)
  })

  it('verifies Stripe billing country and refunds a mismatch', () => {
    const webhook = read('app/api/webhooks/stripe/route.ts')
    expect(webhook).toMatch(/billingCountry !== 'US'/)
    expect(webhook).toMatch(/stripe\.refunds\.create/)
    expect(webhook).toMatch(/status: 'refunded'/)
  })

  it('records every accepted policy version', () => {
    const schema = read('prisma/schema.prisma')
    const route = read('app/api/bookings/route.ts')
    for (const field of ['acceptedTermsVersion', 'acceptedPrivacyVersion', 'acceptedRefundVersion', 'acceptedConsultingVersion']) {
      expect(schema).toContain(field)
      expect(route).toContain(field)
    }
  })
})

describe('session and intake boundaries', () => {
  it('publishes the attended-access and no-recording policy', () => {
    const sessions = read('app/sessions/page.tsx')
    expect(sessions).toMatch(/Google Meet/)
    expect(sessions).toMatch(/Chrome Remote Desktop/)
    expect(sessions).toMatch(/unattended remote access is never installed/i)
    expect(sessions).toMatch(/not recorded/i)
  })

  it('intake no longer asks for recording consent and requires a confirmed booking', () => {
    const page = read('app/intake/page.tsx')
    const route = read('app/api/intake/route.ts')
    expect(page).not.toMatch(/recordConsent/)
    expect(route).toMatch(/status: 'confirmed'/)
    expect(route).toMatch(/recordConsent: false/)
  })

  it('detects representative secret formats before storage', () => {
    expect(containsLikelySecret(['password = definitely-not-for-a-form'])).toBe(true)
    expect(containsLikelySecret(['Build a daily research workflow for our product team.'])).toBe(false)
  })

  it('notifies admin on application submission', () => {
    const route = read('app/api/applications/route.ts')
    const emailLib = read('lib/email.ts')
    expect(route).toMatch(/sendApplicationAdminNotification/)
    expect(emailLib).toMatch(/sendApplicationAdminNotification/)
    expect(emailLib).toMatch(/tony@tonyreviewsthings\.com/)
  })
})

