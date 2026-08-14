import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { buildSignInUrl } from '@/lib/auth-redirect'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Custom & International Business Application',
  description: 'Apply for a scoped Custom Hermes Build or international business engagement.',
  robots: { index: false, follow: false },
}

export default async function Apply() {
  const session = await auth()
  if (!session) redirect(buildSignInUrl({ callbackUrl: '/apply' }))

  return <><SiteHeader /><main id="main-content" tabIndex={-1} className="shell page-shell page-shell--narrow">
    <p className="eyebrow">APPLICATION / SCOPE FIRST</p>
    <h1 className="page-title">Tell me what needs building.</h1>
    <p className="page-intro">Custom Builds and international business engagements are reviewed before scope, price, scheduling, or payment is offered. Projects start at $600.</p>
    <div className="notice" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: 28 }}><strong>Do not submit credentials, confidential datasets, customer records, or private keys.</strong></div>
    <form action="/api/applications" method="post" className="card form-grid">
      <div><label htmlFor="businessName">Business name</label><input id="businessName" name="businessName" required maxLength={160} /></div>
      <div><label htmlFor="businessLocation">Business location</label><input id="businessLocation" name="businessLocation" placeholder="City, state/province, country" required maxLength={160} /></div>
      <div className="field--wide"><label htmlFor="outcome">Desired outcome</label><textarea id="outcome" name="outcome" rows={4} required maxLength={3000} /></div>
      <div className="field--wide"><label htmlFor="environment">Current environment</label><textarea id="environment" name="environment" rows={3} placeholder="Operating systems, hosting, and relevant tools—no credentials" required maxLength={2000} /></div>
      <div><label htmlFor="deadline">Target deadline</label><input id="deadline" name="deadline" placeholder="Flexible, or a specific date" required maxLength={120} /></div>
      <div><label htmlFor="budgetRange">Budget range</label><select id="budgetRange" name="budgetRange" required><option value="">Select one</option><option>$600–$999</option><option>$1,000–$2,499</option><option>$2,500–$4,999</option><option>$5,000+</option></select></div>
      <div className="field--wide"><button type="submit" className="button button--primary">Submit for review <span>↗</span></button></div>
    </form>
    <p className="notice" style={{ marginTop: 20 }}>Submitting an application does not create a booking or payment obligation. Tony will reply with fit, next steps, or a written scope request.</p>
  </main><SiteFooter /></>
}
