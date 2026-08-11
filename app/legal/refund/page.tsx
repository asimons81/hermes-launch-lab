import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'Clear rules for rescheduling, credits, and session changes.',
  alternates: { canonical: '/legal/refund' },
}

export default function Refund() {
  return (
    <article>
      <h1 className="page-title">Refund &amp; Cancellation Policy</h1>
      <p className="page-intro">Clear rules for rescheduling, credits, and session changes.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Cancellation &amp; Rescheduling</h3>
        <p style={{ color: 'var(--muted)' }}>
          24+ hours notice: Full credit or reschedule. Less than 24 hours: Session forfeited.
        </p>

        <h3 style={{ marginTop: 24 }}>Refunds</h3>
        <p style={{ color: 'var(--muted)' }}>
          Full refunds are issued if Tony cannot fulfill the booked session. Processed within 5 business days to the original payment method via Stripe.
        </p>

        <h3 style={{ marginTop: 24 }}>Reschedule Limit</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          One free reschedule per booking with 24h advance notice.
        </p>
      </div>
    </article>
  )
}
