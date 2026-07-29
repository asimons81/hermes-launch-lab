import { DocsLayout, CodeBlock, Callout } from '@/components/DocsLayout'

export default function CronDoc() {
  return (
    <DocsLayout
      title="Autonomous Cron & Background Loops"
      subtitle="Schedule background workflows, recurring radar monitoring, and automated event notifications."
    >
      <h2>Creating a Scheduled Cron Job</h2>
      <p>
        Hermes includes a native cron daemon that executes background skills on standard cron expressions without requiring cloud infrastructure.
      </p>

      <CodeBlock
        title="terminal"
        code={`$ hermes cron create --schedule "0 */2 * * *" --skill "content-radar"\n→ Cron job registered: "content-radar"\n→ Next execution: 2026-07-28 20:00:00 UTC\n✓ Daemon loop active.`}
      />

      <Callout type="tip">
        Cron outputs can be wired directly to Telegram, Discord, or local Markdown log files for silent background operations.
      </Callout>

      <h2>Monitoring Active Loops</h2>
      <CodeBlock
        title="terminal"
        code={`$ hermes cron list\n┌─────────────────┬────────────────┬──────────────────────┬─────────────┐\n│ Name            │ Schedule       │ Target Skill         │ Last Status │\n├─────────────────┼────────────────┼──────────────────────┼─────────────┤\n│ content-radar   │ 0 */2 * * *    │ content-radar        │ SUCCESS     │\n│ vps-health      │ */5 * * * *    │ vps-health-guard     │ SUCCESS     │\n└─────────────────┴────────────────┴──────────────────────┴─────────────┘`}
      />
    </DocsLayout>
  )
}
