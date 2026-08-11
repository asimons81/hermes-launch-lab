import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

const CONTACT_EMAIL = 'tony@tonyreviewsthings.com'

export default function Contact() {
  return (
    <>
      <SiteHeader />
      <main className="shell page-shell page-shell--narrow">
        <p className="eyebrow">CONTACT</p>
        <h1 className="page-title">Contact Launch Lab.</h1>
        <p className="page-intro">
          Questions, custom-build scoping, and requests for your records — reach out directly.
        </p>

        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>Email</h3>
          <p style={{ color: 'var(--muted)' }}>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ textDecoration: 'underline' }}>
              {CONTACT_EMAIL}
            </a>
          </p>

          <h3 style={{ marginTop: 24 }}>What to include</h3>
          <p style={{ color: 'var(--muted)' }}>
            For custom builds, describe the outcome you want, your current setup, and any deadlines. For
            privacy requests (export or deletion), say so in the subject line.
          </p>

          <p className="notice" style={{ marginTop: 24 }}>
            <strong>Do not email passwords, API keys, tokens, or secrets.</strong> Credentials are handled
            during sessions through secure channels only.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
