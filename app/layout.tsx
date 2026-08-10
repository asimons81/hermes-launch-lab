import type { Metadata } from 'next'
import { Instrument_Serif, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CommandPalette } from '@/components/CommandPalette'

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
  title: 'Hermes Launch Lab — Tony Simons Independent Studio',
  description: 'Hands-on 1-on-1 Hermes Agent consulting, zero-trust vault architecture, and custom agent infrastructure builds.',
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#020203] text-[#F8F9FA] antialiased">
        {children}
        <CommandPalette />
      </body>
    </html>
  )
}

