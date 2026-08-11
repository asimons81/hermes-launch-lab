'use client'

import { useState } from 'react'
import Link from 'next/link'

export function RoiCalculator() {
  const [weeklyHours, setWeeklyHours] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(100)

  // Calculations
  const hoursSavedPerWeek = Math.round(weeklyHours * 0.6) // 60% automation efficiency
  const hoursSavedPerMonth = hoursSavedPerWeek * 4
  const monthlySavings = hoursSavedPerMonth * hourlyRate
  const annualSavings = monthlySavings * 12

  let recommendedSlug = 'launch'
  let recommendedName = 'Launch Session ($299)'
  if (weeklyHours >= 15 || hourlyRate >= 150) {
    recommendedSlug = 'custom'
    recommendedName = 'Custom Hermes Build ($600+)'
  } else if (weeklyHours <= 5) {
    recommendedSlug = 'strategy'
    recommendedName = 'Strategy Session ($99)'
  }

  return (
    <div className="pane" style={{ marginTop: 40, border: '1px solid var(--gold)' }}>
      <div className="pane__titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="pane__title">HERMES ROI & TIME-SAVED ESTIMATOR</span>
        <span className="pane__status pane__status--live">● INTERACTIVE</span>
      </div>
      <div className="pane__body" style={{ padding: 24 }}>
        <div className="roi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--fg)', display: 'block', marginBottom: 8 }}>
                Repetitive hours spent per week: <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{weeklyHours} hrs/wk</span>
              </label>
              <input
                type="range"
                min={2}
                max={30}
                value={weeklyHours}
                onChange={e => setWeeklyHours(Number(e.target.value))}
                aria-label="Repetitive hours spent per week"
                style={{ width: '100%', accentColor: 'var(--gold)' }}
              />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                (Code reviews, PR releases, daily research, manual deploys, server checks)
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--fg)', display: 'block', marginBottom: 8 }}>
                Hourly rate / engineering value: <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>${hourlyRate}/hr</span>
              </label>
              <input
                type="range"
                min={40}
                max={250}
                step={10}
                value={hourlyRate}
                onChange={e => setHourlyRate(Number(e.target.value))}
                aria-label="Hourly rate or engineering value"
                style={{ width: '100%', accentColor: 'var(--gold)' }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(10,11,9,0.9)', padding: 20, border: '1px solid rgba(213,174,100,0.2)', borderRadius: 2 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>ESTIMATED ANNUAL VALUE CREATED</div>
            <div style={{ fontSize: 36, fontFamily: 'var(--mono)', color: 'var(--term-green)', margin: '4px 0 12px 0' }}>
              ${annualSavings.toLocaleString()} / yr
            </div>
            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--fg)', marginBottom: 16 }}>
              ~{hoursSavedPerMonth} hours saved every month ({hoursSavedPerWeek} hrs/wk)
            </div>

            <div style={{ borderTop: '1px solid rgba(242,240,233,0.1)', paddingTop: 12 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>RECOMMENDED PATH</div>
              <div style={{ fontSize: 14, fontFamily: 'var(--mono)', color: 'var(--gold)', fontWeight: 'bold', margin: '4px 0 12px 0' }}>
                {recommendedName}
              </div>
              <Link href={`/book?service=${recommendedSlug}`} className="button button--primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                Book Recommended Session ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
