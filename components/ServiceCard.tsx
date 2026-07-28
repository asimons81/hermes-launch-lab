'use client'
import { useState } from 'react'

export function ServiceCard({ service }: { service: any }) {
  return (
    <div className="card" style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
      <div>
        <div style={{fontSize:12,color:'var(--color-ink-muted)',marginBottom:'var(--space-1)'}}>{service.durationMin} MIN</div>
        <h3>{service.name}</h3>
        <div style={{fontSize:28,margin:'var(--space-2) 0'}}>${service.price}</div>
        <p style={{color:'var(--color-ink-muted)',fontSize:14}}>{service.description}</p>
      </div>
      <a href={`/book?service=${service.slug}`} className="btn" style={{marginTop:'var(--space-4)',display:'block',textAlign:'center'}}>Select</a>
    </div>
  )
}
