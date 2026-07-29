type StatusBarProps = {
  items?: { label: string; value: string; status?: 'ok' | 'warn' }[]
}

const defaultItems = [
  { label: 'OS', value: 'ANY', status: 'ok' as const },
  { label: 'SESSION', value: 'READY', status: 'ok' as const },
  { label: 'SECURITY', value: 'BROKERED', status: 'ok' as const },
]

export function StatusBar({ items = defaultItems }: StatusBarProps) {
  return (
    <div className="status-bar" role="status" aria-label="System status">
      {items.map((item, i) => (
        <span key={i} className="status-bar__item">
          <span className={`status-bar__dot status-bar__dot--${item.status ?? 'ok'}`} />
          <span className="status-bar__label">{item.label}</span>
          <span className="status-bar__value">{item.value}</span>
        </span>
      ))}
      <span className="status-bar__spacer" />
      <span className="status-bar__cursor">█</span>
    </div>
  )
}
