import { Resend } from 'resend'
import {
  buildBookingIcs,
  bookingReference,
  formatDateLine,
  formatHeroLine,
  formatSubjectLine,
  formatTimeLine,
  renderConfirmationHtml,
  renderConfirmationText,
  shortTimeZone,
} from './email-templates'

function emailClient(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(key)
}

const FROM = process.env.RESEND_FROM ?? 'Hermes Launch Lab <tony@tonyreviewsthings.com>'
const REPLY_TO = 'Tony Simons <tony@tonyreviewsthings.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'tony@tonyreviewsthings.com'
const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://launch.tonysimons.dev'

export async function sendMagicLink(email: string, url: string) {
  await emailClient().emails.send({
    from: FROM,
    to: email,
    subject: 'Sign in to Hermes Launch Lab',
    html: `<p>Click to sign in: <a href="${url}">${url}</a></p>`,
  })
}

export type ConfirmationBooking = {
  id: string
  startTime: Date
  endTime: Date
  timeZone: string
  service: { name: string; slug: string; durationMin: number; price: number }
  user: { email: string; name: string | null }
  intake?: {
    fullName: string | null
    os: string | null
    comfortLevel: string | null
    hermesInstalled: boolean | null
    installMethod: string | null
    environment: string | null
    modelProvider: string | null
    messaging: string | null
    firstWorkflow: string | null
    blocker: string | null
    additional: string | null
  } | null
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`email send timed out after ${ms}ms`)), ms)
    p.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      }
    )
  })
}

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

/** "2026-08-18" from a Date rendered in the booking's timezone */
function icsDatePart(dt: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(dt)
}

/**
 * Customer confirmation email — sent once per booking on the pending→confirmed
 * transition. Fire-and-forget at the call site (webhook); failures are logged,
 * never fatal.
 */
export async function sendBookingConfirmation(booking: ConfirmationBooking, receiptUrl: string | null) {
  const { service, user } = booking
  const firstName =
    user.name?.split(' ')[0] ?? booking.intake?.fullName?.split(' ')[0] ?? 'there'
  const reference = bookingReference(booking.id)
  // service.price is stored in DOLLARS (e.g. 299); Stripe/formatUsd work in cents.
  const amountUsd = formatUsd(service.price * 100)

  const data = {
    firstName,
    serviceName: service.name,
    serviceSlug: service.slug,
    durationMin: service.durationMin,
    amountUsd,
    reference,
    subjectLine: formatSubjectLine(service.name, booking.startTime, booking.timeZone),
    heroLine: formatHeroLine(booking.startTime, booking.timeZone),
    dateLine: formatDateLine(booking.startTime, booking.timeZone),
    timeLine: formatTimeLine(booking.startTime, booking.endTime, booking.timeZone),
    timeZoneLabel: shortTimeZone(booking.timeZone),
    intakeKnown: Boolean(booking.intake),
    receiptUrl,
    portalUrl: `${BASE_URL}/portal`,
    baseUrl: BASE_URL,
  }

  const ics = buildBookingIcs(
    data,
    booking.startTime,
    booking.endTime
  )

  const result = await withTimeout(
    emailClient().emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: user.email,
      subject: data.subjectLine,
      html: renderConfirmationHtml(data),
      text: renderConfirmationText(data),
      attachments: [
        {
          filename: `hermes-${service.slug}-session-${icsDatePart(booking.startTime, booking.timeZone)}.ics`,
          content: Buffer.from(ics, 'utf8'),
        },
      ],
    }),
    10_000
  )

  if (result.error) throw new Error(`resend error: ${JSON.stringify(result.error)}`)
  console.log(`[email] confirmation sent booking=${booking.id} resend=${result.data?.id}`)
}

/** Internal admin notification with the intake briefing. */
export async function sendAdminNotification(booking: ConfirmationBooking, receiptUrl: string | null) {
  const { service, user } = booking
  const reference = bookingReference(booking.id)
  // service.price is stored in DOLLARS (e.g. 299); formatUsd works in cents.
  const amountUsd = formatUsd(service.price * 100)
  const dateLine = formatDateLine(booking.startTime, booking.timeZone)
  const timeLine = formatTimeLine(booking.startTime, booking.endTime, booking.timeZone)
  const intake = booking.intake

  const intakeLines: string[] = []
  if (intake) {
    const rows: [string, string | boolean | null][] = [
      ['Full name', intake.fullName],
      ['OS', intake.os],
      ['Comfort level', intake.comfortLevel],
      ['Hermes installed', intake.hermesInstalled],
      ['Install method', intake.installMethod],
      ['Environment', intake.environment],
      ['Model provider', intake.modelProvider],
      ['Messaging', intake.messaging],
      ['First workflow', intake.firstWorkflow],
      ['Blocker', intake.blocker],
      ['Additional', intake.additional],
    ]
    for (const [label, value] of rows) {
      if (value === null || value === undefined || value === '') continue
      intakeLines.push(`${label}: ${String(value)}`)
    }
  }

  const body = [
    `New booking — ${service.name}`,
    `------------------------------------------`,
    `Reference:   ${reference}`,
    `Customer:    ${user.name ?? '—'} <${user.email}>`,
    `Session:     ${dateLine} · ${timeLine} (${booking.timeZone})`,
    `Duration:    ${service.durationMin} minutes`,
    `Amount:      ${amountUsd} · paid via Stripe`,
    `Receipt:     ${receiptUrl ?? 'n/a'}`,
    `Booking id:  ${booking.id}`,
    ``,
    `INTAKE BRIEFING`,
    `------------------------------------------`,
    ...(intakeLines.length ? intakeLines : ['(no intake submitted)']),
  ].join('\n')

  const result = await withTimeout(
    emailClient().emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New booking — ${service.name} — ${amountUsd} — ${dateLine}`,
      text: body,
    }),
    10_000
  )

  if (result.error) throw new Error(`resend error: ${JSON.stringify(result.error)}`)
  console.log(`[email] admin notice sent booking=${booking.id} resend=${result.data?.id}`)
}

export type ApplicationAdminData = {
  userEmail: string
  businessName: string
  businessLocation: string
  outcome: string
  environment: string
  deadline: string
  budgetRange: string
  applicationId: string
}

/** Admin notification when a Custom/International application is submitted. */
export async function sendApplicationAdminNotification(data: ApplicationAdminData) {
  const body = [
    `New Custom / International Application`,
    `------------------------------------------`,
    `Applicant:       ${data.userEmail}`,
    `Business:        ${data.businessName}`,
    `Location:        ${data.businessLocation}`,
    `Budget Range:    ${data.budgetRange}`,
    `Target Deadline: ${data.deadline}`,
    `Application ID:  ${data.applicationId}`,
    ``,
    `DESIRED OUTCOME`,
    `------------------------------------------`,
    data.outcome,
    ``,
    `CURRENT ENVIRONMENT`,
    `------------------------------------------`,
    data.environment,
  ].join('\n')

  const result = await withTimeout(
    emailClient().emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: data.userEmail,
      subject: `New Application: ${data.businessName} (${data.budgetRange})`,
      text: body,
    }),
    10_000
  )

  if (result.error) throw new Error(`resend error: ${JSON.stringify(result.error)}`)
  console.log(`[email] application notice sent app=${data.applicationId} resend=${result.data?.id}`)
}

