import { prisma } from './db'

export async function getCustomerBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { service: true, payment: true }
  })
}
