import type { Metadata } from 'next'
import { DocsLayout, CodeBlock, Callout } from '@/components/DocsLayout'

export const metadata: Metadata = {
  title: 'Vault & Credential Security',
  description:
    'How lease-based credential brokering keeps your API keys isolated and out of raw terminal output.',
  alternates: { canonical: '/docs/vault' },
}

export default function VaultDoc() {
  return (
    <DocsLayout
      title="Vault & Credential Security"
      subtitle="Brokered credential leasing, ChaCha20-Poly1305 local keyrings, and zero-leak guarantees."
    >
      <h2>Architecture Overview</h2>
      <p>
        The Hermes Vault ensures that third-party API tokens (Stripe, Anthropic, OpenRouter) are never hardcoded into scripts or visible in raw terminal output.
      </p>

      <Callout type="security">
        The Vault acts as a local proxy broker. Subagents request short-lived cryptographic leases rather than retrieving plaintext secret keys.
      </Callout>

      <h2>Issuing a Credential Lease</h2>
      <CodeBlock
        title="terminal"
        code={`$ hermes vault lease request --provider openrouter --ttl 1800\n→ Validating policy... Authorized\n→ Issuing short-lived lease token: hvs_lease_892f1a9c...\n✓ Lease active for 30 minutes.`}
      />

      <h2>Inspecting Security Audit Log</h2>
      <CodeBlock
        title="terminal"
        code={`$ hermes vault audit\n[14:32:01] LEASE_ISSUED   provider=openrouter ttl=1800s status=OK\n[14:02:15] LEASE_EXPIRED  provider=anthropic   status=CLEARED\n✓ Zero credential leaks detected.`}
      />
    </DocsLayout>
  )
}
