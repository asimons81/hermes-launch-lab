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
  ['What happens after I book?', 'You sign in, choose a time, complete payment, then provide the goal and environment details needed for the work. Bring a clear outcome. Do not put passwords, API keys, tokens, or private keys in a form or email.'],
  ['How do credentials and access work?', 'You grant access only to systems needed for the agreed work, and only with your explicit consent during the session. You remain responsible for credentials you choose to share and should revoke or rotate them afterward.'],
  ['When should I choose Strategy, Launch, or Custom?', 'Choose Strategy when you need a fit assessment and written plan. Choose Launch when you are ready for a hands-on setup or repair and one tested workflow. Choose Custom when the work needs a scoped definition before implementation.'],
  ['Do you guarantee a specific result?', 'No. Services are delivered on a best-efforts basis. Software and AI tooling change, so no specific result, performance level, uptime, or future compatibility is guaranteed.'],
  ['How do I cancel?', 'Give 24 hours or more notice for a full credit. See the refund policy for details.'],
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
