import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'System Status',
  description:
    'Live health checks for the Hermes Launch Lab site, booking, checkout, email, and database.',
  alternates: { canonical: '/status' },
}

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
