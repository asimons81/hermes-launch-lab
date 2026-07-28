import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Portal() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  return (
    <div className="container">
      <nav className="nav">
        <Link href="/">HERMES LAUNCH LAB</Link>
        <form action="/api/auth/signout" method="post"><button>Sign out</button></form>
      </nav>
      <h1>Customer Portal</h1>
      <div className="grid-2">
        <div className="card">
          <h3>Upcoming</h3>
          <p style={{color:'var(--color-ink-muted)'}}>No upcoming sessions.</p>
        </div>
        <div className="card">
          <h3>Past Sessions</h3>
          <p style={{color:'var(--color-ink-muted)'}}>None yet.</p>
        </div>
      </div>
      <div style={{marginTop:'var(--space-6)'}}>
        <a href="/book" className="btn btn-primary">Book another session</a>
      </div>
    </div>
  )
}
