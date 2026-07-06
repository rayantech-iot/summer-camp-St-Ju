'use client'

import { useState } from 'react'
import { Check, Loader } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import CTASection from '@/components/CTASection'
import { createInscription } from '@/lib/data-service'

export default function InscriptionPage() {
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    child_name: '',
    child_age: '',
    parent_name: '',
    email: '',
    phone: '',
    camp_type: 'basket',
    session: '',
    formule: 'externat',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createInscription({
        child_name: formData.child_name,
        child_age: Number(formData.child_age),
        parent_name: formData.parent_name,
        email: formData.email,
        phone: formData.phone,
        camp_type: formData.camp_type as 'basket' | 'multisport',
        session: formData.session,
        formule: formData.formule as 'externat' | 'internat',
        message: formData.message,
        created_at: new Date().toISOString().split('T')[0],
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Erreur inscription:', err)
    }
    setSaving(false)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-32">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-gsc-red/20 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-gsc-red" />
            </div>
            <h1 className="font-heading text-4xl text-gsc-white tracking-wider mb-4">
              Merci&nbsp;!
            </h1>
            <p className="text-gsc-white/60">
              Votre pré-inscription a bien été reçue. Nous vous recontacterons rapidement
              pour finaliser l&apos;inscription.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Inscription
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Prêt à vivre une semaine inoubliable&nbsp;? Remplis le formulaire ci-dessous.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Récap dates / tarifs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-xl text-gsc-white tracking-wider">Camp Basket</h3>
                <p className="text-sm text-gsc-white/60 mt-2">4-11 juillet / 11-18 juillet</p>
                <p className="text-sm text-gsc-white/60">Valleiry</p>
                <p className="text-sm text-gsc-white/60">Externat 300€ / Internat 490€</p>
              </div>
              <div className="bg-gsc-gray/20 p-6 border border-gsc-gray/30">
                <h3 className="font-heading text-xl text-gsc-white tracking-wider">Multisport</h3>
                <p className="text-sm text-gsc-white/60 mt-2">6-13 juillet / 13-17 juillet</p>
                <p className="text-sm text-gsc-white/60">Vulbens</p>
                <p className="text-sm text-gsc-white/60">Externat 300€</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                    Nom de l&apos;enfant *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.child_name}
                    onChange={(e) => setFormData({ ...formData, child_name: e.target.value })}
                    className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                    Âge de l&apos;enfant *
                  </label>
                  <input
                    type="number"
                    required
                    min="11"
                    max="16"
                    value={formData.child_age}
                    onChange={(e) => setFormData({ ...formData, child_age: e.target.value })}
                    className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                    Nom du parent *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parent_name}
                    onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                    className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                  Type de camp *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'basket', label: 'Camp Basket' },
                    { value: 'multisport', label: 'Multisport' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, camp_type: opt.value })}
                      className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border transition-all ${
                        formData.camp_type === opt.value
                          ? 'bg-gsc-red text-white border-gsc-red'
                          : 'bg-gsc-gray/20 text-gsc-white/60 border-gsc-gray/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                  Session *
                </label>
                <select
                  required
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors"
                >
                  <option value="">Sélectionne une session</option>
                  {formData.camp_type === 'basket' ? (
                    <>
                      <option value="4-11 juillet">4-11 juillet 2026</option>
                      <option value="11-18 juillet">11-18 juillet 2026</option>
                    </>
                  ) : (
                    <>
                      <option value="6-13 juillet">6-13 juillet 2026</option>
                      <option value="13-17 juillet">13-17 juillet 2026</option>
                    </>
                  )}
                </select>
              </div>

              {formData.camp_type === 'basket' && (
                <div>
                  <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                    Formule *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'externat', label: 'Externat (300€)' },
                      { value: 'internat', label: 'Internat (490€)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, formule: opt.value })}
                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border transition-all ${
                          formData.formule === opt.value
                            ? 'bg-gsc-red text-white border-gsc-red'
                            : 'bg-gsc-gray/20 text-gsc-white/60 border-gsc-gray/30'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gsc-white/80 mb-2 uppercase tracking-wider">
                  Message (optionnel)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gsc-red hover:bg-gsc-red/90 disabled:opacity-50 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all"
              >
                {saving ? 'Envoi en cours...' : 'Envoyer ma pré-inscription'}
              </button>
            </form>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  )
}
