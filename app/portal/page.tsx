import type { Metadata } from 'next'
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { formatDateLine, formatTimeLine } from "@/lib/email-templates"

export const metadata: Metadata = {
  title: 'Client Portal',
  robots: { index: false, follow: false },
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending payment',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default async function Portal() {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const now = new Date()
  const userId = session.user!.id
  const [upcoming, past] = await Promise.all([
    prisma.booking.findMany({
      where: {
        userId,
        status: { in: ['pending', 'confirmed'] },
        startTime: { gte: now },
      },
      include: { service: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.booking.findMany({
      where: {
        userId,
        status: 'completed',
      },
      include: { service: true },
      orderBy: { startTime: 'desc' },
    }),
  ])

  const rowStyle = {
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  } as const
  const labelStyle = {
    fontFamily: "SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--muted)',
  } as const
  const valueStyle = { color: 'var(--foreground)', fontWeight: 600, fontSize: 14 } as const

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
            {upcoming.length === 0 ? (
              <>
                <p style={{ color: 'var(--muted)' }}>No upcoming sessions booked.</p>
                <Link href="/book" className="text-link" style={{ marginTop: 16 }}>
                  Book a session <span>→</span>
                </Link>
              </>
            ) : (
              <div style={{ marginTop: 8 }}>
                {upcoming.map((b) => (
                  <div key={b.id} style={rowStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                      <span style={valueStyle}>{b.service.name}</span>
                      <span style={{ ...labelStyle, color: b.status === 'confirmed' ? 'var(--green, #34D399)' : 'var(--muted)' }}>
                        {STATUS_LABEL[b.status] ?? b.status}
                      </span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 14, color: 'var(--bone, #E2E8F0)' }}>
                      {formatDateLine(b.startTime, b.timeZone)} · {formatTimeLine(b.startTime, b.endTime, b.timeZone)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ fontSize: 20, margin: '0 0 8px 0' }}>Past Session Notes</h2>
            {past.length === 0 ? (
              <>
                <p style={{ color: 'var(--muted)' }}>No past sessions recorded yet.</p>
                <Link href="/docs/quickstart" className="text-link" style={{ marginTop: 16 }}>
                  Browse Hermes docs <span>→</span>
                </Link>
              </>
            ) : (
              <div style={{ marginTop: 8 }}>
                {past.map((b) => (
                  <div key={b.id} style={rowStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                      <span style={valueStyle}>{b.service.name}</span>
                      <span style={labelStyle}>{STATUS_LABEL[b.status] ?? b.status}</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 14, color: 'var(--bone, #E2E8F0)' }}>
                      {formatDateLine(b.startTime, b.timeZone)} · {formatTimeLine(b.startTime, b.endTime, b.timeZone)}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
