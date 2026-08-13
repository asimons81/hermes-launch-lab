import type { Metadata } from 'next'
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CommandPalette } from '@/components/CommandPalette'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://launch.tonysimons.dev'),
  title: {
    default: 'Hermes Launch Lab — Tony Simons Independent Studio',
    template: '%s — Hermes Launch Lab',
  },
  description:
    'Hands-on 1-on-1 Hermes Agent consulting, credential security setups, and custom agent infrastructure builds.',
  applicationName: 'Hermes Launch Lab',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'Hermes Launch Lab',
    title: 'Hermes Launch Lab — Tony Simons Independent Studio',
    description:
      'Hands-on 1-on-1 Hermes Agent consulting, credential security setups, and custom agent infrastructure builds.',
    url: '/',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Hermes Launch Lab — Tony Simons Independent Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hermes Launch Lab — Tony Simons Independent Studio',
    description:
      'Hands-on 1-on-1 Hermes Agent consulting, credential security setups, and custom agent infrastructure builds.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#020203] text-[#F8F9FA] antialiased">
        {children}
        <CommandPalette />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
