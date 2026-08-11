import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulting Agreement',
  description:
    'Additional terms for Custom Hermes Build sessions, incorporating the Terms of Service.',
  alternates: { canonical: '/legal/agreement' },
}

export default function Agreement() {
  return (
    <article>
      <h1 className="page-title">Consulting Agreement</h1>
      <p className="page-intro">Additional terms for Custom Hermes Build sessions. These incorporate the Terms of Service. Last updated August 10, 2026.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>1. Defined Deliverables</h3>
        <p style={{ color: 'var(--muted)' }}>
          The deliverables for a Custom Build are the specific workflow, configuration, integrations, or automations agreed in writing
          (including via the intake form) before the session. Anything not listed there is out of scope and available as a follow-up session.
          A written summary of deliverables is provided before work begins.
        </p>

        <h3 style={{ marginTop: 24 }}>2. Scheduling &amp; Completion</h3>
        <p style={{ color: 'var(--muted)' }}>
          Sessions are delivered on the booked date and time. The 7-day follow-up window begins at session completion and covers
          reasonable questions about the delivered configuration. Substantial new work during the follow-up window is billed as a new session.
        </p>

        <h3 style={{ marginTop: 24 }}>3. Access &amp; Security</h3>
        <p style={{ color: 'var(--muted)' }}>
          You grant access only to systems needed for the deliverables. Tony may access your machine or VPS only with your explicit consent
          during the session. You should revoke or rotate any credentials shared after the session. Tony accepts no responsibility for
          data loss arising from actions you authorize during the session.
        </p>

        <h3 style={{ marginTop: 24 }}>4. Intellectual Property</h3>
        <p style={{ color: 'var(--muted)' }}>
          On full payment, you receive a non-exclusive, perpetual license to use the deliverables for your business. Tony retains ownership
          of his underlying methods, templates, and reusable components. Deliverables incorporating third-party or open-source software
          remain subject to that software&apos;s licenses.
        </p>

        <h3 style={{ marginTop: 24 }}>5. Confidentiality</h3>
        <p style={{ color: 'var(--muted)' }}>
          Confidential information includes your business data, credentials, system architecture, and proprietary workflows disclosed during
          the engagement. Tony will not disclose it except as needed to deliver the engagement or as required by law. This obligation
          survives termination of the engagement.
        </p>

        <h3 style={{ marginTop: 24 }}>6. Liability &amp; Warranties</h3>
        <p style={{ color: 'var(--muted)' }}>
          Services are provided &ldquo;as is&rdquo; without warranty of any kind. To the maximum extent permitted by law, total liability is limited to
          the fees paid for this engagement, and Tony is not liable for indirect, incidental, consequential, or special damages (including
          lost profits or data). Nothing limits liability that cannot be limited by law.
        </p>

        <h3 style={{ marginTop: 24 }}>7. Termination</h3>
        <p style={{ color: 'var(--muted)' }}>
          Either party may terminate with written notice if the other materially breaches this agreement and fails to cure within 7 days.
          On termination, you pay for work completed through the termination date, and confidentiality obligations survive.
        </p>

        <h3 style={{ marginTop: 24 }}>8. Entire Agreement &amp; Governing Law</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          This agreement, together with the Terms of Service, the Refund &amp; Cancellation Policy, and the Privacy Policy, is the entire
          agreement between the parties. It is governed by Iowa law, with exclusive jurisdiction in Iowa state and federal courts.
          Electronic acceptance is binding under Iowa Code Chapter 554D and the federal E-Sign Act.
        </p>
      </div>
    </article>
  )
}
