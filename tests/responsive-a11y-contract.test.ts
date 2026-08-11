import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

/* WCAG 2.x relative luminance + contrast helpers */
function channel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
function luminance(hex: string): number {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}
function contrast(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}
function cssVar(css: string, name: string): string {
  const m = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!m) throw new Error(`missing css var --${name}`)
  return m[1].trim()
}

describe('Responsive & accessibility repair contract (static)', () => {
  const css = read('app/globals.css')
  const header = read('components/SiteHeader.tsx')
  const palette = read('components/CommandPalette.tsx')
  const roi = read('components/RoiCalculator.tsx')
  const brand = read('components/BrandMark.tsx')
  const layout = read('app/layout.tsx')
  const tailwind = read('tailwind.config.ts')

  it('generates Tailwind utilities so hidden/md:flex/md:hidden work', () => {
    expect(css).toMatch(/@tailwind\s+utilities/)
  })

  it('aligns the responsive md breakpoint with the site design breakpoint (900px)', () => {
    expect(tailwind).toMatch(/md\s*:\s*['"]900px['"]/)
  })

  it('keeps the reduced-motion and mobile CSS blocks the visual contract requires', () => {
    expect(css).toContain('@media(max-width:720px)')
    expect(css).toContain('@media(prefers-reduced-motion:reduce)')
  })

  it('has a skip-to-content link and a matching main-content target', () => {
    expect(header).toMatch(/Skip to content/)
    expect(header).toMatch(/href=["']#main-content["']/)
    const mains = [
      'app/page.tsx',
      'app/contact/page.tsx',
      'app/features/page.tsx',
      'app/pricing/page.tsx',
      'app/faq/page.tsx',
      'app/status/page.tsx',
      'app/portal/page.tsx',
      'app/admin/page.tsx',
      'app/book/page.tsx',
      'app/intake/page.tsx',
      'app/services/page.tsx',
      'app/legal/layout.tsx',
      'components/DocsLayout.tsx',
    ]
    for (const f of mains) expect(read(f)).toMatch(/<main[^>]*id=["']main-content["']/)
  })

  it('declares menu disclosure semantics on the hamburger and drawer', () => {
    expect(header).toMatch(/aria-expanded=\{(menuOpen|menuOpen \? true : false)\}/)
    expect(header).toMatch(/aria-controls=["']mobile-menu["']/)
    expect(header).toMatch(/id=["']mobile-menu["']/)
    expect(header).toMatch(/role=["']navigation["']|aria-label=["']Mobile/)
  })

  it('gives the command palette proper dialog semantics and labelled search', () => {
    expect(palette).toMatch(/role=["']dialog["']/)
    expect(palette).toMatch(/aria-modal/)
    expect(palette).toMatch(/aria-label=["'][^"']*command[^"']*["']/i)
    expect(palette).toMatch(/aria-label=|aria-labelledby=/) // input labelled
  })

  it('labels the ROI sliders', () => {
    expect(roi).toMatch(/aria-label=|htmlFor=/)
    expect((roi.match(/type=["']range["']/g) || []).length).toBeGreaterThanOrEqual(2)
  })

  it('matches the brand accessible name to its visible text', () => {
    // Visible text is "TONY SIMONS // LAUNCH LAB"; the aria-label must not diverge.
    expect(brand).toMatch(/aria-label=["'][^"']*TONY SIMONS/i)
  })

  it('adds explicit type="button" to non-submit interactive buttons', () => {
    const files = [
      'components/SiteHeader.tsx',
      'components/CommandPalette.tsx',
      'components/DiagnosticIntake.tsx',
      'components/LiveTerminal.tsx',
      'components/SkillCatalog.tsx',
      'components/DocsLayout.tsx',
      'components/TopoGraph.tsx',
      'app/status/page.tsx',
    ]
    for (const f of files) {
      const src = read(f)
      // Every <button> without a submit intent must carry an explicit type.
      const buttons = src.match(/<button[\s>]/g) || []
      expect(buttons.length, `${f} has buttons`).toBeGreaterThan(0)
      const untyped = src.match(/<button(?![^>]*type=)[\s>]/g) || []
      expect(untyped, `${f} has untyped buttons`).toEqual([])
    }
  })

  it('keeps heading hierarchy without skips on audited pages', () => {
    const checks: Record<string, string[]> = {
      'components/TopoGraph.tsx': ['h3'], // detail heading must not skip h3
      'components/ServiceCard.tsx': ['h2'], // offer title must not skip h2
      'app/features/page.tsx': ['h2'], // pillars must not skip h2
      'app/portal/page.tsx': ['h2'],
      'app/admin/page.tsx': ['h2'],
      'app/legal/terms/page.tsx': ['h2'],
    }
    for (const [f, tags] of Object.entries(checks)) {
      const src = read(f)
      for (const tag of tags) expect(src, `${f} uses ${tag}`).toContain(`<${tag}`)
    }
  })

  it('defines accessible contrast tokens (>= 4.5:1 for essential text)', () => {
    const bg = cssVar(css, 'bg')
    const ink = cssVar(css, 'ink')
    const muted = cssVar(css, 'muted')
    const faint = cssVar(css, 'faint')
    const muted2 = cssVar(css, 'muted-2')
    expect(contrast(ink, bg)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(muted, bg)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(faint, bg)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(muted2, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it('defines a global focus-visible indicator', () => {
    expect(css).toMatch(/:focus-visible/)
    expect(css).toMatch(/outline[^;]*2px/)
  })

  it('does not rely on opacity alone to mute essential text', () => {
    // Receipts dimmed to opacity 0.6 fail contrast; either full opacity or explicit tokens.
    expect(css).not.toMatch(/\.receipt\s*{[^}]*opacity:\s*0\.6/)
  })
})
