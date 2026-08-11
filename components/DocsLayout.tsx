'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

interface DocsLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

const DOC_LINKS = [
  { href: '/docs', label: 'Documentation Index' },
  { href: '/docs/quickstart', label: '1. Quickstart Guide' },
  { href: '/docs/skills', label: '2. Skills Reference' },
  { href: '/docs/vault', label: '3. Vault & Security' },
  { href: '/docs/cron', label: '4. Autonomous Cron & Loops' },
]

export function DocsLayout({ title, subtitle, children }: DocsLayoutProps) {
  const pathname = usePathname()
  const [copiedText, setCopiedText] = useState<string | null>(null)

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div className="docs-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40, alignItems: 'start' }}>
          {/* Docs Navigation Sidebar */}
          <aside
            className="docs-layout__aside"
            style={{
              position: 'sticky',
              top: 80,
              background: 'var(--pane-bg)',
              border: '1px solid var(--pane-border)',
              padding: 16,
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 12 }}>DOCUMENTATION</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {DOC_LINKS.map(link => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 13,
                      padding: '8px 10px',
                      color: isActive ? 'var(--gold)' : 'var(--muted)',
                      background: isActive ? 'rgba(213,174,100,0.15)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                      textDecoration: 'none',
                      borderRadius: 2,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(242,240,233,0.1)' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                Need help installing or debugging?
              </p>
              <Link href="/book" className="text-link" style={{ fontSize: 12, marginTop: 8, display: 'inline-block' }}>
                Book a launch session ↗
              </Link>
            </div>
          </aside>

          {/* Docs Main Content */}
          <article>
            <p className="eyebrow">HERMES AGENT MANUAL</p>
            <h1 className="page-title" style={{ marginTop: 4, marginBottom: 12 }}>{title}</h1>
            <p className="page-intro" style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 32 }}>{subtitle}</p>

            <div className="docs-body" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {children}
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

export function CodeBlock({ code, title = 'Terminal' }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pane" style={{ margin: '16px 0' }}>
      <div className="pane__titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="pane__title">{title}</span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? 'var(--term-green)' : 'var(--gold)',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          {copied ? 'COPIED ✓' : 'COPY'}
        </button>
      </div>
      <div className="pane__body">
        <pre style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--term-green)', margin: 0, overflowX: 'auto' }}>
          {code}
        </pre>
      </div>
    </div>
  )
}

export function Callout({ type = 'note', children }: { type?: 'note' | 'security' | 'tip'; children: React.ReactNode }) {
  const colorMap = {
    note: 'var(--gold)',
    security: '#ff8888',
    tip: 'var(--term-green)',
  }
  const titleMap = {
    note: 'NOTE',
    security: 'SECURITY BOUNDARY',
    tip: 'PRO TIP',
  }

  return (
    <div
      style={{
        borderLeft: `3px solid ${colorMap[type]}`,
        background: 'rgba(17,18,16,0.8)',
        padding: '12px 16px',
        margin: '16px 0',
      }}
    >
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: colorMap[type], marginBottom: 4 }}>
        [{titleMap[type]}]
      </div>
      <div style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  )
}
