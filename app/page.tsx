import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LiveTerminal } from '@/components/LiveTerminal'
import { ReceiptsRail } from '@/components/ReceiptsRail'
import { DiagnosticIntake } from '@/components/DiagnosticIntake'
import { TopoGraph } from '@/components/TopoGraph'
import { StatusBar } from '@/components/StatusBar'
import { FounderPortrait } from '@/components/FounderPortrait'
import { ProjectProofGrid } from '@/components/ProjectProofGrid'
import { EngagementSteps } from '@/components/EngagementSteps'
import { ReceiptFigure } from '@/components/ReceiptFigure'

export const metadata: Metadata = {
  title: { absolute: 'Hermes Launch Lab — Tony Simons Independent Studio' },
  description:
    'Hands-on 1-on-1 Hermes Agent consulting, credential security setups, and custom agent infrastructure builds. Book a session and leave with it working.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="cockpit shell">
          <div className="cockpit__copy">
            <div className="cockpit__badge">
              <span />
              HERMES LAUNCH LAB // INDEPENDENT CONSULTING
            </div>
            <h1>Get Hermes running.<br /><span className="accent">Leave with it working.</span></h1>
            <p className="cockpit__lede">
              Hands-on installation, secure configuration, and tested workflows. Windows, macOS, or Linux — you bring the machine, I bring the expertise.
            </p>
            <div className="cockpit__actions">
              <Link href="/book?service=launch" className="button button--primary">Book a Launch Session <span aria-hidden="true">↗</span></Link>
              <Link href="/about" className="text-link">Meet Tony <span aria-hidden="true">→</span></Link>
            </div>
            <div className="cockpit__decision-note">
              <strong>Direct 1:1 work.</strong> Book → prepare the useful context → build and verify the agreed workflow.
            </div>
            <p className="cockpit__note">No secrets shared. No mystery-box setup. You stay in control.</p>
            <p className="cockpit__note"><strong>US online booking.</strong> International business clients may <Link href="/apply" style={{ textDecoration: 'underline' }}>apply for review</Link>.</p>
          </div>
          <div className="cockpit__terminal-wrap">
            <LiveTerminal />
            <StatusBar />
          </div>
        </section>

        <section className="receipts-section" style={{ paddingBlock: 24 }}>
          <div className="shell"><ReceiptsRail /></div>
        </section>

        <section className="shell" style={{ paddingBlock: '48px 24px' }}>
          <ReceiptFigure
            src="/media/receipts/home-workflow-receipt-1440.webp"
            mobileSrc="/media/receipts/home-workflow-receipt-720x900.webp"
            alt="SANITIZED EXAMPLE — NOT LIVE CLIENT DATA — one Launch session from goal, access boundary, execution, verification, to handoff"
            width={1440}
            height={900}
            mobileWidth={720}
            mobileHeight={900}
          />
          <p className="eyebrow" style={{ marginTop: 12 }}>REAL SESSION RUNBOOK · SANITIZED RECEIPT</p>
        </section>

        <div className="shell"><ProjectProofGrid /></div>

        <section className="why-tony shell">
          <div className="why-tony__copy">
            <p className="eyebrow">WHY HIRE TONY</p>
            <h2>The work is built in public. The session is hands-on.</h2>
            <p>
              You are not buying a prompt pack. You are working directly with the person configuring the machine, access boundaries, and first workflow you will use.
            </p>
            <p>
              Tony builds local-first agent infrastructure, credential controls, and verification tooling. That practical bias carries into every session: keep the scope useful, keep control with you, and test the thing before calling it done.
            </p>
            <Link href="/about" className="text-link">Why work with Tony <span aria-hidden="true">→</span></Link>
          </div>
          <FounderPortrait compact />
        </section>

        <div className="shell"><EngagementSteps /></div>

        <section className="diagnostic-section shell" style={{ paddingBlock: 64 }}>
          <div className="section-heading-center">
            <p className="eyebrow">FIND YOUR PATH</p>
            <h2>Which session do you need?</h2>
            <p>Answer three questions for a recommendation, or skip straight to pricing.</p>
          </div>
          <DiagnosticIntake />
        </section>

        <section className="topo-section shell" style={{ paddingBlock: 64 }}>
          <div className="topo-section__heading">
            <p className="eyebrow">SYSTEM TOPOLOGY</p>
            <h2>One agent. Your machine. Real output.</h2>
            <p>Hermes runs on your hardware and coordinates work across skills, secrets, and scheduled jobs. This is the kind of system we configure around a real workflow.</p>
          </div>
          <TopoGraph />
        </section>

        <section className="section shell" style={{ paddingBlock: 48 }}>
          <div className="pane fit-panel">
            <div>
              <p className="eyebrow">A GOOD FIT</p>
              <h2>For people who want a real setup — not a sales call.</h2>
            </div>
            <div className="fit-panel__copy">
              <p>Come with a goal, a machine or server, and a willingness to work through the details. We&apos;ll keep the session practical.</p>
              <p>This is independent consulting for Hermes Agent. It is not official Nous Research support, and it is not a place to paste credentials into a form.</p>
              <Link href="/sessions" className="text-link">See exactly how sessions work <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="closing" style={{ paddingBlock: 80, textAlign: 'center' }}>
          <div className="pane shell closing__inner" style={{ padding: 48, background: 'var(--surface)', border: '1px solid var(--gold)' }}>
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: '8px 0 16px 0' }}>Build the first useful thing.</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 500, margin: '0 auto 24px auto' }}>Choose a session and leave with working software — or, for Strategy, a written action plan.</p>
            <Link href="/book?service=launch" className="button button--primary" style={{ padding: '12px 32px', fontSize: 15 }}>Book a Launch Session <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
