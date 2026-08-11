export default function Terms() {
  return (
    <article>
      <h1 className="page-title">Terms of Service</h1>
      <p className="page-intro">The rules governing independent consulting sessions. Last updated August 10, 2026.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>1. Scope of Work</h3>
        <p style={{ color: 'var(--muted)' }}>
          Hands-on technical consulting for Hermes Agent configuration, local tool calling, credential security setup, and scheduled automation workflows.
          Each session delivers the scope described on the service you booked — a defined deliverable, not an ongoing support contract.
          Follow-up and support windows are as stated on the service page and expire when stated.
        </p>

        <h3 style={{ marginTop: 24 }}>2. Payment &amp; Booking</h3>
        <p style={{ color: 'var(--muted)' }}>
          Payment is processed securely via Stripe at time of booking. Your session time is reserved when payment succeeds.
          Cancellation and rescheduling follow the <a href="/legal/refund" style={{ color: 'var(--accent, inherit)' }}>Refund &amp; Cancellation Policy</a>.
        </p>

        <h3 style={{ marginTop: 24 }}>3. Client Responsibilities</h3>
        <p style={{ color: 'var(--muted)' }}>
          You agree to provide accurate information needed to deliver the session and to have any software, accounts, or access
          ready before the session starts. Do not submit secrets, tokens, passwords, or private keys through this site, forms, or email.
          You are responsible for the security of any credentials you share during a session and for revoking them afterward.
        </p>

        <h3 style={{ marginTop: 24 }}>4. Confidentiality</h3>
        <p style={{ color: 'var(--muted)' }}>
          Tony will keep the specific business details and technical information you share during a session confidential and will not
          disclose them to third parties except as needed to deliver the session or as required by law. This obligation survives the session.
          General knowledge, methods, and techniques learned during a session are not confidential.
        </p>

        <h3 style={{ marginTop: 24 }}>5. Intellectual Property</h3>
        <p style={{ color: 'var(--muted)' }}>
          You receive a non-exclusive, non-transferable license to use the workflows, configurations, and materials specifically created
          for your session, for your own business use. Tony retains all rights to his methods, templates, processes, and general knowledge,
          and may reuse them for other clients. Open-source software remains under its own license.
        </p>

        <h3 style={{ marginTop: 24 }}>6. No Guarantee of Outcomes</h3>
        <p style={{ color: 'var(--muted)' }}>
          Consulting services are provided on a best-efforts basis. Tony does not guarantee specific results, performance, uptime, or
          outcomes. Software and AI tooling change frequently; configuration that works at the time of your session may be affected by
          future updates outside Tony&apos;s control.
        </p>

        <h3 style={{ marginTop: 24 }}>7. Limitation of Liability</h3>
        <p style={{ color: 'var(--muted)' }}>
          To the maximum extent permitted by law, Tony&apos;s total liability for any claim arising from a session is limited to the amount
          you paid for that session. Tony is not liable for indirect, incidental, consequential, or special damages, including lost profits,
          lost data, or business interruption. Nothing in these terms limits liability that cannot be limited by law.
        </p>

        <h3 style={{ marginTop: 24 }}>8. Acceptance &amp; Electronic Record</h3>
        <p style={{ color: 'var(--muted)' }}>
          By checking the acceptance box at booking, you agree to these terms. Your acceptance is an electronic signature under the
          Iowa Uniform Electronic Transactions Act (Iowa Code Chapter 554D) and the federal E-Sign Act, and is recorded with the
          date, time, and version of these terms. You may save or print these terms at any time.
        </p>

        <h3 style={{ marginTop: 24 }}>9. Governing Law</h3>
        <p style={{ color: 'var(--muted)' }}>
          These terms are governed by the laws of the State of Iowa, without regard to conflict-of-law rules. Disputes are subject to the
          exclusive jurisdiction of the state and federal courts located in Iowa.
        </p>

        <h3 style={{ marginTop: 24 }}>10. Independent Service</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          This service is independently operated by Tony Simons and is not affiliated with, endorsed by, or operated by Nous Research
          or Hermes Agent core maintainers.
        </p>
      </div>
    </article>
  )
}
