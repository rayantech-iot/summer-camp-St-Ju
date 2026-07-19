'use client'

import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { useLanguage } from '@/contexts/LanguageContext'

export default function USEditionPage() {
  const { t } = useLanguage()

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-block border border-gsc-red/50 text-gsc-red text-xs font-bold px-4 py-2 uppercase tracking-[0.2em] mb-8">
                {t('usEdition.comingSoon')}
              </div>
              <h1 className="font-heading text-6xl sm:text-7xl lg:text-9xl text-gsc-white tracking-wider leading-none">
                {t('usEdition.hero.title')}
              </h1>
              <p className="mt-8 text-lg sm:text-xl text-gsc-white/70 max-w-xl mx-auto leading-relaxed">
                {t('usEdition.hero.subtitle')}
              </p>
              <div className="w-16 h-1 bg-gsc-red mx-auto my-10" />
              <p className="text-base text-gsc-white/50 leading-relaxed max-w-2xl mx-auto">
                {t('usEdition.desc')}
              </p>
              <div className="mt-12">
                <a
                  href="mailto:contact@genevoissummercamp.fr?subject=US%20EDITION"
                  className="inline-flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105"
                >
                  {t('usEdition.cta')} <ArrowRight size={16} />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}