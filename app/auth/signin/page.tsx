import { auth, signIn } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BrandMark } from '@/components/BrandMark'
import { prisma } from '@/lib/db'
import { safeCallbackUrl } from '@/lib/auth-redirect'

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; service?: string }>
}) {
  const sp = await searchParams
  const session = await auth()

  // callbackUrl is user-controlled; only an internal path is ever passed on
  // to the magic-link redirect. Anything else falls back to the portal.
  const callbackUrl = safeCallbackUrl(sp.callbackUrl)
  if (session) redirect(callbackUrl)

  // Selected-service context: resolve the slug so the buyer sees the real
  // service name (never echoed raw input). Failure degrades to generic copy;
  // sign-in itself must never break because of a catalog lookup.
  let serviceName: string | null = null
  let servicePrice: number | null = null
  if (sp.service) {
    try {
      const service = await prisma.service.findUnique({
        where: { slug: sp.service },
        select: { name: true, price: true },
      })
      serviceName = service?.name ?? null
      servicePrice = service?.price ?? null
    } catch {
      serviceName = null
      servicePrice = null
    }
  }

  return (
    <main id="main-content" tabIndex={-1} className="shell page-shell page-shell--narrow">
      <BrandMark />
      <section className="card" style={{ marginTop: 48 }}>
        <p className="eyebrow">CLIENT PORTAL</p>
        <h1 className="page-title" style={{ fontSize: 'clamp(42px,6vw,60px)' }}>Sign in securely.</h1>
        <p className="page-intro">
          Booking and the client portal need an account. We’ll send a magic link — no password to create or remember.
        </p>

        {serviceName && (
          <p className="notice" style={{ marginTop: 20 }}>
            You’re on your way to booking <strong>{serviceName}</strong>
            {servicePrice != null ? ` — $${servicePrice}` : ''}. After signing in, your
            selection will still be there.
          </p>
        )}

        <form
          action={async (formData: FormData) => {
            'use server'
            await signIn('resend', { email: formData.get('email') as string, redirectTo: callbackUrl })
          }}
          style={{ marginTop: 28 }}
        >
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" name="email" placeholder="you@domain.com" required />
          <p className="hero__note" style={{ marginTop: 14 }}>
            By continuing you agree to the{' '}
            <a href="/legal/terms" style={{ textDecoration: 'underline' }}>Terms of Service</a>,{' '}
            <a href="/legal/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</a>, and{' '}
            <a href="/legal/refund" style={{ textDecoration: 'underline' }}>Refund Policy</a>.
          </p>
          <button type="submit" className="button button--primary" style={{ width: '100%', marginTop: 14 }}>
            Send secure link <span>↗</span>
          </button>
        </form>

        <p className="hero__note" style={{ marginTop: 18 }}>
          Independent service. Not affiliated with Nous Research or Hermes Agent maintainers.
        </p>
      </section>
    </main>
  )
}
