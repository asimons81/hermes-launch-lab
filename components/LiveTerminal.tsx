'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * SIMULATED DEMO terminal. Every command shown is a real Hermes v0.20.0
 * command; the output lines are illustrative placeholders, not real
 * program output. The component is labeled as a simulation in the UI.
 */
const sessionScript = [
  { type: 'cmd', text: 'hermes setup --portal' },
  { type: 'system', text: 'Launching interactive setup wizard (simulated)' },
  { type: 'system', text: 'Nous Portal OAuth + Tool Gateway configuration' },
  { type: 'cmd', text: 'hermes skills list' },
  { type: 'system', text: 'Installed skills shown in a table (simulated)' },
  { type: 'cmd', text: 'hermes cron create "every 2h" "Check server status"' },
  { type: 'system', text: 'Scheduled job created (simulated)' },
  { type: 'cmd', text: 'hermes doctor' },
  { type: 'system', text: 'Static checks: config, dependencies, auth (simulated)' },
  { type: 'result', text: '✓ Demo complete — run these commands on your own machine.' },
]

const interactiveCommands: Record<string, { type: 'cmd' | 'system' | 'result'; text: string }[]> = {
  'hermes skills list': [
    { type: 'cmd', text: 'hermes skills list' },
    { type: 'system', text: 'Installed skills are listed here (simulated demo output)' },
    { type: 'result', text: '✓ Real command — try it in your own terminal.' },
  ],
  'hermes doctor': [
    { type: 'cmd', text: 'hermes doctor' },
    { type: 'system', text: 'Runs static diagnostics for your Hermes install (simulated)' },
    { type: 'result', text: '✓ Real command — try it in your own terminal.' },
  ],
  'hermes cron list': [
    { type: 'cmd', text: 'hermes cron list' },
    { type: 'system', text: 'Shows your scheduled jobs (simulated demo output)' },
    { type: 'result', text: '✓ Real command — try it in your own terminal.' },
  ],
  'hermes status': [
    { type: 'cmd', text: 'hermes status' },
    { type: 'system', text: 'Shows provider keys and component status (simulated demo output)' },
    { type: 'result', text: '✓ Real command — try it in your own terminal.' },
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
    <div className="terminal" aria-label="Simulated Hermes Agent demo session">
      <div className="terminal__titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="terminal__dots">
            <span className="terminal__dot terminal__dot--red" />
            <span className="terminal__dot terminal__dot--amber" />
            <span className="terminal__dot terminal__dot--green" />
          </span>
          <span className="terminal__title" style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            {mode === 'auto' ? 'hermes-session — auto-demo (simulated)' : 'hermes-interactive — sandbox (simulated)'}
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
                setInteractiveLog(interactiveCommands['hermes skills list'])
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
              # INTERACTIVE DEMO — Click preset commands below to see simulated output
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
