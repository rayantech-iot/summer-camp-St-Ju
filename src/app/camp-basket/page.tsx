'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { coaches } from '@/lib/data'

const included = [
  '5h d\'entraînement basket par jour',
  'Encadrement par coachs professionnels diplômés',
  '1h d\'échange avec un joueur professionnel',
  'Équipement d\'entraînement',
  'Déjeuner inclus (externat) / Pension complète (internat)',
  'Suivi individuel personnalisé',
  'Certificat de participation',
]

export default function CampBasketPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Camp Basket
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Une immersion totale dans le quotidien d&apos;un basketteur de haut niveau.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-6">
                Le programme
              </h2>
              <p className="text-gsc-white/70 leading-relaxed mb-6">
                Chaque journée est construite comme celle d&apos;un joueur professionnel :
                entraînement collectif le matin, technique individuelle l&apos;après-midi,
                matchs en fin de journée. Le tout encadré par des coachs issus du haut niveau.
              </p>
              <p className="text-gsc-white/70 leading-relaxed mb-6">
                Le temps fort de chaque édition&nbsp;: une heure d&apos;échange privilégié
                avec un joueur professionnel. Questions-réponses, démonstrations, conseils
                personnalisés — un moment unique.
              </p>
              <Link
                href="/programme"
                className="inline-flex items-center gap-2 text-gsc-red font-bold uppercase text-sm tracking-wider hover:gap-3 transition-all"
              >
                Voir la journée type <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider">4-11 juillet 2026</h3>
                <p className="text-sm text-gsc-white/50 mt-1">Session 1</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-lg text-gsc-white tracking-wider">11-18 juillet 2026</h3>
                <p className="text-sm text-gsc-white/50 mt-1">Session 2</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                Tarifs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gsc-gray/30 p-8 border border-gsc-gray/30">
                  <div className="font-heading text-2xl text-gsc-white tracking-wider">Externat</div>
                  <div className="font-heading text-5xl text-gsc-red mt-4">300€</div>
                  <p className="text-sm text-gsc-white/50 mt-2">/ semaine</p>
                  <p className="text-xs text-gsc-white/40 mt-4">Le jeune rentre chaque soir chez lui</p>
                </div>
                <div className="bg-gsc-gray/30 p-8 border border-gsc-red/30 relative">
                  <div className="absolute -top-3 -right-3 bg-gsc-orange text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                    Recommandé
                  </div>
                  <div className="font-heading text-2xl text-gsc-white tracking-wider">Internat</div>
                  <div className="font-heading text-5xl text-gsc-red mt-4">490€</div>
                  <p className="text-sm text-gsc-white/50 mt-2">/ semaine</p>
                  <p className="text-xs text-gsc-white/40 mt-4">Hébergement + pension complète</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-8">
                Ce qui est inclus
              </h2>
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
                <p className="text-sm text-gsc-white/60 mt-2">U11 à U16 (11-16 ans)<br />Garçons &amp; filles</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">Lieu</div>
                <p className="text-sm text-gsc-white/60 mt-2">Valleiry (74520)<br />Haute-Savoie, France</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <div className="font-heading text-2xl text-gsc-red tracking-wider">Niveau</div>
                <p className="text-sm text-gsc-white/60 mt-2">Aucun niveau minimum requis<br />Tous niveaux bienvenus</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-20 bg-gsc-gray/20 px-4" delay={0.1}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-12 text-center">
              Les coachs du camp basket
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {coaches.map((coach) => (
                <Link key={coach.id} href="/coachs" className="text-center group">
                  <div className="aspect-[3/4] bg-gsc-gray/40 mb-4 overflow-hidden relative">
                    <div className="w-full h-full bg-gsc-gray/50 flex items-center justify-center text-gsc-white/20 font-heading text-6xl">
                      {coach.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-heading text-lg text-gsc-white tracking-wider">{coach.name}</h3>
                  <p className="text-xs text-gsc-white/50 mt-1">{coach.role.split(',')[0]}</p>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <CTASection
          title="Rejoins le camp basket"
          subtitle="Une semaine qui change tout. Inscris-toi dès maintenant."
          primaryLabel="Je m'inscris"
          primaryHref="/inscription"
        />
      </main>
      <Footer />
    </>
  )
}
