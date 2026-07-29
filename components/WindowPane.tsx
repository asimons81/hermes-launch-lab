import type { ReactNode } from 'react'

type WindowPaneProps = {
  title?: string
  status?: 'live' | 'idle' | 'ready'
  children: ReactNode
  className?: string
}

export function WindowPane({ title = 'session', status = 'idle', children, className = '' }: WindowPaneProps) {
  const statusLabel = status === 'live' ? '● LIVE' : status === 'ready' ? '○ READY' : '○ IDLE'
  return (
    <div className={`pane ${className}`}>
      <div className="pane__titlebar">
        <span className="pane__title">{title}</span>
        <span className={`pane__status pane__status--${status}`}>{statusLabel}</span>
      </div>
      <div className="pane__body">{children}</div>
    </div>
  )
}
