'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BrandMark } from './BrandMark'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <BrandMark />

        {/* Desktop navigation */}
        <nav className="site-nav hidden md:flex" aria-label="Primary navigation">
          <a
            href="https://tonysimons.dev"
            className="mono-label-pill"
          >
            ← STUDIO PORTFOLIO
          </a>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/status">Status</Link>
          <Link href="/portal">Client portal</Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12, marginLeft: 16, flexShrink: 0 }}>
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
              padding: '5px 10px',
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
            title="Open Command Palette (Ctrl+K or /)"
          >
            <span>Search</span>
            <kbd style={{ background: 'rgba(255,42,53,0.12)', color: 'var(--red-accent)', padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>/</kbd>
          </button>
          <Link href="/book" className="button button--primary" style={{ whiteSpace: 'nowrap', flexShrink: 0, padding: '6px 14px', fontSize: 12, minHeight: 34 }}>
            Book a session <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            color: "var(--foreground)",
            marginLeft: "auto",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            {menuOpen ? (
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <>
                <line x1="3" y1="7" x2="17" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown drawer */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "rgba(2, 2, 3, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
            padding: "24px 24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <a
            href="https://tonysimons.dev"
            onClick={handleNavClick}
            className="mono-label-pill"
            style={{ alignSelf: "flex-start" }}
          >
            ← STUDIO PORTFOLIO
          </a>
          <Link href="/features" onClick={handleNavClick} style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)", textDecoration: "none" }}>Features</Link>
          <Link href="/pricing" onClick={handleNavClick} style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)", textDecoration: "none" }}>Pricing</Link>
          <Link href="/docs" onClick={handleNavClick} style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)", textDecoration: "none" }}>Docs</Link>
          <Link href="/status" onClick={handleNavClick} style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)", textDecoration: "none" }}>Status</Link>
          <Link href="/portal" onClick={handleNavClick} style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--bone)", textDecoration: "none" }}>Client portal</Link>
          <Link
            href="/book"
            onClick={handleNavClick}
            className="button button--primary"
            style={{ marginTop: 8, textAlign: "center", justifyContent: "center", minHeight: 36 }}
          >
            Book a session →
          </Link>
        </div>
      )}
    </header>
  )
}
