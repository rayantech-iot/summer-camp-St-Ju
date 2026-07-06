import Link from 'next/link'

interface Props {
  title: string
  subtitle?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CTASection({
  title,
  subtitle,
  primaryLabel = 'Je m\'inscris',
  primaryHref = '/inscription',
  secondaryLabel,
  secondaryHref,
}: Props) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/10 to-gsc-black" />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-gsc-white tracking-wider leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-6 text-lg text-gsc-white/70 font-sans max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryHref}
            className="bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 inline-block"
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="border border-gsc-white/30 hover:border-gsc-white/60 text-gsc-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all inline-block"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
