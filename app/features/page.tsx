import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { SkillCatalog } from '@/components/SkillCatalog'

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
          <div className="eyebrow">PERSISTENT SKILL LIBRARY</div>
          <h2 style={{ letterSpacing: '-0.04em', fontSize: 32, marginTop: 4, marginBottom: 8 }}>
            Browse Example Skills
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 640 }}>
            Representative examples of the kind of Hermes skills that can be loaded and persisted. Manifests shown are
            illustrative, not a live catalog of every skill installed on a machine.
          </p>
          <SkillCatalog />
        </section>

        {/* Comparison Matrix */}
        <section style={{ marginTop: 64 }}>
          <p className="eyebrow">CHOOSE A PATH</p>
          <h2 style={{ letterSpacing: '-0.04em', fontSize: 32, marginTop: 4, marginBottom: 24 }}>
            How the sessions compare
          </h2>
          <div className="pane" style={{ overflowX: 'auto' }}>
            <div className="pane__titlebar">
              <span className="pane__title">SESSION COMPARISON</span>
            </div>
            <div className="pane__body" style={{ padding: 0 }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.15)', background: 'rgba(10,11,9,0.8)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)' }}>What&apos;s included</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)' }}>Strategy ($99)</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--gold)' }}>Launch ($299)</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--muted)' }}>Custom ($600+)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>Duration</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>60 min</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>90 min</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}>120 min</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>Written action plan</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>Hands-on installation or repair</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>Configuration, memory &amp; permissions</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>One tested workflow</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>VPS deployment, integrations &amp; automations</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(242,240,233,0.08)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>7-day follow-up support</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', color: 'var(--fg)', fontFamily: 'var(--sans)', fontWeight: 500 }}>Application required</td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={false} /></td>
                    <td style={{ textAlign: 'center', padding: '12px 16px' }}><Cell value={true} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--mono)' }}>
            Details match the service descriptions on the pricing page.
          </p>
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
