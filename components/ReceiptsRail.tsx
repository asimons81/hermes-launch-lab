'use client'

import { useEffect, useState } from 'react'

/**
 * ILLUSTRATIVE DEMO FEED — not live telemetry. Events are generic
 * examples of what Hermes activity receipts look like; every command
 * referenced is a real Hermes v0.20.0 command.
 */
const receipts = [
  { time: '14:32', type: 'skill', text: 'hermes skills list · catalog verified', status: 'ok' },
  { time: '14:28', type: 'cron', text: 'hermes cron create "every 2h" · job scheduled', status: 'ok' },
  { time: '14:15', type: 'workflow', text: 'hermes doctor · diagnostics passed', status: 'ok' },
  { time: '14:02', type: 'security', text: 'hermes secrets bitwarden status · token valid', status: 'ok' },
  { time: '13:47', type: 'skill', text: 'hermes skills install openai/skills/k8s · scanned', status: 'ok' },
  { time: '13:30', type: 'cron', text: 'hermes cron list · jobs reviewed', status: 'ok' },
  { time: '13:12', type: 'workflow', text: 'hermes verify · build/test/start recipe checked', status: 'ok' },
  { time: '12:58', type: 'security', text: 'hermes egress status · proxy mappings listed', status: 'ok' },
]

export function ReceiptsRail() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % receipts.length)
    }, 3800)

    return () => clearInterval(interval)
  }, [])

  // One sample at a time keeps the illustrative rail legible at every width.
  const visibleCount = 1
  const visibleReceipts = Array.from({ length: visibleCount }, (_, i) =>
    receipts[(activeIndex + i) % receipts.length]
  )

  return (
    <div className="receipts-rail" aria-label="Demo Hermes activity feed (illustrative)">
      <div className="receipts-rail__label">
        <span className="receipts-rail__pulse" />
        <span>DEMO ACTIVITY (ILLUSTRATIVE)</span>
      </div>
      <div className="receipts-rail__items">
        {visibleReceipts.map((r, i) => (
          <div key={`${r.time}-${i}`} className={`receipt ${i === 0 ? 'receipt--active' : ''}`}>
            <span className="receipt__time">{r.time}</span>
            <span className={`receipt__type receipt__type--${r.type}`}>{r.type.toUpperCase()}</span>
            <span className="receipt__text">{r.text}</span>
            <span className="receipt__status">✓</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '8px 0 0', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
        Illustrative sample — not live activity.
      </p>
    </div>
  )
}
