import { DocsLayout, CodeBlock, Callout } from '@/components/DocsLayout'

export default function SkillsDoc() {
  return (
    <DocsLayout
      title="Skills Reference"
      subtitle="How Hermes skills work: on-demand instruction documents, the SKILL.md format, and the real install/verify commands."
    >
      <h2>What is a Hermes Skill?</h2>
      <p>
        A skill is a <code>SKILL.md</code> instruction document — a name, a description, and a step-by-step procedure — that teaches
        Hermes how to do a specific task (deploy to Kubernetes, open a GitHub PR, search GIFs). Skills live in{' '}
        <code>~/.hermes/skills/</code>, the primary directory and source of truth.
      </p>

      <Callout type="note">
        Skills are loaded on demand: Hermes reads every skill&apos;s short description for free and only loads the full content when a
        task actually calls for it. Bundled skills ship with every install; hub skills are added from online registries; and you can
        write your own.
      </Callout>

      <h2>Installing Skills</h2>
      <p>Browse, search, and install from the Skills Hub with the <code>hermes skills</code> command group:</p>
      <CodeBlock
        title="terminal"
        code={`$ hermes skills browse                      # list available skills\n$ hermes skills search kubernetes           # find skills by keyword\n$ hermes skills install openai/skills/k8s   # install one (runs a security scan first)`}
      />
      <p>
        The install argument is a <code>source/path</code> slug from the hub — <code>openai/skills/k8s</code> means the <code>k8s</code>{' '}
        skill from OpenAI&apos;s catalog — or a direct HTTP(S) URL to a <code>SKILL.md</code> file. List what is installed with{' '}
        <code>hermes skills list</code>.
      </p>

      <h2>Writing a Custom Skill</h2>
      <p>
        Write a <code>SKILL.md</code> with standard frontmatter into <code>~/.hermes/skills/&lt;name&gt;/SKILL.md</code>; it becomes
        available to the agent immediately (no indexing step). The example below is an illustrative manifest showing the real
        frontmatter fields — not a skill shipped with Hermes:
      </p>
      <CodeBlock
        title="SKILL.md (illustrative example)"
        code={`---\nname: my-custom-skill\ndescription: Automates project build & deployment verification\nversion: 1.0.0\nauthor: You\nplatforms: [linux, macos, windows]\n---\n\n## When to Use\nTrigger when the user asks to verify a build and deploy.\n\n## Procedure\n1. Run the local test suite with \`npm test\`\n2. Verify the production build output\n3. Notify the configured channel on success\n\n## Verification\nConfirm the build artifact exists and the tests passed.`}
      />
      <Callout type="tip">
        Installed skills become slash commands automatically — <code>/k8s deploy the staging manifest</code> runs the skill with a
        request, and <code>/k8s</code> loads it and lets Hermes ask what you need. This works in the CLI and on connected messaging
        platforms. You don&apos;t have to install everything up front — Hermes picks the right bundled skill on its own during normal
        conversation when a task matches one.
      </Callout>
    </DocsLayout>
  )
}
