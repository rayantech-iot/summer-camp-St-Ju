'use client'

import { Star } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { testimonials } from '@/lib/data'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TemoignagesPage() {
  const { t } = useLanguage()

  const roleLabel = { parent: t('testimonials.parent'), jeune: t('testimonials.jeune'), coach: t('testimonials.coach') }

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              {t('testimonialsPage.hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              {t('testimonialsPage.hero.subtitle')}
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-gsc-gray/20 p-6 sm:p-8 border border-gsc-gray/30 hover:border-gsc-red/30 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-gsc-orange fill-gsc-orange" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gsc-white/70 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-gsc-gray/30">
                  <p className="text-sm font-bold text-gsc-white tracking-wider">{item.author}</p>
                  <p className="text-xs text-gsc-white/40 mt-1">{roleLabel[item.role]}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <CTASection
          title={t('testimonialsPage.cta.title')}
          subtitle={t('testimonialsPage.cta.subtitle')}
          primaryLabel={t('testimonialsPage.cta.register')}
          primaryHref="/inscription"
          secondaryLabel={t('testimonialsPage.cta.contact')}
          secondaryHref="/contact"
        />
      </main>
      <Footer />
    </>
  )
}
