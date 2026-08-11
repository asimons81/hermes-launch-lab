import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import BookingForm from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Book a Session',
  robots: { index: false, follow: false },
}

export default async function Book(props: { searchParams: Promise<{ service?: string }> }) {
  const searchParams = await props.searchParams; const session = await auth(); if (!session) redirect('/auth/signin')
  const services = await prisma.service.findMany({ where: { isActive: true } }); const selected = searchParams.service || 'launch'
  const serviceProps = services.map(({ id, name, price, slug }) => ({ id, name, price, slug }))
  return <><SiteHeader /><main className="shell page-shell page-shell--narrow"><p className="eyebrow">STEP 01 / BOOK</p><h1 className="page-title">Choose a session.</h1><p className="page-intro">Pick a service, then a date and time. Checkout comes next.</p><BookingForm services={serviceProps} initialService={selected} /><p className="hero__note" style={{ marginTop: 20 }}>Sessions are held in Central Time. Weekdays 5–9 PM, weekends 9 AM–5 PM. Closed Thursdays.</p></main><SiteFooter /></>
}
