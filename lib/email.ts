import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMagicLink(email: string, url: string) {
  await resend.emails.send({
    from: 'Hermes Launch Lab <no-reply@tonysimons.dev>',
    to: email,
    subject: 'Sign in to Hermes Launch Lab',
    html: `<p>Click to sign in: <a href="${url}">${url}</a></p>`
  })
}
