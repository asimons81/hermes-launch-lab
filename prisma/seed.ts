import { prisma } from "@/lib/db"

export async function seedServices() {
  const existing = await prisma.service.count()
  if (existing > 0) return

  await prisma.service.createMany({
    data: [
      { slug: 'strategy', name: 'Hermes Strategy Session', price: 99, durationMin: 60, description: 'Fit assessment, model recommendations, hosting guidance, security discussion, written action plan.', isFeatured: true },
      { slug: 'launch', name: 'Hermes Launch Session', price: 299, durationMin: 90, description: 'Installation or repair, model configuration, channels, memory, permissions, one tested workflow, 7-day follow-up.', isFeatured: true },
      { slug: 'custom', name: 'Custom Hermes Build', price: 600, durationMin: 120, description: 'VPS deployment, integrations, custom skills, scheduled automations, and 7-day follow-up support. Application required — scoped through a conversation.' }
    ]
  })
  console.log('Services seeded')
}

// Run when executed directly (npm run db:seed / tsx prisma/seed.ts).
// Importing this module as a library must NOT auto-seed.
if (require.main === module) {
  seedServices()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}
