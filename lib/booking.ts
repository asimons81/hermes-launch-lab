import { prisma } from './db'

export async function preventDoubleBooking(serviceId: string, startTime: Date) {
  const conflict = await prisma.booking.findFirst({
    where: { serviceId, startTime, status: { not: 'cancelled' } }
  })
  return !!conflict
}
