'use client'

import { useState } from 'react'
import { ArrowRight, X, CheckCircle, Download } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { useLanguage } from '@/contexts/LanguageContext'
import { createUSEditionInterest } from '@/lib/data-service'

export default function USEditionPage() {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    parent_name: '',
    child_first_name: '',
    child_age: '',
    email: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.parent_name || !form.child_first_name || !form.child_age || !form.email || !form.phone) {
      setError(t('usEdition.form.required'))
      return
    }
    setSubmitting(true)
    try {
      await createUSEditionInterest({
        parent_name: form.parent_name,
        child_first_name: form.child_first_name,
        child_age: Number(form.child_age),
        email: form.email,
        phone: form.phone,
      })
      setSubmitted(true)
    } catch (err) {
      setError(t('usEdition.form.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/6 to-gsc-black" />
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <AnimatedSection>
              <h1 className="font-heading text-5xl sm:text-7xl lg:text-[7rem] text-gsc-white tracking-wider leading-[0.85]">
                {t('usEdition.hero.title')}
              </h1>
              <div className="w-20 h-[2px] bg-gsc-red mx-auto my-12" />
              <p className="text-lg sm:text-xl text-gsc-white/50 tracking-[0.15em] uppercase">
                {t('usEdition.hero.subtitle')}
              </p>
              <p className="mt-6 text-sm text-gsc-white/30 tracking-wider uppercase font-bold">
                {t('usEdition.comingSoon')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* STRIP — Key details */}
        <section className="border-y border-gsc-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4">
              {(['location', 'ages', 'group', 'price'] as string[]).map((key, i) => (
                <AnimatedSection key={key} delay={i * 0.08}>
                  <div className={`py-8 px-6 text-center ${i < 3 ? 'border-r border-gsc-white/10' : ''} ${i < 2 ? 'border-b sm:border-b-0 border-gsc-white/10' : i === 2 ? 'border-b lg:border-b-0 border-gsc-white/10' : ''}`}>
                    <p className="text-gsc-white/80 text-sm tracking-wide leading-snug">
                      {t(`usEdition.features.${key}`)}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* NARRATIVE */}
        <section className="py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-12 text-center">
                {t('usEdition.narrative.title')}
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <div className="space-y-6 text-gsc-white/55 leading-[1.85] text-[15px]">
                <p>{t('usEdition.narrative.p1')}</p>
                <p>{t('usEdition.narrative.p2')}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="py-20 px-6 bg-gsc-gray/10 border-y border-gsc-white/5">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <p className="text-center text-gsc-white/30 uppercase text-[11px] tracking-[0.3em] font-bold mb-14">
                {t('usEdition.strip.title')}
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-0">
              {(['basketball', 'english', 'training', 'meet', 'departure', 'price'] as string[]).map((key, i) => (
                <AnimatedSection key={key} delay={i * 0.06}>
                  <div className="flex items-center gap-5 py-5 border-b border-gsc-white/8">
                    <span className="w-1.5 h-1.5 bg-gsc-red shrink-0" />
                    <p className="text-gsc-white/70 text-sm">
                      {t(`usEdition.features.${key}`)}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* BROCHURE DOWNLOAD */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedSection>
              <a
                href="/brochure-us-edition-2027.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border-2 border-gsc-red text-gsc-white hover:bg-gsc-red hover:text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300"
              >
                <Download size={18} />
                {t('usEdition.brochure')}
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider mb-5">
                {t('usEdition.cta')}
              </h2>
              <p className="text-gsc-white/40 mb-12 max-w-md mx-auto text-sm leading-relaxed">
                {t('usEdition.cta.sub')}
              </p>
              <button
                onClick={() => { setShowForm(true); setSubmitted(false); setError(''); setForm({ parent_name: '', child_first_name: '', child_age: '', email: '', phone: '' }) }}
                className="inline-flex items-center gap-3 bg-gsc-red hover:bg-gsc-red/90 text-white px-12 py-5 font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.02]"
              >
                {t('usEdition.cta')} <ArrowRight size={16} />
              </button>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />

      {/* POPUP FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-gsc-gray/90 border border-gsc-red/30 w-full max-w-lg p-8 rounded-sm max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gsc-white/50 hover:text-gsc-white">
              <X size={24} />
            </button>

            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <p className="text-gsc-white font-heading text-xl tracking-wider">{t('usEdition.form.success')}</p>
                <button onClick={() => setShowForm(false)} className="mt-8 text-gsc-red hover:text-gsc-red/80 text-sm uppercase tracking-wider font-bold">
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-heading text-2xl text-gsc-white tracking-wider mb-8 text-center">
                  {t('usEdition.form.title')}
                </h3>
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 mb-6 rounded-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gsc-white/60 uppercase tracking-wider mb-2">{t('usEdition.form.parent')} *</label>
                    <input type="text" required value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                      className="w-full bg-gsc-black/50 border border-gsc-white/20 text-gsc-white px-4 py-3 text-sm focus:border-gsc-red focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gsc-white/60 uppercase tracking-wider mb-2">{t('usEdition.form.child')} *</label>
                    <input type="text" required value={form.child_first_name} onChange={(e) => setForm({ ...form, child_first_name: e.target.value })}
                      className="w-full bg-gsc-black/50 border border-gsc-white/20 text-gsc-white px-4 py-3 text-sm focus:border-gsc-red focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gsc-white/60 uppercase tracking-wider mb-2">{t('usEdition.form.age')} *</label>
                    <input type="number" required min={10} max={18} value={form.child_age} onChange={(e) => setForm({ ...form, child_age: e.target.value })}
                      className="w-full bg-gsc-black/50 border border-gsc-white/20 text-gsc-white px-4 py-3 text-sm focus:border-gsc-red focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gsc-white/60 uppercase tracking-wider mb-2">{t('usEdition.form.email')} *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-gsc-black/50 border border-gsc-white/20 text-gsc-white px-4 py-3 text-sm focus:border-gsc-red focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gsc-white/60 uppercase tracking-wider mb-2">{t('usEdition.form.phone')} *</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gsc-black/50 border border-gsc-white/20 text-gsc-white px-4 py-3 text-sm focus:border-gsc-red focus:outline-none" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full bg-gsc-red hover:bg-gsc-red/90 disabled:opacity-50 text-white py-4 font-bold uppercase tracking-wider text-sm transition-all">
                    {submitting ? '...' : t('usEdition.form.submit')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
