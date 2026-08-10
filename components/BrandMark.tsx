import Link from 'next/link'

export function BrandMark() {
  return (
    <Link href="/" className="brand-mark" aria-label="Hermes Launch Lab home">
      <span className="brand-mark__glyph" aria-hidden="true">T</span>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--foreground)' }}>
        TONY SIMONS <em style={{ fontStyle: 'normal', color: 'var(--red-accent)' }}>// LAUNCH LAB</em>
      </span>
    </Link>
  )
}

