'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { getOffers } from '@/lib/data-service'
import type { CampOffer } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'

const activityKeys = [
  'multisport.offered.basket',
  'multisport.offered.futsal',
  'multisport.offered.tabletennis',
  'multisport.offered.bike',
  'multisport.offered.team',
  'multisport.offered.games',
]

const includedKeys = [
  'multisport.included.supervision',
  'multisport.included.groups',
  'multisport.included.gear',
  'multisport.included.lunch',
  'multisport.included.discovery',
  'multisport.included.vibe',
]

export default function MultisportPage() {
  const { t } = useLanguage()
  const [offers, setOffers] = useState<CampOffer[]>([])
  const multiOffer = offers.find((o) => o.type === 'multisport')

  useEffect(() => {
    getOffers().then(setOffers)
  }, [])
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              {t('multisport.hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              {t('multisport.hero.subtitle')}
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-6">
                {t('multisport.activities.title')}
              </h2>
              <p className="text-gsc-white/70 leading-relaxed mb-6">
                {t('multisport.activities.desc1')}
              </p>
              <p className="text-gsc-white/70 leading-relaxed">
                {t('multisport.activities.desc2')}
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider">{t('multisport.session1')}</h3>
                <p className="text-sm text-gsc-white/50 mt-1">{t('multisport.session1Label')}</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider">{t('multisport.session2')}</h3>
                <p className="text-sm text-gsc-white/50 mt-1">{t('multisport.session2Label')}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                {t('multisport.offered.title')}
              </h2>
              <ul className="space-y-3">
                {activityKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-gsc-white/70">
                    <Check size={18} className="text-gsc-red shrink-0 mt-0.5" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                {t('multisport.pricing.title')}
              </h2>
              <div className="bg-gsc-gray/30 p-8 border border-gsc-gray/30 mb-6">
                <div className="font-heading text-2xl text-gsc-white tracking-wider">{t('multisport.pricing.externat')}</div>
                <div className="font-heading text-5xl text-gsc-red mt-4">{multiOffer?.price_externat || 300}€</div>
                <p className="text-sm text-gsc-white/50 mt-2">{t('multisport.pricing.perWeek')}</p>
              </div>
              <ul className="space-y-3">
                {includedKeys.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-gsc-white/70">
                    <Check size={18} className="text-gsc-red shrink-0 mt-0.5" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 px-4" delay={0.15}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-12 text-center">
              {t('multisport.practical.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">{t('multisport.practical.audience')}</div>
                <p className="text-sm text-gsc-white/60 mt-2">{t('multisport.practical.audienceValue')}</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">{t('multisport.practical.location')}</div>
                <p className="text-sm text-gsc-white/60 mt-2">{t('multisport.practical.locationValue')}</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">{t('multisport.practical.supervision')}</div>
                <p className="text-sm text-gsc-white/60 mt-2">{t('multisport.practical.supervisionValue')}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <CTASection
          title={t('multisport.cta.title')}
          subtitle={t('multisport.cta.subtitle')}
          primaryLabel={t('multisport.cta.register')}
          primaryHref="/inscription"
        />
      </main>
      <Footer />
    </>
  )
}
