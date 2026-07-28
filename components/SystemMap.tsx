export function SystemMap() {
  return <div className="system-map" aria-label="A session turns your request into a tested workflow">
    <div className="system-map__topline"><span>SESSION OUTPUT</span><span className="status-dot">LIVE</span></div>
    <div className="system-map__node"><small>01 / INPUT</small><strong>Your request</strong><p>What needs to work?</p></div>
    <div className="system-map__line" />
    <div className="system-map__node system-map__node--core"><small>02 / CONFIGURE</small><strong>Hermes core</strong><p>Install · secure · connect</p></div>
    <div className="system-map__line" />
    <div className="system-map__node system-map__node--result"><small>03 / VERIFY</small><strong>Tested workflow</strong><p>Useful before we leave</p></div>
    <div className="system-map__caption">A live working session, not a mystery-box handoff.</div>
  </div>
}
