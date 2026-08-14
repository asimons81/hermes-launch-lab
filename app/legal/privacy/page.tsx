import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we handle your information and technical metadata.',
  alternates: { canonical: '/legal/privacy' },
}

export default function Privacy() {
  return (
    <article>
      <h1 className="page-title">Privacy Policy</h1>
      <p className="page-intro">How Tony Simons handles booking, service, and technical information. Last updated August 14, 2026.</p>
      
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Data Collected</h3>
        <ul style={{ color: 'var(--muted)', paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Email, name, time zone for booking and communication.</li>
          <li>Technical environment details for service delivery (OS, Hermes version).</li>
          <li>Payment metadata via Stripe (no credit card details stored).</li>
          <li>Intake answers you choose to submit before a session (goals, blockers, comfort level).</li>
          <li>Application details for Custom Builds and international business requests.</li>
          <li>Agreement versions, acceptance time, booking status, and written session notes or deliverables.</li>
          <li>Basic usage and device data when Google Analytics is enabled.</li>
        </ul>

        <h3 style={{ marginTop: 24 }}>Service Providers</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Vercel hosts the site; Neon stores application records; Stripe processes checkout, billing-country verification, receipts, and
          refunds; Resend sends transactional email; the configured authentication provider manages sign-in; and Google Analytics may
          process basic site-usage data. Sessions use Google Meet. Attended hands-on access, when you authorize it, uses Chrome Remote
          Desktop. Those Google services process meeting and connection metadata under their own terms. Sessions are not recorded.
        </p>

        <h3 style={{ marginTop: 24 }}>Retention</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Intake answers, applications, written session notes, and ordinary service records are retained for up to 24 months after the last
          engagement, then deleted or anonymized unless a shorter deletion request applies or longer retention is required for disputes,
          tax, payment, fraud-prevention, or legal obligations. Payment records and agreement evidence may be retained for the applicable
          financial and legal recordkeeping period. Remote-support codes are not stored.
        </p>

        <h3 style={{ marginTop: 24 }}>Data Boundaries</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Do not submit credentials or confidential datasets through forms or email. During attended sessions, you enter passwords, MFA
          codes, API keys, and other secrets yourself. No unattended remote access is installed.
        </p>

        <h3 style={{ marginTop: 24 }}>Your Rights</h3>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Request access, export, correction, or deletion through the <a href="/contact" style={{ color: 'var(--accent, inherit)' }}>Contact page</a>{' '}
          or by emailing{' '}
          <a href="mailto:tony@tonyreviewsthings.com" style={{ color: 'var(--accent, inherit)' }}>tony@tonyreviewsthings.com</a>.
        </p>
      </div>
    </article>
  )
}
