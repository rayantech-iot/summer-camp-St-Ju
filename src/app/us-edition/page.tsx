'use client'

import { Download, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { useLanguage } from '@/contexts/LanguageContext'
import { HELLOASSO_US_EDITION } from '@/lib/helloasso'

export default function USEditionPage() {
  const { t } = useLanguage()

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/6 to-gsc-black" />
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <AnimatedSection>
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-[7rem] text-gsc-white tracking-wider leading-[0.85]">
                {t('usEdition.hero.title')}
              </h1>
              <div className="w-20 h-[2px] bg-gsc-red mx-auto my-12" />
              <p className="text-lg sm:text-xl text-gsc-white/50 tracking-[0.15em] uppercase">
                {t('usEdition.hero.subtitle')}
              </p>
              <p className="mt-6 text-sm text-gsc-white/30 tracking-wider uppercase font-bold">
                {t('usEdition.comingSoon')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* STRIP — Key details */}
        <section className="border-y border-gsc-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
              {(['location', 'ages', 'group', 'price'] as string[]).map((key, i) => (
                <AnimatedSection key={key} delay={i * 0.08}>
                  <div className={`py-8 px-6 text-center ${i < 3 ? 'border-r border-gsc-white/10' : ''} ${i < 2 ? 'border-b sm:border-b-0 border-gsc-white/10' : i === 2 ? 'border-b lg:border-b-0 border-gsc-white/10' : ''}`}>
                    <p className="text-gsc-white/80 text-sm tracking-wide leading-snug">
                      {t(`usEdition.features.${key}`)}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* NARRATIVE */}
        <section className="py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-12 text-center">
                {t('usEdition.narrative.title')}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="space-y-6 text-gsc-white/55 leading-[1.85] text-[15px]">
                <p>{t('usEdition.narrative.p1')}</p>
                <p>{t('usEdition.narrative.p2')}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="py-20 px-6 bg-gsc-gray/10 border-y border-gsc-white/5">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <p className="text-center text-gsc-white/30 uppercase text-[11px] tracking-[0.3em] font-bold mb-14">
                {t('usEdition.strip.title')}
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-0">
              {(['basketball', 'english', 'training', 'meet', 'departure', 'price'] as string[]).map((key, i) => (
                <AnimatedSection key={key} delay={i * 0.06}>
                  <div className="flex items-center gap-5 py-5 border-b border-gsc-white/8">
                    <span className="w-1.5 h-1.5 bg-gsc-red shrink-0" />
                    <p className="text-gsc-white/70 text-sm">
                      {t(`usEdition.features.${key}`)}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* BROCHURE DOWNLOAD */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedSection>
              <a
                href="/brochure-us-edition-2027.pdf"
                download="Brochure USA Experience 2027.pdf"
                className="inline-flex items-center gap-3 border-2 border-gsc-red text-gsc-white hover:bg-gsc-red hover:text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300"
              >
                <Download size={18} />
                {t('usEdition.brochure')}
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedSection>
              <a
                href={HELLOASSO_US_EDITION}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gsc-red hover:bg-gsc-red/90 text-white px-12 py-5 font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02]"
              >
                {t('inscription.cta')} <ExternalLink size={16} />
              </a>
              <p className="text-sm text-gsc-white/40 mt-4">{t('inscription.helloasso')}</p>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
