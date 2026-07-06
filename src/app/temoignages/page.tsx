'use client'

import { Star } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { testimonials } from '@/lib/data'

const roleLabel = { parent: 'Parent', jeune: 'Jeune', coach: 'Coach' }

export default function TemoignagesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Témoignages
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Ce qu&apos;ils disent de nous.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-gsc-gray/20 p-6 sm:p-8 border border-gsc-gray/30 hover:border-gsc-red/30 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gsc-orange fill-gsc-orange" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gsc-white/70 leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-gsc-gray/30">
                  <p className="text-sm font-bold text-gsc-white tracking-wider">{t.author}</p>
                  <p className="text-xs text-gsc-white/40 mt-1">{roleLabel[t.role]}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <CTASection
          title="Rejoins la famille Genevois Summer Camp"
          subtitle="La meilleure publicité, ce sont nos participants."
          primaryLabel="Je m'inscris"
          primaryHref="/inscription"
          secondaryLabel="Contacte-nous"
          secondaryHref="/contact"
        />
      </main>
      <Footer />
    </>
  )
}
