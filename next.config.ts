import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/services', destination: '/pricing', permanent: true },
    ]
  },
  async headers() {
    // The production CSP matches what Next.js App Router actually emits:
    // inline RSC/hydration bootstrap scripts, self-hosted chunks/CSS/fonts,
    // and React inline style attributes. Dev relaxes connect-src for HMR.
    const isProd = process.env.NODE_ENV === 'production'
    // GA4 gtag is only loaded (and only allowed by CSP) when the measurement
    // ID is actually set on the platform. No env var -> no third-party
    // scripts and a fully strict CSP.
    const gaEnabled = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}${gaEnabled ? ' https://www.googletagmanager.com' : ''}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob:${gaEnabled ? ' https://www.google-analytics.com' : ''}`,
      "font-src 'self' data:",
      `connect-src 'self'${isProd ? '' : ' ws:'}${gaEnabled ? ' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com' : ''}`,
      "frame-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "object-src 'none'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), usb=(), battery=(), autoplay=()',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
}

export default nextConfig
