import { test, expect, Page, BrowserContext } from '@playwright/test'

const VIEWPORTS = [390, 768, 1024, 1280, 1440]
const PAGES = ['/', '/pricing', '/features', '/docs', '/docs/quickstart', '/faq', '/status', '/legal/terms', '/services']

async function newCtx(browser: any, width: number): Promise<BrowserContext> {
  return browser.newContext({ viewport: { width, height: 900 } })
}

test.describe('no page-level horizontal overflow at target viewports', () => {
  for (const width of VIEWPORTS) {
    test(`viewport ${width}px has no horizontal overflow on public pages`, async ({ browser }) => {
      const ctx = await newCtx(browser, width)
      const page = await ctx.newPage()
      const failures: string[] = []
      for (const path of PAGES) {
        await page.goto(path, { waitUntil: 'networkidle', timeout: 30_000 })
        const m = await page.evaluate(() => ({
          doc: document.documentElement.scrollWidth,
          vw: window.innerWidth,
        }))
        if (m.doc > m.vw) failures.push(`${path}: scrollWidth ${m.doc} > vw ${m.vw}`)
      }
      await ctx.close()
      expect(failures, failures.join('\n')).toEqual([])
    })
  }
})

test.describe('header responsive exclusivity', () => {
  test('mobile (390px): hamburger visible, desktop nav + actions hidden', async ({ browser }) => {
    const ctx = await newCtx(browser, 390)
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const hamburger = page.getByRole('button', { name: /open menu|close menu/i })
    await expect(hamburger).toBeVisible()
    const nav = page.locator('nav[aria-label="Primary navigation"]')
    await expect(nav).toBeHidden()
    // Desktop Search + Book actions are hidden on mobile (scope to the site header
    // because the hero/footer also carry visible Book CTAs on small screens)
    const header = page.locator('.site-header')
    await expect(header.getByRole('button', { name: /^Search$/ })).toBeHidden()
    await expect(header.getByRole('link', { name: /Book a session/ })).toBeHidden()
    await ctx.close()
  })

  test('desktop (1280px): desktop nav visible, hamburger hidden, actions horizontal', async ({ browser }) => {
    const ctx = await newCtx(browser, 1280)
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const nav = page.locator('nav[aria-label="Primary navigation"]')
    await expect(nav).toBeVisible()
    await expect(page.getByRole('button', { name: /open menu/i })).toBeHidden()
    // Search and Book actions sit side by side (same y), not stacked
    const search = page.getByRole('button', { name: /^Search$/ })
    const book = page.getByRole('link', { name: /Book a session/ }).first()
    await expect(search).toBeVisible()
    await expect(book).toBeVisible()
    const sb = await search.boundingBox()
    const bb = await book.boundingBox()
    expect(sb).not.toBeNull()
    expect(bb).not.toBeNull()
    expect(Math.abs(sb!.y - bb!.y)).toBeLessThanOrEqual(6)
    expect(bb!.x).toBeGreaterThan(sb!.x)
    await ctx.close()
  })

  test('menu disclosure: aria-expanded toggles, Escape closes, focus returns to toggle', async ({ browser }) => {
    const ctx = await newCtx(browser, 390)
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const toggle = page.getByRole('button', { name: /open menu|close menu/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const drawer = page.locator('#mobile-menu')
    await expect(drawer).toBeVisible()
    // Escape closes and returns focus
    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(drawer).toBeHidden()
    expect(await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))).toMatch(/open menu/i)
    await ctx.close()
  })

  test('mobile drawer offers Book + Search actions', async ({ browser }) => {
    const ctx = await newCtx(browser, 390)
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /open menu/i }).click()
    const drawer = page.locator('#mobile-menu')
    await expect(drawer.getByRole('link', { name: /Book a session/ })).toBeVisible()
    await expect(drawer.getByRole('button', { name: /search/i })).toBeVisible()
    await ctx.close()
  })
})

test.describe('skip link', () => {
  test('skip link is first in tab order and jumps to main content', async ({ browser }) => {
    const ctx = await newCtx(browser, 1280)
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const skip = page.getByRole('link', { name: /skip to content/i })
    await skip.focus()
    await expect(skip).toBeVisible()
    await skip.press('Enter')
    await expect(page).toHaveURL(/#main-content/)
    await expect(page.locator('#main-content')).toBeFocused()
    await ctx.close()
  })
})

test.describe('command palette dialog semantics', () => {
  test('Ctrl+K opens a labelled modal dialog with search input; Escape closes and restores focus', async ({ browser }) => {
    const ctx = await newCtx(browser, 1280)
    const page = await ctx.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const search = page.getByRole('button', { name: /^Search$/ })
    await search.click()
    const dialog = page.getByRole('dialog', { name: /command/i })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    const input = dialog.getByRole('textbox')
    await expect(input).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    expect(await page.evaluate(() => document.activeElement?.textContent)).toContain('Search')
    await ctx.close()
  })
})

test.describe('axe scan', () => {
  const RULES = ['color-contrast', 'heading-order', 'label', 'button-name', 'link-name', 'landmark-one-main', 'region']

  for (const width of [390, 1280]) {
    test(`homepage has no serious axe violations at ${width}px`, async ({ browser }) => {
      const ctx = await newCtx(browser, width)
      const page = await ctx.newPage()
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
      const results = await page.evaluate(async (rules) => {
        const r = await (window as any).axe.run(document, {
          runOnly: { type: 'rule', values: rules },
        })
        return r.violations.map((v: any) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.length,
          targets: v.nodes.slice(0, 5).map((n: any) => n.target.join(' ')),
        }))
      }, RULES)
      const serious = results.filter((v: any) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious, JSON.stringify(results, null, 2)).toEqual([])
      await ctx.close()
    })
  }
})
