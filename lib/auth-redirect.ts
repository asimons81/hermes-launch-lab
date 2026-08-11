/**
 * Safe booking → auth handoff helpers.
 *
 * The booking page sends anonymous buyers to /auth/signin with a callbackUrl
 * so they land back on the exact booking context after the magic-link round
 * trip. callbackUrl is user-controllable query state, so it must never be
 * echoed into a redirect unless it is provably an internal path.
 *
 * These helpers are deliberately dependency-free so the safety rules can be
 * unit-tested in isolation and reused from any route component.
 */

const DEFAULT_CALLBACK = '/portal'

/**
 * Validate a callback URL and return a safe internal path.
 *
 * Accepts only same-site absolute paths: must start with '/', must not be
 * protocol-relative ('//'), must contain no backslashes (browser path
 * smuggling), no colons (blocks 'javascript:', 'data:', and scheme injection
 * after a leading slash), and no whitespace/control characters. Values are
 * decoded before validation so '%2F%2Fevil.example' cannot slip through as a
 * protocol-relative URL. Anything else falls back to DEFAULT_CALLBACK.
 */
export function safeCallbackUrl(raw: string | null | undefined, fallback: string = DEFAULT_CALLBACK): string {
  if (!raw) return fallback
  const trimmed = raw.trim()
  if (trimmed !== raw) return fallback

  let decoded: string
  try {
    decoded = decodeURIComponent(trimmed)
  } catch {
    // Malformed percent-encoding — never trust it as a redirect target.
    return fallback
  }

  if (/\s/.test(decoded)) return fallback
  if (!decoded.startsWith('/')) return fallback
  if (decoded.startsWith('//')) return fallback
  if (decoded.includes('\\')) return fallback
  if (decoded.includes(':')) return fallback
  return decoded
}

/**
 * Build the sign-in URL that preserves booking intent.
 *
 * `service` is kept as its own query parameter so the sign-in page can show
 * selected-service context; `callbackUrl` is sanitized so the magic-link
 * redirect can never point outside the site.
 */
export function buildSignInUrl(opts: { callbackUrl?: string | null; service?: string | null }): string {
  const params = new URLSearchParams()
  params.set('callbackUrl', safeCallbackUrl(opts.callbackUrl))
  if (opts.service) params.set('service', opts.service)
  return `/auth/signin?${params.toString()}`
}
