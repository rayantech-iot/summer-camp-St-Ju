'use client'

import { ArrowRight, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'

const activities = [
  'Basketball',
  'Football en salle',
  'Tennis de table',
  'VTT',
  'Sports collectifs',
  'Jeux et activités de groupe',
]

const included = [
  'Encadrement par animateurs BPJEPS et BAFA',
  'Activités variées encadrées en petits groupes',
  'Matériel sportif fourni',
  'Déjeuner inclus',
  'Découverte de nouvelles disciplines',
  'Ambiance conviviale et bienveillante',
]

export default function MultisportPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Multisport
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Bouger, découvrir, partager — le plaisir du sport dans toute sa diversité.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-6">
                Une semaine multi-activités
              </h2>
              <p className="text-gsc-white/70 leading-relaxed mb-6">
                L&apos;édition Multisport est conçue pour les jeunes qui aiment le sport dans
                sa diversité. Au programme : basket, foot en salle, tennis de table, VTT et
                sports collectifs — le tout dans une ambiance décontractée et bienveillante.
              </p>
              <p className="text-gsc-white/70 leading-relaxed">
                Encadrée par des animateurs diplômés BPJEPS et BAFA, cette formule permet
                à chaque jeune de progresser à son rythme, de découvrir de nouvelles activités
                et de vivre une semaine sportive riche en souvenirs.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider">6-13 juillet 2026</h3>
                <p className="text-sm text-gsc-white/50 mt-1">Session 1</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider">13-17 juillet 2026</h3>
                <p className="text-sm text-gsc-white/50 mt-1">Session 2</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                Activités proposées
              </h2>
              <ul className="space-y-3">
                {activities.map((activity) => (
                  <li key={activity} className="flex items-start gap-3 text-sm text-gsc-white/70">
                    <Check size={18} className="text-gsc-red shrink-0 mt-0.5" />
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                Tarifs &amp; infos
              </h2>
              <div className="bg-gsc-gray/30 p-8 border border-gsc-gray/30 mb-6">
                <div className="font-heading text-2xl text-gsc-white tracking-wider">Externat uniquement</div>
                <div className="font-heading text-5xl text-gsc-red mt-4">300€</div>
                <p className="text-sm text-gsc-white/50 mt-2">/ semaine</p>
              </div>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gsc-white/70">
                    <Check size={18} className="text-gsc-red shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 px-4" delay={0.15}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-12 text-center">
              Infos pratiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">Public</div>
                <p className="text-sm text-gsc-white/60 mt-2">U11 à U16 (11-16 ans)<br />Garçons &amp; filles<br />Tous niveaux</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">Lieu</div>
                <p className="text-sm text-gsc-white/60 mt-2">Vulbens (74520)<br />Haute-Savoie, France</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">Encadrement</div>
                <p className="text-sm text-gsc-white/60 mt-2">BPJEPS &amp; BAFA<br />Animateurs diplômés</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <CTASection
          title="Envie de varier les plaisirs&nbsp;?"
          subtitle="Inscris-toi à l'édition Multisport et vis une semaine sportive unique."
          primaryLabel="Je m'inscris"
          primaryHref="/inscription"
        />
      </main>
      <Footer />
    </>
  )
}
