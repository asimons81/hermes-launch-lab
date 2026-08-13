import Script from 'next/script'

/**
 * GA4 measurement snippet.
 *
 * Guarded by NEXT_PUBLIC_GA_MEASUREMENT_ID so the site ships with zero
 * third-party scripts until the env var is actually set on the platform
 * (Vercel). The strict CSP in next.config.ts is relaxed for Google's
 * analytics domains only when this env var is present, so nothing leaks
 * until analytics is genuinely enabled.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  )
}
