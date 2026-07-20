'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ArrowRight, Check } from 'lucide-react'
import Header from '@/components/Header'
import AnimatedSection from '@/components/AnimatedSection'
import { getOffers, getSiteConfig } from '@/lib/data-service'
import type { CampOffer, SiteConfig } from '@/lib/types'
import { coaches } from '@/lib/data'
import { useLanguage } from '@/contexts/LanguageContext'

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: false })

const includedKeys = [
  'campBasket.included.training',
  'campBasket.included.coaching',
  'campBasket.included.pro',
  'campBasket.included.equipment',
  'campBasket.included.meals',
  'campBasket.included.tracking',
  'campBasket.included.certificate',
]

export default function CampBasketPage() {
  const { t } = useLanguage()
  const [offers, setOffers] = useState<CampOffer[]>([])
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ sessions: [] })
  const basketOffer = offers.find((o) => o.type === 'basket')
  const basketSessions = siteConfig.sessions.filter(s => s.basket_dates)

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
              {t('campBasket.hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              {t('campBasket.hero.subtitle')}
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-6">
                {t('campBasket.program.title')}
              </h2>
              <p className="text-gsc-white/70 leading-relaxed mb-6">
                {t('campBasket.program.desc1')}
              </p>
              <p className="text-gsc-white/70 leading-relaxed mb-6">
                {t('campBasket.program.desc2')}
              </p>
              <Link
                href="/programme"
                className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
              >
                {t('campBasket.program.viewDay')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {basketSessions.length > 0 ? basketSessions.map((s, i) => (
                <div key={i} className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                  <h3 className="font-heading text-lg text-gsc-white tracking-wider">{s.basket_dates}</h3>
                  <p className="text-sm text-gsc-white/50 mt-1">{t('campBasket.sessionLabel')} {i + 1}</p>
                </div>
              )) : (
                <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                  <p className="text-sm text-gsc-white/40">{t('common.loading')}</p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                {t('campBasket.pricing.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                  <div className="font-heading text-lg text-gsc-white tracking-wider">{t('campBasket.pricing.externat')}</div>
                  <p className="text-xs text-gsc-white/40 mt-1">{t('campBasket.pricing.externatSansRepas')}</p>
                  <div className="font-heading text-4xl text-gsc-red mt-4">{basketOffer?.price_externat || 300}€</div>
                  <p className="text-sm text-gsc-white/50 mt-2">{t('campBasket.pricing.perWeek')}</p>
                </div>
                <div className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                  <div className="font-heading text-lg text-gsc-white tracking-wider">{t('campBasket.pricing.externat')}</div>
                  <p className="text-xs text-gsc-white/40 mt-1">{t('campBasket.pricing.externatAvecRepas')}</p>
                  <div className="font-heading text-4xl text-gsc-red mt-4">{basketOffer?.price_externat_avec_repas || 350}€</div>
                  <p className="text-sm text-gsc-white/50 mt-2">{t('campBasket.pricing.perWeek')}</p>
                </div>
                <div className="bg-gsc-gray/30 p-6 border border-gsc-red/30 relative">
                  <div className="absolute -top-3 -right-3 bg-gsc-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    {t('campBasket.pricing.recommended')}
                  </div>
                  <div className="font-heading text-lg text-gsc-white tracking-wider">{t('campBasket.pricing.internat')}</div>
                  <p className="text-xs text-gsc-white/40 mt-1">{t('campBasket.pricing.internatDesc')}</p>
                  <div className="font-heading text-4xl text-gsc-red mt-4">{basketOffer?.price_internat || 490}€</div>
                  <p className="text-sm text-gsc-white/50 mt-2">{t('campBasket.pricing.perWeek')}</p>
                </div>
                <div className="bg-gsc-gray/30 p-6 border border-gsc-gray/30 flex flex-col">
                  <div className="font-heading text-lg text-gsc-white tracking-wider">{t('campBasket.pricing.coaching')}</div>
                  <p className="text-xs text-gsc-white/40 mt-1">{t('campBasket.pricing.coachingDesc')}</p>
                  <div className="font-heading text-4xl text-gsc-red mt-4">{t('campBasket.pricing.coachingPrice')}</div>
                  <p className="text-sm text-gsc-white/50 mt-2">{t('campBasket.pricing.perWeek')}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                {t('campBasket.included.title')}
              </h2>
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
              {t('campBasket.practical.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">{t('campBasket.practical.audience')}</div>
                <p className="text-sm text-gsc-white/60 mt-2">{t('campBasket.practical.audienceValue')}</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">{t('campBasket.practical.location')}</div>
                <p className="text-sm text-gsc-white/60 mt-2">{t('campBasket.practical.locationValue')}</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">{t('campBasket.practical.level')}</div>
                <p className="text-sm text-gsc-white/60 mt-2">{t('campBasket.practical.levelValue')}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-12 text-center">
              {t('campBasket.coaches.title')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {coaches.map((coach) => (
                <Link key={coach.id} href="/coachs" className="text-center group">
                  <div className="aspect-[3/4] bg-gsc-gray/40 mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-gsc-black/60 to-transparent z-10" />
                    {coach.image_url ? (
                      <Image src={coach.image_url} alt={coach.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gsc-gray/50 flex items-center justify-center text-gsc-white/20 font-heading text-6xl">
                        {coach.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-lg text-gsc-white tracking-wider group-hover:text-gsc-red transition-colors">{coach.name}</h3>
                  <p className="text-xs text-gsc-white/50 mt-1 truncate">{coach.role}</p>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <CTASection
          title={t('campBasket.cta.title')}
          subtitle={t('campBasket.cta.subtitle')}
          primaryLabel={t('campBasket.cta.register')}
          primaryHref="/inscription"
        />
      </main>
      <Footer />
    </>
  )
}
