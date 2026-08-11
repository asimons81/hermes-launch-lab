'use client'

import { useState } from 'react'

export interface SkillItem {
  id: string
  name: string
  category: 'Security' | 'Automations' | 'Integrations' | 'Fleet'
  description: string
  persistence: string
  yamlManifest: string
  cmd: string
}

/**
 * ILLUSTRATIVE DEMO CATALOG — none of these manifests describe a real,
 * shipped Hermes skill. They exist to demonstrate the SKILL.md shape and
 * the real `hermes skills` command surface. The copy buttons run real
 * commands; the manifests are examples only.
 */
const SKILL_DATABASE: SkillItem[] = [
  {
    id: 'credential-guard',
    name: 'credential-guard',
    category: 'Security',
    description: 'Example security skill: validate provider keys and rotate them on a schedule.',
    persistence: 'Example: scheduled validation',
    yamlManifest: `name: credential-guard
description: (illustrative example) Rotate and validate provider API keys
version: 1.0.0
author: Example Author
platforms: [linux, macos]
---
## When to Use
When a provider key is expiring or suspected of leaking.
## Procedure
1. Check configured keys with \`hermes status\`
2. Rotate the key in the provider dashboard
3. Update ~/.hermes/.env and re-run \`hermes status\`
## Verification
The rotated key authenticates successfully.`,
    cmd: 'hermes skills search security',
  },
  {
    id: 'pr-review-bot',
    name: 'pr-review-bot',
    category: 'Automations',
    description: 'Example automation skill: review a pull request and post a summary comment.',
    persistence: 'Example: on-demand',
    yamlManifest: `name: pr-review-bot
description: (illustrative example) Review PRs and post a summary
version: 1.0.0
author: Example Author
platforms: [linux, macos, windows]
---
## When to Use
When a pull request is opened or updated.
## Procedure
1. Fetch the diff
2. Run typecheck and review the changes
3. Post a summary comment
## Verification
The PR has a review summary and no blocking errors.`,
    cmd: 'hermes skills search github',
  },
  {
    id: 'content-radar',
    name: 'content-radar',
    category: 'Automations',
    description: 'Example automation skill: aggregate news and changelogs into a daily digest.',
    persistence: 'Example: cron job',
    yamlManifest: `name: content-radar
description: (illustrative example) Daily tech news digest
version: 1.0.0
author: Example Author
platforms: [linux, macos]
---
## When to Use
Each morning, to summarize the latest releases and news.
## Procedure
1. Collect items from configured sources
2. Summarize into a short digest
3. Deliver to the configured channel
## Verification
A digest is delivered on schedule.`,
    cmd: 'hermes cron create "0 9 * * *" "Daily tech news digest" --name content-radar',
  },
  {
    id: 'deal-hunter',
    name: 'deal-hunter',
    category: 'Integrations',
    description: 'Example integration skill: watch product or listing prices and alert on target prices.',
    persistence: 'Example: scheduled watch',
    yamlManifest: `name: deal-hunter
description: (illustrative example) Monitor prices and alert on drops
version: 1.0.0
author: Example Author
platforms: [linux, macos, windows]
---
## When to Use
When the user wants to be alerted about a price change.
## Procedure
1. Check current prices
2. Compare against the target threshold
3. Alert only when the threshold is crossed
## Verification
An alert fires exactly when the price crosses the threshold.`,
    cmd: 'hermes skills browse',
  },
  {
    id: 'channel-broadcaster',
    name: 'channel-broadcaster',
    category: 'Integrations',
    description: 'Example integration skill: route execution receipts and alerts to a chat channel.',
    persistence: 'Example: delivery target',
    yamlManifest: `name: channel-broadcaster
description: (illustrative example) Deliver agent results to a chat channel
version: 1.0.0
author: Example Author
platforms: [linux, macos, windows]
---
## When to Use
When a job finishes and its output should be delivered to a channel.
## Procedure
1. Collect the job output
2. Format it for the channel
3. Deliver via the configured integration
## Verification
The channel receives the formatted output.`,
    cmd: 'hermes cron create "every 1h" "Broadcast status summary" --deliver telegram --name broadcaster',
  },
  {
    id: 'host-health-guard',
    name: 'host-health-guard',
    category: 'Fleet',
    description: 'Example fleet skill: check host health and alert on high load.',
    persistence: 'Example: watchdog loop',
    yamlManifest: `name: host-health-guard
description: (illustrative example) Watch host load and alert when high
version: 1.0.0
author: Example Author
platforms: [linux]
---
## When to Use
Recurring, to catch load spikes before they cause outages.
## Procedure
1. Read CPU and memory usage
2. Compare against the alert threshold
3. Deliver an alert only when the threshold is crossed
## Verification
Alerts fire on threshold crossing; silent otherwise.`,
    cmd: 'hermes cron create "every 5m" "Check host health" --script host-health.sh --no-agent --name host-health',
  },
]

export function SkillCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeInspect, setActiveInspect] = useState<SkillItem | null>(null)
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const categories = ['All', 'Security', 'Automations', 'Integrations', 'Fleet']

  const filteredSkills = SKILL_DATABASE.filter(skill => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  return (
    <div className="skill-catalog" style={{ marginTop: 24 }}>
      <div
        className="pane"
        style={{ marginBottom: 16, border: '1px solid rgba(213,174,100,0.25)', padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', marginRight: 8 }}>ILLUSTRATIVE DEMO</span>
        These manifests are examples of the SKILL.md format — they are not skills shipped with or installed by Hermes. The copy
        buttons run real <code>hermes skills</code>/<code>hermes cron</code> commands you can use yourself.
      </div>

      {/* Search & Filter Header */}
      <div
        className="skill-catalog__header"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div className="skill-catalog__categories" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                padding: '6px 14px',
                background: selectedCategory === cat ? 'rgba(213,174,100,0.2)' : 'rgba(255,255,255,0.03)',
                border: selectedCategory === cat ? '1px solid var(--gold)' : '1px solid rgba(242,240,233,0.12)',
                color: selectedCategory === cat ? 'var(--gold)' : 'var(--muted)',
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: 240 }}>
          <input
            type="text"
            placeholder="Search examples..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              background: 'rgba(10,11,9,0.9)',
              border: '1px solid rgba(213,174,100,0.2)',
              color: 'var(--fg)',
              borderRadius: 2,
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Grid of skills */}
      <div
        className="skill-catalog__grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        {filteredSkills.map(skill => (
          <div
            key={skill.id}
            className="pane"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.2s ease',
            }}
          >
            <div className="pane__titlebar">
              <span className="pane__title">{skill.name}</span>
              <span
                className="pane__status"
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  color: 'var(--gold)',
                  border: '1px solid rgba(213,174,100,0.3)',
                  padding: '1px 6px',
                }}
              >
                {skill.category.toUpperCase()} · DEMO
              </span>
            </div>

            <div className="pane__body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 14, color: 'var(--fg)', marginBottom: 12, lineHeight: 1.4 }}>
                {skill.description}
              </p>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 16 }}>
                ⚡ {skill.persistence}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setActiveInspect(skill)}
                  style={{
                    flexGrow: 1,
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    padding: '6px 10px',
                    background: 'rgba(213,174,100,0.1)',
                    border: '1px solid rgba(213,174,100,0.3)',
                    color: 'var(--gold)',
                    cursor: 'pointer',
                    borderRadius: 2,
                  }}
                >
                  Inspect Example Manifest ↗
                </button>
                <button
                  onClick={() => copyToClipboard(skill.cmd)}
                  title="Copy command"
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    padding: '6px 10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(242,240,233,0.12)',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    borderRadius: 2,
                  }}
                >
                  {copiedCmd === skill.cmd ? 'Copied ✓' : 'Copy Cmd'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manifest Inspection Modal */}
      {activeInspect && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setActiveInspect(null)}
        >
          <div
            className="pane"
            style={{ width: '100%', maxWidth: 560, background: 'var(--bg)', border: '1px solid var(--gold)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="pane__titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="pane__title">EXAMPLE MANIFEST: {activeInspect.name}.md (illustrative)</span>
              <button
                onClick={() => setActiveInspect(null)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
              >
                ✕ ESC
              </button>
            </div>
            <div className="pane__body">
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                {activeInspect.description}
              </p>
              <pre
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  background: 'rgba(10,11,9,0.95)',
                  padding: 14,
                  border: '1px solid rgba(213,174,100,0.2)',
                  color: 'var(--term-green)',
                  overflowX: 'auto',
                  borderRadius: 2,
                }}
              >
                {activeInspect.yamlManifest}
              </pre>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)' }}>
                  $ {activeInspect.cmd}
                </code>
                <button
                  onClick={() => copyToClipboard(activeInspect.cmd)}
                  className="button button--primary"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  {copiedCmd === activeInspect.cmd ? 'Copied ✓' : 'Copy Command'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
