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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--red-soft)', border: '1px solid rgba(255, 42, 53, 0.15)', borderRadius: '100px', color: 'var(--red-accent)', fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, background: 'var(--red-accent)', borderRadius: '50%', boxShadow: '0 0 8px var(--red-accent)' }} />
              SYSTEM ACTIVE // HERMES LAUNCH LAB
            </div>
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
        <section className="receipts-section" style={{ paddingBlock: 24 }}>
          <div className="shell">
            <ReceiptsRail />
          </div>
        </section>

        {/* === DIAGNOSTIC (replaces pricing) === */}
        <section className="diagnostic-section shell" style={{ paddingBlock: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="eyebrow">FIND YOUR PATH</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.05, margin: 0 }}>
              Which session do you need?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 480, margin: '16px auto 0' }}>
              Answer three questions. Get a recommendation. Or skip straight to pricing.
            </p>
          </div>
          <DiagnosticIntake />
        </section>

        {/* === TOPOGRAPH (replaces "What is Hermes" + process) === */}
        <section className="topo-section shell" style={{ paddingBlock: 64 }}>
          <div style={{ marginBottom: 48 }}>
            <p className="eyebrow">SYSTEM TOPOLOGY</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, letterSpacing: '-.035em', lineHeight: 1.05, margin: 0, maxWidth: 620 }}>
              One agent. Your machine. Real output.
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 540, margin: '16px 0 0' }}>
              Hermes runs on your hardware and coordinates work across skills, vault, and scheduled jobs. Tap a node to see what it does.
            </p>
          </div>
          <TopoGraph />
        </section>

        {/* === FIT PANEL === */}
        <section className="section shell" style={{ paddingBlock: 48 }}>
          <div className="pane fit-panel" style={{ padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
            <div>
              <p className="eyebrow">A GOOD FIT</p>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.1, margin: 0 }}>
                For people who want a real setup — not a sales call.
              </h2>
            </div>
            <div className="fit-panel__copy" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0, color: 'var(--muted)' }}>Come with a goal, a machine or server, and a willingness to work through the details. We&apos;ll keep the session practical.</p>
              <p style={{ margin: 0, color: 'var(--faint)', fontSize: 14 }}>This is independent consulting for Hermes Agent. It is not official Nous Research support, and it is not a place to paste credentials into a form.</p>
              <Link href="/faq" className="text-link" style={{ marginTop: 8 }}>Read the FAQ <span>→</span></Link>
            </div>
          </div>
        </section>

        {/* === CLOSING === */}
        <section className="closing" style={{ paddingBlock: 80, textAlign: 'center' }}>
          <div className="pane shell closing__inner" style={{ padding: 48, background: 'var(--surface)', border: '1px solid var(--gold)' }}>
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: '8px 0 16px 0' }}>Build the first useful thing.</h2>
            <p style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 500, margin: '0 auto 24px auto' }}>Choose a session and we&apos;ll turn the starting point into a working system.</p>
            <Link href="/book" className="button button--primary" style={{ padding: '12px 32px', fontSize: 15 }}>Book a session <span>↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
