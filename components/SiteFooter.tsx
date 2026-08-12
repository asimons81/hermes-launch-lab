import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="site-footer__intro">
          <BrandMark />
          <p>Private, hands-on Hermes Agent consulting, credential security setups, and custom agent infrastructure.</p>
        </div>
        <div className="footer-links">
          <div className="eyebrow">WORK WITH TONY</div>
          <Link href="/about">About Tony</Link>
          <Link href="/features">What I build</Link>
          <Link href="/pricing" style={{ color: 'var(--ink)' }}>Book a session ↗</Link>
          <Link href="/intake">Pre-Session Intake</Link>
          <Link href="/contact">Custom build contact</Link>
        </div>
        <div className="footer-links">
          <div className="eyebrow">RESOURCES</div>
          <Link href="/docs">Documentation</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/status">Status</Link>
          <Link href="/portal">Client portal</Link>
        </div>
        <div className="footer-links">
          <div className="eyebrow">LEGAL &amp; POLICY</div>
          <Link href="/legal/privacy">Privacy Policy</Link>
          <Link href="/legal/terms">Terms of Service</Link>
          <Link href="/legal/refund">Refund Policy</Link>
        </div>
      </div>
      <div className="shell site-footer__fineprint">
        <span>© {new Date().getFullYear()} Tony Simons · Independent Studio service. Not affiliated with Nous Research.</span>
        <span>Contact: <a href="mailto:tony@tonyreviewsthings.com">tony@tonyreviewsthings.com</a></span>
      </div>
    </footer>
  )
}
