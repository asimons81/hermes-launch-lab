import Image from 'next/image'

type ReceiptFigureProps = {
  src: string
  mobileSrc: string
  alt: string
  width: number
  height: number
  mobileWidth?: number
  mobileHeight?: number
  className?: string
}

/**
 * Responsive receipt figure: serves a dedicated mobile crop (720px square/portrait
 * per the visual asset brief) on small screens and the desktop render above it.
 * All receipts are real, sanitized tool output — never fabricated UI.
 */
export function ReceiptFigure({
  src,
  mobileSrc,
  alt,
  width,
  height,
  mobileWidth = 720,
  mobileHeight = 720,
  className,
}: ReceiptFigureProps) {
  return (
    <picture>
      <source
        media="(max-width: 720px)"
        srcSet={mobileSrc}
        width={mobileWidth}
        height={mobileHeight}
      />
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 720px) 100vw, (min-width: 721px) 100vw"
        className={className}
      />
    </picture>
  )
}
