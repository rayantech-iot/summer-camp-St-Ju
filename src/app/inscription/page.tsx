'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { getOffers, getSiteConfig } from '@/lib/data-service'
import type { CampOffer, SiteConfig } from '@/lib/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { HELLOASSO_BASKET } from '@/lib/helloasso'

export default function InscriptionPage() {
  const { t } = useLanguage()
  const [offers, setOffers] = useState<CampOffer[]>([])
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ sessions: [] })
  const basketOffer = offers.find((o) => o.type === 'basket')
  const multiOffer = offers.find((o) => o.type === 'multisport')
  const basketSessions = siteConfig.sessions.filter(s => s.basket_dates)
  const multiSessions = siteConfig.sessions.filter(s => s.multisport_dates)

  useEffect(() => {
    Promise.all([getOffers(), getSiteConfig()]).then(([offers, config]) => {
      setOffers(offers)
      setSiteConfig(config)
    })
  }, [])

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              {t('inscription.hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              {t('inscription.hero.subtitle')}
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gsc-gray/20 p-8 border border-gsc-gray/30 flex flex-col">
                <h3 className="font-heading text-2xl text-gsc-white tracking-wider">{t('inscription.basket.title')}</h3>
                <p className="text-sm text-gsc-white/60 mt-3">
                  {basketSessions.map(s => s.basket_dates).join(' / ')}
                </p>
                <p className="text-sm text-gsc-white/60">{basketOffer?.lieu || 'Valleiry & Vulbens'}</p>
                <div className="my-6 space-y-2">
                  <p className="text-gsc-white font-bold text-base">{t('campBasket.pricing.externatSansRepas')} — {basketOffer?.price_externat || 300}€</p>
                  <p className="text-gsc-white font-bold text-base">{t('campBasket.pricing.externatAvecRepas')} — {basketOffer?.price_externat_avec_repas || 350}€</p>
                  <p className="text-gsc-white font-bold text-base">{t('campBasket.pricing.internatDesc')} — {basketOffer?.price_internat || 490}€</p>
                </div>
                <a
                  href={HELLOASSO_BASKET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-3 bg-gsc-red hover:bg-gsc-red/90 text-white px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all"
                >
                  {t('inscription.cta')} <ExternalLink size={18} />
                </a>
                <p className="text-sm text-gsc-white/40 mt-4 text-center">{t('inscription.helloasso')}</p>
              </div>
              <div className="bg-gsc-gray/20 p-8 border border-gsc-gray/30 flex flex-col">
                <h3 className="font-heading text-2xl text-gsc-white tracking-wider">{t('inscription.multi.title')}</h3>
                <p className="text-sm text-gsc-white/60 mt-3">
                  {multiSessions.map(s => s.multisport_dates).join(' / ')}
                </p>
                <p className="text-sm text-gsc-white/60">{multiOffer?.lieu || 'Valleiry & Vulbens'}</p>
                <div className="my-6 space-y-2">
                  <p className="text-gsc-white font-bold text-base">{t('multisport.pricing.externatSansRepas')} — {multiOffer?.price_externat || 300}€</p>
                  <p className="text-gsc-white font-bold text-base">{t('multisport.pricing.externatAvecRepas')} — {multiOffer?.price_externat_avec_repas || 350}€</p>
                </div>
                <a
                  href={HELLOASSO_BASKET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-3 bg-gsc-red hover:bg-gsc-red/90 text-white px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all"
                >
                  {t('inscription.cta')} <ExternalLink size={18} />
                </a>
                <p className="text-sm text-gsc-white/40 mt-4 text-center">{t('inscription.helloasso')}</p>
              </div>
            </div>

          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  )
}
