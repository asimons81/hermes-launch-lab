import Link from 'next/link'
import { BrandMark } from '@/components/BrandMark'

export default function NotFound() {
  return (
    <main className="shell page-shell page-shell--narrow" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <BrandMark />
        <p className="eyebrow" style={{ marginTop: 56 }}>ERROR 404</p>
        <h1 className="page-title" style={{ fontSize: 'clamp(42px,6vw,64px)', margin: '12px 0 8px' }}>
          Signal lost.
        </h1>
        <p className="page-intro" style={{ color: 'var(--muted)', maxWidth: 420, margin: '0 auto' }}>
          That page doesn&apos;t exist or was moved. The system is still online — let&apos;s route you somewhere useful.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <Link href="/" className="button button--primary">
            Return home <span>↗</span>
          </Link>
          <Link href="/pricing" className="button button--ghost">
            See pricing <span>→</span>
          </Link>
          <Link href="/docs" className="text-link" style={{ alignSelf: 'center' }}>
            Browse docs <span>→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
