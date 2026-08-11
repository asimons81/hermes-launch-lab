import { ServiceCard } from '@/components/ServiceCard'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

const services = [
  { slug: 'strategy', name: 'Hermes Strategy Session', price: 99, durationMin: 60, description: 'Fit assessment, model recommendations, hosting guidance, security discussion, and a written action plan.' },
  { slug: 'launch', name: 'Hermes Launch Session', price: 299, durationMin: 90, description: 'Installation or repair, model configuration, channels, memory, permissions, one tested workflow, and 7-day follow-up support.' },
  { slug: 'custom', name: 'Custom Hermes Build', price: 600, durationMin: 120, description: 'VPS deployment, integrations, custom skills, scheduled automations, and 7-day follow-up support. Application required.' }
]
export default function Services() { return <><SiteHeader /><main className="shell page-shell"><p className="eyebrow">SERVICE PATHS</p><h1 className="page-title">Choose the depth of help you need.</h1><p className="page-intro">Clear, hands-on sessions for getting from a specific Hermes problem to a tested next step.</p><div className="offer-grid" style={{marginTop:48}}>{services.map((s, i) => <ServiceCard key={s.slug} service={s} featured={i === 1} />)}</div></main><SiteFooter /></> }
