import type { Metadata } from 'next'
import { Geist, Geist_Mono, Outfit } from 'next/font/google'
import './globals.css'
import { CommandPalette } from '@/components/CommandPalette'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display', weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'Hermes Launch Lab — Private Hermes Agent Consulting',
  description: 'Hands-on Hermes Agent consulting for installation, secure configuration, and useful workflows.',
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} ${outfit.variable}`}>
        {children}
        <CommandPalette />
      </body>
    </html>
  )
}
