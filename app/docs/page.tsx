import type { Metadata } from 'next'
import Link from 'next/link'
import { DocsLayout, Callout } from '@/components/DocsLayout'

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Practical technical guides for getting started with Hermes Agent, securing credentials, and configuring autonomous loops.',
  alternates: { canonical: '/docs' },
}

const docPages = [
  { slug: 'quickstart', name: '1. Quickstart Guide', desc: 'Get Hermes installed, configured, and running in four practical steps.' },
  { slug: 'skills', name: '2. Skills Reference', desc: 'Understand persistent memory skills, manifests, and compounding workflows.' },
  { slug: 'vault', name: '3. Vault & Security', desc: 'Learn how lease-based credential brokering keeps your API keys isolated.' },
  { slug: 'cron', name: '4. Autonomous Cron & Loops', desc: 'Configure background loops and automated deliveries to Telegram or Discord.' },
]

export default function DocsIndex() {
  return (
    <DocsLayout
      title="Hermes Agent Documentation"
      subtitle="Practical technical guides for getting started, securing credentials, and configuring autonomous loops."
    >
      <Callout type="tip">
        All guides apply to Linux, macOS, and Windows (WSL2). For hands-on pairing and custom architecture setups, you can book a direct Launch Session.
      </Callout>

      <div className="offer-grid" style={{ marginTop: 16 }}>
        {docPages.map(doc => (
          <article className="card" key={doc.slug} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ letterSpacing: '-0.04em', margin: '0 0 8px 0' }}>{doc.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{doc.desc}</p>
            </div>
            <Link href={`/docs/${doc.slug}`} className="offer__link" style={{ marginTop: 16 }}>
              Read chapter <span>→</span>
            </Link>
          </article>
        ))}
      </div>
    </DocsLayout>
  )
}
