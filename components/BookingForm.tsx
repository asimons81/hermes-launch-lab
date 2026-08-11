'use client'

import { useEffect, useState } from 'react'

type Service = { id: string; name: string; price: number; slug?: string }
type Day = { date: string; label: string }

export default function BookingForm({ services, initialService }: { services: Service[]; initialService: string }) {
  // initialService may be a slug (e.g. ?service=launch) — resolve to a real service id.
  const resolvedInitial = services.find(s => s.slug === initialService)?.id
    ?? services.find(s => s.id === initialService)?.id
    ?? services[0]?.id
    ?? ''
  const [serviceId, setServiceId] = useState(resolvedInitial)
  const [days, setDays] = useState<Day[]>([])
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<{ iso: string; label: string }[]>([])
  const [selected, setSelected] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/availability').then(r => r.json()).then(d => { setDays(d.days || []); if (d.days?.length) setDate(d.days[0].date) }).catch(() => setError('Could not load dates.'))
  }, [])

  useEffect(() => {
    if (!date || !serviceId) { setSlots([]); return }
    setLoading(true); setSelected('')
    fetch(`/api/availability?date=${date}&serviceId=${serviceId}`).then(r => r.json()).then(d => {
      setSlots(d.slots || [])
      if (d.error) setError(d.error)
    }).catch(() => setError('Could not load slots.')).finally(() => setLoading(false))
  }, [date, serviceId])

  return (
    <form action="/api/bookings" method="post" className="card form-grid" style={{ marginTop: 36 }}>
      <div>
        <label htmlFor="serviceId">Service</label>
        <select id="serviceId" name="serviceId" value={serviceId} onChange={e => setServiceId(e.target.value)}>
          {services.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date (Central Time)</label>
        <select id="date" name="date" value={date} onChange={e => setDate(e.target.value)}>
          {days.map(d => <option key={d.date} value={d.date}>{d.label}</option>)}
        </select>
      </div>
      <div className="field--wide">
        <label>Available times</label>
        {loading ? <p className="notice">Loading…</p> : slots.length === 0
          ? <p className="notice">No available sessions that day. Try another date.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {slots.map(s => (
                <button key={s.iso} type="button" onClick={() => setSelected(s.iso)}
                  className={`button ${selected === s.iso ? 'button--primary' : ''}`}
                  style={{ marginTop: 0 }}>{s.label}</button>
              ))}
            </div>}
        {error && <p className="notice" style={{ color: 'var(--red-accent, #ff2020)' }}>{error}</p>}
      </div>
      <input type="hidden" name="startTime" value={selected} />
      <input type="hidden" name="acceptedTerms" value={accepted ? 'yes' : ''} />
      <div className="field--wide">
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" name="accept" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 4 }} />
          <span style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
            I agree to the <a href="/legal/terms" target="_blank" style={{ textDecoration: 'underline' }}>Terms of Service</a>, the{' '}
            <a href="/legal/agreement" target="_blank" style={{ textDecoration: 'underline' }}>Consulting Agreement</a>, and the{' '}
            <a href="/legal/privacy" target="_blank" style={{ textDecoration: 'underline' }}>Privacy Policy</a>. This acceptance is an
            electronic signature and is recorded with this booking.
          </span>
        </label>
      </div>
      <div className="field--wide">
        <button type="submit" className="button button--primary" disabled={!selected || !accepted}>
          Continue to checkout <span>↗</span>
        </button>
      </div>
      <p className="notice" style={{ marginTop: 18 }}>All times shown in Central Time (CST/CDT). Do not submit secrets, tokens, or passwords.</p>
    </form>
  )
}
