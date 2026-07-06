'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Check, Loader } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedSection from '@/components/AnimatedSection'
import { createContactMessage } from '@/lib/data-service'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createContactMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        created_at: new Date().toISOString(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Erreur contact:', err)
    }
    setSaving(false)
  }

  return (
    <>
      <Header />
      <main>
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gsc-black via-gsc-red/5 to-gsc-black" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl text-gsc-white tracking-wider leading-none">
              Contact
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gsc-white/70 max-w-2xl mx-auto">
              Une question&nbsp;? On est là pour y répondre.
            </p>
          </div>
        </section>

        <AnimatedSection className="py-20 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-heading text-3xl text-gsc-white tracking-wider mb-8">
                Nos coordonnées
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="text-gsc-red shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-sm text-gsc-white/80">Dodzi</p>
                    <a href="tel:+33658152927" className="text-sm text-gsc-white/50 hover:text-gsc-red transition-colors">
                      +33 6 58 15 29 27
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-gsc-red shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gsc-white/50">contact@genevoissummercamp.fr</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-gsc-red shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-sm text-gsc-white/80">Camp Basket</p>
                    <p className="text-sm text-gsc-white/50">Valleiry (74520)</p>
                    <p className="font-bold text-sm text-gsc-white/80 mt-2">Édition Multisport</p>
                    <p className="text-sm text-gsc-white/50">Vulbens (74520)</p>
                    <p className="text-sm text-gsc-white/50 mt-2">Haute-Savoie, France — À 20 min de Genève</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-heading text-xl text-gsc-white tracking-wider mb-4">Suis-nous</h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/genevoissummercamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gsc-white/60 hover:text-gsc-red transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://facebook.com/genevoissummercamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gsc-white/60 hover:text-gsc-red transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://tiktok.com/@genevoissummercamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gsc-white/60 hover:text-gsc-red transition-colors"
                  >
                    TikTok
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-10 aspect-video bg-gsc-gray/20 border border-gsc-gray/30 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-gsc-red mx-auto mb-2" size={24} />
                  <p className="text-sm text-gsc-white/40">Carte — Valleiry / Vulbens (74520)</p>
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="bg-gsc-gray/20 p-8 border border-gsc-gray/30 text-center">
                  <div className="w-16 h-16 rounded-full bg-gsc-red/20 flex items-center justify-center mx-auto mb-6">
                    <Check size={32} className="text-gsc-red" />
                  </div>
                  <h3 className="font-heading text-2xl text-gsc-white tracking-wider mb-2">Message envoyé&nbsp;!</h3>
                  <p className="text-sm text-gsc-white/50">Nous te répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-heading text-3xl text-gsc-white tracking-wider mb-8">
                    Envoie-nous un message
                  </h2>
                  <div>
                    <input
                      type="text"
                      placeholder="Nom *"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Sujet"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Message *"
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gsc-red hover:bg-gsc-red/90 disabled:opacity-50 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all"
                  >
                    {saving ? 'Envoi...' : 'Envoyer'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </>
  )
}
