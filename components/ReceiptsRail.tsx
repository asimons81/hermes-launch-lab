'use client'

import { useEffect, useState } from 'react'

const receipts = [
  { time: '14:32', type: 'skill', text: 'hermes-vault loaded · policy verified', status: 'ok' },
  { time: '14:28', type: 'cron', text: 'content-radar deployed · first run queued', status: 'ok' },
  { time: '14:15', type: 'workflow', text: 'booking-pipeline tested · Stripe webhook confirmed', status: 'ok' },
  { time: '14:02', type: 'vault', text: 'credential lease issued · provider: openrouter', status: 'ok' },
  { time: '13:47', type: 'skill', text: 'github-pr-workflow loaded · 12 steps indexed', status: 'ok' },
  { time: '13:30', type: 'cron', text: 'deal-hunter executed · 3 candidates found', status: 'ok' },
  { time: '13:12', type: 'workflow', text: 'intake-form tested · validation passed', status: 'ok' },
  { time: '12:58', type: 'vault', text: 'lease renewed · provider: anthropic', status: 'ok' },
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

  const visibleCount = 3
  const visibleReceipts = Array.from({ length: visibleCount }, (_, i) =>
    receipts[(activeIndex + i) % receipts.length]
  )

  return (
    <div className="receipts-rail" aria-label="Illustrative session activity sample">
      <div className="receipts-rail__label">
        <span className="receipts-rail__pulse" />
        <span>SAMPLE SESSION ACTIVITY</span>
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
