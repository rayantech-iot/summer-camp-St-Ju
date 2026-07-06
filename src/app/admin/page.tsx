'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield, LogOut, Upload, Plus, Edit, Trash2, Download, X, Save, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  getEditions, createEdition, deleteEdition,
  getMediaByEdition, uploadMedia, deleteMedia,
  getCoaches, createCoach, updateCoach, deleteCoach,
  getFAQItems, createFAQItem, updateFAQItem, deleteFAQItem,
  getTestimonials, createTestimonial, deleteTestimonial,
  getInscriptions, exportInscriptionsCSV,
  getContactMessages, exportMessagesCSV,
  getOffers, updateOffer,
} from '@/lib/data-service'
import type { Edition, Coach, FAQItem, Testimonial, Inscription, ContactMessage, CampOffer } from '@/lib/types'

type AdminTab = 'editions' | 'coachs' | 'faq' | 'temoignages' | 'offres' | 'inscriptions' | 'messages'

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'editions', label: 'Memories' },
  { id: 'coachs', label: 'Coachs' },
  { id: 'faq', label: 'FAQ' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'offres', label: 'Offres' },
  { id: 'inscriptions', label: 'Inscriptions' },
  { id: 'messages', label: 'Messages' },
]

// ─── Inline Dialog ───
function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gsc-gray/90 border border-gsc-gray/30 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-2xl text-gsc-white tracking-wider">{title}</h3>
          <button onClick={onClose} className="text-gsc-white/50 hover:text-gsc-white"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('editions')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Data states
  const [editions, setEditions] = useState<Edition[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, any[]>>({})
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [faqItems, setFAQItems] = useState<FAQItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [offers, setOffers] = useState<CampOffer[]>([])
  const [loading, setLoading] = useState(true)

  // Dialogs
  const [dialog, setDialog] = useState<{ open: boolean; type: string; data?: any }>({ open: false, type: '' })
  const [uploading, setUploading] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [eds, cos, faq, tms, ins, msgs, offs] = await Promise.all([
        getEditions(),
        getCoaches(),
        getFAQItems(),
        getTestimonials(),
        getInscriptions(),
        getContactMessages(),
        getOffers(),
      ])
      setEditions(eds)
      setCoaches(cos)
      setFAQItems(faq)
      setTestimonials(tms)
      setInscriptions(ins)
      setMessages(msgs)
      setOffers(offs)

      // Load media for each edition
      const mm: Record<string, any[]> = {}
      for (const ed of eds) {
        mm[ed.id] = await getMediaByEdition(ed.id)
      }
      setMediaMap(mm)
    } catch (e) {
      console.error('Load data error:', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (isLoggedIn) loadData()
  }, [isLoggedIn, loadData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (email && password) {
      setIsLoggedIn(true)
    } else {
      setLoginError('Identifiants invalides')
    }
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-32">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <Shield size={40} className="text-gsc-red mx-auto mb-4" />
              <h1 className="font-heading text-3xl text-gsc-white tracking-wider">Administration</h1>
              <p className="text-sm text-gsc-white/50 mt-2">Connecte-toi pour gérer le site</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
              <input type="password" placeholder="Mot de passe" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
              {loginError && <p className="text-sm text-gsc-red">{loginError}</p>}
              <button type="submit" className="w-full bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm">
                Se connecter
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <h1 className="font-heading text-3xl sm:text-4xl text-gsc-white tracking-wider">Administration</h1>
            <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-sm text-gsc-white/50 hover:text-gsc-red">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-gsc-red text-white' : 'bg-gsc-gray/30 text-gsc-white/60 hover:text-gsc-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gsc-white/30 font-heading text-2xl">Chargement...</div>
          ) : (
            <div className="bg-gsc-gray/20 border border-gsc-gray/30 p-6 sm:p-8">
              {/* ─── EDITIONS / MEMORIES ─── */}
              {activeTab === 'editions' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer les Memories</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-edition' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Nouvelle édition
                    </button>
                  </div>

                  {editions.length === 0 ? (
                    <p className="text-gsc-white/40 text-sm">Aucune édition pour le moment. Crée la première !</p>
                  ) : (
                    <div className="space-y-8">
                      {editions.map((ed) => (
                        <div key={ed.id} className="bg-gsc-gray/30 p-4 sm:p-6 border border-gsc-gray/30">
                          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div>
                              <span className="font-heading text-xl text-gsc-white tracking-wider">{ed.title}</span>
                              <span className="ml-3 text-xs text-gsc-white/40">{ed.year} — {ed.type === 'basket' ? 'Basket' : 'Multisport'}</span>
                            </div>
                            <div className="flex gap-2">
                              <label className="flex items-center gap-1 text-xs text-gsc-white/50 hover:text-gsc-red cursor-pointer transition-colors">
                                <Upload size={14} /> Ajouter photos/vidéos
                                <input type="file" multiple accept="image/*,video/*" className="hidden"
                                  onChange={async (e) => {
                                    const files = e.target.files
                                    if (!files) return
                                    setUploading(ed.id)
                                    for (const f of Array.from(files)) {
                                      await uploadMedia(ed.id, f)
                                    }
                                    setUploading(null)
                                    const updated = await getMediaByEdition(ed.id)
                                    setMediaMap((prev) => ({ ...prev, [ed.id]: updated }))
                                    e.target.value = ''
                                  }} />
                              </label>
                              <button onClick={async () => {
                                await deleteEdition(ed.id)
                                setEditions(await getEditions())
                              }} className="text-gsc-white/40 hover:text-gsc-red transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {uploading === ed.id && (
                            <p className="text-xs text-gsc-orange mb-3 animate-pulse">Upload en cours...</p>
                          )}

                          {/* Media grid */}
                          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                            {(mediaMap[ed.id] || []).length === 0 ? (
                              <p className="col-span-full text-xs text-gsc-white/30 py-4">Aucun média. Clique sur &quot;Ajouter photos/vidéos&quot;</p>
                            ) : (
                              (mediaMap[ed.id] || []).map((media) => (
                                <div key={media.id} className="aspect-square bg-gsc-gray/20 relative group overflow-hidden">
                                  {media.type === 'image' ? (
                                    <img src={media.url} alt={media.alt || ''} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gsc-white/20 font-heading text-2xl">
                                      {media.url ? '▶' : '🎬'}
                                    </div>
                                  )}
                                  <button
                                    onClick={async () => {
                                      await deleteMedia(media.id)
                                      const updated = await getMediaByEdition(ed.id)
                                      setMediaMap((prev) => ({ ...prev, [ed.id]: updated }))
                                    }}
                                    className="absolute top-1 right-1 bg-gsc-red/80 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── COACHS ─── */}
              {activeTab === 'coachs' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer les coachs</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-coach' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Ajouter un coach
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {coaches.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                        <div className="w-12 h-12 bg-gsc-gray/40 flex items-center justify-center text-gsc-white/20 font-heading text-xl shrink-0 rounded-full overflow-hidden">
                          {c.image_url && c.image_url.startsWith('data:') ? (
                            <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gsc-white truncate">{c.name}</p>
                          <p className="text-xs text-gsc-white/40 truncate">{c.role}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setDialog({ open: true, type: 'edit-coach', data: c })}
                            className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Edit size={16} /></button>
                          <button onClick={async () => {
                            await deleteCoach(c.id)
                            setCoaches(await getCoaches())
                          }} className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── FAQ ─── */}
              {activeTab === 'faq' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer la FAQ</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-faq' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Ajouter une question
                    </button>
                  </div>
                  <div className="space-y-2">
                    {faqItems.map((f) => (
                      <div key={f.id} className="flex items-center justify-between bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                        <p className="text-sm text-gsc-white/70 flex-1 mr-4">{f.question}</p>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setDialog({ open: true, type: 'edit-faq', data: f })}
                            className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Edit size={16} /></button>
                          <button onClick={async () => {
                            await deleteFAQItem(f.id)
                            setFAQItems(await getFAQItems())
                          }} className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── TÉMOIGNAGES ─── */}
              {activeTab === 'temoignages' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer les témoignages</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-testimonial' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {testimonials.map((t) => (
                      <div key={t.id} className="bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-bold text-gsc-white">{t.author}</p>
                          <button onClick={async () => {
                            await deleteTestimonial(t.id)
                            setTestimonials(await getTestimonials())
                          }} className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-xs text-gsc-white/50">{t.role === 'parent' ? 'Parent' : t.role === 'jeune' ? 'Jeune' : 'Coach'}</p>
                        <p className="text-xs text-gsc-white/40 mt-2 italic line-clamp-2">{t.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── OFFRES ─── */}
              {activeTab === 'offres' && (
                <div>
                  <h2 className="font-heading text-2xl text-gsc-white tracking-wider mb-6">Modifier les offres</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offers.length === 0 ? (
                      <p className="text-gsc-white/40 text-sm col-span-full">Aucune offre configurée.</p>
                    ) : (
                      offers.map((offer) => (
                        <div key={offer.id} className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                          <h3 className="font-heading text-xl text-gsc-white tracking-wider mb-4">
                            {offer.type === 'basket' ? 'Camp Basket' : 'Multisport'}
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div>
                              <label className="text-gsc-white/40 text-xs uppercase tracking-wider">Lieu</label>
                              <input defaultValue={offer.lieu}
                                className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white mt-1 focus:outline-none focus:border-gsc-red"
                                onBlur={async (e) => {
                                  const updated = await updateOffer(offer.id, { lieu: e.target.value })
                                  setOffers(offers.map((o) => o.id === offer.id ? updated : o))
                                }} />
                            </div>
                            <div>
                              <label className="text-gsc-white/40 text-xs uppercase tracking-wider">Prix externat (€)</label>
                              <input type="number" defaultValue={offer.price_externat}
                                className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white mt-1 focus:outline-none focus:border-gsc-red"
                                onBlur={async (e) => {
                                  const updated = await updateOffer(offer.id, { price_externat: Number(e.target.value) })
                                  setOffers(offers.map((o) => o.id === offer.id ? updated : o))
                                }} />
                            </div>
                            {offer.type === 'basket' && (
                              <div>
                                <label className="text-gsc-white/40 text-xs uppercase tracking-wider">Prix internat (€)</label>
                                <input type="number" defaultValue={offer.price_internat || ''}
                                  className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white mt-1 focus:outline-none focus:border-gsc-red"
                                  onBlur={async (e) => {
                                    const updated = await updateOffer(offer.id, { price_internat: Number(e.target.value) })
                                    setOffers(offers.map((o) => o.id === offer.id ? updated : o))
                                  }} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ─── INSCRIPTIONS ─── */}
              {activeTab === 'inscriptions' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Inscriptions reçues ({inscriptions.length})</h2>
                    {inscriptions.length > 0 && (
                      <button onClick={() => downloadCSV(exportInscriptionsCSV(inscriptions), 'inscriptions.csv')}
                        className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                        <Download size={16} /> Exporter CSV
                      </button>
                    )}
                  </div>
                  {inscriptions.length === 0 ? (
                    <p className="text-gsc-white/40 text-sm">Aucune inscription pour le moment.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gsc-gray/30 text-left">
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Enfant</th>
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Âge</th>
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Parent</th>
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Email</th>
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Tél.</th>
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Camp</th>
                            <th className="pb-3 pr-4 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Session</th>
                            <th className="pb-3 text-gsc-white/60 font-bold uppercase tracking-wider text-xs">Formule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inscriptions.map((ins) => (
                            <tr key={ins.id} className="border-b border-gsc-gray/20">
                              <td className="py-3 pr-4 text-gsc-white/80 whitespace-nowrap">{ins.child_name}</td>
                              <td className="py-3 pr-4 text-gsc-white/60">{ins.child_age}</td>
                              <td className="py-3 pr-4 text-gsc-white/80 whitespace-nowrap">{ins.parent_name}</td>
                              <td className="py-3 pr-4 text-gsc-white/60">{ins.email}</td>
                              <td className="py-3 pr-4 text-gsc-white/60 whitespace-nowrap">{ins.phone}</td>
                              <td className="py-3 pr-4 text-gsc-white/60">{ins.camp_type === 'basket' ? 'Basket' : 'Multisport'}</td>
                              <td className="py-3 pr-4 text-gsc-white/60 whitespace-nowrap">{ins.session}</td>
                              <td className="py-3 text-gsc-white/60">{ins.formule}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ─── MESSAGES ─── */}
              {activeTab === 'messages' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Messages reçus ({messages.length})</h2>
                    {messages.length > 0 && (
                      <button onClick={() => downloadCSV(exportMessagesCSV(messages), 'messages-contact.csv')}
                        className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                        <Download size={16} /> Exporter CSV
                      </button>
                    )}
                  </div>
                  {messages.length === 0 ? (
                    <p className="text-gsc-white/40 text-sm">Aucun message pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                          <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                            <div>
                              <p className="text-sm font-bold text-gsc-white">{msg.name}</p>
                              <p className="text-xs text-gsc-white/40">{msg.email}</p>
                            </div>
                            <p className="text-xs text-gsc-white/30">{msg.created_at}</p>
                          </div>
                          {msg.subject && <p className="text-xs text-gsc-white/50 mb-2 font-bold">{msg.subject}</p>}
                          <p className="text-sm text-gsc-white/60">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── DIALOGS ─── */}

      {/* New Edition */}
      <Dialog open={dialog.type === 'new-edition'} onClose={() => setDialog({ open: false, type: '' })} title="Nouvelle édition">
        <Form onSubmit={async (data) => {
          await createEdition(data as any)
          setEditions(await getEditions())
          setDialog({ open: false, type: '' })
        }}>
          <FormInput name="title" label="Titre (ex: Été 2026)" required />
          <FormInput name="year" label="Année" type="number" required />
          <FormSelect name="type" label="Type" options={[
            { value: 'basket', label: 'Basket' },
            { value: 'multisport', label: 'Multisport' },
          ]} required />
        </Form>
      </Dialog>

      {/* New Coach */}
      <Dialog open={dialog.type === 'new-coach'} onClose={() => setDialog({ open: false, type: '' })} title="Ajouter un coach">
        <Form onSubmit={async (data) => {
          await createCoach({
            ...data as any,
            diplomas: (data.diplomas as string || '').split(',').map((d: string) => d.trim()),
            featured: false,
            order: coaches.length,
            image_url: '',
          })
          setCoaches(await getCoaches())
          setDialog({ open: false, type: '' })
        }}>
          <FormInput name="name" label="Nom complet" required />
          <FormInput name="role" label="Rôle / Titre" required />
          <FormInput name="bio" label="Biographie" textarea required />
          <FormInput name="diplomas" label="Diplômes (séparés par des virgules)" />
          <FormInput name="citation" label="Citation" textarea />
        </Form>
      </Dialog>

      {/* Edit Coach */}
      <Dialog open={dialog.type === 'edit-coach'} onClose={() => setDialog({ open: false, type: '' })} title="Modifier un coach">
        <Form
          initialData={{
            name: (dialog.data as Coach)?.name || '',
            role: (dialog.data as Coach)?.role || '',
            bio: (dialog.data as Coach)?.bio || '',
            citation: (dialog.data as Coach)?.citation || '',
          }}
          onSubmit={async (data) => {
            await updateCoach((dialog.data as Coach).id, data as any)
            setCoaches(await getCoaches())
            setDialog({ open: false, type: '' })
          }}
        >
          <FormInput name="name" label="Nom complet" required />
          <FormInput name="role" label="Rôle / Titre" required />
          <FormInput name="bio" label="Biographie" textarea required />
          <FormInput name="citation" label="Citation" textarea />
        </Form>
      </Dialog>

      {/* New FAQ */}
      <Dialog open={dialog.type === 'new-faq'} onClose={() => setDialog({ open: false, type: '' })} title="Ajouter une question FAQ">
        <Form onSubmit={async (data) => {
          await createFAQItem({ ...data as any, order: faqItems.length })
          setFAQItems(await getFAQItems())
          setDialog({ open: false, type: '' })
        }}>
          <FormInput name="question" label="Question" required />
          <FormInput name="answer" label="Réponse" textarea required />
        </Form>
      </Dialog>

      {/* Edit FAQ */}
      <Dialog open={dialog.type === 'edit-faq'} onClose={() => setDialog({ open: false, type: '' })} title="Modifier la question">
        <Form
          initialData={{
            question: (dialog.data as FAQItem)?.question || '',
            answer: (dialog.data as FAQItem)?.answer || '',
          }}
          onSubmit={async (data) => {
            await updateFAQItem((dialog.data as FAQItem).id, data as any)
            setFAQItems(await getFAQItems())
            setDialog({ open: false, type: '' })
          }}
        >
          <FormInput name="question" label="Question" required />
          <FormInput name="answer" label="Réponse" textarea required />
        </Form>
      </Dialog>

      {/* New Testimonial */}
      <Dialog open={dialog.type === 'new-testimonial'} onClose={() => setDialog({ open: false, type: '' })} title="Ajouter un témoignage">
        <Form onSubmit={async (data) => {
          await createTestimonial({ ...data as any, created_at: new Date().toISOString() })
          setTestimonials(await getTestimonials())
          setDialog({ open: false, type: '' })
        }}>
          <FormInput name="author" label="Nom / Prénom" required />
          <FormSelect name="role" label="Rôle" options={[
            { value: 'parent', label: 'Parent' },
            { value: 'jeune', label: 'Jeune' },
            { value: 'coach', label: 'Coach' },
          ]} required />
          <FormInput name="content" label="Témoignage" textarea required />
          <FormInput name="rating" label="Note (1-5)" type="number" min={1} max={5} required />
        </Form>
      </Dialog>

      <Footer />
    </>
  )
}

// ─── Form helpers ───

function Form({ children, onSubmit, initialData }: { children: React.ReactNode; onSubmit: (data: Record<string, string>) => Promise<void>; initialData?: Record<string, string> }) {
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(initialData || {})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSubmit(values)
    setSaving(false)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Array.isArray(children) ? (children as React.ReactElement[]).map((child) => {
        if (child.type === FormInput || child.type === FormSelect) {
          return (
            <child.type
              key={(child.props as any).name}
              {...(child.props as any)}
              value={values[(child.props as any).name] || ''}
              onChange={(val: string) => setValue((child.props as any).name, val)}
            />
          )
        }
        return child
      }) : children}
      <button type="submit" disabled={saving}
        className="w-full bg-gsc-red hover:bg-gsc-red/90 disabled:opacity-50 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all">
        {saving ? 'Enregistrement...' : done ? <span className="flex items-center justify-center gap-2"><Save size={16} /> Enregistré</span> : 'Enregistrer'}
      </button>
    </form>
  )
}

function FormInput({ label, name, textarea, type = 'text', required, min, max, value: controlledValue, onChange }: any) {
  const isControlled = controlledValue !== undefined
  const [localValue, setLocalValue] = useState('')

  const val = isControlled ? controlledValue : localValue
  const setVal = isControlled ? onChange : setLocalValue

  const inputProps = {
    required,
    value: val,
    onChange: (e: any) => setVal(e.target.value),
    className: 'w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1',
    placeholder: label,
  }

  return (
    <div>
      <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea rows={4} {...inputProps} />
      ) : (
        <input type={type} min={min} max={max} {...inputProps} />
      )}
    </div>
  )
}

function FormSelect({ label, name, options, required, value: controlledValue, onChange }: any) {
  const isControlled = controlledValue !== undefined
  const [localValue, setLocalValue] = useState(options[0]?.value || '')

  const val = isControlled ? controlledValue : localValue
  const setVal = isControlled ? onChange : setLocalValue

  return (
    <div>
      <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">{label}</label>
      <select
        required={required}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red mt-1"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
