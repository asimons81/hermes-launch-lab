import type { Metadata } from 'next'
import Link from 'next/link'
import { FounderPortrait } from '@/components/FounderPortrait'
import { ProjectProofGrid } from '@/components/ProjectProofGrid'
import { EngagementSteps } from '@/components/EngagementSteps'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'About Tony',
  description: 'Meet Tony Simons, the independent builder behind Hermes Launch Lab. Inspect the local-first agent infrastructure work and see how direct sessions are run.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Tony — Hermes Launch Lab',
    description: 'Independent, hands-on Hermes consulting backed by public local-first agent infrastructure work.',
    url: '/about',
  },
  twitter: {
    title: 'About Tony — Hermes Launch Lab',
    description: 'Independent, hands-on Hermes consulting backed by public local-first agent infrastructure work.',
  },
}

const workingStyle = [
  ['01 / START WITH THE REAL JOB', 'We begin with the machine, workflow, boundary, or failure that is actually in front of you.'],
  ['02 / CONFIGURE THE USEFUL PART', 'The point is a setup you can use, not a deck full of abstract agent advice.'],
  ['03 / VERIFY BEFORE HANDOFF', 'When a session includes implementation, we test the agreed workflow before we call it done.'],
]

export default function AboutTony() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="about-hero shell">
          <div className="about-hero__copy">
            <p className="eyebrow">ABOUT TONY</p>
            <h1>The person configuring the system.</h1>
            <p className="about-hero__lede">
              I&apos;m Tony Simons. I build local-first agent systems, credential controls, and verification tooling, then bring that same hands-on approach to direct Hermes consulting.
            </p>
            <p className="about-hero__note">
              You are working with the person doing the configuration, not an account manager passing you into a black box.
            </p>
            <div className="cockpit__actions">
              <Link href="/pricing" className="button button--primary">Choose a session <span aria-hidden="true">↗</span></Link>
              <Link href="#work" className="text-link">Inspect the work <span aria-hidden="true">↓</span></Link>
            </div>
          </div>
          <FounderPortrait priority />
        </section>

        <section className="about-statement shell">
          <p className="eyebrow">WHY HIRE TONY</p>
          <div className="about-statement__grid">
            <h2>Build the secure, useful, verifiable version of the setup.</h2>
            <div>
              <p>
                A useful agent environment needs more than an API key and a clever prompt. It needs a machine it can run on, clear access boundaries, a workflow worth automating, and a way to tell whether the result actually works.
              </p>
              <p>
                That is the work I build in public and the lens I bring into a session. We stay close to the real environment, define the useful scope, and leave you in control of what is running.
              </p>
            </div>
          </div>
        </section>

        <div id="work" className="shell">
          <ProjectProofGrid />
        </div>

        <section className="working-style shell">
          <p className="eyebrow">HOW I WORK</p>
          <div className="working-style__grid">
            {workingStyle.map(([label, copy]) => (
              <article className="working-style__item" key={label}>
                <p>{label}</p>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </section>

        <div className="shell">
          <EngagementSteps />
        </div>

        <section className="fit-check shell">
          <div className="fit-check__good">
            <p className="eyebrow">A GOOD FIT</p>
            <h2>You have a real goal and want a real setup.</h2>
            <p>Founders, operators, developers, and technical teams who have a machine or server, a concrete workflow, and room to work through the details together.</p>
          </div>
          <div className="fit-check__not">
            <p className="eyebrow">NOT THE RIGHT SESSION</p>
            <p>This is not a promise of a magic autonomous business, a place to dump credentials into a form, or a guarantee that future software changes will never break a workflow.</p>
            <p>Start with Strategy if the scope is still fuzzy. Use Custom when the work needs a written definition before implementation.</p>
          </div>
        </section>

        <section className="closing" style={{ paddingBlock: 80, textAlign: 'center' }}>
          <div className="pane shell closing__inner" style={{ padding: 48, background: 'var(--surface)', border: '1px solid var(--gold)' }}>
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: '8px 0 16px 0' }}>Pick the path that matches the work.</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 560, margin: '0 auto 24px auto' }}>Strategy clarifies the plan. Launch is the hands-on setup path. Custom starts with a scoped conversation.</p>
            <Link href="/pricing" className="button button--primary" style={{ padding: '12px 32px', fontSize: 15 }}>See session options <span aria-hidden="true">↗</span></Link>
            <p className="about-disclosure">Independent consulting service. Not affiliated with Nous Research or Hermes Agent maintainers.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
