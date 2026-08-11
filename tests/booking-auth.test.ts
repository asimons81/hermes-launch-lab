import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { safeCallbackUrl, buildSignInUrl } from '../lib/auth-redirect'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('booking → auth handoff preserves intent safely', () => {
  describe('safeCallbackUrl', () => {
    it('accepts an internal path with a query string', () => {
      expect(safeCallbackUrl('/book?service=launch')).toBe('/book?service=launch')
    })

    it('accepts plain internal paths', () => {
      expect(safeCallbackUrl('/intake')).toBe('/intake')
      expect(safeCallbackUrl('/')).toBe('/')
    })

    it('rejects absolute external URLs', () => {
      expect(safeCallbackUrl('https://evil.example/phish')).toBe('/portal')
    })

    it('rejects protocol-relative URLs', () => {
      expect(safeCallbackUrl('//evil.example/phish')).toBe('/portal')
    })

    it('rejects backslash path smuggling', () => {
      expect(safeCallbackUrl('/\\evil.example/phish')).toBe('/portal')
    })

    it('rejects scheme-like internal paths containing a colon', () => {
      expect(safeCallbackUrl('/javascript:alert(1)')).toBe('/portal')
    })

    it('rejects encoded protocol-relative URLs after decoding', () => {
      expect(safeCallbackUrl('/%2F%2Fevil.example')).toBe('/portal')
    })

    it('falls back for undefined, null, and empty values', () => {
      expect(safeCallbackUrl(undefined)).toBe('/portal')
      expect(safeCallbackUrl(null)).toBe('/portal')
      expect(safeCallbackUrl('')).toBe('/portal')
    })

    it('rejects control characters and whitespace injection', () => {
      expect(safeCallbackUrl('/book\nLocation: /evil')).toBe('/portal')
      expect(safeCallbackUrl('/book  /evil')).toBe('/portal')
    })
  })

  describe('buildSignInUrl', () => {
    it('preserves callbackUrl and service intent', () => {
      expect(buildSignInUrl({ callbackUrl: '/book?service=launch', service: 'launch' })).toBe(
        '/auth/signin?callbackUrl=%2Fbook%3Fservice%3Dlaunch&service=launch'
      )
    })

    it('omits service when absent', () => {
      expect(buildSignInUrl({ callbackUrl: '/intake' })).toBe('/auth/signin?callbackUrl=%2Fintake')
    })

    it('never leaks an unsafe callback into the sign-in URL', () => {
      expect(buildSignInUrl({ callbackUrl: 'https://evil.example' })).toBe('/auth/signin?callbackUrl=%2Fportal')
    })
  })
})

describe('booking page auth gate', () => {
  it('preserves service intent when redirecting an anonymous buyer to sign-in', () => {
    const page = read('app/book/page.tsx')
    expect(page).not.toMatch(/redirect\('\/auth\/signin'\)/)
    expect(page).toContain('buildSignInUrl')
    expect(page).toContain('callbackUrl')
    expect(page).toContain('searchParams.service')
  })
})

describe('sign-in page pre-auth context', () => {
  it('shows an honest account-first explanation', () => {
    const page = read('app/auth/signin/page.tsx')
    expect(page).toMatch(/account/i)
  })

  it('renders Terms, Privacy, and Refund links before requesting a magic link', () => {
    const page = read('app/auth/signin/page.tsx')
    expect(page).toContain('/legal/terms')
    expect(page).toContain('/legal/privacy')
    expect(page).toContain('/legal/refund')
  })

  it('passes a safe callbackUrl into the magic-link redirect', () => {
    const page = read('app/auth/signin/page.tsx')
    expect(page).toContain('safeCallbackUrl')
    expect(page).toContain('redirectTo')
  })

  it('shows selected-service context when a service param is present', () => {
    const page = read('app/auth/signin/page.tsx')
    expect(page).toMatch(/service/i)
  })
})

describe('intake gate and labels', () => {
  it('preserves intake callback instead of a generic sign-in redirect', () => {
    const page = read('app/intake/page.tsx')
    expect(page).not.toMatch(/redirect\('\/auth\/signin'\)/)
    expect(page).toContain('buildSignInUrl')
  })

  it('footer labels intake truthfully (Pre-Session, not generic Diagnostic)', () => {
    const footer = read('components/SiteFooter.tsx')
    expect(footer).not.toMatch(/Diagnostic Intake/)
    expect(footer).toContain('Pre-Session Intake')
  })
})

describe('custom build application path is truthful', () => {
  it('services page no longer claims an application flow that does not exist', () => {
    const page = read('app/services/page.tsx')
    expect(page).not.toMatch(/Application required\./)
  })

  it('pricing page carries the same truthful custom copy', () => {
    const page = read('app/pricing/page.tsx')
    expect(page).not.toMatch(/Application required\./)
  })

  it('custom card points to the public contact path instead of a nonexistent app flow', () => {
    const card = read('components/ServiceCard.tsx')
    expect(card).toContain('/contact')
    expect(card).toMatch(/custom/i)
  })
})

describe('public contact path', () => {
  it('exposes a contact page with a real destination and no secret collection', () => {
    const page = read('app/contact/page.tsx')
    expect(page).toContain('mailto:')
    expect(page).toMatch(/secret/i)
    expect(page).not.toMatch(/<form/i)
  })

  it('privacy page links to the public contact path', () => {
    const page = read('app/legal/privacy/page.tsx')
    expect(page).toContain('/contact')
  })

  it('footer exposes the contact page', () => {
    const footer = read('components/SiteFooter.tsx')
    expect(footer).toContain('/contact')
  })
})
