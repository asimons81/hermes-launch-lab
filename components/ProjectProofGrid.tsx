import Image from 'next/image'
import { projectProof } from '@/lib/project-proof'

type ProjectProofGridProps = {
  heading?: string
  intro?: string
}

export function ProjectProofGrid({
  heading = 'Work you can inspect.',
  intro = 'The systems below are public proof of the kind of infrastructure Tony builds and uses in the work he recommends.',
}: ProjectProofGridProps) {
  return (
    <section className="proof-work" aria-labelledby="proof-work-heading">
      <div className="proof-work__heading">
        <div>
          <p className="eyebrow">PUBLIC RECEIPTS</p>
          <h2 id="proof-work-heading">{heading}</h2>
        </div>
        <p>{intro}</p>
      </div>

      <div className="proof-work__grid">
        {projectProof.map((project) => (
          <article className="proof-project" key={project.name}>
            <div className="proof-project__image-wrap">
              <Image
                src={project.image}
                alt={project.imageAlt}
                width={1200}
                height={750}
                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className="proof-project__image"
              />
            </div>
            <div className="proof-project__body">
              <p className="proof-project__category">{project.category}</p>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul className="proof-project__tags" aria-label={`${project.name} capabilities`}>
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="text-link">
                Inspect the source <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
