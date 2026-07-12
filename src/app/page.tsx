'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Clock, Shield, Camera } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import InfiniteCoachCarousel from '@/components/InfiniteCoachCarousel'
import { getCoaches, getTestimonials, getEditions, getAllMedia, getOffers } from '@/lib/data-service'
import type { Coach, Testimonial, Edition, MemoryMedia, CampOffer } from '@/lib/types'

const stats = [
  { value: '3', label: 'Années d\'existence', icon: Clock },
  { value: '60+', label: 'Participants', icon: Users },
  { value: '35+', label: 'Heures d\'entraînement/semaine', icon: Star },
  { value: '1/5', label: 'Ratio encadrants', icon: Shield },
]

const whyCards = [
  {
    title: 'Encadrement professionnel',
    desc: 'Coachs issus du haut niveau, diplômés DEJEPS, DETB, BPJEPS.',
    icon: Shield,
  },
  {
    title: '+5h de basket par jour',
    desc: 'Une progression garantie par le volume et la qualité des entraînements.',
    icon: Clock,
  },
  {
    title: 'Joueurs pros invités',
    desc: 'Une heure d\'échange exclusive avec un joueur professionnel chaque semaine.',
    icon: Star,
  },
  {
    title: 'Taille humaine',
    desc: 'Une vingtaine de jeunes maximum, un suivi individuel pour chacun.',
    icon: Users,
  },
]

export default function Home() {
  const [dynamicCoaches, setDynamicCoaches] = useState<Coach[]>([])
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([])
  const [editionPreviews, setEditionPreviews] = useState<{edition: Edition; cover: MemoryMedia | null; count: number}[]>([])
  const [offers, setOffers] = useState<CampOffer[]>([])
  const basketOffer = offers.find((o) => o.type === 'basket')
  const multiOffer = offers.find((o) => o.type === 'multisport')

  useEffect(() => {
    const load = async () => {
      const [cos, tms, eds, allMedia, offs] = await Promise.all([
        getCoaches(),
        getTestimonials(),
        getEditions(),
        getAllMedia(),
        getOffers(),
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
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black/70 via-gsc-black/50 to-gsc-black z-10" />
          <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center" />
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
                GENEVOIS
                <br />
                SUMMER CAMP
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gsc-white/80 font-sans max-w-2xl mx-auto leading-relaxed">
                Approche le basket de haut niveau.
                <br />
                Vis ton été autrement.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/camp-basket"
                  className="bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 inline-flex items-center gap-2"
                >
                  Découvrir le camp <ArrowRight size={16} />
                </Link>
                <Link
                  href="/inscription"
                  className="border border-gsc-white/30 hover:border-gsc-white/60 text-gsc-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all inline-flex items-center gap-2"
                >
                  Je m&rsquo;inscris <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Notre histoire */}
        <AnimatedSection className="py-24 sm:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider mb-8">
              Notre histoire
            </h2>
            <div className="w-16 h-1 bg-gsc-red mx-auto mb-8" />
            <p className="text-base sm:text-lg text-gsc-white/70 leading-relaxed max-w-3xl mx-auto">
              Le Genevois Summer Camp est né d&apos;une conviction simple : permettre aux jeunes
              passionnés de basket de bénéficier d&apos;un encadrement de qualité sans devoir
              quitter la région genevoise. Ici, aux pieds du Vuache, nous transmettons chaque
              été bien plus que des techniques de jeu — nous partageons des valeurs : discipline,
              travail, respect, partage et dépassement de soi.
            </p>
          </div>
        </AnimatedSection>

        {/* Pourquoi choisir */}
        <AnimatedSection className="py-24 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-16">
              Pourquoi choisir le Genevois Summer Camp&nbsp;?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyCards.map((card) => (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -5 }}
                  className="bg-gsc-gray/30 p-8 border border-gsc-gray/30 hover:border-gsc-red/50 transition-colors"
                >
                  <card.icon className="text-gsc-red mb-4" size={28} />
                  <h3 className="font-heading text-xl text-gsc-white tracking-wider mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gsc-white/60 leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Offres */}
        <AnimatedSection className="py-24 px-4" delay={0.2}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-16">
              Nos offres
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/camp-basket" className="group block">
                <div className="bg-gsc-gray/20 p-8 sm:p-12 border border-gsc-gray/30 group-hover:border-gsc-red/50 transition-all h-full">
                  <h3 className="font-heading text-3xl text-gsc-white tracking-wider">Camp Basket</h3>
                  <p className="mt-4 text-gsc-white/60 text-sm leading-relaxed">
                    +5h d&apos;entraînement par jour, coachs professionnels, échange avec un joueur pro.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-gsc-white/40">
                    <span>U11-U16</span>
                    <span>Valleiry</span>
                    <span>À partir de {basketOffer?.price_externat || 300}€</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider group-hover:gap-3 transition-all">
                    Découvrir <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
              <Link href="/multisport" className="group block">
                <div className="bg-gsc-gray/20 p-8 sm:p-12 border border-gsc-gray/30 group-hover:border-gsc-red/50 transition-all h-full">
                  <h3 className="font-heading text-3xl text-gsc-white tracking-wider">Multisport</h3>
                  <p className="mt-4 text-gsc-white/60 text-sm leading-relaxed">
                    Foot en salle, VTT, tennis de table, sports collectifs — encadrement BPJEPS/BAFA.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-xs text-gsc-white/40">
                    <span>U11-U16</span>
                    <span>Vulbens</span>
                    <span>{multiOffer?.price_externat || 300}€</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider group-hover:gap-3 transition-all">
                    Découvrir <ArrowRight size={14} />
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
              L&apos;encadrement
            </h2>
          </div>
          <InfiniteCoachCarousel />
          <div className="text-center mt-12">
            <Link
              href="/coachs"
              className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
            >
              Voir tous les coachs <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        {/* Chiffres clés */}
        <AnimatedSection className="py-24 px-4" delay={0.15}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="text-gsc-red mx-auto mb-3" size={24} />
                  <div className="font-heading text-5xl text-gsc-white tracking-wider">{stat.value}</div>
                  <div className="text-sm text-gsc-white/50 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Témoignages */}
        <AnimatedSection className="py-24 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider text-center mb-16">
              Ils nous ont fait confiance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(displayTestimonials.length > 0 ? displayTestimonials : []).slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-gsc-gray/30 p-6 border border-gsc-gray/30"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-gsc-orange fill-gsc-orange" />
                    ))}
                  </div>
                  <p className="text-sm text-gsc-white/70 leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <p className="text-xs text-gsc-white/40 mt-4 font-bold uppercase tracking-wider">
                    {t.author} - {t.role === 'parent' ? 'Parent' : t.role === 'jeune' ? 'Jeune' : 'Coach'}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/temoignages"
                className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
              >
                Voir tous les témoignages <ArrowRight size={14} />
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
              Chaque édition, un album. Plonge dans les souvenirs.
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
                      <img
                        src={preview.cover.url}
                        alt=""
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
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
                        {preview.edition.type === 'basket' ? 'BASKET' : 'MULTISPORT'}
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
                          {preview.count} {preview.count > 1 ? 'photos' : 'photo'}
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
                <p className="text-gsc-white/30 font-heading text-3xl">Aucun souvenir pour le moment</p>
                <p className="text-gsc-white/20 text-sm mt-4">Les photos arrivent bientôt !</p>
              </div>
            )}
            <div className="text-center mt-12">
              <Link
                href="/memories"
                className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
              >
                Voir tous les souvenirs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA final */}
        <CTASection
          title="Prêt à vivre l'été autrement&nbsp;?"
          subtitle="Rejoins-nous pour une semaine d'immersion basket inoubliable."
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
