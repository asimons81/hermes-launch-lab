import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"

export default async function Admin() {
  const session = await auth()
  // @ts-ignore
  if (!session || session.user?.role !== 'admin') redirect('/auth/signin')

  const bookings = await prisma.booking.findMany({
    take: 20,
    orderBy: { startTime: 'desc' },
    include: { user: true, service: true }
  })

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell">
        <p className="eyebrow">ADMINISTRATION</p>
        <h1 className="page-title">Booking Dashboard</h1>
        <p className="page-intro">Real-time session reservations and client intake records.</p>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Recent Sessions ({bookings.length})</h2>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)', padding: '32px 16px' }}>
                    No bookings recorded in database yet.
                  </td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 13 }}>{b.startTime.toLocaleString()}</td>
                    <td>{b.user.email}</td>
                    <td style={{ color: 'var(--gold)' }}>{b.service.name}</td>
                    <td>
                      <span className="status-bar__dot status-bar__dot--ok" />
                      {b.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="notice" style={{ marginTop: 24 }}>
          Server-side authorization enforced. Admin role verified.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
