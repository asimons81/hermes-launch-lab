import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'How Sessions Work',
  description: 'The complete Hermes Launch Lab session process, including attended remote access, credential boundaries, verification, and follow-up.',
  alternates: { canonical: '/sessions' },
}

const steps = [
  ['01', 'Book and confirm', 'US clients choose Strategy or Launch, confirm the time zone and agreements, then pay through Stripe. International businesses apply first.'],
  ['02', 'Prepare without secrets', 'Complete intake with goals and environment context. Never submit passwords, tokens, private keys, MFA codes, or confidential datasets.'],
  ['03', 'Join privately', 'A private Google Meet link is sent for the session. Sessions are not recorded.'],
  ['04', 'Authorize attended access', 'For hands-on work, you generate a fresh Chrome Remote Desktop support code, explicitly approve access, remain present, and can disconnect at any time. Screen-share coaching is always available instead.'],
  ['05', 'Keep credentials in your hands', 'You enter passwords, MFA codes, API keys, and other secrets yourself. Unattended remote access is never installed.'],
  ['06', 'Verify and disconnect', 'We test the agreed result, review changes, disconnect remote access, and identify any temporary access or credentials you should revoke.'],
  ['07', 'Receive the handoff', 'You receive written notes and deliverables. Launch includes seven calendar days of email support for defects within the agreed configuration.'],
] as const

export default function Sessions() {
  return <><SiteHeader /><main id="main-content" tabIndex={-1} className="shell page-shell">
    <p className="eyebrow">HOW SESSIONS WORK</p>
    <h1 className="page-title">Your machine stays under your control.</h1>
    <p className="page-intro">Meet face to face, grant one-time access only when useful, enter secrets yourself, and verify the result before handoff.</p>

    <section className="control-flow" aria-label="Session privacy and control flow">
      {['Google Meet', 'One-time access', 'Client enters secrets', 'Verify', 'Disconnect'].map((label, index) => <div className="control-flow__node" key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong></div>)}
    </section>

    <ol className="session-steps">
      {steps.map(([number, title, copy]) => <li className="card" key={number}><p className="eyebrow">{number}</p><h2>{title}</h2><p>{copy}</p></li>)}
    </ol>

    <section className="pane session-boundaries"><div><p className="eyebrow">STRATEGY</p><h2>A written action plan</h2><p>Advisory work only: fit, architecture, provider choices, hosting, security, and practical next steps.</p></div><div><p className="eyebrow">LAUNCH</p><h2>One tested workflow</h2><p>Installation or repair, configuration, and verification within the 90-minute session scope.</p></div></section>
    <div className="notice session-policy">Seven-day follow-up covers defects in the agreed Launch configuration through one continuing email thread. It excludes new features, provider outages, third-party updates, and expanded scope.</div>
    <div className="session-actions"><Link href="/book?service=launch" className="button button--primary">Book a US session ↗</Link><Link href="/apply" className="text-link">International business or Custom Build →</Link></div>
  </main><SiteFooter /></>
}
