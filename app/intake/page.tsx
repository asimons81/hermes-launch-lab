import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { buildSignInUrl } from "@/lib/auth-redirect"

export default async function Intake() {
  const session = await auth()
  if (!session) redirect(buildSignInUrl({ callbackUrl: '/intake' }))

  return (
    <>
      <SiteHeader />
      <main className="shell page-shell page-shell--narrow">
        <p className="eyebrow">STEP 02 / PRE-SESSION</p>
        <h1 className="page-title">Pre-Session Intake</h1>
        <p className="page-intro">Prepare your environment context so we hit the ground running.</p>

        <div className="notice" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: 28 }}>
          <strong>WARNING:</strong> Do not submit passwords, API keys, tokens, or any secrets.
        </div>

        <form action="/api/intake" method="post" className="card form-grid">
          <div><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" required /></div>
          <div><label htmlFor="email">Email</label><input id="email" type="email" name="email" defaultValue={session.user?.email || ''} required /></div>
          <div><label htmlFor="timeZone">Time zone</label><input id="timeZone" name="timeZone" placeholder="e.g. America/Chicago" /></div>
          <div><label htmlFor="os">Operating system</label><input id="os" name="os" placeholder="e.g. Arch Linux, macOS Sonoma, Windows 11" /></div>
          <div>
            <label htmlFor="comfortLevel">Technical comfort</label>
            <select id="comfortLevel" name="comfortLevel">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div>
            <label htmlFor="hermesInstalled">Hermes installed?</label>
            <select id="hermesInstalled" name="hermesInstalled">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="field--wide"><label htmlFor="firstWorkflow">First workflow you want to build</label><textarea id="firstWorkflow" name="firstWorkflow" rows={3} placeholder="Describe the outcome you want to achieve..." /></div>
          <div className="field--wide"><label htmlFor="blocker">Current blocker</label><textarea id="blocker" name="blocker" rows={3} placeholder="What is preventing you from reaching that goal today?" /></div>
          <div className="field--wide" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <input type="checkbox" id="recordConsent" name="recordConsent" style={{ width: 'auto' }} />
            <label htmlFor="recordConsent" style={{ margin: 0, fontWeight: 400, color: 'var(--muted)' }}>
              I consent to session recording for internal notes only.
            </label>
          </div>
          <div className="field--wide" style={{ marginTop: 12 }}>
            <button type="submit" className="button button--primary" style={{ width: '100%' }}>Submit intake form <span>↗</span></button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  )
}
