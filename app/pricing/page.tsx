import type { Metadata } from 'next'
import { ServiceCard } from '@/components/ServiceCard'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RoiCalculator } from '@/components/RoiCalculator'
import { EngagementSteps } from '@/components/EngagementSteps'

export const metadata: Metadata = {
  title: 'Pricing & Services',
  description:
    'One-time Hermes Agent consulting sessions: Strategy ($99), Launch ($299), and scoped Custom Builds starting at $600. US online booking; international business applications reviewed manually.',
  alternates: { canonical: '/pricing' },
}

const services = [
  { slug: 'strategy', name: 'Hermes Strategy Session', price: 99, durationMin: 60, description: 'Fit assessment, model recommendations, hosting guidance, security discussion, and a written action plan.' },
  { slug: 'launch', name: 'Hermes Launch Session', price: 299, durationMin: 90, description: 'Installation or repair, model configuration, channels, memory, permissions, one tested workflow, and 7-day follow-up defect support by email.' },
  { slug: 'custom', name: 'Custom Hermes Build', price: 600, durationMin: 120, description: 'Quoted after scope review; projects start at $600. VPS deployments, integrations, custom skills, and automations. Application required.' },
]

export default function Pricing() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell pricing-page">
        <p className="eyebrow">PRICING & SERVICES</p>
        <h1 className="page-title">One-time sessions. No retainers.</h1>
        <p className="page-intro">Strategy ends with a written action plan. Launch targets one tested workflow. Custom Builds are quoted only after scope review—without an upsell maze or vague subscription.</p>

        <p className="notice geography-notice"><strong>US clients may book Strategy or Launch online.</strong> International business clients and all Custom Build clients may <a href="/apply" style={{ textDecoration: 'underline' }}>apply for review</a>. International consumer checkout is not available.</p>

        <div className="pricing-direct-note">
          <p className="eyebrow">DIRECT 1:1 WORK</p>
          <p>Tony leads the session directly. There is no sales handoff and no account manager between you and the work.</p>
        </div>

        <div className="offer-grid pricing-page__offers">
          {services.map((service, index) => <ServiceCard key={service.slug} service={service} featured={index === 1} />)}
        </div>

        <div className="pricing-page__steps"><EngagementSteps /></div>

        <section className="pricing-page__strategy">
          <p className="eyebrow">UNSURE WHERE TO START?</p>
          <h2>Start with Strategy when the job still needs shape.</h2>
          <p>Strategy is the lower-commitment path for a fit assessment, technical direction, and a written action plan. It is not an installation session.</p>
        </section>

        <section className="pricing-page__roi">
          <p className="eyebrow">ESTIMATE YOUR RETURN</p>
          <h2>Estimate what a configured agent could save you</h2>
          <p>Adjust the sliders below to see an illustrative estimate of monthly time savings and annual engineering value.</p>
          <RoiCalculator />
        </section>

        <p className="notice">Checkout is processed via Stripe. Sessions use private Google Meet and, when authorized, attended one-time Chrome Remote Desktop access. Sessions are not recorded. Independent service, not affiliated with Nous Research.</p>
      </main>
      <SiteFooter />
    </>
  )
}
