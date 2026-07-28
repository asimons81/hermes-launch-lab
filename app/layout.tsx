import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HERMES LAUNCH LAB',
  description: 'Private consulting for Hermes Agent installation, configuration, and workflows. Independent service by Tony Simons.',
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
