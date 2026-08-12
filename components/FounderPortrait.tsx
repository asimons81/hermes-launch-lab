import Image from 'next/image'

type FounderPortraitProps = {
  priority?: boolean
  compact?: boolean
}

export function FounderPortrait({ priority = false, compact = false }: FounderPortraitProps) {
  return (
    <figure className={`founder-portrait${compact ? ' founder-portrait--compact' : ''}`}>
      <Image
        src="/media/tony-founder-portrait.webp"
        alt="Tony Simons, independent Hermes Agent consultant"
        width={1600}
        height={2000}
        priority={priority}
        sizes={compact ? '(max-width: 720px) 100vw, 36vw' : '(max-width: 720px) 100vw, 46vw'}
      />
      <figcaption>Independent consulting. Direct work. Your system stays yours.</figcaption>
    </figure>
  )
}
