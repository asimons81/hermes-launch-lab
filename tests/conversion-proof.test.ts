import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

const PROOF_REPOS = [
  'https://github.com/asimons81/hermes-vault',
  'https://github.com/asimons81/nexusos',
  'https://github.com/asimons81/hardproof',
]

describe('conversion and proof contract', () => {
  it('ships a public About Tony route instead of a dead trust surface', () => {
    expect(existsSync(resolve(process.cwd(), 'app/about/page.tsx'))).toBe(true)
    const about = read('app/about/page.tsx')
    expect(about).toMatch(/About Tony|person configuring the system/i)
    expect(about).toMatch(/not affiliated with Nous Research/i)
    expect(about).toMatch(/openGraph:/)
    expect(about).toMatch(/url:\s*'\/about'/)
  })

  it('adds the About route to the canonical public sitemap', () => {
    const sitemap = read('app/sitemap.ts')
    expect(sitemap).toContain("'/about'")
  })

  it('keeps proof cards source-backed and inspectable', () => {
    expect(existsSync(resolve(process.cwd(), 'lib/project-proof.ts'))).toBe(true)
    const proof = read('lib/project-proof.ts')
    for (const repo of PROOF_REPOS) expect(proof).toContain(repo)
    expect(proof).toMatch(/hermes-vault\.webp|hermes-vault\.jpg/)
    expect(proof).toMatch(/nexusos\.webp|nexusos\.jpg/)
    expect(proof).toMatch(/hardproof\.webp|hardproof\.jpg/)
    expect(existsSync(resolve(process.cwd(), 'public/media/projects/hermes-vault.jpg'))).toBe(true)
    expect(existsSync(resolve(process.cwd(), 'public/media/projects/nexusos.jpg'))).toBe(true)
    expect(existsSync(resolve(process.cwd(), 'public/media/projects/hardproof.jpg'))).toBe(true)
  })

  it('puts real work, direct engagement steps, and About in the homepage conversion path', () => {
    const home = read('app/page.tsx')
    expect(home).toMatch(/ProjectProofGrid/)
    expect(home).toMatch(/EngagementSteps/)
    expect(home).toMatch(/href="\/about"/)
  })

  it('makes About Tony reachable from shared public navigation', () => {
    const header = read('components/SiteHeader.tsx')
    const footer = read('components/SiteFooter.tsx')
    expect(header).toMatch(/href="\/about"/)
    expect(footer).toMatch(/href="\/about"/)
  })

  it('does not replace evidence with fabricated credentials or social proof', () => {
    const surfaces = [
      read('app/about/page.tsx'),
      read('app/page.tsx'),
      read('lib/project-proof.ts'),
    ].join('\n')
    expect(surfaces).not.toMatch(/10\+ years|trusted by|client logos|official Hermes expert|certified Hermes/i)
  })
})
