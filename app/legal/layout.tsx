import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="shell page-shell page-shell--narrow">
        <p className="eyebrow">LEGAL &amp; PRIVACY</p>
        {children}
        <p className="notice" style={{ marginTop: 40 }}>
          Independent consulting service. Not affiliated with Nous Research or Hermes Agent maintainers.
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
