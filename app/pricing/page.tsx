import { ServiceCard } from '@/components/ServiceCard'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RoiCalculator } from '@/components/RoiCalculator'

const services = [
  { slug: 'strategy', name: 'Hermes Strategy Session', price: 99, durationMin: 60, description: 'Fit assessment, model recommendations, hosting guidance, security discussion, and a written action plan.' },
  { slug: 'launch', name: 'Hermes Launch Session', price: 299, durationMin: 90, description: 'Installation or repair, model configuration, channels, memory, permissions, and one tested workflow.' },
  { slug: 'custom', name: 'Custom Hermes Build', price: 600, durationMin: 120, description: 'VPS deployment, integrations, custom skills, and scheduled automations. Application required.' }
]

export default function Pricing() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <p className="eyebrow">PRICING & SERVICES</p>
        <h1 className="page-title">One-time sessions. No retainers.</h1>
        <p className="page-intro">
          You leave with working software. Pick the depth of help you need — no upsell maze, no vague subscriptions.
        </p>

        <div className="offer-grid" style={{ marginTop: 48 }}>
          {services.map((s, i) => (
            <ServiceCard key={s.slug} service={s} featured={i === 1} />
          ))}
        </div>

        {/* Interactive ROI Calculator */}
        <section style={{ marginTop: 56 }}>
          <p className="eyebrow">ESTIMATE YOUR RETURN</p>
          <h2 style={{ letterSpacing: '-0.04em', fontSize: 28, marginTop: 4, marginBottom: 8 }}>
            How much time will Hermes save you?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>
            Adjust the sliders below to calculate your estimated monthly time savings and annual engineering value.
          </p>
          <RoiCalculator />
        </section>

        <p className="notice" style={{ marginTop: 40, color: 'var(--muted)', fontSize: 14 }}>
          Live Stripe checkout. Receipts via Resend. Independent service — not affiliated with Nous Research.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
