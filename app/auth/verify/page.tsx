import { BrandMark } from '@/components/BrandMark'

export default function VerifyRequest() {
  return (
    <main className="shell page-shell page-shell--narrow">
      <BrandMark />
      <section className="card" style={{ marginTop: 48 }}>
        <p className="eyebrow">CLIENT PORTAL</p>
        <h1 className="page-title" style={{ fontSize: 'clamp(42px,6vw,60px)' }}>Check your inbox.</h1>
        <p className="page-intro">We just sent you a secure magic link. Click it to sign in and continue to booking.</p>
        <p className="hero__note" style={{ marginTop: 28 }}>Didn’t receive it? Check spam, then try again — links expire after a short window.</p>
        <p className="hero__note">Independent service. Not affiliated with Nous Research or Hermes Agent maintainers.</p>
      </section>
    </main>
  )
}
