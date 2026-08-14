export const LEGAL_VERSIONS = {
  terms: '2026-08-14',
  privacy: '2026-08-14',
  refund: '2026-08-14',
  consulting: '2026-08-14',
} as const

export const BOOKABLE_SERVICE_SLUGS = ['strategy', 'launch'] as const

export function isBookableService(slug: string): boolean {
  return BOOKABLE_SERVICE_SLUGS.includes(slug as (typeof BOOKABLE_SERVICE_SLUGS)[number])
}
