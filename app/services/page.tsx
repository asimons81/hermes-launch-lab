import { ServiceCard } from '@/components/ServiceCard'

const services = [
  { slug: 'strategy', name: 'Hermes Strategy Session', price: 99, durationMin: 60, description: 'Fit assessment, model recommendations, hosting guidance, security discussion, written action plan.' },
  { slug: 'launch', name: 'Hermes Launch Session', price: 299, durationMin: 90, description: 'Installation or repair, model configuration, channels, memory, permissions, one tested workflow, 7-day follow-up.' },
  { slug: 'custom', name: 'Custom Hermes Build', price: 600, durationMin: 120, description: 'VPS deployment, integrations, custom skills, scheduled automations. Application required.' }
]

export default function Services() {
  return (
    <div className="container">
      <nav className="nav">
        <a href="/">HERMES LAUNCH LAB</a>
        <a href="/book">Book</a>
      </nav>
      <h1>Services</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'var(--space-5)',marginTop:'var(--space-6)'}}>
        {services.map(s => <ServiceCard key={s.slug} service={s} />)}
      </div>
      <p style={{marginTop:'var(--space-6)',fontSize:12,color:'var(--color-ink-muted)'}}>
        All prices in USD. Independent service. Not affiliated with Nous Research.
      </p>
    </div>
  )
}
