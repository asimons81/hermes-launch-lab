export default function Terms() {
  return (
    <article>
      <h1 className="page-title">Terms of Service</h1>
      <p className="page-intro">The rules governing independent consulting sessions.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Scope of Work</h3>
        <p style={{ color: 'var(--muted)' }}>
          Hands-on technical consulting for Hermes Agent configuration, local tool calling, vault setup, and scheduled automation workflows.
        </p>

        <h3 style={{ marginTop: 24 }}>Payment &amp; Booking</h3>
        <p style={{ color: 'var(--muted)' }}>
          Payment is processed securely via Stripe at time of booking. Cancellation and reschedule terms follow the Refund Policy.
        </p>

        <h3 style={{ marginTop: 24 }}>Independent Service</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          This service is independently operated by Tony Simons and is not affiliated with, endorsed by, or operated by Nous Research or Hermes Agent core maintainers.
        </p>
      </div>
    </article>
  )
}
