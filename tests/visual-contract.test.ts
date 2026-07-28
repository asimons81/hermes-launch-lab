import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('Technical Atelier visual contract', () => {
  it('gives the flagship homepage an outcome-led hero and truthful proof', () => {
    const page = read('app/page.tsx')
    expect(page).toMatch(/Leave with Hermes[\s\S]*working\./)
    expect(page).toContain('No secrets. No mystery-box setup.')
    expect(page).not.toMatch(/10\+ years shipping/i)
  })

  it('has shared public navigation with no public admin link', () => {
    const header = read('components/SiteHeader.tsx')
    expect(header).toContain('Book a session')
    expect(header).not.toMatch(/href="\/admin"/)
  })

  it('contains intentional mobile and reduced-motion styling', () => {
    const css = read('app/globals.css')
    expect(css).toContain('@media(max-width:720px)')
    expect(css).toContain('@media(prefers-reduced-motion:reduce)')
  })
})
