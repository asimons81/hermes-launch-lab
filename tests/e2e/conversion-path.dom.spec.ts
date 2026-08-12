import { expect, test } from '@playwright/test'

const sourceRepos = [
  'https://github.com/asimons81/hermes-vault',
  'https://github.com/asimons81/nexusos',
  'https://github.com/asimons81/hardproof',
]

test.describe('conversion and proof path', () => {
  test('About Tony is public, indexable, and connected to the primary navigation', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' })

    await expect(page).toHaveTitle(/About Tony/i)
    await expect(page.getByRole('heading', { level: 1, name: /person configuring the system/i })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://launch.tonysimons.dev/about')

    const header = page.locator('.site-header')
    await expect(header.getByRole('link', { name: /About Tony/i })).toBeVisible()
    await expect(header.getByRole('link', { name: /Book a session/i })).toHaveAttribute('href', '/book?service=launch')
  })

  test('real proof cards link to exact public source repositories', async ({ page }) => {
    await page.goto('/about', { waitUntil: 'networkidle' })

    const cards = page.locator('.proof-project')
    await expect(cards).toHaveCount(3)
    for (const url of sourceRepos) {
      await expect(page.locator(`.proof-project a[href="${url}"]`)).toBeVisible()
    }
  })

  test('homepage presents proof and direct engagement context before the session diagnostic', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await expect(page.getByRole('link', { name: /Meet Tony/i })).toHaveAttribute('href', '/about')
    await expect(page.locator('.proof-work')).toBeVisible()
    await expect(page.locator('.engagement-steps')).toBeVisible()

    const order = await page.evaluate(() => {
      const proof = document.querySelector('.proof-work')?.getBoundingClientRect().top ?? Infinity
      const steps = document.querySelector('.engagement-steps')?.getBoundingClientRect().top ?? Infinity
      const diagnostic = document.querySelector('.diagnostic-section')?.getBoundingClientRect().top ?? Infinity
      return { proof, steps, diagnostic }
    })
    expect(order.proof).toBeLessThan(order.diagnostic)
    expect(order.steps).toBeLessThan(order.diagnostic)
  })

  test('conversion pages remain usable without horizontal overflow at mobile and desktop widths', async ({ browser }) => {
    for (const width of [375, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } })
      const page = await context.newPage()
      for (const path of ['/', '/about', '/pricing', '/faq', '/features']) {
        await page.goto(path, { waitUntil: 'networkidle' })
        const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }))
        expect(dimensions.document, `${path} overflow at ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
      }
      await context.close()
    }
  })
})
