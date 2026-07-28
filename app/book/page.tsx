import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export default async function Book(props: { searchParams: Promise<{ service?: string }> }) {
  const searchParams = await props.searchParams; const session = await auth(); if (!session) redirect('/auth/signin')
  const services = await prisma.service.findMany({ where: { isActive: true } }); const selected = searchParams.service || 'launch'
  return <><SiteHeader /><main className="shell page-shell page-shell--narrow"><p className="eyebrow">STEP 01 / BOOK</p><h1 className="page-title">Choose a session.</h1><p className="page-intro">Pick the service and a time. Checkout comes next.</p><form action="/api/bookings" method="post" className="card form-grid" style={{marginTop:36}}><div><label htmlFor="serviceId">Service</label><select id="serviceId" name="serviceId" defaultValue={selected}>{services.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>)}</select></div><div><label htmlFor="startTime">Date &amp; time (your timezone)</label><input id="startTime" type="datetime-local" name="startTime" required /></div><div className="field--wide"><button type="submit" className="button button--primary">Continue to checkout <span>↗</span></button></div></form><p className="notice" style={{marginTop:18}}>Availability is currently confirmed manually after booking. Do not submit secrets, tokens, or passwords.</p></main><SiteFooter /></>
}
