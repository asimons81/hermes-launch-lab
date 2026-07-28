import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <nav className="nav">
        <div style={{fontFamily:'var(--font-mono)',fontSize:14,letterSpacing:'2px'}}>HERMES LAUNCH LAB</div>
        <div style={{display:'flex',gap:'var(--space-5)'}}>
          <Link href="/services">Services</Link>
          <Link href="/book">Book</Link>
          <Link href="/portal">Portal</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>

      <div style={{maxWidth:680,marginTop:'var(--space-8)'}}>
        <h1>Private consulting for Hermes Agent.</h1>
        <p style={{fontSize:18,color:'var(--color-ink-muted)',marginBottom:'var(--space-6)'}}>
          Get Hermes Agent installed, configured, secured, and running one useful workflow.
          Independent service. No affiliation with Nous Research.
        </p>
        
        <div style={{display:'flex',gap:'var(--space-3)',marginBottom:'var(--space-8)'}}>
          <Link href="/book" className="btn btn-primary">Book a session</Link>
          <Link href="/services" className="btn">View services</Link>
        </div>
      </div>

      <div style={{marginTop:'var(--space-7)',paddingTop:'var(--space-6)',borderTop:'var(--border)'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'var(--space-5)'}}>
          <div>
            <div style={{fontSize:12,color:'var(--color-ink-muted)',marginBottom:'var(--space-2)'}}>STRATEGY SESSION</div>
            <div style={{fontSize:32}}>$99–149</div>
            <div style={{color:'var(--color-ink-muted)'}}>60 min • fit assessment + plan</div>
          </div>
          <div>
            <div style={{fontSize:12,color:'var(--color-ink-muted)',marginBottom:'var(--space-2)'}}>LAUNCH SESSION</div>
            <div style={{fontSize:32}}>$299</div>
            <div style={{color:'var(--color-ink-muted)'}}>90 min • installation + first workflow</div>
          </div>
          <div>
            <div style={{fontSize:12,color:'var(--color-ink-muted)',marginBottom:'var(--space-2)'}}>CUSTOM BUILD</div>
            <div style={{fontSize:32}}>$600+</div>
            <div style={{color:'var(--color-ink-muted)'}}>VPS, integrations, skills</div>
          </div>
        </div>
      </div>

      <div style={{marginTop:'var(--space-8)',fontSize:12,color:'var(--color-ink-muted)'}}>
        Tony Simons • 10+ years shipping production systems • Arch Linux + fleet operations
      </div>
    </div>
  )
}
