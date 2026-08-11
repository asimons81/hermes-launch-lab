'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface NavCommand {
  id: string
  title: string
  category: 'Navigation' | 'Docs' | 'Booking'
  shortcut?: string
  url: string
}

const COMMANDS: NavCommand[] = [
  { id: 'home', title: 'Home / Terminal Cockpit', category: 'Navigation', url: '/' },
  { id: 'features', title: 'Features & System Architecture', category: 'Navigation', url: '/features' },
  { id: 'pricing', title: 'Pricing & Service Paths', category: 'Navigation', url: '/pricing' },
  { id: 'status', title: 'System Status & Telemetry', category: 'Navigation', url: '/status' },
  { id: 'docs-index', title: 'Documentation Hub', category: 'Docs', url: '/docs' },
  { id: 'docs-quickstart', title: 'Docs: Quickstart Guide', category: 'Docs', url: '/docs/quickstart' },
  { id: 'docs-skills', title: 'Docs: Skills Catalog & Persistence', category: 'Docs', url: '/docs/skills' },
  { id: 'docs-vault', title: 'Docs: Vault Credential Security', category: 'Docs', url: '/docs/vault' },
  { id: 'docs-cron', title: 'Docs: Autonomous Cron Loops', category: 'Docs', url: '/docs/cron' },
  { id: 'book', title: 'Book a Live Session (Stripe)', category: 'Booking', shortcut: '⌘B', url: '/book' },
  { id: 'intake', title: 'Pre-Session Intake Form', category: 'Booking', url: '/intake' },
]

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Filter commands
  const filtered = COMMANDS.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K, Ctrl+K or '/'
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      } else if (e.key === '/' && !isOpen) {
        const activeTag = document.activeElement?.tagName
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault()
          setIsOpen(true)
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null
      setSelectedIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setQuery('')
      // Restore focus to the trigger that opened the palette
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
      triggerRef.current = null
    }
  }, [isOpen])

  const handleSelect = (url: string) => {
    setIsOpen(false)
    router.push(url)
  }

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault()
      handleSelect(filtered[selectedIndex].url)
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="pane"
        style={{
          width: '100%',
          maxWidth: 600,
          background: 'var(--bg)',
          border: '1px solid var(--gold)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="pane__titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="pane__title">COMMAND PALETTE — ZSH</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>ESC TO CLOSE</span>
        </div>

        <div className="pane__body" style={{ padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(213,174,100,0.2)', paddingBottom: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--mono)', color: 'var(--gold)', fontSize: 14 }}>$</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or jump to page..."
              aria-label="Search commands"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDownInInput}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--mono)',
                fontSize: 14,
                color: 'var(--fg)',
              }}
            />
          </div>

          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--mono)' }}>
                No matching terminal commands.
              </div>
            ) : (
              filtered.map((cmd, i) => {
                const isSelected = i === selectedIndex
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => handleSelect(cmd.url)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? 'rgba(213,174,100,0.15)' : 'transparent',
                      borderLeft: isSelected ? '2px solid var(--gold)' : '2px solid transparent',
                      borderTop: 'none',
                      borderRight: 'none',
                      borderBottom: 'none',
                      cursor: 'pointer',
                      borderRadius: 2,
                      textAlign: 'left',
                      color: 'inherit',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: isSelected ? 'var(--gold)' : 'var(--fg)' }}>
                        {cmd.title}
                      </div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                        {cmd.category} · {cmd.url}
                      </div>
                    </div>
                    {cmd.shortcut && (
                      <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', border: '1px solid rgba(213,174,100,0.3)', padding: '2px 6px' }}>
                        {cmd.shortcut}
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
