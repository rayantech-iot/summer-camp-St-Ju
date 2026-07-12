'use client'

import { Sun, Users, Utensils, Target, Trophy, Star, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { timelineSteps } from '@/lib/data'
import { useLanguage } from '@/contexts/LanguageContext'

const iconMap: Record<string, React.ReactNode> = {
  sun: <Sun size={24} />,
  users: <Users size={24} />,
  utensils: <Utensils size={24} />,
  target: <Target size={24} />,
  trophy: <Trophy size={24} />,
  star: <Star size={24} />,
  check: <Check size={24} />,
}

export default function ProgrammePage() {
  const { t } = useLanguage()

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              {t('programme.hero.title')}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              {t('programme.hero.subtitle')}
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 sm:py-28 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gsc-red/30 hidden sm:block" />
              <div className="space-y-12">
                {timelineSteps.map((step, idx) => (
                  <div key={step.time} className="relative flex items-start gap-6 sm:gap-10">
                    <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-gsc-black border-2 border-gsc-red items-center justify-center text-gsc-red z-10">
                      {iconMap[step.icon]}
                    </div>
                    <div className="sm:hidden shrink-0 w-10 h-10 rounded-full bg-gsc-black border-2 border-gsc-red flex items-center justify-center text-gsc-red z-10">
                      {iconMap[step.icon]}
                    </div>
                    <div className="flex-1 bg-gsc-gray/20 p-6 sm:p-8 border border-gsc-gray/30 hover:border-gsc-red/30 transition-colors">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-heading text-2xl sm:text-3xl text-gsc-red tracking-wider">
                          {step.time}
                        </span>
                        <span className="font-heading text-lg sm:text-xl text-gsc-white tracking-wider">
                          {t(`programme.step${idx}`)}
                        </span>
                      </div>
                      <p className="text-sm text-gsc-white/50">
                        {t(`programme.step${idx}desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <CTASection
          title={t('programme.cta.title')}
          subtitle={t('programme.cta.subtitle')}
          primaryLabel={t('programme.cta.register')}
          primaryHref="/inscription"
        />
      </main>
      <Footer />
    </>
  )
}
