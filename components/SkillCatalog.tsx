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

const SKILL_DATABASE: SkillItem[] = [
  {
    id: 'hermes-vault',
    name: 'hermes-vault',
    category: 'Security',
    description: 'Brokered credential leasing engine. Secrets stay isolated in encrypted memory.',
    persistence: 'Lease-based (TTL 3600s)',
    yamlManifest: `name: hermes-vault
version: 1.4.0
policy: brokered
storage: local-encrypted-keyring
lease_ttl: 3600
allowed_providers:
  - anthropic
  - openrouter
  - stripe`,
    cmd: 'hermes skill load hermes-vault',
  },
  {
    id: 'github-pr-workflow',
    name: 'github-pr-workflow',
    category: 'Automations',
    description: 'Autonomous PR review, typecheck verification, diff analysis, and merge approval.',
    persistence: 'Persistent Repository Agent',
    yamlManifest: `name: github-pr-workflow
version: 2.1.2
triggers:
  - pull_request.opened
  - pull_request.synchronize
actions:
  - run_typecheck
  - analyze_diff
  - post_summary_comment`,
    cmd: 'hermes skill load github-pr-workflow',
  },
  {
    id: 'content-radar',
    name: 'content-radar',
    category: 'Automations',
    description: 'Aggregates tech news, changelogs, and release notes into concise daily summaries.',
    persistence: 'Cron Loop (2h interval)',
    yamlManifest: `name: content-radar
version: 0.9.5
cron: "0 */2 * * *"
sources:
  - github_releases
  - hacker_news_top
outputs:
  - telegram_bot
  - local_markdown_log`,
    cmd: 'hermes skill load content-radar',
  },
  {
    id: 'deal-hunter',
    name: 'deal-hunter',
    category: 'Integrations',
    description: 'Monitors domain drops, SaaS promos, and cloud infrastructure pricing anomalies.',
    persistence: 'Scheduled Cron',
    yamlManifest: `name: deal-hunter
version: 1.1.0
cron: "0 9 * * *"
filters:
  min_discount: 40%
  categories: [cloud, domains, devtools]`,
    cmd: 'hermes skill load deal-hunter',
  },
  {
    id: 'telegram-broadcaster',
    name: 'telegram-broadcaster',
    category: 'Integrations',
    description: 'Routes agent execution receipts and critical alerts to encrypted Telegram channels.',
    persistence: 'Event Channel Listener',
    yamlManifest: `name: telegram-broadcaster
version: 1.0.3
bot_mode: silent_receipts
alert_threshold: warning_and_above`,
    cmd: 'hermes skill load telegram-broadcaster',
  },
  {
    id: 'vps-health-guard',
    name: 'vps-health-guard',
    category: 'Fleet',
    description: 'Continuous server telemetry, RAM/CPU load monitoring, and automated service recovery.',
    persistence: 'Daemon Loop',
    yamlManifest: `name: vps-health-guard
version: 1.8.0
check_interval: 60s
actions:
  on_high_load: dump_process_tree
  on_down: systemctld_restart`,
    cmd: 'hermes skill load vps-health-guard',
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
              type="button"
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
            placeholder="Search 55+ skills..."
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
                {skill.category.toUpperCase()}
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
                  type="button"
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
                  Inspect Manifest ↗
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(skill.cmd)}
                  title="Copy load command"
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
              <span className="pane__title">MANIFEST: {activeInspect.name}.yaml</span>
              <button
                type="button"
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
                  type="button"
                  onClick={() => copyToClipboard(activeInspect.cmd)}
                  className="button button--primary"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  {copiedCmd === activeInspect.cmd ? 'Copied ✓' : 'Copy Load Command'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
