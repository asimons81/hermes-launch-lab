import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { isWithinAvailability } from '@/lib/availability'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) redirect('/auth/signin')

  const form = await req.formData()
  const serviceId = form.get('serviceId') as string
  const startTime = new Date(form.get('startTime') as string)

  if (Number.isNaN(startTime.getTime())) {
    return new Response('Invalid start time', { status: 400 })
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } })
  if (!service) return new Response('Service not found', { status: 404 })

  const endTime = new Date(startTime.getTime() + service.durationMin * 60000)

  // Server-side availability gate: reject anything outside Tony's schedule.
  if (!isWithinAvailability(startTime, service.durationMin)) {
    return new Response('Selected time is outside available hours', { status: 400 })
  }

  // No double-booking the same slot.
  const conflict = await prisma.booking.findFirst({
    where: { serviceId, startTime, status: { not: 'cancelled' } }
  })
  if (conflict) return new Response('That slot was just taken — pick another time', { status: 409 })

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id!,
      serviceId,
      startTime,
      endTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  })

  const checkout = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: service.name },
        unit_amount: service.price * 100
      },
      quantity: 1
    }],
    success_url: `${process.env.NEXTAUTH_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/book/cancel`,
    metadata: { bookingId: booking.id }
  })

  redirect(checkout.url!)
}
