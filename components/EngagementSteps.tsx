const steps = [
  {
    label: '01 / CHOOSE THE PATH',
    title: 'Pick the right depth.',
    copy: 'Start with Strategy when the shape of the work is still unclear. Book Launch when you are ready to configure and test a real workflow.',
  },
  {
    label: '02 / BOOK & PREPARE',
    title: 'Secure the session.',
    copy: 'Sign in, choose a time, complete payment, then share the goal and environment details needed for the work. Do not put secrets in a form or email.',
  },
  {
    label: '03 / BUILD & VERIFY',
    title: 'Work through the useful part.',
    copy: 'The session is direct and hands-on. Launch work covers setup or repair, configuration, and one tested workflow. Strategy ends with a written action plan.',
  },
]

export function EngagementSteps() {
  return (
    <section className="engagement-steps" aria-labelledby="engagement-steps-heading">
      <div className="engagement-steps__intro">
        <p className="eyebrow">HOW THE SESSION WORKS</p>
        <h2 id="engagement-steps-heading">Clear before you commit.</h2>
        <p>There is no account-manager relay or mystery handoff. You book the path that fits, prepare the useful context, and work directly with Tony in the session.</p>
      </div>
      <ol className="engagement-steps__list">
        {steps.map((step) => (
          <li key={step.label}>
            <p>{step.label}</p>
            <h3>{step.title}</h3>
            <span>{step.copy}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
