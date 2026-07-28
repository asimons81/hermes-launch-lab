import Link from 'next/link'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container" style={{maxWidth:720}}>
      <nav className="nav">
        <Link href="/">HERMES LAUNCH LAB</Link>
      </nav>
      {children}
      <div style={{marginTop:'var(--space-8)',fontSize:12,color:'var(--color-ink-muted)'}}>
        This is a draft. Final legal review required before launch.
      </div>
    </div>
  )
}
