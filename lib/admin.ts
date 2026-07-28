import { prisma } from './db'

export async function adminStats() {
  const [bookings, revenue] = await Promise.all([
    prisma.booking.count(),
    prisma.payment.aggregate({ _sum: { amount: true } })
  ])
  return { bookings, revenue: revenue._sum.amount || 0 }
}
