import type { Metadata } from 'next'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

const CONTACT_EMAIL = 'tony@tonyreviewsthings.com'

export const metadata: Metadata = {
  title: 'Contact Launch Lab',
  description:
    'Contact Launch Lab for custom-build scoping, questions, and privacy requests. Email tony@tonyreviewsthings.com — never send passwords, API keys, or secrets.',
  alternates: { canonical: '/contact' },
}

export default function Contact() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell page-shell--narrow">
        <p className="eyebrow">CONTACT</p>
        <h1 className="page-title">Contact Launch Lab.</h1>
        <p className="page-intro">
          Questions, custom-build scoping, and requests for your records — reach out directly.
        </p>

        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>Email</h2>
          <p style={{ color: 'var(--muted)' }}>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ textDecoration: 'underline' }}>
              {CONTACT_EMAIL}
            </a>
          </p>

          <h2 style={{ marginTop: 24 }}>What to include</h2>
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
