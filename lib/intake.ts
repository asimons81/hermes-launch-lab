import { prisma } from './db'

export async function createIntake(data: any, userId: string) {
  return prisma.intake.create({ data: { ...data, userId } })
}
