import Link from 'next/link'

export function BrandMark() {
  return (
    <Link href="/" className="brand-mark" aria-label="Hermes Launch Lab home">
      <span className="brand-mark__glyph" aria-hidden="true">H</span>
      <span>HERMES <em>LAUNCH LAB</em></span>
    </Link>
  )
}
