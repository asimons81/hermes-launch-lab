import Link from 'next/link'

type Service = { slug: string; name: string; price: number; durationMin: number; description: string }
export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  return <article className={`offer ${featured ? 'offer--featured' : ''}`}><p className="offer__label">{`${service.durationMin} MINUTES${featured ? ' · MOST HANDS-ON' : ''}`}</p><h3>{service.name}</h3><p className="offer__price">${service.price}{service.slug === 'custom' ? '+' : ''}</p><p>{service.description}</p><Link href={`/book?service=${service.slug}`} className="offer__link">Choose this path <span>→</span></Link></article>
}
