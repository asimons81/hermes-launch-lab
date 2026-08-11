import type { Metadata } from 'next'
import { DocsLayout, CodeBlock, Callout } from '@/components/DocsLayout'

export const metadata: Metadata = {
  title: 'Quickstart Guide',
  description:
    'Install Hermes Agent, verify local dependencies, and test your first workflow in under 5 minutes.',
  alternates: { canonical: '/docs/quickstart' },
}

export default function QuickstartDoc() {
  return (
    <DocsLayout
      title="Quickstart Guide"
      subtitle="Install Hermes Agent, verify local dependencies, and test your first workflow in under 5 minutes."
    >
      <h2>Step 1: Install Hermes CLI</h2>
      <p>Execute the official bootstrap installer on your host machine or server:</p>
      <CodeBlock title="bash (Linux / macOS / WSL)" code={`curl -fsSL https://hermes.tonysimons.dev/bootstrap.sh | bash`} />

      <h2>Step 2: Initialize Local Environment</h2>
      <p>Run the environment detector to index local toolchains (git, python, sqlite, docker):</p>
      <CodeBlock title="terminal" code={`$ hermes setup\n→ Environment: Linux 7.1.3 (x86_64)\n→ Toolchains indexed: git, python3.12, sqlite3\n→ Hermes Agent core ready.`} />

      <Callout type="security">
        Hermes never requests or stores your raw root passwords. Environment inspection runs strictly under your user account permissions.
      </Callout>

      <h2>Step 3: Load Core Skills</h2>
      <p>Load the vault security broker and persistent memory skill:</p>
      <CodeBlock title="terminal" code={`$ hermes skill load hermes-vault\n$ hermes skill load sqlite-mem-persist\n✓ 2 skills loaded into local catalog.`} />

      <h2>Step 4: Verify System Workflow</h2>
      <p>Run the built-in diagnostic test to verify system integrity:</p>
      <CodeBlock title="terminal" code={`$ hermes test\n✓ Core Engine: OK\n✓ SQLite Memory: OK\n✓ Vault Broker: OK\nSession setup complete!`} />
    </DocsLayout>
  )
}
