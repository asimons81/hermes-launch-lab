import { prisma } from "@/lib/db"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function Book({ searchParams }: { searchParams: { service?: string } }) {
  const session = await auth()
  if (!session) redirect('/auth/signin')

  const services = await prisma.service.findMany({ where: { isActive: true } })
  const selected = searchParams.service || 'launch'

  return (
    <div className="container">
      <nav className="nav">
        <a href="/">HERMES LAUNCH LAB</a>
      </nav>
      <h1>Book a Session</h1>
      <form action="/api/bookings" method="post" className="grid-2">
        <div>
          <label>Service</label>
          <select name="serviceId" defaultValue={selected}>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Date &amp; Time (your timezone)</label>
          <input type="datetime-local" name="startTime" required />
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <button type="submit" className="btn btn-primary">Continue to checkout</button>
        </div>
      </form>
      <p style={{marginTop:'var(--space-4)',fontSize:12,color:'var(--color-ink-muted)'}}>
        Development fixtures only. Real availability after calendar integration.
      </p>
    </div>
  )
}
