import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Received',
  robots: { index: false, follow: false },
}

export default function BookSuccess() {
  return (
    <div className="container" style={{textAlign:'center',marginTop:'var(--space-8)'}}>
      <h1>Payment received</h1>
      <p>Check your email for confirmation and next steps.</p>
      <a href="/portal" className="btn btn-primary" style={{marginTop:'var(--space-5)'}}>Go to portal</a>
    </div>
  )
}
