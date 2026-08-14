'use client'

import { useEffect, useState } from 'react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

interface HealthMetrics {
  status: 'checking' | 'ok' | 'error'
  latencyMs: number | null
  timestamp: string
}

export default function StatusPage() {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    status: 'checking',
    latencyMs: null,
    timestamp: '',
  })
  const [isPinging, setIsPinging] = useState(false)

  const checkHealth = async () => {
    setIsPinging(true)
    const startTime = performance.now()
    try {
      const res = await fetch('/api/health')
      const endTime = performance.now()
      if (res.ok) {
        setMetrics({
          status: 'ok',
          latencyMs: Math.round(endTime - startTime),
          timestamp: new Date().toLocaleTimeString(),
        })
      } else {
        setMetrics(prev => ({ ...prev, status: 'error' }))
      }
    } catch {
      setMetrics(prev => ({ ...prev, status: 'error' }))
    } finally {
      setIsPinging(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  const healthOk = metrics.status === 'ok'
  const healthChecking = metrics.status === 'checking'

  // Only claims backed by the live /api/health probe (app + database round-trip).
  const verified = [
    { name: 'Health Endpoint (/api/health)', status: healthChecking ? 'Checking' : healthOk ? 'Operational' : 'Degraded', detail: healthChecking ? 'probe in progress' : healthOk ? (metrics.latencyMs !== null ? `${metrics.latencyMs}ms response` : 'responding') : 'not responding' },
    { name: 'Application & Database', status: healthChecking ? 'Checking' : healthOk ? 'Operational' : 'Degraded', detail: healthChecking ? 'probe in progress' : healthOk ? 'SELECT 1 via Prisma' : 'database check failing' },
  ]

  // Components this page does not probe. We state the boundary instead of guessing.
  const unmonitored = [
    { name: 'Stripe Checkout & Webhooks', detail: 'Not monitored from this page' },
    { name: 'Resend Transactional Email', detail: 'Not monitored from this page' },
    { name: 'Vercel Edge CDN / SSL', detail: 'Not monitored from this page' },
  ]

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell page-shell--narrow" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p className="eyebrow">SYSTEM TELEMETRY</p>
            <h1 className="page-title" style={{ margin: 0 }}>Health check status.</h1>
          </div>
          <button
            type="button"
            onClick={checkHealth}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              padding: '6px 12px',
              background: 'rgba(213,174,100,0.15)',
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              cursor: 'pointer',
              borderRadius: 2,
            }}
          >
            {isPinging ? 'Pinging...' : 'Ping Live ↻'}
          </button>
        </div>

        <div className="pane" style={{ marginBottom: 32 }}>
          <div className="pane__titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="pane__title">HEALTH METRICS</span>
            <span className="pane__status pane__status--live">● {isPinging ? 'CHECKING' : 'LIVE POLL'}</span>
          </div>
          <div className="pane__body status-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center' }}>
            <div style={{ padding: 12, background: 'rgba(10,11,9,0.8)', border: '1px solid rgba(242,240,233,0.1)' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>LATENCY</div>
              <div style={{ fontSize: 24, fontFamily: 'var(--mono)', color: 'var(--term-green)', marginTop: 4 }}>
                {metrics.latencyMs !== null ? `${metrics.latencyMs}ms` : '—'}
              </div>
            </div>
            <div style={{ padding: 12, background: 'rgba(10,11,9,0.8)', border: '1px solid rgba(242,240,233,0.1)' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>STATUS</div>
              <div style={{ fontSize: 24, fontFamily: 'var(--mono)', color: healthOk ? 'var(--term-green)' : 'var(--red-accent)', marginTop: 4 }}>
                {healthChecking ? '—' : healthOk ? 'OK' : 'ERROR'}
              </div>
            </div>
            <div style={{ padding: 12, background: 'rgba(10,11,9,0.8)', border: '1px solid rgba(242,240,233,0.1)' }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>LAST CHECK</div>
              <div style={{ fontSize: 14, fontFamily: 'var(--mono)', color: 'var(--fg)', marginTop: 8 }}>
                {metrics.timestamp || '—'}
              </div>
            </div>
          </div>
        </div>

        <div className="pane">
          <div className="pane__titlebar">
            <span className="pane__title">COMPONENT STATUS</span>
          </div>
          <div className="pane__body" style={{ padding: 0 }}>
            {verified.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(242,240,233,0.08)',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>{item.name}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{item.detail}</div>
                </div>
                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: healthOk ? 'var(--term-green)' : 'var(--red-accent)' }}>
                  ● {item.status}
                </span>
              </div>
            ))}
            {unmonitored.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: i < unmonitored.length - 1 ? '1px solid rgba(242,240,233,0.08)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)' }}>{item.name}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{item.detail}</div>
                </div>
                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                  ○ Not monitored
                </span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 24, color: 'var(--muted)', fontSize: 13, textAlign: 'center', fontFamily: 'var(--mono)' }}>
          This page polls <code style={{ color: 'var(--gold)' }}>/api/health</code> every 10 seconds. That endpoint
          verifies the app and database respond. Stripe, Resend, and edge infrastructure are not probed here.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
