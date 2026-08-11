import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/auth', '/book', '/intake', '/portal'],
    },
    sitemap: 'https://launch.tonysimons.dev/sitemap.xml',
  }
}
