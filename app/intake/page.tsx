import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Intake() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  return (
    <div className="container" style={{maxWidth:680}}>
      <h1>Pre-Session Intake</h1>
      <div style={{background:'var(--color-surface-2)',padding:'var(--space-4)',marginBottom:'var(--space-5)',border:'1px solid var(--color-danger)'}}>
        WARNING: Do not submit passwords, API keys, tokens, or any secrets.
      </div>
      <form action="/api/intake" method="post">
        <div className="grid-2">
          <div><label>Full name</label><input name="fullName" required /></div>
          <div><label>Email</label><input type="email" name="email" required /></div>
          <div><label>Time zone</label><input name="timeZone" /></div>
          <div><label>Operating system</label><input name="os" /></div>
          <div><label>Technical comfort</label><select name="comfortLevel"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
          <div><label>Hermes installed?</label><select name="hermesInstalled"><option value="false">No</option><option value="true">Yes</option></select></div>
        </div>
        <div style={{marginTop:'var(--space-4)'}}><label>First workflow you want to build</label><textarea name="firstWorkflow" rows={3} /></div>
        <div style={{marginTop:'var(--space-4)'}}><label>Current blocker</label><textarea name="blocker" rows={3} /></div>
        <div style={{marginTop:'var(--space-4)'}}><label>Record consent</label><input type="checkbox" name="recordConsent" /> I consent to session recording for internal notes only.</div>
        <button type="submit" className="btn btn-primary" style={{marginTop:'var(--space-5)'}}>Submit intake</button>
      </form>
    </div>
  )
}
