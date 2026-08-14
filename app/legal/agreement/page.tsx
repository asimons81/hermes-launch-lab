import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulting & Remote Access Agreement',
  description:
    'Scope, attended remote-access, credential, verification, and follow-up terms for Hermes Launch Lab sessions.',
  alternates: { canonical: '/legal/agreement' },
}

export default function Agreement() {
  return (
    <article>
      <h1 className="page-title">Consulting &amp; Remote Access Agreement</h1>
      <p className="page-intro">The operating boundaries for Strategy, Launch, and separately quoted Custom engagements. These incorporate the Terms of Service. Last updated August 14, 2026.</p>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>1. Defined Deliverables</h3>
        <p style={{ color: 'var(--muted)' }}>
          Strategy delivers a written action plan. Launch covers installation or repair, configuration, and one tested workflow within
          the booked session. Custom deliverables are defined and priced in a separate written scope before scheduling or payment.
          Anything not expressly included is out of scope.
        </p>

        <h3 style={{ marginTop: 24 }}>2. Scheduling &amp; Completion</h3>
        <p style={{ color: 'var(--muted)' }}>
          Sessions are delivered on the booked date and time. Late arrival does not extend the end time. After a 15-minute grace period,
          a client no-show is forfeited. Launch follow-up begins at session completion and provides one email thread for defects in the
          agreed configuration for seven calendar days. New features, expanded scope, provider outages, and third-party updates are excluded.
        </p>

        <h3 style={{ marginTop: 24 }}>3. Access &amp; Security</h3>
        <p style={{ color: 'var(--muted)' }}>
          Sessions use a private Google Meet link. If hands-on access is useful, you generate a fresh Chrome Remote Desktop support code,
          explicitly approve access, remain present, and may disconnect at any time. Tony will not install unattended remote access.
          Screen-share coaching is available instead. Before changes begin, the parties confirm the authorized systems, intended outcome,
          relevant backup state, and scope. Tony may stop work that cannot be performed safely.
        </p>

        <h3 style={{ marginTop: 24 }}>4. Credentials &amp; Recording</h3>
        <p style={{ color: 'var(--muted)' }}>
          You enter passwords, MFA codes, API keys, and other secrets yourself. Do not submit credentials through the site, intake,
          application, or email. Sessions are not audio- or video-recorded. At handoff, remote access is disconnected and Tony identifies
          temporary access or credentials you should revoke or rotate.
        </p>

        <h3 style={{ marginTop: 24 }}>5. Intellectual Property</h3>
        <p style={{ color: 'var(--muted)' }}>
          On full payment, you own client-specific code, configurations, documentation, and other bespoke deliverables created for the
          engagement. Tony retains pre-existing tools, reusable templates and components, methods, processes, and general knowledge.
          Third-party and open-source materials remain subject to their own licenses.
        </p>

        <h3 style={{ marginTop: 24 }}>6. Confidentiality</h3>
        <p style={{ color: 'var(--muted)' }}>
          Confidential information includes your business data, credentials, system architecture, and proprietary workflows disclosed during
          the engagement. Tony will not disclose it except as needed to deliver the engagement or as required by law. This obligation
          survives termination of the engagement.
        </p>

        <h3 style={{ marginTop: 24 }}>7. Liability &amp; Warranties</h3>
        <p style={{ color: 'var(--muted)' }}>
          Services are provided &ldquo;as is&rdquo; without warranty of any kind. To the maximum extent permitted by law, total liability is limited to
          the fees paid for this engagement, and Tony is not liable for indirect, incidental, consequential, or special damages (including
          lost profits or data). Nothing limits liability that cannot be limited by law.
        </p>

        <h3 style={{ marginTop: 24 }}>8. Technical Failure &amp; Termination</h3>
        <p style={{ color: 'var(--muted)' }}>
          If Tony cancels or a technical failure prevents meaningful delivery, you may choose a reschedule or refund. Tony may pause or
          terminate work when authorization is unclear, backups are inadequate for a material-risk change, credentials are exposed, the
          requested work is unlawful or unsafe, or the agreed scope cannot be followed. Refund eligibility then depends on work already
          delivered and the reason work stopped. Confidentiality obligations survive termination.
        </p>

        <h3 style={{ marginTop: 24 }}>9. Entire Agreement &amp; Governing Law</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          This agreement, together with the Terms of Service, the Refund &amp; Cancellation Policy, and the Privacy Policy, is the entire
          agreement between the parties. It is governed by Iowa law, with exclusive jurisdiction in Iowa state and federal courts.
          Electronic acceptance is binding under Iowa Code Chapter 554D and the federal E-Sign Act.
        </p>
      </div>
    </article>
  )
}
