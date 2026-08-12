// TEMPORARY admin route — cancels ONLY the two Launch Lab test bookings.
// Deleted after the cleanup (replaced by a clean deploy).
import { prisma } from '@/lib/db'

const TEST_BOOKING_IDS = ['cmso6wc9u0001jo04mtecmrz6', 'cmspe1qjd0001jm04bzgtskdp']

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const ids: unknown = body?.ids
  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== 'string' || !TEST_BOOKING_IDS.includes(id))) {
    return new Response('invalid ids — only the two test bookings are allowed', { status: 400 })
  }
  const res = await prisma.booking.updateMany({
    where: { id: { in: ids as string[] }, status: { in: ['pending', 'confirmed'] } },
    data: { status: 'cancelled' },
  })
  return Response.json({ ok: true, cancelled: res.count })
}
