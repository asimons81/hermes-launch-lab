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

  // Legal gate: terms acceptance is mandatory and recorded with the booking (Iowa UETA § 554D).
  const TERMS_VERSION = '2026-08-10'
  if (form.get('acceptedTerms') !== 'yes') {
    return new Response('You must accept the Terms of Service to book', { status: 400 })
  }

  // No double-booking the same slot. Pending bookings hold the slot only for
  // a limited window — an abandoned checkout must not lock it forever.
  // Hold (35 min) is deliberately longer than the Stripe session lifetime
  // (30 min + 60s buffer): the checkout.session.expired webhook normally
  // releases the slot at expiry; this hold is the backstop if it never lands.
  const HOLD_MS = 35 * 60 * 1000
  const staleCutoff = new Date(Date.now() - HOLD_MS)

  // Release holds that outlived their checkout window.
  await prisma.booking.updateMany({
    where: { serviceId, startTime, status: 'pending', createdAt: { lt: staleCutoff } },
    data: { status: 'cancelled' }
  })

  const conflict = await prisma.booking.findFirst({
    where: {
      serviceId,
      startTime,
      OR: [
        { status: { in: ['confirmed', 'completed'] } },
        { status: 'pending', createdAt: { gte: staleCutoff } }
      ]
    }
  })
  if (conflict) return new Response('That slot was just taken — pick another time', { status: 409 })

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id!,
      serviceId,
      startTime,
      endTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      acceptedTermsVersion: TERMS_VERSION,
      acceptedTermsAt: new Date()
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
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60 + 60, // 30-min min + skew buffer; slot hold (35 min) outlives it
    success_url: `${process.env.NEXTAUTH_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/book/cancel`,
    metadata: { bookingId: booking.id }
  })

  redirect(checkout.url!)
}
