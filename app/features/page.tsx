import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SkillCatalog } from '@/components/SkillCatalog'

const comparison = [
  { feature: 'Hands-on setup pairing', hermes: true, claude: false, cursor: false, diy: false },
  { feature: 'Credential security & sandbox hardening', hermes: true, claude: false, cursor: false, diy: false },
  { feature: 'Persistent compounding skills', hermes: true, claude: 'Partial', cursor: false, diy: false },
  { feature: 'Tested production workflow', hermes: true, claude: false, cursor: false, diy: false },
  { feature: 'Works on any OS (Linux/macOS/Win)', hermes: true, claude: true, cursor: true, diy: true },
  { feature: '1-on-1 expert guidance', hermes: true, claude: false, cursor: false, diy: false },
  { feature: 'Autonomous background cron', hermes: true, claude: false, cursor: false, diy: 'Manual' },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span style={{ color: 'var(--term-green)', fontWeight: 'bold' }}>✓</span>
  if (value === false) return <span style={{ color: 'var(--muted)' }}>—</span>
  return <span style={{ color: 'var(--gold)' }}>{value}</span>
}

export default function Features() {
  return (
    <>
      <SiteHeader />
      <main className="shell page-shell" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <p className="eyebrow">WHAT IT IS</p>
        <h1 className="page-title">What is Hermes Agent?</h1>
        <p className="page-intro">
          Hermes is an autonomous AI agent that runs on your hardware — Windows, macOS, or Linux. It executes real work: research, coding, content production, and operations. You stay in control of the keys, the data, and the output.
        </p>

        {/* 3 Pillars */}
        <section style={{ marginTop: 40 }}>
          <div className="proof-strip__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            <div className="pane">
              <div className="pane__titlebar">
                <span className="pane__title">01 // FLEET COMMANDER</span>
              </div>
              <div className="pane__body">
                <h3 style={{ letterSpacing: '-0.04em', margin: '0 0 8px 0' }}>Orchestrated Execution</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  One agent coordinates work across your local tools and external APIs. Tasks get routed, executed, and logged with receipts.
                </p>
              </div>
            </div>

            <div className="pane">
              <div className="pane__titlebar">
                <span className="pane__title">02 // PERSISTENT SKILLS</span>
              </div>
              <div className="pane__body">
                <h3 style={{ letterSpacing: '-0.04em', margin: '0 0 8px 0' }}>Compounding Intelligence</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  Workflows survive sessions and compound over time. No re-engineering the same prompt every single morning.
                </p>
              </div>
            </div>

            <div className="pane">
              <div className="pane__titlebar">
                <span className="pane__title">03 // LOCAL-FIRST ENGINE</span>
              </div>
              <div className="pane__body">
                <h3 style={{ letterSpacing: '-0.04em', margin: '0 0 8px 0' }}>Zero Cloud Lock-In</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  Runs on your hardware. No cloud vendor lock-in. You decide what stays local and what leaves your machine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Skill Library Section */}
        <section style={{ marginTop: 64 }}>
          <div className="eyebrow">SKILL.MD FORMAT</div>
          <h2 style={{ letterSpacing: '-0.04em', fontSize: 32, marginTop: 4, marginBottom: 8 }}>
            Inspect Example Skill Manifests
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 640 }}>
            These are illustrative example manifests — not skills shipped with Hermes. They show the SKILL.md format, and the copy
            buttons run real <code>hermes skills</code> and <code>hermes cron</code> commands you can use on your own machine.
          </p>
          <SkillCatalog />
        </section>

        {/* Comparison Matrix */}
        <section style={{ marginTop: 64 }}>
          <p className="eyebrow">HOW IT COMPARES</p>
          <h2 style={{ letterSpacing: '-0.04em', fontSize: 32, marginTop: 4, marginBottom: 24 }}>
            Hermes Consulting vs. Alternatives
          </h2>
          <div className="pane" style={{ overflowX: 'auto' }}>
            <div className="pane__titlebar">
              <span className="pane__title">COMPARISON MATRIX</span>
            </div>
            <div className="pane__body" style={{ padding: 0 }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.15)', background: 'rgba(10,11,9,0.8)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)' }}>Feature / Capability</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--gold)' }}>Hermes Consulting</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)' }}>Claude Code</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)' }}>Cursor</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)' }}>DIY</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(row => (
                    <tr key={row.feature} style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>{row.feature}</td>
                      <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={row.hermes} /></td>
                      <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={row.claude} /></td>
                      <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={row.cursor} /></td>
                      <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={row.diy} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={{ marginTop: 48, marginBottom: 32, textAlign: 'center' }}>
          <Link href="/book" className="button button--primary" style={{ padding: '12px 32px', fontSize: 16 }}>
            Book a Launch Session ↗
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
