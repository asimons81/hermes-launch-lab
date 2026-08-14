import { prisma } from '@/lib/db'
import Stripe from 'stripe'
import { sendAdminNotification, sendBookingConfirmation, type ConfirmationBooking } from '@/lib/email'

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

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, user: true, intake: true },
  })
  if (!booking) return new Response('ok')

  if (event.type === 'checkout.session.completed') {
    // Defense in depth: the booking form gates self-service to US purchasers,
    // and Stripe billing-country data verifies that assertion after payment.
    // A mismatch is refunded immediately and never becomes a confirmed booking.
    const billingCountry = session.customer_details?.address?.country
    if (booking.purchaseCountry !== 'US' || billingCountry !== 'US') {
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id
      if (paymentIntentId) {
        await stripe.refunds.create({ payment_intent: paymentIntentId }, {
          idempotencyKey: `non-us-${session.id}`,
        })
      }
      await prisma.payment.upsert({
        where: { stripeId: session.id },
        create: {
          userId: booking.userId,
          bookingId: booking.id,
          stripeId: session.id,
          amount: session.amount_total || 0,
          status: 'refunded',
        },
        update: { status: 'refunded', amount: session.amount_total || 0 },
      })
      await prisma.booking.update({ where: { id: booking.id }, data: { status: 'cancelled' } })
      return new Response('ok')
    }

    // Capture the Stripe-hosted receipt URL (exists in test mode too).
    // Best-effort: a failure here must not block booking confirmation.
    let receiptUrl: string | null = null
    try {
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['payment_intent.latest_charge'],
      })
      const pi = full.payment_intent
      const charge = typeof pi === 'object' && pi !== null && 'latest_charge' in pi
        ? (pi.latest_charge as Stripe.Charge | null)
        : null
      receiptUrl = charge?.receipt_url ?? null
    } catch (err) {
      console.error('[webhook] receipt url fetch failed', err)
    }

    // Payment.userId is an FK to User.id (cuid) — resolve the real booking owner,
    // never the customer email string. Upsert so Stripe webhook retries are idempotent.
    await prisma.payment.upsert({
      where: { stripeId: session.id },
      create: {
        userId: booking.userId,
        bookingId: booking.id,
        stripeId: session.id,
        amount: session.amount_total || 0,
        status: 'succeeded',
        receiptUrl,
      },
      update: { status: 'succeeded', amount: session.amount_total || 0, receiptUrl },
    })
    const wasAlreadyConfirmed = booking.status === 'confirmed'
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'confirmed' },
    })

    // Emails fire only on the pending→confirmed transition, so webhook retries
    // (which arrive with booking.status already 'confirmed') never double-send.
    // Fire-and-forget: failures are logged, never allowed to fail the webhook.
    if (!wasAlreadyConfirmed) {
      const emailBooking: ConfirmationBooking = {
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
        timeZone: booking.timeZone,
        service: booking.service,
        user: booking.user,
        intake: booking.intake,
      }
      const results = await Promise.allSettled([
        sendBookingConfirmation(emailBooking, receiptUrl),
        sendAdminNotification(emailBooking, receiptUrl),
      ])
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[webhook] email ${i === 0 ? 'confirmation' : 'admin'} failed booking=${booking.id}`, r.reason)
        }
      })
    }
  }

  if (event.type === 'checkout.session.expired') {
    // Abandoned checkout: release the slot. Only pending bookings are released —
    // a confirmed booking must never be cancelled by a stale expiry event.
    await prisma.booking.updateMany({
      where: { id: booking.id, status: 'pending' },
      data: { status: 'cancelled' },
    })
  }

  return new Response('ok')
}
