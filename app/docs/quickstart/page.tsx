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
      subtitle="Install the official Hermes Agent CLI, choose a model provider, and verify the install with real diagnostics — in under 5 minutes."
    >
      <h2>Step 1: Install Hermes CLI</h2>
      <p>Run the official installer published by Nous Research on your host machine or server (Linux / macOS / WSL2 / Android Termux):</p>
      <CodeBlock title="bash (Linux / macOS / WSL2)" code={`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`} />
      <p>Windows (native PowerShell): <code>iex (irm https://hermes-agent.nousresearch.com/install.ps1)</code>. After the installer finishes, reload your shell, then confirm the version:</p>
      <CodeBlock title="terminal" code={`$ hermes --version\nHermes Agent v0.20.0 (2026.8.3)`} />

      <Callout type="security">
        The installer performs a per-user install under <code>~/.hermes/</code> — no sudo or root password is required for the default
        path. As with any installer, review the script before running it: the full source is published at
        <a href="https://hermes-agent.nousresearch.com/install.sh" className="text-link" style={{ display: 'inline' }}> hermes-agent.nousresearch.com/install.sh</a>.
      </Callout>

      <h2>Step 2: Choose a Provider &amp; Configure</h2>
      <p>Pick your inference provider with the interactive picker:</p>
      <CodeBlock title="terminal" code={`$ hermes model`} />
      <p>
        The fastest path on a fresh install is the Nous Portal one-shot setup — one OAuth login covers a model plus the Tool Gateway
        (web search, image generation, TTS, browser):
      </p>
      <CodeBlock title="terminal" code={`$ hermes setup --portal`} />
      <p>
        <code>hermes setup</code> alone runs the full interactive wizard (provider/model, terminal backend, messaging gateway, tools,
        telemetry, agent behaviour). Sections can be run individually, e.g. <code>hermes setup model</code> or <code>hermes setup gateway</code>.
      </p>

      <h2>Step 3: Check the Bundled Skills</h2>
      <p>Hermes ships with a catalog of bundled skills. Verify they are present, then browse the hub for more:</p>
      <CodeBlock title="terminal" code={`$ hermes skills list\n$ hermes skills browse`} />
      <p>
        Skills are installed by identifier from a registry — for example <code>hermes skills install openai/skills/k8s</code> — and are
        security-scanned before installation. See the Skills Reference for details.
      </p>

      <h2>Step 4: Verify the Install</h2>
      <p>Run the built-in diagnostics to confirm configuration and dependencies are healthy:</p>
      <CodeBlock
        title="terminal (abridged from a real run)"
        code={`$ hermes doctor\n┌─────────────────────────────────────────────────────────┐\n│                 🩺 Hermes Doctor                        │\n└─────────────────────────────────────────────────────────┘\n\n◆ Python Environment\n  ✓ Python 3.11.15\n  ✓ Virtual environment active\n  ✓ Version files consistent (0.20.0)\n\n◆ Configuration Files\n  ✓ ~/.hermes/.env file exists\n  ✓ ~/.hermes/config.yaml exists\n  ✓ No deprecated config keys or env vars\n\n◆ Auth Providers\n  ✓ Nous Portal auth (logged in)`}
      />
      <Callout type="note">
        Sample output above is abridged from an actual <code>hermes doctor</code> run on Hermes Agent v0.20.0. Your machine will show
        its own environment details; the check marks indicate healthy checks. <code>hermes status</code> shows which provider keys are
        configured, and <code>hermes verify</code> can smoke-test a project&apos;s build/test/start recipe in your current directory.
      </Callout>
    </DocsLayout>
  )
}
