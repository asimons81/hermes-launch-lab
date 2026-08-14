import type { MetadataRoute } from 'next'

const SITE_URL = 'https://launch.tonysimons.dev'

// Public, indexable routes. /services is a permanent redirect to /pricing, so it
// is intentionally excluded here — the sitemap must list real canonical pages.
const routes = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/sessions',
  '/features',
  '/faq',
  '/status',
  '/docs',
  '/docs/quickstart',
  '/docs/skills',
  '/docs/vault',
  '/docs/cron',
  '/legal/agreement',
  '/legal/privacy',
  '/legal/refund',
  '/legal/terms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))
}
