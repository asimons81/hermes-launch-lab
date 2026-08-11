import { describe, expect, it } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const ROOT = process.cwd()
const read = (path: string) => readFileSync(resolve(ROOT, path), 'utf8')

/**
 * Documentation accuracy contract.
 *
 * Ground truth captured 2026-08-10 from:
 *  - `hermes --version` -> Hermes Agent v0.20.0 (2026.8.3)
 *  - `hermes --help` and subcommand receipts on the same build
 *  - Official docs at https://hermes-agent.nousresearch.com/docs
 *
 * These tests fail on stale URLs, invalid CLI commands, fabricated
 * sample output, and unsupported security absolutes.
 */

const OFFICIAL_INSTALL_URL = 'https://hermes-agent.nousresearch.com/install.sh'

const BANNED_PATTERNS: RegExp[] = [
  // Dead/self-hosted installer
  /hermes\.tonysimons\.dev/,
  /bootstrap\.sh/,
  // Commands that do not exist on the v0.20.0 CLI
  /hermes\s+skill\s+load\b/,
  /\$?\s*hermes\s+test\b/,
  /hermes\s+benchmark\b/,
  /hermes\s+vault\b/,
  /hermes\s+workflow\b/,
  // Invalid cron syntax: schedule is positional, not --schedule
  /hermes\s+cron\s+create\s+--schedule\b/,
  /--schedule\s+"0 \*\/2/,
  // Unsupported absolutes / fabricated internals
  /zero[- ]leak/i,
  /ChaCha20/i,
  /hvs_lease/,
  /lease (request|issued|renewed|token)/i,
  // Stale version claims
  /v0\.19\.0/,
  // Fabricated skill-count claims
  /55\s+skills/,
  /skills\s+indexed/,
]

const REQUIRED_REAL_COMMANDS: Record<string, RegExp[]> = {
  'app/docs/quickstart/page.tsx': [
    /hermes-agent\.nousresearch\.com\/install\.sh/,
    /hermes\s+setup/,
    /hermes\s+doctor\b/,
  ],
  'app/docs/skills/page.tsx': [
    /hermes\s+skills\s+(list|install|browse|search)\b/,
    /SKILL\.md/,
  ],
  'app/docs/vault/page.tsx': [
    /hermes\s+secrets\b/,
    /hermes\s+egress\b/,
  ],
  'app/docs/cron/page.tsx': [
    /hermes\s+cron\s+create\s+"every\s+2h"/,
    /hermes\s+cron\s+list\b/,
  ],
}

const FILES_IN_SCOPE = [
  'app/docs/quickstart/page.tsx',
  'app/docs/skills/page.tsx',
  'app/docs/vault/page.tsx',
  'app/docs/cron/page.tsx',
  'app/docs/page.tsx',
  'app/features/page.tsx',
  'app/status/page.tsx',
  'app/layout.tsx',
  'components/DocsLayout.tsx',
  'components/SkillCatalog.tsx',
  'components/LiveTerminal.tsx',
  'components/ReceiptsRail.tsx',
  'components/StatusBar.tsx',
  'components/TopoGraph.tsx',
  'components/SiteFooter.tsx',
]

describe('Docs accuracy contract (v0.20.0 CLI + official docs)', () => {
  describe('quickstart', () => {
    const page = read('app/docs/quickstart/page.tsx')

    it('uses the official installer URL, not the dead self-hosted bootstrap', () => {
      expect(page).toContain(OFFICIAL_INSTALL_URL)
      expect(page).not.toMatch(/hermes\.tonysimons\.dev|bootstrap\.sh/)
    })

    it('replaces hermes skill load / hermes test with real commands', () => {
      expect(page).toMatch(/hermes\s+setup\b/)
      expect(page).toMatch(/hermes\s+doctor\b/)
      expect(page).not.toMatch(/hermes\s+skill\s+load\b/)
      expect(page).not.toMatch(/hermes\s+test\b/)
    })

    it('does not show fabricated setup/test output', () => {
      expect(page).not.toMatch(/Toolchains indexed/)
      expect(page).not.toMatch(/Session setup complete/)
      expect(page).not.toMatch(/Core Engine: OK/)
    })
  })

  describe('skills', () => {
    const page = read('app/docs/skills/page.tsx')

    it('uses real skill commands and does not reference hermes skill load', () => {
      expect(page).toMatch(/hermes\s+skills\s+(list|install|browse|search)\b/)
      expect(page).not.toMatch(/hermes\s+skill\s+load\b/)
    })

    it('labels the manifest example as an example and uses real frontmatter', () => {
      expect(page).toMatch(/example/i)
      const manifest = page.match(/code=\{`[\s\S]*?SKILL\.md[\s\S]*?`\}/)
      if (manifest) {
        expect(manifest[0]).toMatch(/name:/)
        expect(manifest[0]).toMatch(/description:/)
        expect(manifest[0]).not.toMatch(/tools:/)
      }
    })
  })

  describe('vault / credential security', () => {
    const page = read('app/docs/vault/page.tsx')

    it('does not invent a hermes vault command or lease broker', () => {
      expect(page).not.toMatch(/hermes\s+vault\b/)
      expect(page).not.toMatch(/ChaCha20|hvs_lease|lease (request|issued|renewed|token)/i)
    })

    it('removes zero-leak absolutes', () => {
      expect(page).not.toMatch(/zero[- ]leak/i)
    })

    it('documents the real secret-management surfaces', () => {
      expect(page).toMatch(/hermes\s+secrets\b/)
      expect(page).toMatch(/hermes\s+egress\b/)
    })
  })

  describe('cron', () => {
    const page = read('app/docs/cron/page.tsx')

    it('uses positional schedule syntax, not --schedule', () => {
      expect(page).toMatch(/hermes\s+cron\s+create\s+"every\s+2h"/)
      expect(page).not.toMatch(/--schedule/)
    })

    it('keeps the real hermes cron list command', () => {
      expect(page).toMatch(/hermes\s+cron\s+list\b/)
    })
  })

  describe('docs index', () => {
    const page = read('app/docs/page.tsx')
    it('does not advertise lease-based credential brokering', () => {
      expect(page).not.toMatch(/lease-based credential brokering/)
    })
  })

  describe('global stale-claim scan', () => {
    it.each(FILES_IN_SCOPE)('%s contains no banned patterns', file => {
      const content = read(file)
      for (const pattern of BANNED_PATTERNS) {
        expect(content, `banned pattern ${pattern} in ${file}`).not.toMatch(pattern)
      }
    })
  })

  describe('real command grounding', () => {
    it.each(Object.entries(REQUIRED_REAL_COMMANDS))('%s contains the real command', (file, patterns) => {
      const content = read(file)
      for (const pattern of patterns) {
        expect(content, `missing ${pattern} in ${file}`).toMatch(pattern)
      }
    })
  })

  describe('marketing surfaces', () => {
    it('features page does not claim the demo skills are real/loadable', () => {
      const page = read('app/features/page.tsx')
      expect(page).not.toMatch(/Inspect & Load Real Skills/)
      expect(page).not.toMatch(/real Hermes Agent skills/i)
      expect(page).not.toMatch(/Brokered vault security/)
    })

    it('live terminal uses real commands and is labeled as a simulation', () => {
      const page = read('components/LiveTerminal.tsx')
      expect(page).toMatch(/simulated|demo/i)
      expect(page).not.toMatch(/hermes\s+skill\s+load\b/)
      expect(page).not.toMatch(/hermes\s+vault\b/)
      expect(page).not.toMatch(/hermes\s+benchmark\b/)
      expect(page).not.toMatch(/hermes\s+workflow\b/)
    })

    it('skill catalog uses real command forms and is labeled as a demo/example', () => {
      const page = read('components/SkillCatalog.tsx')
      expect(page).not.toMatch(/hermes\s+skill\s+load\b/)
      expect(page).toMatch(/example|illustrative|demo/i)
      expect(page).toMatch(/hermes\s+skills\s+(list|browse|search|install)/)
    })

    it('receipts rail is labeled as a demo, not live system activity', () => {
      const page = read('components/ReceiptsRail.tsx')
      expect(page).not.toMatch(/Live agent activity/)
      expect(page).toMatch(/demo|simulated|illustrative/i)
    })

    it('status page shows the real current version, not v0.19.0', () => {
      const page = read('app/status/page.tsx')
      expect(page).not.toMatch(/v0\.19\.0/)
    })

    it('site metadata/footer do not sell a nonexistent "vault" product', () => {
      const layout = read('app/layout.tsx')
      const footer = read('components/SiteFooter.tsx')
      expect(layout).not.toMatch(/zero-trust vault/)
      expect(footer).not.toMatch(/zero-trust vault/)
    })
  })

  describe('docs routes resolve', () => {
    it('every docs link in the layout sidebar maps to a real page', () => {
      const layout = read('components/DocsLayout.tsx')
      const hrefs = [...layout.matchAll(/href:\s*'(\/docs[^']*)'/g)].map(m => m[1])
      expect(hrefs.length).toBeGreaterThan(0)
      for (const href of hrefs) {
        const rel = href.replace(/^\/docs\/?/, '')
        const pagePath = rel
          ? join('app/docs', rel, 'page.tsx')
          : 'app/docs/page.tsx'
        expect(existsSync(resolve(ROOT, pagePath)), `route ${href} has no page at ${pagePath}`).toBe(true)
      }
    })

    it('every docs index card links to a real page', () => {
      const index = read('app/docs/page.tsx')
      const slugs = [...index.matchAll(/slug:\s*'([a-z-]+)'/g)].map(m => m[1])
      expect(slugs.length).toBeGreaterThan(0)
      for (const slug of slugs) {
        expect(existsSync(resolve(ROOT, 'app/docs', slug, 'page.tsx')), `docs card ${slug} has no page`).toBe(true)
      }
    })

    it('every app/docs page file is linked from the sidebar or index', () => {
      const layout = read('components/DocsLayout.tsx')
      const index = read('app/docs/page.tsx')
      const slugs = readdirSync(resolve(ROOT, 'app/docs'), { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name)
      for (const slug of slugs) {
        const linked = layout.includes(`/docs/${slug}`) || index.includes(`/docs/${slug}`)
        expect(linked, `docs/${slug} page is not linked`).toBe(true)
      }
    })
  })
})
