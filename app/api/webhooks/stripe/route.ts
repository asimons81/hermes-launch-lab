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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      await prisma.payment.create({
        data: {
          userId: session.customer_details?.email || '',
          bookingId,
          stripeId: session.id,
          amount: session.amount_total || 0,
          status: 'succeeded'
        }
      })
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'confirmed' }
      })
    }
  }

  return new Response('ok')
}
