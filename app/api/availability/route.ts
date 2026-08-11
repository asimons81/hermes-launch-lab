import { prisma } from '@/lib/db'
import { availableSlotsForDate, upcomingCstDates } from '@/lib/availability'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const date = url.searchParams.get('date') || ''
  const serviceId = url.searchParams.get('serviceId') || ''

  // No date: return the next 14 bookable calendar days with day-of-week labels.
  if (!date) {
    const days = upcomingCstDates(14).map(d => {
      const dow = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }).format(new Date(d + 'T12:00:00Z'))
      return { date: d, label: dow }
    })
    return Response.json({ days })
  }

  const service = serviceId
    ? await prisma.service.findUnique({ where: { id: serviceId } })
    : null
  if (!service) return Response.json({ error: 'Service not found' }, { status: 404 })

  const durationMin = service.durationMin

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: 'Bad date' }, { status: 400 })

  // A pending booking holds the slot only for a limited checkout window (35 min,
  // outliving the 30-min Stripe session). Stale pending holds (abandoned
  // checkouts) must not hide the slot forever.
  const HOLD_MS = 35 * 60 * 1000
  const staleCutoff = new Date(Date.now() - HOLD_MS)

  const taken = (await prisma.booking.findMany({
    where: {
      startTime: { gte: new Date(date + 'T00:00:00Z'), lt: new Date(date + 'T23:59:59Z') },
      OR: [
        { status: { in: ['confirmed', 'completed'] } },
        { status: 'pending', createdAt: { gte: staleCutoff } }
      ]
    },
    select: { startTime: true }
  })).map(b => b.startTime)

  const slots = availableSlotsForDate(date, durationMin, taken)

  return Response.json({
    date,
    serviceId,
    durationMin,
    slots: slots.map(s => ({ iso: s.toISOString(), label: s.toLocaleTimeString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' }) }))
  })
}
