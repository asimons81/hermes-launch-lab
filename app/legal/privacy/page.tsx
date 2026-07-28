export default function Privacy() {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p style={{color:'var(--color-ink-muted)'}}>Draft — requires legal review.</p>
      <h3 style={{marginTop:'var(--space-6)'}}>Data collected</h3>
      <ul>
        <li>Email, name, time zone for booking and communication</li>
        <li>Technical environment details for service delivery</li>
        <li>Payment metadata via Stripe (no card details stored)</li>
      </ul>
      <h3>Retention</h3>
      <p>Records retained 24 months after last engagement, then deleted or anonymized.</p>
      <h3>Your rights</h3>
      <p>Request export or deletion via the customer portal or email.</p>
    </div>
  )
}
