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
          Questions and requests for access, export, correction, or deletion of your records — reach out directly. Custom and international business work starts with the application.
        </p>

        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ marginTop: 0 }}>Email</h2>
          <p style={{ color: 'var(--muted)' }}>
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ textDecoration: 'underline' }}>
              {CONTACT_EMAIL}
            </a>
          </p>

          <h2 style={{ marginTop: 24 }}>Custom or international business work</h2>
          <p style={{ color: 'var(--muted)' }}>
            <a href="/apply" style={{ textDecoration: 'underline' }}>Use the application</a> to share your business location, desired outcome,
            current environment, deadline, and budget range. Applications are reviewed before scope, price, scheduling, or payment.
          </p>

          <h2 style={{ marginTop: 24 }}>Privacy requests</h2>
          <p style={{ color: 'var(--muted)' }}>Put “Privacy request” and the requested action in the subject line. Identity verification may be required before records are disclosed or deleted.</p>

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
