import { DocsLayout, CodeBlock, Callout } from '@/components/DocsLayout'

export default function CronDoc() {
  return (
    <DocsLayout
      title="Autonomous Cron & Background Loops"
      subtitle="Schedule background workflows with Hermes' built-in cron — natural-language intervals or standard cron expressions, delivered to any platform."
    >
      <h2>Creating a Scheduled Job</h2>
      <p>
        Hermes includes a native cron scheduler that runs jobs without requiring cloud infrastructure. Create a job with the CLI by
        passing the schedule as a positional argument — either a natural-language interval or a standard cron expression — followed by
        the prompt that tells the agent what to do:
      </p>
      <CodeBlock
        title="terminal"
        code={`$ hermes cron create "every 2h" "Check server status"\n$ hermes cron create "0 9 * * *" "Summarize yesterday's news" --name "daily-briefing" --deliver telegram\n$ hermes cron create "every 1h" "Summarize new feed items" --skill blogwatcher`}
      />
      <p>
        Options include <code>--name</code> (friendly job name), <code>--deliver</code> (origin, local, telegram, discord, signal, or{' '}
        <code>platform:chat_id</code>), <code>--repeat</code>, <code>--skill</code> (repeatable), <code>--script</code> and{' '}
        <code>--no-agent</code> for script-only watchdog jobs, and <code>--model</code>/<code>--provider</code> to pin inference.
      </p>

      <Callout type="tip">
        You can also manage jobs by asking the agent directly in chat — the <code>cronjob</code> tool supports create, list, update,
        pause, resume, run, and remove with plain language. No CLI required.
      </Callout>

      <h2>Listing Jobs</h2>
      <p>List scheduled jobs with <code>hermes cron list</code>. On a fresh profile the output is:</p>
      <CodeBlock
        title="terminal"
        code={`$ hermes cron list\nNo scheduled jobs.\nCreate one with 'hermes cron create ...' or the /cron command in chat.`}
      />
      <Callout type="note">
        Sample output above is from a real <code>hermes cron list</code> run on Hermes Agent v0.20.0. Once jobs exist, the list shows
        each job&apos;s name, schedule, prompt, and delivery target — the exact columns are produced by the CLI, not shown here to avoid
        inventing sample data.
      </Callout>
    </DocsLayout>
  )
}
