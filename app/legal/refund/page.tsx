import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Clear rules for refunds, rescheduling, lateness, and session changes.',
  alternates: { canonical: '/legal/refund' },
}

export default function Refund() {
  return (
    <article>
      <h1 className="page-title">Refund &amp; Cancellation Policy</h1>
      <p className="page-intro">Clear rules for refunds, rescheduling, lateness, and session changes. Last updated August 14, 2026.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Cancellation &amp; Rescheduling</h3>
        <p style={{ color: 'var(--muted)' }}>
          With at least 24 hours notice, choose either one reschedule or a refund to the original payment method. With less than 24 hours
          notice, the session is forfeited unless Tony chooses otherwise because of exceptional circumstances.
        </p>

        <h3 style={{ marginTop: 24 }}>Refunds</h3>
        <p style={{ color: 'var(--muted)' }}>
          Full refunds are issued if Tony cannot fulfill the booked session or a technical failure prevents meaningful delivery. Approved
          refunds are submitted to the original payment method through Stripe within 5 business days; the bank may take additional time to post them.
        </p>

        <h3 style={{ marginTop: 24 }}>Reschedule Limit</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          One free reschedule per booking with 24h advance notice.
        </p>

        <h3 style={{ marginTop: 24 }}>Lateness &amp; No-Shows</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          A 15-minute grace period applies. A late arrival receives only the remaining booked time and does not extend the scheduled end.
          After 15 minutes without contact, the booking is treated as a forfeited no-show.
        </p>
      </div>
    </article>
  )
}
