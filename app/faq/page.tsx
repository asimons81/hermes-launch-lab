import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Practical answers on independent Hermes Agent consulting: session fit, deliverables, preparation, access boundaries, and cancellation.',
  alternates: { canonical: '/faq' },
}

const faqs = [
  ['Is this official Hermes support?', 'No. This is an independent consulting service, not affiliated with Nous Research or Hermes Agent maintainers.'],
  ['Who is a Launch Session for?', 'The Launch Session is for someone ready to work on a real machine or server: installation or repair, configuration, permissions, and one workflow worth testing.'],
  ['What leaves the session working?', 'Strategy produces a written action plan. Launch includes hands-on setup or repair and one tested workflow within the session scope. Custom work is defined in writing before it begins.'],
  ['What happens after I book?', 'You sign in, choose a time in your local zone with Central Time shown for reference, confirm the agreements and US purchasing eligibility, then pay. Next, provide goal and environment context—never credentials. A private Google Meet link is sent for the session.'],
  ['How do credentials and remote access work?', 'If hands-on access is useful, you generate a fresh Chrome Remote Desktop support code, explicitly approve access, remain present, and may disconnect at any time. No unattended access is installed. You enter all passwords, MFA codes, API keys, and other secrets yourself. Screen-share coaching is always available instead.'],
  ['Are sessions recorded?', 'No. Sessions are not recorded. Tony uses written notes and deliverables instead.'],
  ['Who can book online?', 'Self-service Strategy and Launch booking is currently available to US purchasers. International business clients may apply for review. International consumer checkout is not available.'],
  ['When should I choose Strategy, Launch, or Custom?', 'Choose Strategy when you need a fit assessment and written plan. Choose Launch when you are ready for a hands-on setup or repair and one tested workflow. Choose Custom when the work needs a scoped definition before implementation.'],
  ['Do you guarantee a specific result?', 'No. Services are delivered on a best-efforts basis. Software and AI tooling change, so no specific result, performance level, uptime, or future compatibility is guaranteed.'],
  ['What does 7-day follow-up include?', 'Launch includes one continuing email thread for defects in the agreed configuration for seven calendar days after the session. It excludes new features, expanded scope, provider outages, and third-party software changes.'],
  ['How do I cancel?', 'With at least 24 hours notice, choose one reschedule or a refund to the original payment method. With less notice, the session is forfeited. A 15-minute grace period applies to lateness and no-shows.'],
]

export default function FAQ() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell page-shell--narrow">
        <p className="eyebrow">GOOD QUESTIONS</p>
        <h1 className="page-title">Before we build.</h1>
        <p className="page-intro">The practical details, without the sales fog.</p>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <section className="card faq-item" key={question}>
              <p className="eyebrow">{String(index + 1).padStart(2, '0')}</p>
              <h2>{question}</h2>
              <p>{answer}</p>
            </section>
          ))}
        </div>
        <p className="faq-cta"><Link className="text-link" href="/pricing">See session options <span aria-hidden="true">→</span></Link></p>
      </main>
      <SiteFooter />
    </>
  )
}
