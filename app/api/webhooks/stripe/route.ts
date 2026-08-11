import { prisma } from '@/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response('Webhook signature failed', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const bookingId = session.metadata?.bookingId
  if (!bookingId) return new Response('ok')

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
  if (!booking) return new Response('ok')

  if (event.type === 'checkout.session.completed') {
    // Payment.userId is an FK to User.id (cuid) — resolve the real booking owner,
    // never the customer email string. Upsert so Stripe webhook retries are idempotent.
    await prisma.payment.upsert({
      where: { stripeId: session.id },
      create: {
        userId: booking.userId,
        bookingId: booking.id,
        stripeId: session.id,
        amount: session.amount_total || 0,
        status: 'succeeded'
      },
      update: { status: 'succeeded', amount: session.amount_total || 0 }
    })
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'confirmed' }
    })
  }

  if (event.type === 'checkout.session.expired') {
    // Abandoned checkout: release the slot. Only pending bookings are released —
    // a confirmed booking must never be cancelled by a stale expiry event.
    await prisma.booking.updateMany({
      where: { id: booking.id, status: 'pending' },
      data: { status: 'cancelled' }
    })
  }

  return new Response('ok')
}
