import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"

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
    <div className="container">
      <nav className="nav">
        <a href="/">HERMES LAUNCH LAB</a>
        <span>Admin</span>
      </nav>
      <h1>Dashboard</h1>
      <div className="card" style={{marginBottom:'var(--space-5)'}}>
        <h3>Upcoming Sessions ({bookings.length})</h3>
        <table className="table">
          <thead>
            <tr><th>When</th><th>Customer</th><th>Service</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.startTime.toLocaleString()}</td>
                <td>{b.user.email}</td>
                <td>{b.service.name}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{fontSize:12,color:'var(--color-ink-muted)'}}>
        Real data. Server-side authorization enforced.
      </div>
    </div>
  )
}
