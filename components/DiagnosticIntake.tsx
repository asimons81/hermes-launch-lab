'use client'

import { useState } from 'react'
import Link from 'next/link'

type Answers = { os?: string; goal?: string; depth?: string }

const steps = [
  {
    key: 'os',
    question: 'What OS are you running?',
    options: ['Windows', 'macOS', 'Linux', 'Not sure yet'],
  },
  {
    key: 'goal',
    question: 'What do you want Hermes to do?',
    options: ['Research', 'Coding', 'Content', 'Operations', 'Just exploring'],
  },
  {
    key: 'depth',
    question: 'How deep do you want to go?',
    options: ['Just want to understand', 'Ready to set up', 'Need a full build'],
  },
]

function recommend(answers: Answers): { slug: string; name: string; price: string; why: string; prep: string } {
  const { depth } = answers
  if (depth === 'Need a full build') {
    return {
      slug: 'custom',
      name: 'Custom Hermes Build',
      price: '$600+',
      why: 'You want the full system — VPS deployment, integrations, custom skills, and scheduled automations. This is a 120-minute working session that leaves you with a production setup. Application required before booking.',
      prep: 'Bring your server or VPS details, API keys for services you want integrated, and your automation goals.',
    }
  }
  if (depth === 'Ready to set up') {
    return {
      slug: 'launch',
      name: 'Launch Session',
      price: '$299',
      why: 'You want to get Hermes installed, secured, and running a real workflow. 90 minutes of hands-on work that leaves you with a tested setup.',
      prep: 'Have your machine ready, know what API keys you might need (we never paste secrets into forms), and come with one workflow you want working.',
    }
  }
  return {
    slug: 'strategy',
    name: 'Strategy Session',
    price: '$99',
    why: 'You want to understand what Hermes can do for your specific situation before committing to a full setup. 60 minutes of fit assessment, model recommendations, and a written action plan.',
    prep: 'Come with your goals, your current setup, and questions. Leave with clarity on what to do next.',
  }
}

export function DiagnosticIntake() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [showResult, setShowResult] = useState(false)
  const [showFlatPricing, setShowFlatPricing] = useState(false)

  if (showFlatPricing) {
    return (
      <div className="diagnostic__flat">
        <div className="offer-grid">
          <article className="offer">
            <p className="offer__label">START HERE</p>
            <h3>Strategy session</h3>
            <p className="offer__price">$99</p>
            <p>60 min · Fit assessment, guidance, and a written action plan.</p>
            <Link className="offer__link" href="/book?service=strategy">Choose this path <span>→</span></Link>
          </article>
          <article className="offer offer--featured">
            <p className="offer__label">MOST HANDS-ON</p>
            <h3>Launch session</h3>
            <p className="offer__price">$299</p>
            <p>90 min · Setup or repair, secure configuration, and one tested workflow.</p>
            <Link className="offer__link" href="/book?service=launch">Choose this path <span>→</span></Link>
          </article>
          <article className="offer">
            <p className="offer__label">BUILT TO FIT</p>
            <h3>Custom build</h3>
            <p className="offer__price">$600+</p>
            <p>120 min · VPS, integrations, custom skills, and scheduled automations. Application required.</p>
            <Link className="offer__link" href="/book?service=custom">Choose this path <span>→</span></Link>
          </article>
        </div>
      </div>
    )
  }

  if (showResult) {
    const rec = recommend(answers)
    return (
      <div className="diagnostic__result">
        <div className="pane pane--result">
          <div className="pane__titlebar">
            <span className="pane__title">diagnostic-output</span>
            <span className="pane__status pane__status--live">● MATCHED</span>
          </div>
          <div className="pane__body">
            <p className="eyebrow">RECOMMENDED FOR YOU</p>
            <h3 className="diagnostic__rec-name">{rec.name}</h3>
            <p className="diagnostic__rec-price">{rec.price}</p>
            <p className="diagnostic__rec-why">{rec.why}</p>
            <div className="diagnostic__prep">
              <p className="eyebrow">WHAT TO PREPARE</p>
              <p>{rec.prep}</p>
            </div>
            <div className="diagnostic__actions">
              <Link href={`/book?service=${rec.slug}`} className="button button--primary">Book this session <span>↗</span></Link>
              <button className="text-link" onClick={() => { setStepIndex(0); setAnswers({}); setShowResult(false) }}>Start over</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const step = steps[stepIndex]
  const progress = ((stepIndex) / steps.length) * 100

  return (
    <div className="diagnostic">
      <div className="diagnostic__progress">
        <div className="diagnostic__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="diagnostic__step-indicator">
        {steps.map((s, i) => (
          <span key={i} className={`diagnostic__dot ${i === stepIndex ? 'diagnostic__dot--active' : ''} ${i < stepIndex ? 'diagnostic__dot--done' : ''}`} />
        ))}
      </div>
      <p className="eyebrow">STEP {stepIndex + 1} / {steps.length}</p>
      <h3 className="diagnostic__question">{step.question}</h3>
      <div className="diagnostic__options">
        {step.options.map(opt => (
          <button
            key={opt}
            className="diagnostic__option"
            onClick={() => {
              const newAnswers = { ...answers, [step.key]: opt }
              setAnswers(newAnswers)
              if (stepIndex < steps.length - 1) {
                setStepIndex(stepIndex + 1)
              } else {
                setShowResult(true)
              }
            }}
          >
            <span className="diagnostic__option-text">{opt}</span>
            <span className="diagnostic__option-arrow">→</span>
          </button>
        ))}
      </div>
      <div className="diagnostic__footer">
        {stepIndex > 0 && (
          <button className="text-link" onClick={() => setStepIndex(stepIndex - 1)}>← Back</button>
        )}
        <button className="text-link diagnostic__skip" onClick={() => setShowFlatPricing(true)}>
          Just show me pricing →
        </button>
      </div>
    </div>
  )
}
