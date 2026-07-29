'use client'

import { useEffect, useState, useRef } from 'react'

const sessionScript = [
  { type: 'cmd', text: 'hermes setup' },
  { type: 'system', text: 'Detecting environment... Linux 7.1.3 (x86_64)' },
  { type: 'system', text: 'Installing Hermes Agent v0.19.0... ✓' },
  { type: 'system', text: 'Loading skill catalog... 55 skills indexed ✓' },
  { type: 'cmd', text: 'hermes skill load hermes-vault' },
  { type: 'system', text: 'Vault initialized. Policy: brokered, lease-based.' },
  { type: 'system', text: 'Credential leases: 0 active, 3 available.' },
  { type: 'cmd', text: 'hermes cron create "Daily content radar"' },
  { type: 'system', text: 'Schedule: every 2h · Deliver: telegram' },
  { type: 'system', text: 'First run queued. ✓' },
  { type: 'cmd', text: 'hermes workflow test "booking-pipeline"' },
  { type: 'system', text: 'Stripe webhook... ✓ verified' },
  { type: 'system', text: 'Email relay... ✓ confirmed' },
  { type: 'system', text: 'Prisma connection... ✓ alive' },
  { type: 'result', text: '✓ Workflow tested. Session complete.' },
]

const interactiveCommands: Record<string, { type: 'cmd' | 'system' | 'result'; text: string }[]> = {
  'hermes skills': [
    { type: 'cmd', text: 'hermes skills' },
    { type: 'system', text: 'Active Memory Engine: SQLite + Vector Index' },
    { type: 'system', text: '┌──────────────────────┬─────────────┬─────────────────┐' },
    { type: 'system', text: '│ Skill Name           │ Version     │ Status          │' },
    { type: 'system', text: '├──────────────────────┼─────────────┼─────────────────┤' },
    { type: 'system', text: '│ hermes-vault         │ v1.4.0      │ READY           │' },
    { type: 'system', text: '│ github-pr-workflow   │ v2.1.2      │ ACTIVE          │' },
    { type: 'system', text: '│ content-radar        │ v0.9.5      │ CRON QUEUED     │' },
    { type: 'system', text: '│ deal-hunter          │ v1.1.0      │ READY           │' },
    { type: 'system', text: '└──────────────────────┴─────────────┴─────────────────┘' },
    { type: 'result', text: '✓ 55 total skills available in local catalog.' },
  ],
  'hermes vault status': [
    { type: 'cmd', text: 'hermes vault status' },
    { type: 'system', text: 'Vault Security Broker: BROKERED LEASE ENGINE' },
    { type: 'system', text: '→ Storage: Local encrypted keyring (ChaCha20-Poly1305)' },
    { type: 'system', text: '→ Active Leases: 0 (No active background leases)' },
    { type: 'system', text: '→ Rate Limit: 100 req/min per key' },
    { type: 'system', text: '→ Policy Gating: Enabled (No raw keys emitted to logs)' },
    { type: 'result', text: '✓ Vault isolation verified. Secrets remain local.' },
  ],
  'hermes workflow test': [
    { type: 'cmd', text: 'hermes workflow test "launch-lab"' },
    { type: 'system', text: 'Testing integration endpoints...' },
    { type: 'system', text: '→ Health API (/api/health)... 200 OK (14ms)' },
    { type: 'system', text: '→ Stripe webhook secret... Configured ✓' },
    { type: 'system', text: '→ Resend email engine... Verified ✓' },
    { type: 'system', text: '→ Prisma PostgreSQL pool... Connected (2ms)' },
    { type: 'result', text: '✓ All systems operational. 0 errors detected.' },
  ],
  'hermes benchmark': [
    { type: 'cmd', text: 'hermes benchmark' },
    { type: 'system', text: 'Benchmarking Hermes local agent throughput...' },
    { type: 'system', text: '→ Local LLM Context Window: 128,000 tokens' },
    { type: 'system', text: '→ Tool Call Latency: 42ms' },
    { type: 'system', text: '→ SQLite Vector Search: 1.2ms' },
    { type: 'result', text: '✓ Fleet ready for production workloads.' },
  ],
}

export function LiveTerminal() {
  const [mode, setMode] = useState<'auto' | 'interactive'>('auto')
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [currentChar, setCurrentChar] = useState<number>(0)
  const [phase, setPhase] = useState<'typing' | 'hold' | 'clear'>('typing')
  const [interactiveLog, setInteractiveLog] = useState<{ type: 'cmd' | 'system' | 'result'; text: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-play loop effect
  useEffect(() => {
    if (mode !== 'auto') return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setVisibleLines(sessionScript.length)
      setCurrentChar(999)
      return
    }

    let timeout: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      const line = sessionScript[visibleLines]
      if (!line) {
        timeout = setTimeout(() => setPhase('hold'), 800)
      } else if (currentChar < line.text.length) {
        timeout = setTimeout(() => setCurrentChar(c => c + 1), 28)
      } else {
        timeout = setTimeout(() => {
          setVisibleLines(l => l + 1)
          setCurrentChar(0)
        }, line.type === 'cmd' ? 500 : 180)
      }
    } else if (phase === 'hold') {
      timeout = setTimeout(() => setPhase('clear'), 3500)
    } else if (phase === 'clear') {
      setVisibleLines(0)
      setCurrentChar(0)
      setPhase('typing')
    }

    return () => clearTimeout(timeout)
  }, [visibleLines, currentChar, phase, mode])

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleLines, currentChar, interactiveLog, mode])

  const runCommand = (cmdKey: string) => {
    const lines = interactiveCommands[cmdKey]
    if (lines) {
      setMode('interactive')
      setInteractiveLog(prev => [...prev, ...lines])
    }
  }

  const resetTerminal = () => {
    setInteractiveLog([])
    setMode('auto')
    setVisibleLines(0)
    setCurrentChar(0)
    setPhase('typing')
  }

  return (
    <div className="terminal" aria-label="Live simulated Hermes Agent session">
      <div className="terminal__titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="terminal__dots">
            <span className="terminal__dot terminal__dot--red" />
            <span className="terminal__dot terminal__dot--amber" />
            <span className="terminal__dot terminal__dot--green" />
          </span>
          <span className="terminal__title" style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            {mode === 'auto' ? 'hermes-session — auto-demo' : 'hermes-interactive — sandbox'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, fontSize: 11, fontFamily: 'var(--mono)' }}>
          <button
            onClick={() => setMode('auto')}
            style={{
              background: mode === 'auto' ? 'var(--gold-dim)' : 'transparent',
              border: '1px solid var(--line)',
              color: mode === 'auto' ? 'var(--gold)' : 'var(--muted)',
              padding: '2px 8px',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            AUTO
          </button>
          <button
            onClick={() => {
              if (mode === 'auto') {
                setMode('interactive')
                setInteractiveLog(interactiveCommands['hermes skills'])
              }
            }}
            style={{
              background: mode === 'interactive' ? 'var(--gold-dim)' : 'transparent',
              border: '1px solid var(--line)',
              color: mode === 'interactive' ? 'var(--gold)' : 'var(--muted)',
              padding: '2px 8px',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            INTERACTIVE
          </button>
        </div>
      </div>

      <div className="terminal__body" ref={scrollRef} style={{ minHeight: 280, maxHeight: 320, overflowY: 'auto' }}>
        {mode === 'auto' ? (
          sessionScript.slice(0, visibleLines + 1).map((line, i) => {
            const isCurrent = i === visibleLines
            const text = isCurrent ? line.text.slice(0, currentChar) : line.text
            const showCursor = isCurrent && currentChar < line.text.length
            const prefix = line.type === 'cmd' ? '$ ' : line.type === 'result' ? '' : '→ '
            return (
              <div key={i} className={`terminal__line terminal__line--${line.type}`}>
                <span className="terminal__prefix">{prefix}</span>
                <span>{text}</span>
                {showCursor && <span className="terminal__cursor">█</span>}
              </div>
            )
          })
        ) : (
          <>
            <div className="terminal__line terminal__line--system" style={{ color: 'var(--gold)', marginBottom: 8 }}>
              # INTERACTIVE SANDBOX — Click preset commands below to execute live
            </div>
            {interactiveLog.map((line, i) => {
              const prefix = line.type === 'cmd' ? '$ ' : line.type === 'result' ? '' : '→ '
              return (
                <div key={i} className={`terminal__line terminal__line--${line.type}`}>
                  <span className="terminal__prefix">{prefix}</span>
                  <span>{line.text}</span>
                </div>
              )
            })}
            <div className="terminal__line terminal__line--idle" style={{ marginTop: 8 }}>
              <span className="terminal__prefix">$ </span>
              <span className="terminal__cursor">█</span>
            </div>
          </>
        )}
      </div>

      {/* Preset interactive controls */}
      <div
        className="terminal__controls"
        style={{
          borderTop: '1px solid var(--line)',
          padding: '8px 12px',
          background: '#14171D',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', marginRight: 4 }}>
          COMMANDS:
        </span>
        {Object.keys(interactiveCommands).map(cmd => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              padding: '3px 8px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              cursor: 'pointer',
              borderRadius: 2,
              transition: 'border-color 0.15s ease',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--line)')}
          >
            $ {cmd}
          </button>
        ))}
        {mode === 'interactive' && (
          <button
            onClick={resetTerminal}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              padding: '3px 8px',
              background: 'transparent',
              border: '1px dashed var(--line)',
              color: 'var(--muted)',
              cursor: 'pointer',
              marginLeft: 'auto',
              borderRadius: 2,
            }}
          >
            Clear / Reset
          </button>
        )}
      </div>
    </div>
  )
}
