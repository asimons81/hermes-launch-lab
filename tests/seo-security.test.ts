import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')
const exists = (path: string) => existsSync(resolve(process.cwd(), path))

const CANONICAL_ORIGIN = 'https://launch.tonysimons.dev'

// Public, indexable routes — must appear in sitemap with per-route metadata + canonical.
const PUBLIC_ROUTES = [
  { path: '/', file: 'app/page.tsx' },
  { path: '/contact', file: 'app/contact/page.tsx' },
  { path: '/pricing', file: 'app/pricing/page.tsx' },
  { path: '/features', file: 'app/features/page.tsx' },
  { path: '/faq', file: 'app/faq/page.tsx' },
  { path: '/status', file: 'app/status/layout.tsx' },
  { path: '/docs', file: 'app/docs/page.tsx' },
  { path: '/docs/quickstart', file: 'app/docs/quickstart/page.tsx' },
  { path: '/docs/skills', file: 'app/docs/skills/page.tsx' },
  { path: '/docs/vault', file: 'app/docs/vault/page.tsx' },
  { path: '/docs/cron', file: 'app/docs/cron/page.tsx' },
  { path: '/legal/terms', file: 'app/legal/terms/page.tsx' },
  { path: '/legal/privacy', file: 'app/legal/privacy/page.tsx' },
  { path: '/legal/refund', file: 'app/legal/refund/page.tsx' },
  { path: '/legal/agreement', file: 'app/legal/agreement/page.tsx' },
]

// Private / auth-gated routes that must be excluded from sitemap and noindexed.
const PRIVATE_ROUTES = ['/admin', '/auth', '/book', '/intake', '/portal', '/api']

describe('SEO route files', () => {
  it('serves a robots.txt route that blocks private paths and advertises the sitemap', () => {
    const robots = read('app/robots.ts')
    expect(robots).toContain('default function robots')
    expect(robots).toContain(`${CANONICAL_ORIGIN}/sitemap.xml`)
    expect(robots).toContain('/admin')
    expect(robots).toContain('/api')
    expect(robots).toContain('/auth')
    expect(robots).toContain('/book')
    expect(robots).toContain('/intake')
    expect(robots).toContain('/portal')
  })

  it('derives the sitemap from actual public routes and never the /services redirect', () => {
    const sitemap = read('app/sitemap.ts')
    for (const route of PUBLIC_ROUTES) {
      expect(sitemap).toContain(`'${route.path}'`)
    }
    // /services is a permanent redirect to /pricing — must not appear in the sitemap.
    expect(sitemap).not.toContain(`'/services'`)
    // Private routes must not appear in the sitemap.
    for (const route of PRIVATE_ROUTES) {
      expect(sitemap).not.toContain(`'${route}'`)
    }
  })

  it('serves a branded custom 404 with recovery links', () => {
    const notFound = read('app/not-found.tsx')
    expect(notFound).toMatch(/404|not.?found/i)
    expect(notFound).toContain('href="/"')
    expect(notFound).toContain('href="/pricing"')
  })
})

describe('per-route metadata', () => {
  it('gives every public route its own title, description, and canonical URL', () => {
    for (const route of PUBLIC_ROUTES) {
      const page = read(route.file)
      expect(page, `${route.file} must export metadata`).toMatch(/export const metadata/)
      expect(page, `${route.file} must have a title`).toMatch(/title:/)
      expect(page, `${route.file} must have a description`).toMatch(/description:/)
      expect(page, `${route.file} canonical for ${route.path}`).toContain(`canonical: '${route.path}'`)
    }
  })

  it('noindexes private auth-gated routes instead of giving them duplicate public titles', () => {
    for (const file of [
      'app/admin/page.tsx',
      'app/auth/signin/page.tsx',
      'app/auth/verify/page.tsx',
      'app/book/page.tsx',
      'app/book/cancel/page.tsx',
      'app/book/success/page.tsx',
      'app/intake/page.tsx',
      'app/portal/page.tsx',
    ]) {
      const page = read(file)
      expect(page, `${file} must noindex private content`).toMatch(/index:\s*false/)
    }
  })

  it('defines metadataBase, openGraph, twitter, and title template in the root layout', () => {
    const layout = read('app/layout.tsx')
    expect(layout).toContain(`metadataBase: new URL('${CANONICAL_ORIGIN}')`)
    expect(layout).toContain('openGraph:')
    expect(layout).toContain('twitter:')
    expect(layout).toContain('template:')
    expect(layout).toContain('siteName:')
  })
})

describe('icon and social image assets', () => {
  it('ships a real favicon that will not 404', () => {
    expect(exists('public/favicon.ico')).toBe(true)
    const ico = readFileSync(resolve(process.cwd(), 'public/favicon.ico'))
    // ICO magic: 00 00 01 00
    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0])
    expect(ico.length).toBeGreaterThan(1000)
  })

  it('ships an apple-touch-icon and a 1200x630 social image', () => {
    for (const file of ['public/apple-touch-icon.png', 'public/og.png']) {
      expect(exists(file), `${file} must exist`).toBe(true)
      const png = readFileSync(resolve(process.cwd(), file))
      expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      if (file === 'public/og.png') {
        // IHDR width/height at bytes 16-23 (big-endian)
        const width = png.readUInt32BE(16)
        const height = png.readUInt32BE(20)
        expect(width).toBe(1200)
        expect(height).toBe(630)
      }
    }
  })

  it('references the favicon from the root layout', () => {
    const layout = read('app/layout.tsx')
    expect(layout).toMatch(/icons:/)
    expect(layout).toContain('/favicon.ico')
  })
})

describe('security headers', () => {
  it('disables the x-powered-by header and configures baseline security headers', () => {
    const config = read('next.config.ts')
    expect(config).toContain('poweredByHeader: false')
    expect(config).toContain('Content-Security-Policy')
    expect(config).toContain('X-Content-Type-Options')
    expect(config).toContain('nosniff')
    expect(config).toContain('Referrer-Policy')
    expect(config).toContain('Permissions-Policy')
    expect(config).toContain('X-Frame-Options')
  })

  it('uses a CSP compatible with the Next App Router runtime', () => {
    const config = read('next.config.ts')
    // RSC payload + hydration are inline scripts; styles are inline; everything else self-hosted.
    expect(config).toContain("script-src 'self' 'unsafe-inline'")
    expect(config).toContain("style-src 'self' 'unsafe-inline'")
    expect(config).toContain("default-src 'self'")
    expect(config).toContain("frame-ancestors 'self'")
    expect(config).toContain("object-src 'none'")
    expect(config).toContain("base-uri 'self'")
  })

  it('never emits wildcard CORS on documents', () => {
    // Source must not contain a wildcard ACAO anywhere.
    const config = read('next.config.ts')
    expect(config).not.toMatch(/access-control-allow-origin\s*[:=]\s*['"]?\*/i)
    // vercel.json overrides the Vercel CDN wildcard with the canonical origin.
    expect(exists('vercel.json')).toBe(true)
    const vercel = JSON.parse(read('vercel.json'))
    const acao = (vercel.headers ?? [])
      .flatMap((rule: { headers: Array<{ key: string; value: string }> }) => rule.headers)
      .find((h: { key: string }) => h.key.toLowerCase() === 'access-control-allow-origin')
    expect(acao).toBeDefined()
    expect(acao.value).not.toBe('*')
    expect(acao.value).toBe(CANONICAL_ORIGIN)
  })
})
