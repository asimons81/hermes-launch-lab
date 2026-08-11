import type { Metadata } from 'next'
import { DocsLayout, CodeBlock, Callout } from '@/components/DocsLayout'

export const metadata: Metadata = {
  title: 'Skills Reference & Manifests',
  description:
    'How persistent skills encapsulate workflows, toolchains, and memory across Hermes sessions.',
  alternates: { canonical: '/docs/skills' },
}

export default function SkillsDoc() {
  return (
    <DocsLayout
      title="Skills Reference & Manifests"
      subtitle="How persistent skills encapsulate workflows, toolchains, and memory across Hermes sessions."
    >
      <h2>What is a Hermes Skill?</h2>
      <p>
        A skill is a self-contained markdown or YAML directory containing execution manifests, memory persistence rules, and step-by-step tool invocation procedures.
      </p>

      <Callout type="note">
        Unlike ephemeral prompt engineering, Hermes skills are versioned in Git and compound over time as your agent learns your project domain.
      </Callout>

      <h2>Creating a Custom Skill</h2>
      <p>Skills are defined with standard frontmatter and explicit action declarations:</p>
      <CodeBlock
        title="SKILL.md"
        code={`---
name: my-custom-skill
version: 1.0.0
description: Automates project build & deployment verification
tools:
  - run_command
  - grep_search
---

# Workflow Procedures
1. Run local test suite using \`npm test\`
2. Verify production build output
3. Notify Telegram channel on success`}
      />

      <h2>Loading & Verifying Skills</h2>
      <CodeBlock
        title="terminal"
        code={`$ hermes skill load ./my-custom-skill\n→ Validating manifest syntax... OK\n→ Indexing 3 action procedures... OK\n✓ Skill "my-custom-skill" indexed.`}
      />
    </DocsLayout>
  )
}
