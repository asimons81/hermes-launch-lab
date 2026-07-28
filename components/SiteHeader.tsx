import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <BrandMark />
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/services">Services</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/portal">Client portal</Link>
        </nav>
        <Link href="/book" className="button button--primary">Book a session <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  )
}
