export default function Privacy() {
  return (
    <article>
      <h1 className="page-title">Privacy Policy</h1>
      <p className="page-intro">How we handle your information and technical metadata.</p>
      
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Data Collected</h3>
        <ul style={{ color: 'var(--muted)', paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Email, name, time zone for booking and communication.</li>
          <li>Technical environment details for service delivery (OS, Hermes version).</li>
          <li>Payment metadata via Stripe (no credit card details stored).</li>
          <li>Intake answers you choose to submit before a session (goals, blockers, comfort level).</li>
        </ul>

        <h3 style={{ marginTop: 24 }}>Service Providers</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          This site is hosted on Vercel, uses a Neon PostgreSQL database, processes payments through Stripe, and sends
          transactional email through Resend. Each provider processes only the data needed for its function.
        </p>

        <h3 style={{ marginTop: 24 }}>Retention</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Records retained 24 months after last engagement, then deleted or anonymized.
        </p>

        <h3 style={{ marginTop: 24 }}>Your Rights</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Request export or deletion anytime via the customer portal or by contacting Tony at{' '}
          <a href="mailto:tony@tonyreviewsthings.com" style={{ color: 'var(--accent, inherit)' }}>tony@tonyreviewsthings.com</a>.
        </p>
      </div>
    </article>
  )
}
