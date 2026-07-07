'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { getFAQItems } from '@/lib/data-service'
import type { FAQItem } from '@/lib/types'

function AccordionItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b border-gsc-gray/30">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left hover:text-gsc-red transition-colors"
      >
        <span className="font-heading text-lg sm:text-xl text-gsc-white tracking-wider pr-4">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gsc-red transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-sm sm:text-base text-gsc-white/60 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [faqItems, setFAQItems] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const items = await getFAQItems()
      setFAQItems(items)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              FAQ
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Toutes les réponses à vos questions.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <p className="text-center text-gsc-white/30 text-sm">Chargement...</p>
            ) : faqItems.length === 0 ? (
              <p className="text-center text-gsc-white/30 text-sm">Aucune question pour le moment.</p>
            ) : (
              faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openId === item.id}
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                />
              ))
            )}
          </div>
        </AnimatedSection>

        <CTASection
          title="Encore une question ?"
          subtitle="On est là pour te répondre."
          primaryLabel="Contacte-nous"
          primaryHref="/contact"
        />
      </main>
      <Footer />
    </>
  )
}
