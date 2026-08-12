import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('email amount shows dollars, not cents (regression: $2.99 bug)', () => {
  it('formats the DB dollar price as USD cents in the customer email', () => {
    const email = read('lib/email.ts')
    // service.price is stored in dollars (299) — must be multiplied to cents before formatUsd.
    expect(email).toMatch(/formatUsd\(service\.price \* 100\)/)
    expect(email).not.toMatch(/formatUsd\(service\.price\)/)
  })
})

describe('booking records the customer timezone (regression: UTC bookings)', () => {
  it('booking form sends the browser timezone', () => {
    const form = read('components/BookingForm.tsx')
    expect(form).toMatch(/name="timeZone"/)
    expect(form).toMatch(/resolvedOptions\(\)\.timeZone/)
  })

  it('bookings route reads the client timezone with a server fallback', () => {
    const route = read('app/api/bookings/route.ts')
    expect(route).toMatch(/form\.get\('timeZone'\)/)
    expect(route).toMatch(/resolvedOptions\(\)\.timeZone/)
    // the booking row must use the client value, not a server-side hardcode
    expect(route).not.toMatch(/timeZone:\s*Intl\.DateTimeFormat/)
  })
})

describe('client portal shows real bookings (regression: static placeholder)', () => {
  const portal = read('app/portal/page.tsx')

  it('queries bookings for the signed-in user', () => {
    expect(portal).toMatch(/prisma\.booking\.findMany/)
    expect(portal).toMatch(/userId:\s*session\.user\.id/)
  })

  it('filters upcoming vs past sessions', () => {
    expect(portal).toMatch(/status:\s*\{\s*in:\s*\['pending',\s*'confirmed'\]/)
    expect(portal).toMatch(/startTime:\s*\{\s*gte:\s*now/)
    expect(portal).toMatch(/status:\s*'completed'/)
  })

  it('renders session rows with timezone-correct dates', () => {
    expect(portal).toMatch(/formatDateLine\(b\.startTime, b\.timeZone\)/)
    expect(portal).toMatch(/formatTimeLine\(b\.startTime, b\.endTime, b\.timeZone\)/)
  })
})
