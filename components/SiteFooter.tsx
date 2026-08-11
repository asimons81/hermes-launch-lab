import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <BrandMark />
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5, margin: 0, maxWidth: 320 }}>
            Private, hands-on Hermes Agent consulting, zero-trust vault setups &amp; custom agent infrastructure.
          </p>
        </div>
        <div className="footer-links">
          <div className="eyebrow" style={{ color: 'var(--red-accent)', marginBottom: 6, fontSize: 10 }}>// SUITE</div>
          <a href="https://tonysimons.dev" style={{ color: 'var(--red-accent)' }}>Studio Portfolio ↗</a>
          <Link href="/book" style={{ color: 'var(--ink)' }}>Book Session ↗</Link>
          <Link href="/intake">Diagnostic Intake</Link>
          <Link href="/portal">Client Portal</Link>
        </div>
        <div className="footer-links">
          <div className="eyebrow" style={{ color: 'var(--muted-2)', marginBottom: 6, fontSize: 10 }}>Resources</div>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Documentation</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/status">Status</Link>
        </div>
        <div className="footer-links">
          <div className="eyebrow" style={{ color: 'var(--muted-2)', marginBottom: 6, fontSize: 10 }}>Legal &amp; Policy</div>
          <Link href="/legal/privacy">Privacy Policy</Link>
          <Link href="/legal/terms">Terms of Service</Link>
          <Link href="/legal/refund">Refund Policy</Link>
        </div>
      </div>
      <div className="shell site-footer__fineprint" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span>© {new Date().getFullYear()} Tony Simons · Independent Studio service. Not affiliated with Nous Research.</span>
        <span style={{ color: 'var(--red-accent)', fontFamily: 'var(--mono)', fontSize: 11 }}>
          Contact: <a href="mailto:tony@tonyreviewsthings.com" style={{ color: 'var(--red-accent)', textDecoration: 'underline' }}>tony@tonyreviewsthings.com</a>
        </span>
      </div>
    </footer>
  )
}
