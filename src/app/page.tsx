'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Clock, Shield, Camera } from 'lucide-react'
import Header from '@/components/Header'
import AnimatedSection from '@/components/AnimatedSection'

const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: false })
const InfiniteCoachCarousel = dynamic(() => import('@/components/InfiniteCoachCarousel'), { ssr: false })
import { useLanguage } from '@/contexts/LanguageContext'
import { getCoaches, getTestimonials, getEditions, getAllMedia, getOffers, getSiteConfig } from '@/lib/data-service'
import type { Coach, Testimonial, Edition, MemoryMedia, CampOffer, SiteConfig } from '@/lib/types'

const stats: { value: string; labelKey: string; icon: any }[] = [
  { value: '3', labelKey: 'stats.years', icon: Clock },
  { value: '60+', labelKey: 'stats.participants', icon: Users },
  { value: '35+', labelKey: 'stats.hours', icon: Star },
  { value: '1/5', labelKey: 'stats.ratio', icon: Shield },
]

const whyCards: { titleKey: string; descKey: string; icon: any }[] = [
  { titleKey: 'why.proCoaching.title', descKey: 'why.proCoaching.desc', icon: Shield },
  { titleKey: 'why.hours.title', descKey: 'why.hours.desc', icon: Clock },
  { titleKey: 'why.pros.title', descKey: 'why.pros.desc', icon: Star },
  { titleKey: 'why.small.title', descKey: 'why.small.desc', icon: Users },
]

export default function Home() {
  const { t } = useLanguage()
  const [dynamicCoaches, setDynamicCoaches] = useState<Coach[]>([])
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([])
  const [editionPreviews, setEditionPreviews] = useState<{edition: Edition; cover: MemoryMedia | null; count: number}[]>([])
  const [offers, setOffers] = useState<CampOffer[]>([])
  const [upcomingConfig, setUpcomingConfig] = useState<SiteConfig>({ sessions: [{ basket_dates: '', multisport_dates: '' }] })
  const basketOffer = offers.find((o) => o.type === 'basket')
  const multiOffer = offers.find((o) => o.type === 'multisport')

  useEffect(() => {
    const load = async () => {
      const [cos, tms, eds, allMedia, offs, config] = await Promise.all([
        getCoaches(),
        getTestimonials(),
        getEditions(),
        getAllMedia(),
        getOffers(),
        getSiteConfig(),
      ])
      setDynamicCoaches(cos)
      setDynamicTestimonials(tms)
      const grouped: Record<string, MemoryMedia[]> = {}
      for (const m of allMedia) {
        if (!grouped[m.edition_id]) grouped[m.edition_id] = []
        grouped[m.edition_id].push(m)
      }
      const previews = eds.map(ed => ({
        edition: ed,
        cover: (grouped[ed.id] || []).find(m => m.type === 'image') || (grouped[ed.id] || [])[0] || null,
        count: (grouped[ed.id] || []).length,
      })).reverse()
      setEditionPreviews(previews)
      setOffers(offs)
      setUpcomingConfig(config)
    }
    load()
  }, [])

  const displayCoaches = dynamicCoaches.length > 0 ? dynamicCoaches : []
  const displayTestimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : []

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black/70 via-gsc-black/50 to-gsc-black z-10" />
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
                {t('hero.title1')}
                <br />
                {t('hero.title2')}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gsc-white/80 font-sans max-w-2xl mx-auto leading-relaxed">
                {t('hero.subtitle1')}
                <br />
                {t('hero.subtitle2')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/camp-basket"
                  className="bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 inline-flex items-center gap-2"
                >
                  {t('hero.ctaDiscover')} <ArrowRight size={16} />
                </Link>
                <Link
                  href="/inscription"
                  className="border border-gsc-white/30 hover:border-gsc-white/60 text-gsc-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all inline-flex items-center gap-2"
                >
                  {t('hero.ctaRegister')} <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sessions à venir */}
        {upcomingConfig.sessions.some(s => s.basket_dates || s.multisport_dates) && (
          <AnimatedSection className="py-16 px-4 bg-gsc-gray/20">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-10">
                {t('upcoming.title')}
              </h2>
              <div className="space-y-6">
                {upcomingConfig.sessions.map((session, idx) => {
                  const hasBasket = !!session.basket_dates
                  const hasMulti = !!session.multisport_dates
                  if (!hasBasket && !hasMulti) return null
                  const cols = hasBasket && hasMulti ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md mx-auto'
                  return (
                    <div key={idx}>
                      {upcomingConfig.sessions.length > 1 && (
                        <p className="font-heading text-lg text-gsc-white/50 tracking-wider mb-3">Session {idx + 1}</p>
                      )}
                      <div className={`grid grid-cols-1 ${cols} gap-4`}>
                        {hasBasket && (
                          <div className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                            <p className="font-heading text-xl text-gsc-red tracking-wider">{t('upcoming.basket')}</p>
                            <p className="text-gsc-white/70 mt-2">{session.basket_dates}</p>
                          </div>
                        )}
                        {hasMulti && (
                          <div className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                            <p className="font-heading text-xl text-gsc-orange tracking-wider">{t('upcoming.multisport')}</p>
                            <p className="text-gsc-white/70 mt-2">{session.multisport_dates}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Notre histoire */}
        <AnimatedSection className="py-24 sm:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider mb-8">
              {t('story.title')}
            </h2>
            <div className="w-16 h-1 bg-gsc-red mx-auto mb-8" />
            <p className="text-base sm:text-lg text-gsc-white/70 leading-relaxed max-w-3xl mx-auto">
              {t('story.text')}
            </p>
          </div>
        </AnimatedSection>

        {/* Pourquoi choisir */}
        <AnimatedSection className="py-24 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-16">
              {t('why.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyCards.map((card) => (
                <motion.div
                  key={card.titleKey}
                  whileHover={{ y: -5 }}
                  className="bg-gsc-gray/30 p-8 border border-gsc-gray/30 hover:border-gsc-red/50 transition-colors"
                >
                  <card.icon className="text-gsc-red mb-4" size={28} />
                  <h3 className="font-heading text-xl text-gsc-white tracking-wider mb-3">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-sm text-gsc-white/60 leading-relaxed">{t(card.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Offres */}
        <AnimatedSection className="py-24 px-4" delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-16">
              {t('offers.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/camp-basket" className="group block">
                <div className="bg-gsc-gray/20 p-8 sm:p-12 border border-gsc-gray/30 group-hover:border-gsc-red/50 transition-all h-full">
                  <h3 className="font-heading text-3xl text-gsc-white tracking-wider">{t('offers.basket.title')}</h3>
                  <p className="mt-4 text-gsc-white/60 text-sm leading-relaxed">
                    {t('offers.basket.desc')}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-gsc-white/40">
                    <span>U11-U16</span>
                    <span>Valleiry</span>
                    <span>{t('offers.basket.from')} {basketOffer?.price_externat || 300}€</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider group-hover:gap-3 transition-all">
                    {t('offers.basket.cta')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
              <Link href="/multisport" className="group block">
                <div className="bg-gsc-gray/20 p-8 sm:p-12 border border-gsc-gray/30 group-hover:border-gsc-red/50 transition-all h-full">
                  <h3 className="font-heading text-3xl text-gsc-white tracking-wider">{t('offers.multi.title')}</h3>
                  <p className="mt-4 text-gsc-white/60 text-sm leading-relaxed">
                    {t('offers.multi.desc')}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-gsc-white/40">
                    <span>U11-U16</span>
                    <span>Vulbens</span>
                    <span>{multiOffer?.price_externat || 300}€</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider group-hover:gap-3 transition-all">
                    {t('offers.multi.cta')} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Coachs résumé */}
        <AnimatedSection className="py-24 bg-gsc-gray/20 overflow-hidden" delay={0.1}>
          <div className="max-w-6xl mx-auto px-4 mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center">
              {t('coaching.title')}
            </h2>
          </div>
          <InfiniteCoachCarousel />
          <div className="text-center mt-12">
            <Link
              href="/coachs"
              className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
            >
              {t('coaching.viewAll')} <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        {/* Chiffres clés */}
        <AnimatedSection className="py-24 px-4" delay={0.15}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.labelKey} className="text-center">
                  <stat.icon className="text-gsc-red mx-auto mb-3" size={24} />
                  <div className="font-heading text-5xl text-gsc-white tracking-wider">{stat.value}</div>
                  <div className="text-sm text-gsc-white/50 mt-2">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Témoignages */}
        <AnimatedSection className="py-24 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-16">
              {t('testimonials.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(displayTestimonials.length > 0 ? displayTestimonials : []).slice(0, 3).map((test) => (
                <div
                  key={test.id}
                  className="bg-gsc-gray/30 p-6 border border-gsc-gray/30"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-gsc-orange fill-gsc-orange" />
                    ))}
                  </div>
                  <p className="text-sm text-gsc-white/70 leading-relaxed italic">
                    &ldquo;{test.content}&rdquo;
                  </p>
                  <p className="text-xs text-gsc-white/40 mt-4 font-bold uppercase tracking-wider">
                    {test.author} - {test.role === 'parent' ? t('testimonials.parent') : test.role === 'jeune' ? t('testimonials.jeune') : t('testimonials.coach')}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/temoignages"
                className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
              >
                {t('testimonials.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Memories - albums by edition */}
        <AnimatedSection className="py-24 px-4" delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-4">
              Memories
            </h2>
            <p className="text-center text-gsc-white/40 text-sm mb-16 max-w-xl mx-auto">
              {t('memories.subtitle')}
            </p>
            {editionPreviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {editionPreviews.map((preview) => (
                  <Link
                    key={preview.edition.id}
                    href="/memories"
                    className="group relative aspect-[3/4] overflow-hidden bg-gsc-gray/30 block"
                  >
                    {preview.cover ? (
                      <Image
                        src={preview.cover.url}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera size={48} className="text-gsc-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 ${
                        preview.edition.type === 'basket'
                          ? 'bg-gsc-red text-white'
                          : 'bg-gsc-orange text-white'
                      }`}>
                        {preview.edition.type === 'basket' ? t('memories.badge.basket') : t('memories.badge.multisport')}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-heading text-6xl sm:text-7xl text-gsc-white tracking-wider leading-none">
                        {preview.edition.year}
                      </h3>
                      {preview.edition.title && (
                        <p className="text-sm text-gsc-white/60 mt-2 font-medium line-clamp-2">
                          {preview.edition.title}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Camera size={12} className="text-gsc-white/40" />
                        <span className="text-xs text-gsc-white/40">
                          {preview.count} {preview.count > 1 ? t('memories.photos') : t('memories.photo')}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gsc-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <div className="absolute inset-0 bg-gsc-red/0 group-hover:bg-gsc-red/5 transition-colors duration-500" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Camera size={48} className="text-gsc-white/10 mx-auto mb-4" />
                <p className="text-gsc-white/30 font-heading text-3xl">{t('memories.empty')}</p>
                <p className="text-gsc-white/20 text-sm mt-4">{t('memories.emptyDesc')}</p>
              </div>
            )}
            <div className="text-center mt-12">
              <Link
                href="/memories"
                className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
              >
                {t('memories.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA final */}
        <CTASection
          title={t('cta.final.title')}
          subtitle={t('cta.final.subtitle')}
          primaryLabel={t('cta.final.register')}
          primaryHref="/inscription"
          secondaryLabel={t('cta.final.contact')}
          secondaryHref="/contact"
        />
      </main>
      <Footer />
    </>
  )
}
