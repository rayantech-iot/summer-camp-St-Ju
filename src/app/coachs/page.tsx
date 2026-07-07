'use client'

import { Star, Quote } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { coaches } from '@/lib/data'

export default function CoachsPage() {
  const [dodzi, mike, ...others] = coaches

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Les Coachs
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              La qualité de l&apos;encadrement fait la différence. Rencontre nos coachs.
            </p>
          </div>
        </section>

        {/* Dodzi - Featured */}
        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-gsc-gray/30 to-gsc-red/10 border border-gsc-red/20 p-8 sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[3/4] bg-gsc-gray/40 overflow-hidden relative">
                  {dodzi.image_url ? (
                    <img src={dodzi.image_url} alt={dodzi.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gsc-gray/50 flex items-center justify-center text-gsc-white/10 font-heading text-8xl">D</div>
                  )}
                  <div className="absolute top-4 left-4 bg-gsc-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    Organisateur
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-gsc-orange fill-gsc-orange" />
                    ))}
                  </div>
                  <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider">
                    {dodzi.name}
                  </h2>
                  <p className="text-gsc-red font-bold uppercase text-sm tracking-wider mt-3">
                    Éducateur Sportif Responsable BCSJ
                  </p>
                  <p className="text-gsc-white/50 text-sm mt-1">
                    {dodzi.role}
                  </p>
                  <div className="w-12 h-0.5 bg-gsc-red mt-6 mb-6" />
                  <p className="text-gsc-white/70 leading-relaxed">{dodzi.bio}</p>
                  <div className="mt-6 bg-gsc-black/50 p-4 border-l-2 border-gsc-red">
                    <Quote size={18} className="text-gsc-red mb-2" />
                    <p className="text-sm text-gsc-white/60 italic">&ldquo;{dodzi.citation}&rdquo;</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {dodzi.diplomas.map((d) => (
                      <span key={d} className="text-xs border border-gsc-gray/50 text-gsc-white/60 px-3 py-1">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Mike Alard - Featured */}
        <AnimatedSection className="py-20 px-4 bg-gsc-gray/20" delay={0.1}>
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-gsc-gray/30 to-gsc-red/10 border border-gsc-red/20 p-8 sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[3/4] bg-gsc-gray/40 overflow-hidden relative">
                  {mike.image_url ? (
                    <img src={mike.image_url} alt={mike.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gsc-gray/50 flex items-center justify-center text-gsc-white/10 font-heading text-8xl">MA</div>
                  )}
                  <div className="absolute top-4 left-4 bg-gsc-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    Coach vedette
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-gsc-orange fill-gsc-orange" />
                    ))}
                  </div>
                  <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider">
                    {mike.name}
                  </h2>
                  <p className="text-gsc-red font-bold uppercase text-sm tracking-wider mt-3">
                    Ex-entraîneur de Victor Wembanyama
                  </p>
                  <p className="text-gsc-white/50 text-sm mt-1">
                    Directeur du centre de formation Nanterre 92 (Pro A)
                  </p>
                  <div className="w-12 h-0.5 bg-gsc-red mt-6 mb-6" />
                  <p className="text-gsc-white/70 leading-relaxed">{mike.bio}</p>
                  <div className="mt-6 bg-gsc-black/50 p-4 border-l-2 border-gsc-red">
                    <Quote size={18} className="text-gsc-red mb-2" />
                    <p className="text-sm text-gsc-white/60 italic">&ldquo;{mike.citation}&rdquo;</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {mike.diplomas.map((d) => (
                      <span key={d} className="text-xs border border-gsc-gray/50 text-gsc-white/60 px-3 py-1">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Other coaches */}
        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.15}>
          <div className="max-w-5xl mx-auto space-y-20">
            {others.map((coach, i) => (
              <div key={coach.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? '' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-[3/4] bg-gsc-gray/30 overflow-hidden">
                    {coach.image_url ? (
                      <img src={coach.image_url} alt={coach.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gsc-gray/40 flex items-center justify-center text-gsc-white/10 font-heading text-8xl">
                        {coach.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider">{coach.name}</h2>
                  <p className="text-gsc-red font-bold uppercase text-sm tracking-wider mt-3">{coach.role}</p>
                  <div className="w-12 h-0.5 bg-gsc-red mt-6 mb-6" />
                  <p className="text-gsc-white/70 leading-relaxed">{coach.bio}</p>
                  <div className="mt-6 bg-gsc-black/30 p-4 border-l-2 border-gsc-red">
                    <Quote size={16} className="text-gsc-red mb-2" />
                    <p className="text-sm text-gsc-white/60 italic">&ldquo;{coach.citation}&rdquo;</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {coach.diplomas.map((d) => (
                      <span key={d} className="text-xs border border-gsc-gray/50 text-gsc-white/60 px-3 py-1">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <CTASection
          title="Prêt à t'entraîner avec les meilleurs&nbsp;?"
          subtitle="Rejoins-nous cet été et progresse aux côtés de coachs d'exception."
          primaryLabel="Je m'inscris"
          primaryHref="/inscription"
        />
      </main>
      <Footer />
    </>
  )
}
