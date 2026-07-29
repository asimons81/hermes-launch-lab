'use client'

import { useState } from 'react'

const nodes = [
  { id: 'machine', label: 'Your Machine', desc: 'Windows, macOS, or Linux — the agent runs on your hardware.', x: 0, y: 1 },
  { id: 'core', label: 'Hermes Core', desc: 'Install, secure, configure. The agent that executes real work.', x: 1, y: 1 },
  { id: 'skills', label: 'Skills', desc: 'Persistent workflows that survive sessions and compound over time.', x: 2, y: 0 },
  { id: 'vault', label: 'Vault', desc: 'Credential broker. Secrets stay yours — brokered, lease-based, policy-gated.', x: 2, y: 1 },
  { id: 'cron', label: 'Cron', desc: 'Scheduled jobs that run autonomously and deliver results to your channels.', x: 2, y: 2 },
  { id: 'output', label: 'Live Output', desc: 'Research, coding, content, and operations — delivered with receipts.', x: 3, y: 1 },
]

const edges = [
  { from: 'machine', to: 'core' },
  { from: 'core', to: 'skills' },
  { from: 'core', to: 'vault' },
  { from: 'core', to: 'cron' },
  { from: 'skills', to: 'output' },
  { from: 'vault', to: 'output' },
  { from: 'cron', to: 'output' },
]

export function TopoGraph() {
  const [activeNode, setActiveNode] = useState<string | null>('core')

  return (
    <div className="topo" aria-label="System topology map">
      <div className="topo__grid">
        {/* SVG edges */}
        <svg className="topo__svg" viewBox="0 0 400 300" preserveAspectRatio="none">
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from)!
            const to = nodes.find(n => n.id === edge.to)!
            const x1 = (12 + (from.x / 3) * 76) * 4
            const y1 = (15 + (from.y / 2) * 70) * 3
            const x2 = (12 + (to.x / 3) * 76) * 4
            const y2 = (15 + (to.y / 2) * 70) * 3
            const isActive = activeNode === edge.from || activeNode === edge.to
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isActive ? 'var(--gold)' : 'var(--line)'}
                strokeWidth={isActive ? '1.5' : '1'}
                className={isActive ? 'topo__edge topo__edge--active' : 'topo__edge'}
              />
            )
          })}
        </svg>
        {/* Nodes */}
        {nodes.map(node => {
          const left = `${12 + (node.x / 3) * 76}%`
          const top = `${15 + (node.y / 2) * 70}%`
          const isActive = activeNode === node.id
          return (
            <button
              key={node.id}
              className={`topo__node ${isActive ? 'topo__node--active' : ''}`}
              style={{ left, top }}
              onClick={() => setActiveNode(node.id)}
              aria-label={node.label}
            >
              <span className="topo__node-label">{node.label}</span>
            </button>
          )
        })}
      </div>
      <div className="topo__detail">
        {nodes.filter(n => n.id === activeNode).map(n => (
          <div key={n.id} className="topo__detail-content">
            <p className="eyebrow">NODE</p>
            <h4>{n.label}</h4>
            <p>{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
