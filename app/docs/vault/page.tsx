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
      title="Secrets & Credential Security"
      subtitle="Where Hermes keeps API keys, how to pull them from an external secret manager, and how the optional egress proxy keeps them out of sandboxes."
    >
      <h2>Where Credentials Live</h2>
      <p>
        Provider API keys are stored in your profile&apos;s <code>.env</code> file under <code>~/.hermes/</code> — not hardcoded into
        scripts or committed to repositories. Hermes loads that file at process startup. Check which provider keys are configured with{' '}
        <code>hermes status</code>, and keep the file permissions tight (<code>chmod 600 ~/.hermes/.env</code>).
      </p>

      <Callout type="security">
        There is no single &quot;vault&quot; command that brokers short-lived key leases. Instead, Hermes offers three real,
        configurable surfaces for credential security: external secret managers (<code>hermes secrets</code>), the optional sandbox
        egress firewall (<code>hermes egress</code>), and supply-chain auditing (<code>hermes security</code>). All are covered below.
      </Callout>

      <h2>External Secret Managers</h2>
      <p>
        Pull API keys from Bitwarden Secrets Manager or 1Password at process startup instead of keeping every provider key in{' '}
        <code>~/.hermes/.env</code>:
      </p>
      <CodeBlock
        title="terminal"
        code={`$ hermes secrets --help\nusage: hermes secrets [-h] {bitwarden,bw,onepassword,op,1password} ...\n\nPull API keys from an external secret manager at process startup instead of\nstoring them in ~/.hermes/.env. Supports Bitwarden Secrets Manager and 1Password.\n\n$ hermes secrets bitwarden setup   # wizard: install bws, store access token, pick project\n$ hermes secrets bitwarden status  # show config + token validation\n$ hermes secrets bitwarden sync --apply  # pull secrets into the shell environment`}
      />

      <h2>Sandbox Credential Isolation (egress proxy)</h2>
      <p>
        For remote terminal sandboxes (Docker, SSH, Modal), <code>hermes egress</code> manages an optional TLS-intercepting firewall
        (iron-proxy). The sandbox holds <em>opaque proxy tokens</em>, never the real keys; iron-proxy swaps the token for the real
        credential at the network boundary before an outbound request leaves the sandbox. It is disabled by default:
      </p>
      <CodeBlock
        title="terminal"
        code={`$ hermes egress setup   # wizard: install binary + CA + mint tokens + write config\n$ hermes egress start    # start the managed proxy daemon\n$ hermes egress status   # proxy state and token mappings`}
      />
      <Callout type="security">
        The token-swap guarantee is bounded: it holds while the sandbox trusts the local CA and traffic reaches the real iron-proxy.
        If the proxy boundary itself is compromised (stolen CA private key or a hijacked proxy endpoint), the guarantee no longer
        holds — treat any &quot;nothing can leak&quot; marketing claim with suspicion. Egress protects provider env vars only; it does not
        inspect arbitrary files mounted into a sandbox.
      </Callout>

      <h2>Supply-Chain Audit</h2>
      <p>
        Scan the Hermes virtualenv, plugin dependencies, and pinned MCP servers against OSV.dev advisories:
      </p>
      <CodeBlock title="terminal" code={`$ hermes security audit\nOn-demand vulnerability scan against OSV.dev. Covers the Hermes venv\n(installed PyPI dists), Python deps declared by plugins under\n~/.hermes/plugins/, and pinned npx/uvx MCP servers in config.yaml.`} />
      <Callout type="note">
        Command output above is taken from <code>hermes --help</code> receipts on Hermes Agent v0.20.0. Full guides: the official
        Security docs and the Egress proxy docs at hermes-agent.nousresearch.com/docs.
      </Callout>
    </DocsLayout>
  )
}
