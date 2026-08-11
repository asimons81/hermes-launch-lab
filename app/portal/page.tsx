import type { Metadata } from 'next'
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"

export const metadata: Metadata = {
  title: 'Client Portal',
  robots: { index: false, follow: false },
}

export default async function Portal() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p className="eyebrow">CUSTOMER PORTAL</p>
            <h1 className="page-title">Welcome back, {session.user?.name || session.user?.email}</h1>
          </div>
          <form action="/api/auth/signout" method="post">
            <button className="button button--ghost" type="submit">Sign out</button>
          </form>
        </div>

        <div className="grid-2" style={{ marginTop: 32 }}>
          <div className="card">
            <h2 style={{ fontSize: 20, margin: '0 0 8px 0' }}>Upcoming Sessions</h2>
            <p style={{ color: 'var(--muted)' }}>No upcoming sessions booked.</p>
            <Link href="/book" className="text-link" style={{ marginTop: 16 }}>
              Book a session <span>→</span>
            </Link>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 20, margin: '0 0 8px 0' }}>Past Session Notes</h2>
            <p style={{ color: 'var(--muted)' }}>No past sessions recorded yet.</p>
            <Link href="/docs/quickstart" className="text-link" style={{ marginTop: 16 }}>
              Browse Hermes docs <span>→</span>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/book" className="button button--primary" style={{ padding: '12px 28px' }}>
            Book another session ↗
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
