import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('abandoned checkout releases the slot (hold expiry)', () => {
  it('booking conflict check does not treat stale pending bookings as taken', () => {
    const route = read('app/api/bookings/route.ts')
    // A pending booking created long ago must not block the slot.
    expect(route).toMatch(/createdAt/)
    expect(route).toMatch(/pending/)
    // The stale-hold cutoff must be a time window, not a hardcoded status filter.
    expect(route).not.toMatch(/status:\s*\{\s*not:\s*'cancelled'\s*\}/)
  })

  it('availability API does not hide slots behind stale pending bookings', () => {
    const route = read('app/api/availability/route.ts')
    expect(route).toMatch(/createdAt/)
    expect(route).toMatch(/pending/)
    expect(route).not.toMatch(/status:\s*\{\s*not:\s*'cancelled'\s*\}/)
  })

  it('checkout session carries an expiry so Stripe abandons open sessions', () => {
    const route = read('app/api/bookings/route.ts')
    expect(route).toMatch(/expires_at/)
  })
})

describe('stripe webhook confirms the booking correctly', () => {
  it('records the payment against the real booking userId, not the customer email', () => {
    const webhook = read('app/api/webhooks/stripe/route.ts')
    // Payment.userId is an FK to User.id (cuid) — the email string is not a valid id.
    expect(webhook).not.toMatch(/userId:\s*session\.customer_details/)
    expect(webhook).toMatch(/booking\.userId|booking\.id/)
  })

  it('is idempotent across Stripe webhook retries (upsert, not plain create)', () => {
    const webhook = read('app/api/webhooks/stripe/route.ts')
    expect(webhook).toMatch(/upsert/)
  })

  it('releases the slot when Stripe reports the checkout session expired', () => {
    const webhook = read('app/api/webhooks/stripe/route.ts')
    expect(webhook).toMatch(/checkout\.session\.expired/)
    expect(webhook).toMatch(/cancelled/)
  })
})
