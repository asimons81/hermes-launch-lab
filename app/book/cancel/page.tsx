export default function BookCancel() {
  return (
    <div className="container" style={{textAlign:'center',marginTop:'var(--space-8)'}}>
      <h1>Checkout cancelled</h1>
      <p>Your booking was not completed.</p>
      <a href="/book" className="btn">Try again</a>
    </div>
  )
}
