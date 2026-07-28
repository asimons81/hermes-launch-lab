import Link from 'next/link'

export default function FAQ() {
  return (
    <div className="container" style={{maxWidth:720}}>
      <nav className="nav"><Link href="/">HERMES LAUNCH LAB</Link></nav>
      <h1>FAQ</h1>
      <div style={{marginTop:'var(--space-5)'}}>
        <h3>Is this official Hermes support?</h3>
        <p>No. Independent consulting. Not affiliated with Nous Research.</p>
        <h3>Do you guarantee installation?</h3>
        <p>Strategy sessions do not include installation. Launch sessions do.</p>
        <h3>How do I cancel?</h3>
        <p>24h+ notice for full credit. See refund policy.</p>
      </div>
    </div>
  )
}
