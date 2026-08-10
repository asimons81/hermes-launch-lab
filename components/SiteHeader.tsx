'use client'

import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <BrandMark />
        <nav className="site-nav" aria-label="Primary navigation">
          <a
            href="https://tonysimons.dev"
            style={{
              color: 'var(--gold)',
              fontWeight: 600,
              fontFamily: 'var(--mono)',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 4,
              background: 'var(--gold-dim)',
              border: '1px solid var(--line-strong)',
              transition: 'all 0.2s ease',
            }}
          >
            ← Studio Portfolio
          </a>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/status">Status</Link>
          <Link href="/portal">Client portal</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16, flexShrink: 0 }}>
          <button
            onClick={() => {
              const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
              window.dispatchEvent(event)
            }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--muted)',
              fontSize: 11,
              fontFamily: 'var(--mono)',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
            title="Open Command Palette (Ctrl+K or /)"
          >
            <span>Search</span>
            <kbd style={{ background: 'rgba(255,42,53,0.12)', color: 'var(--gold)', padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>/</kbd>
          </button>
          <Link href="/book" className="button button--primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            Book a session <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
