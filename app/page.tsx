import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SystemMap } from '@/components/SystemMap'

const offers = [
  { label: 'START HERE', name: 'Strategy session', price: '$99', detail: '60 min · Fit assessment, guidance, and a written action plan.', href: '/book?service=strategy' },
  { label: 'MOST HANDS-ON', name: 'Launch session', price: '$299', detail: '90 min · Setup or repair, secure configuration, and one tested workflow.', href: '/book?service=launch', featured: true },
  { label: 'BUILT TO FIT', name: 'Custom build', price: '$600+', detail: '120 min · VPS, integrations, custom skills, and scheduled automations.', href: '/book?service=custom' },
]

export default function Home() {
  return <><SiteHeader /><main>
    <section className="hero shell">
      <div className="hero__copy">
        <p className="eyebrow">PRIVATE HERMES AGENT CONSULTING</p>
        <h1>Leave with Hermes <span>working.</span></h1>
        <p className="hero__lede">Installation, security, configuration, and one tested workflow—handled live with you, not handed off to a mystery box.</p>
        <div className="hero__actions"><Link href="/book" className="button button--primary">Book a session <span>↗</span></Link><Link href="/services" className="text-link">Explore services <span>→</span></Link></div>
        <p className="hero__note">No secrets. No mystery-box setup. You stay in control of your accounts and keys.</p>
      </div>
      <SystemMap />
    </section>

    <section className="proof-strip"><div className="shell proof-strip__grid"><div><span>01</span><strong>HANDS-ON</strong><p>We work through the actual setup together.</p></div><div><span>02</span><strong>SECURITY-FIRST</strong><p>Secrets stay with you. Boundaries are explicit.</p></div><div><span>03</span><strong>TESTED LIVE</strong><p>Leave with a workflow that has actually run.</p></div></div></section>

    <section className="section shell"><div className="section-heading"><p className="eyebrow">CHOOSE THE RIGHT DEPTH</p><h2>A clear path from “should I?” to “it works.”</h2><p>Pick the amount of hands-on help you need. No upsell maze, no vague retainers.</p></div><div className="offer-grid">{offers.map(offer => <article className={`offer ${offer.featured ? 'offer--featured' : ''}`} key={offer.name}><p className="offer__label">{offer.label}</p><h3>{offer.name}</h3><p className="offer__price">{offer.price}</p><p>{offer.detail}</p><Link className="offer__link" href={offer.href}>Choose this path <span>→</span></Link></article>)}</div></section>

    <section className="section section--split shell"><div><p className="eyebrow">WHAT HAPPENS IN A SESSION</p><h2>Move from intent to a system you can use.</h2></div><ol className="process-list"><li><span>01</span><div><strong>Pick the job</strong><p>Define the first useful workflow, the environment, and the constraints.</p></div></li><li><span>02</span><div><strong>Build it together</strong><p>Install, repair, configure, or integrate in the actual environment.</p></div></li><li><span>03</span><div><strong>Run the proof</strong><p>Test the workflow, document the next move, and leave with clarity.</p></div></li></ol></section>

    <section className="section shell"><div className="fit-panel"><div><p className="eyebrow">A GOOD FIT</p><h2>For people who want a real setup—not a sales call.</h2></div><div className="fit-panel__copy"><p>Come with a goal, a machine or server, and a willingness to work through the details. We’ll keep the session practical.</p><p>This is independent consulting for Hermes Agent. It is not official Nous Research support, and it is not a place to paste credentials into a form.</p><Link href="/faq" className="text-link">Read the FAQ <span>→</span></Link></div></div></section>

    <section className="closing"><div className="shell closing__inner"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Build the first useful thing.</h2><p>Choose a session and we’ll turn the starting point into a working system.</p><Link href="/book" className="button button--primary">Book a session <span>↗</span></Link></div></section>
  </main><SiteFooter /></>
}
