import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('Trust copy contract — every claim must be bounded and derivable', () => {
  it('pricing bounds the working-software promise by service and states support windows', () => {
    const pricing = read('app/pricing/page.tsx')
    // No blanket "you leave with working software" over all three offers; Strategy is plan-only.
    expect(pricing).not.toContain('You leave with working software')
    expect(pricing).toMatch(/written action plan/i)
    // Launch Session duration is present on the pricing card.
    expect(pricing).toMatch(/90/)
    // Support windows referenced by the Terms are stated on the service page.
    expect(pricing).toMatch(/7-day follow-up/i)
    // No fabricated receipt mechanism.
    expect(pricing).not.toMatch(/Receipts via Resend/i)
  })

  it('services page states the same bounded descriptions and support windows', () => {
    const services = read('app/services/page.tsx')
    expect(services).toMatch(/7-day follow-up/i)
    expect(services).toMatch(/Application required/i)
    expect(services).toMatch(/written action plan/i)
  })

  it('service cards always surface duration, including the featured Launch card', () => {
    const card = read('components/ServiceCard.tsx')
    expect(card).toMatch(/MOST HANDS-ON/)
    // Featured label must still include the duration, not replace it.
    expect(card).toMatch(/durationMin/)
    expect(card).toMatch(/MINUTES/)
    expect(card).not.toMatch(/featured \? 'MOST HANDS-ON'/)
  })

  it('custom-build offers always state application required', () => {
    const intake = read('components/DiagnosticIntake.tsx')
    const pricing = read('app/pricing/page.tsx')
    const services = read('app/services/page.tsx')
    // Recommendation path and flat-pricing card both state the requirement.
    expect(intake).toMatch(/Application required/i)
    expect(pricing).toMatch(/Application required/i)
    expect(services).toMatch(/Application required/i)
  })

  it('status page only claims what /api/health substantiates', () => {
    const status = read('app/status/page.tsx')
    // No fabricated uptime percentage.
    expect(status).not.toMatch(/99\.98/)
    // No fabricated latency default.
    expect(status).not.toMatch(/14ms response/)
    // No unsubstantiated Stripe/Resend/fleet operational claims.
    expect(status).not.toMatch(/Stripe Webhooks active/i)
    expect(status).not.toMatch(/DKIM \/ SPF verified/i)
    expect(status).not.toMatch(/Hermes Local Fleet Engine/)
    expect(status).not.toMatch(/v0\.19\.0/)
    expect(status).not.toMatch(/All systems operational/i)
    // The only monitored component is the health endpoint itself.
    expect(status).toMatch(/\/api\/health/)
    expect(status).toMatch(/not monitored/i)
    expect(status).toMatch(/timestamp: ''/)
  })

  it('live terminal discloses simulation and drops stale/fabricated telemetry', () => {
    const terminal = read('components/LiveTerminal.tsx')
    expect(terminal).toMatch(/simulated/i)
    expect(terminal).not.toMatch(/v0\.19\.0/)
    expect(terminal).not.toMatch(/55 skills/)
  })

  it('receipts rail labels are illustrative, not live activity', () => {
    const rail = read('components/ReceiptsRail.tsx')
    expect(rail).not.toMatch(/Live agent activity/)
    expect(rail).toMatch(/illustrative|simulated|sample/i)
  })

  it('ROI calculator discloses the 60% recovery assumption', () => {
    const roi = read('components/RoiCalculator.tsx')
    expect(roi).toMatch(/60%/i)
    expect(roi).toMatch(/assum/i)
    expect(roi).not.toMatch(/will save you\??/)
  })

  it('comparison table compares sessions, not unverifiable third-party tool categories', () => {
    const features = read('app/features/page.tsx')
    expect(features).not.toMatch(/Claude Code/)
    expect(features).not.toMatch(/Cursor/)
    expect(features).toMatch(/How the sessions compare|sessions compare/i)
  })

  it('skill catalog claims are illustrative, not a fabricated real catalog', () => {
    const catalog = read('components/SkillCatalog.tsx')
    expect(catalog).not.toMatch(/55\+ skills/)
    expect(catalog).toMatch(/illustrative|example/i)
    const features = read('app/features/page.tsx')
    expect(features).not.toMatch(/Inspect & Load Real Skills/)
    expect(features).toMatch(/example skills|skill examples/i)
  })

  it('privacy page provides a derivable public contact method', () => {
    const privacy = read('app/legal/privacy/page.tsx')
    expect(privacy).toMatch(/tony@tonyreviewsthings\.com/)
  })

  it('footer does not claim unmonitored operational status', () => {
    const footer = read('components/SiteFooter.tsx')
    expect(footer).not.toMatch(/All Systems Operational/)
    expect(footer).toMatch(/tony@tonyreviewsthings\.com/)
  })

  it('homepage hero does not claim live system-active telemetry', () => {
    const page = read('app/page.tsx')
    expect(page).not.toMatch(/SYSTEM ACTIVE/)
    expect(page).toMatch(/working\./)
  })

  it('status bar values are static descriptors, not live system state', () => {
    const bar = read('components/StatusBar.tsx')
    expect(bar).not.toMatch(/BROKERED/)
    expect(bar).toMatch(/status-bar__value/)
  })
})
