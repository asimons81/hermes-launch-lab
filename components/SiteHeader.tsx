'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BrandMark } from './BrandMark'

const navLinkStyle = {
  fontFamily: 'var(--mono)',
  fontSize: 12,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'var(--bone)',
  textDecoration: 'none',
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const handleNavClick = () => setMenuOpen(false)

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
  }

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <BrandMark />

        <nav className="site-nav hidden md:flex" aria-label="Primary navigation">
          <a href="https://tonysimons.dev" className="mono-label-pill">← STUDIO PORTFOLIO</a>
          <Link href="/about">About Tony</Link>
          <Link href="/features">What I build</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/sessions">Sessions</Link>
          <Link href="/docs">Docs</Link>
        </nav>

        <div className="hidden md:flex site-header__actions">
          <button type="button" onClick={openCommandPalette} aria-label="Search" title="Open Command Palette (Ctrl+K or /)">
            <span>Search</span><kbd>/</kbd>
          </button>
          <Link href="/book?service=launch" className="button button--primary">Book a session <span aria-hidden="true">→</span></Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="md:hidden site-header__toggle"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : <>
              <line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" role="navigation" aria-label="Mobile navigation" className="md:hidden site-header__drawer">
          <a href="https://tonysimons.dev" onClick={handleNavClick} className="mono-label-pill">← STUDIO PORTFOLIO</a>
          <Link href="/about" onClick={handleNavClick} style={navLinkStyle}>About Tony</Link>
          <Link href="/features" onClick={handleNavClick} style={navLinkStyle}>What I build</Link>
          <Link href="/pricing" onClick={handleNavClick} style={navLinkStyle}>Pricing</Link>
          <Link href="/sessions" onClick={handleNavClick} style={navLinkStyle}>Sessions</Link>
          <Link href="/docs" onClick={handleNavClick} style={navLinkStyle}>Docs</Link>
          <Link href="/faq" onClick={handleNavClick} style={navLinkStyle}>FAQ</Link>
          <button type="button" onClick={() => { handleNavClick(); openCommandPalette() }} className="site-header__drawer-search">Search commands</button>
          <Link href="/book?service=launch" onClick={handleNavClick} className="button button--primary site-header__drawer-book">Book a session →</Link>
        </div>
      )}
    </header>
  )
}
