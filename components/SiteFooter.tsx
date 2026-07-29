import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div><BrandMark /><p>Private, hands-on Hermes Agent consulting.</p></div>
        <div className="footer-links"><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/docs">Docs</Link><Link href="/faq">FAQ</Link><Link href="/portal">Client portal</Link></div>
        <div className="footer-links"><Link href="/status">Status</Link><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/refund">Refunds</Link></div>
      </div>
      <div className="shell site-footer__fineprint">Independent service by Tony Simons. Not affiliated with Nous Research or Hermes Agent maintainers.</div>
    </footer>
  )
}
