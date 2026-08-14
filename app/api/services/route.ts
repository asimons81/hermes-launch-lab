import { prisma } from "@/lib/db"

export async function GET() {
  const services = await prisma.service.findMany({ where: { isActive: true, slug: { in: ['strategy', 'launch'] } } })
  return Response.json({ services })
}
