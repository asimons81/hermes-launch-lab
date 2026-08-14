import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { containsLikelySecret } from '@/lib/submission-security'
import { sendApplicationAdminNotification } from '@/lib/email'
import { z } from 'zod'

const schema = z.object({
  businessName: z.string().trim().min(2).max(160),
  businessLocation: z.string().trim().min(2).max(160),
  outcome: z.string().trim().min(20).max(3000),
  environment: z.string().trim().min(5).max(2000),
  deadline: z.string().trim().min(2).max(120),
  budgetRange: z.enum(['$600–$999', '$1,000–$2,499', '$2,500–$4,999', '$5,000+']),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 })
  const parsed = schema.safeParse(Object.fromEntries(await req.formData()))
  if (!parsed.success) return new Response('Please correct the application', { status: 400 })
  if (containsLikelySecret([parsed.data.outcome, parsed.data.environment])) {
    return new Response('This looks like it may contain a credential or secret. Remove it and submit again.', { status: 400 })
  }

  const recent = await prisma.application.count({
    where: { userId: session.user.id, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
  })
  if (recent >= 3) return new Response('Too many applications. Try again later.', { status: 429 })

  const application = await prisma.application.create({ data: { userId: session.user.id, type: 'custom', payload: parsed.data } })

  try {
    await sendApplicationAdminNotification({
      userEmail: session.user.email ?? 'Unknown applicant',
      businessName: parsed.data.businessName,
      businessLocation: parsed.data.businessLocation,
      outcome: parsed.data.outcome,
      environment: parsed.data.environment,
      deadline: parsed.data.deadline,
      budgetRange: parsed.data.budgetRange,
      applicationId: application.id,
    })
  } catch (err) {
    console.error('[applications] failed to send admin notification email:', err)
  }

  return Response.redirect(new URL('/contact?application=received', req.url), 303)
}

