import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { LiveTerminal } from '@/components/LiveTerminal'
import { ReceiptsRail } from '@/components/ReceiptsRail'
import { DiagnosticIntake } from '@/components/DiagnosticIntake'
import { TopoGraph } from '@/components/TopoGraph'
import { StatusBar } from '@/components/StatusBar'

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* === COCKPIT HERO === */}
        <section className="cockpit shell">
          <div className="cockpit__copy">
            <p className="eyebrow">HERMES AGENT CONSULTING</p>
            <h1>Get Hermes running.<br /><span className="accent">Leave with it working.</span></h1>
            <p className="cockpit__lede">
              Hands-on installation, secure configuration, and tested workflows. Windows, macOS, or Linux — you bring the machine, I bring the expertise.
            </p>
            <div className="cockpit__actions">
              <Link href="/book" className="button button--primary">Book a session <span>↗</span></Link>
              <Link href="/features" className="text-link">See how it works <span>→</span></Link>
            </div>
            <p className="cockpit__note">No secrets shared. No mystery-box setup. You stay in control.</p>
          </div>
          <div className="cockpit__terminal-wrap">
            <LiveTerminal />
            <StatusBar />
          </div>
        </section>

        {/* === RECEIPTS RAIL === */}
        <section className="receipts-section">
          <div className="shell">
            <ReceiptsRail />
          </div>
        </section>

        {/* === DIAGNOSTIC (replaces pricing) === */}
        <section className="diagnostic-section shell">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="eyebrow">FIND YOUR PATH</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 640, letterSpacing: '-.035em', lineHeight: 1.05, margin: 0 }}>
              Which session do you need?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 480, margin: '16px auto 0' }}>
              Answer three questions. Get a recommendation. Or skip straight to pricing.
            </p>
          </div>
          <DiagnosticIntake />
        </section>

        {/* === TOPOGRAPH (replaces "What is Hermes" + process) === */}
        <section className="topo-section shell">
          <div style={{ marginBottom: 48 }}>
            <p className="eyebrow">SYSTEM TOPOLOGY</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 640, letterSpacing: '-.035em', lineHeight: 1.05, margin: 0, maxWidth: 620 }}>
              One agent. Your machine. Real output.
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 540, margin: '16px 0 0' }}>
              Hermes runs on your hardware and coordinates work across skills, vault, and scheduled jobs. Tap a node to see what it does.
            </p>
          </div>
          <TopoGraph />
        </section>

        {/* === FIT PANEL === */}
        <section className="section shell">
          <div className="fit-panel">
            <div>
              <p className="eyebrow">A GOOD FIT</p>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.1, margin: 0 }}>
                For people who want a real setup — not a sales call.
              </h2>
            </div>
            <div className="fit-panel__copy">
              <p>Come with a goal, a machine or server, and a willingness to work through the details. We&apos;ll keep the session practical.</p>
              <p>This is independent consulting for Hermes Agent. It is not official Nous Research support, and it is not a place to paste credentials into a form.</p>
              <Link href="/faq" className="text-link">Read the FAQ <span>→</span></Link>
            </div>
          </div>
        </section>

        {/* === CLOSING === */}
        <section className="closing">
          <div className="shell closing__inner">
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2>Build the first useful thing.</h2>
            <p>Choose a session and we&apos;ll turn the starting point into a working system.</p>
            <Link href="/book" className="button button--primary">Book a session <span>↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
