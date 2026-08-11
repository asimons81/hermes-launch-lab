import Link from 'next/link'

type Service = { slug: string; name: string; price: number; durationMin: number; description: string }
export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const isCustom = service.slug === 'custom'
  return <article className={`offer ${featured ? 'offer--featured' : ''}`}><p className="offer__label">{featured ? 'MOST HANDS-ON' : `${service.durationMin} MINUTES`}</p><h3>{service.name}</h3><p className="offer__price">${service.price}{isCustom ? '+' : ''}</p><p>{service.description}</p><Link href={isCustom ? '/contact' : `/book?service=${service.slug}`} className="offer__link">{isCustom ? 'Apply via contact' : 'Choose this path'} <span>→</span></Link></article>
}
