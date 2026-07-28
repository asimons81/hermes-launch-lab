import { auth, signIn } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function SignIn() {
  const session = await auth()
  if (session) redirect('/portal')

  return (
    <div className="container" style={{maxWidth:420,marginTop:'var(--space-8)'}}>
      <h2>Sign in</h2>
      <p style={{color:'var(--color-ink-muted)'}}>Magic link. No password.</p>
      <form action={async (formData: FormData) => {
        'use server'
        await signIn('resend', { email: formData.get('email') as string, redirectTo: '/portal' })
      }} style={{marginTop:'var(--space-5)'}}>
        <input type="email" name="email" placeholder="you@domain.com" required />
        <button type="submit" className="btn btn-primary" style={{marginTop:'var(--space-3)',width:'100%'}}>Send link</button>
      </form>
      <div style={{marginTop:'var(--space-4)',fontSize:12,color:'var(--color-ink-muted)'}}>
        Independent service. Not affiliated with Nous Research.
      </div>
    </div>
  )
}
