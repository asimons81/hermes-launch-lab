import { auth } from '@/lib/auth'
import { containsLikelySecret } from '@/lib/submission-security'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().email().max(254),
  timeZone: z.string().trim().min(1).max(80),
  os: z.string().trim().max(120).default('Not provided'),
  comfortLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  hermesInstalled: z.enum(['true', 'false']),
  firstWorkflow: z.string().trim().min(5).max(2000),
  blocker: z.string().trim().max(2000).default(''),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return new Response('Unauthorized', { status: 401 })

  const form = await req.formData()
  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return new Response('Please correct the intake form', { status: 400 })
  if (parsed.data.email.toLowerCase() !== session.user.email.toLowerCase()) {
    return new Response('Use the email associated with your account', { status: 403 })
  }
  if (containsLikelySecret([parsed.data.firstWorkflow, parsed.data.blocker])) {
    return new Response('This looks like it may contain a credential or secret. Remove it and submit again.', { status: 400 })
  }

  const booking = await prisma.booking.findFirst({
    where: { userId: session.user.id, status: 'confirmed', intake: null },
    orderBy: { startTime: 'asc' },
  })
  if (!booking) return new Response('A confirmed booking is required before submitting intake', { status: 403 })

  await prisma.intake.create({
    data: {
      userId: session.user.id,
      bookingId: booking.id,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      timeZone: parsed.data.timeZone,
      os: parsed.data.os || 'Not provided',
      comfortLevel: parsed.data.comfortLevel,
      hermesInstalled: parsed.data.hermesInstalled === 'true',
      environment: parsed.data.os || 'Not provided',
      outcome: parsed.data.firstWorkflow,
      firstWorkflow: parsed.data.firstWorkflow,
      blocker: parsed.data.blocker,
      recordConsent: false,
    },
  })

  return Response.redirect(new URL('/portal?intake=received', req.url), 303)
}
