import Link from 'next/link'

export function BrandMark() {
  return (
    <Link href="/" className="brand-mark" aria-label="Hermes Launch Lab home">
      <span className="brand-mark__glyph" aria-hidden="true" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>T</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        TONY SIMONS <em>// LAUNCH LAB</em>
      </span>
    </Link>
  )
}

