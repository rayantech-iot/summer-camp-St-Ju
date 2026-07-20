'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Shield, LogOut, Upload, Plus, Edit, Trash2, Download, X, Save, ImageIcon, AlertTriangle, UserPlus } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  getEditions, createEdition, deleteEdition,
  getMediaByEdition, uploadMedia, deleteMedia,
  getCoaches, createCoach, updateCoach, deleteCoach,
  getFAQItems, createFAQItem, updateFAQItem, deleteFAQItem,
  getTestimonials, createTestimonial, deleteTestimonial,
  getContactMessages, exportMessagesCSV,
  getOffers, updateOffer,
  getAdminUsers, createAdminUser, deleteAdminUser, findAdminByEmail,
  setAdminPassword, verifyAdminPassword,
  getSiteConfig, saveSiteConfig,
} from '@/lib/data-service'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Edition, Coach, FAQItem, Testimonial, ContactMessage, CampOffer, AdminUser, SiteConfig } from '@/lib/types'

type AdminTab = 'editions' | 'coachs' | 'faq' | 'temoignages' | 'offres' | 'messages' | 'admins' | 'config'

const tabs: { id: AdminTab; label: string }[] = [
  { id: 'editions', label: 'Memories' },
  { id: 'coachs', label: 'Coachs' },
  { id: 'faq', label: 'FAQ' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'offres', label: 'Offres' },
  { id: 'messages', label: 'Messages' },
  { id: 'admins', label: 'Admins' },
  { id: 'config', label: 'Config' },
]

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
  const [isLoggedIn, setIsLoggedIn_] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('editions')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const setIsLoggedIn = (v: boolean) => {
    setIsLoggedIn_(v)
    if (v) {
      try { localStorage.setItem('gsc_admin', '1') } catch { /* ignore */ }
    } else {
      try { localStorage.removeItem('gsc_admin') } catch { /* ignore */ }
    }
  }

  const [editions, setEditions] = useState<Edition[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, any[]>>({})
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [faqItems, setFAQItems] = useState<FAQItem[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [offers, setOffers] = useState<CampOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [offerDrafts, setOfferDrafts] = useState<CampOffer[]>([])
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const [dialog, setDialog] = useState<{ open: boolean; type: string; data?: any }>({ open: false, type: '' })
  const [uploading, setUploading] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' })
  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null)

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passwordSetupError, setPasswordSetupError] = useState('')
  const [adminEmailInput, setAdminEmailInput] = useState('')
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ sessions: [{ basket_dates: '', multisport_dates: '' }] })
  const [configSavedMessage, setConfigSavedMessage] = useState('')
  const [savingConfig, setSavingConfig] = useState(false)

  const askConfirm = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve
      setDialog({ open: false, type: '' })
      setConfirmModal({ open: true, title, message })
    })
  }, [])

  const handleConfirmYes = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, open: false }))
    confirmResolveRef.current?.(true)
    confirmResolveRef.current = null
  }, [])

  const handleConfirmNo = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, open: false }))
    confirmResolveRef.current?.(false)
    confirmResolveRef.current = null
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [eds, cos, faq, tms, msgs, offs, admins, config] = await Promise.all([
        getEditions(),
        getCoaches(),
        getFAQItems(),
        getTestimonials(),
        getContactMessages(),
        getOffers(),
        getAdminUsers(),
        getSiteConfig(),
      ])
      setEditions(eds)
      setCoaches(cos)
      setFAQItems(faq)
      setTestimonials(tms)
      setMessages(msgs)
      setOffers(offs)
      setOfferDrafts(offs.map((o) => ({ ...o })))
      setAdminUsers(admins)
      setSiteConfig(config)

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
    const saved = typeof window !== 'undefined' && localStorage.getItem('gsc_admin')
    if (saved === '1') setIsLoggedIn_(true)
  }, [])

  useEffect(() => {
    if (isLoggedIn) loadData()
  }, [isLoggedIn, loadData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (!email) { setLoginError('Entre ton email'); return }

    try {
      const admin = await findAdminByEmail(email)

      if (!admin) {
        if (email.toLowerCase() === 'admin@genevoissummercamp.fr') {
          const created = await createAdminUser(email)
          setNeedsPasswordSetup(true)
          return
        }
        setLoginError('Email non trouvé. Seuls les administrateurs invités peuvent se connecter.')
        return
      }

      if (!admin.password_set) {
        setNeedsPasswordSetup(true)
        return
      }

      if (admin.password_hash) {
        const valid = await verifyAdminPassword(email, password)
        if (valid) { setIsLoggedIn(true); return }
        setLoginError('Mot de passe incorrect')
        return
      }

      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) {
          if (password) await setAdminPassword(admin.id, password)
          setIsLoggedIn(true)
          return
        }
      }

      setLoginError('Email ou mot de passe incorrect')
    } catch (e) {
      setLoginError('Erreur de connexion : ' + (e instanceof Error ? e.message : 'problème réseau'))
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

  if (needsPasswordSetup) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-32">
          <div className="w-full max-w-sm">
            <div className="text-center mb-10">
              <Shield size={40} className="text-gsc-red mx-auto mb-4" />
              <h1 className="font-heading text-3xl text-gsc-white tracking-wider">Bienvenue !</h1>
              <p className="text-sm text-gsc-white/50 mt-2">Configure ton mot de passe pour accéder à l'administration.</p>
            </div>
            <div className="space-y-4">
              <input type="email" value={email} disabled
                className="w-full bg-gsc-gray/10 border border-gsc-gray/20 px-4 py-3 text-gsc-white/50 focus:outline-none cursor-not-allowed" />
              <input type="password" placeholder="Nouveau mot de passe" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
              <input type="password" placeholder="Confirmer le mot de passe" value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
              {passwordSetupError && <p className="text-sm text-gsc-red">{passwordSetupError}</p>}
              <button onClick={async () => {
                setPasswordSetupError('')
                if (!newPassword || newPassword.length < 6) {
                  setPasswordSetupError('Le mot de passe doit faire au moins 6 caractères')
                  return
                }
                if (newPassword !== newPasswordConfirm) {
                  setPasswordSetupError('Les mots de passe ne correspondent pas')
                  return
                }
                try {
                  const admin = await findAdminByEmail(email)
                  if (admin) {
                    await setAdminPassword(admin.id, newPassword)
                  }
                  setNeedsPasswordSetup(false)
                  setIsLoggedIn(true)
                } catch (e) {
                  setPasswordSetupError('Erreur : ' + (e instanceof Error ? e.message : 'problème réseau'))
                }
              }} className="w-full bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm">
                Enregistrer le mot de passe
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
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
              <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gsc-gray/20 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
              {loginError && <p className="text-sm text-gsc-red">{loginError}</p>}
              <button type="submit" className="w-full bg-gsc-red hover:bg-gsc-red/90 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm">
                Se connecter
              </button>
              <p className="text-xs text-gsc-white/30 text-center">Première connexion ? Entre ton email (mot de passe vide) et clique sur "Se connecter".</p>
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
                              <span className="ml-3 text-xs text-gsc-white/40">{ed.year} - {ed.type === 'basket' ? 'Basket' : 'Multisport'}</span>
                            </div>
                            <div className="flex gap-2">
                              <label className="flex items-center gap-1 text-xs text-gsc-white/50 hover:text-gsc-red cursor-pointer transition-colors">
                                <Upload size={14} /> Ajouter photos/vidéos
                                <input type="file" multiple accept="image/*,video/*" className="hidden"
                                  onChange={async (e) => {
                                     const files = e.target.files
                                     if (!files) return
                                     const valid = Array.from(files).filter(f => f.size <= 20 * 1024 * 1024)
                                     const oversize = files.length - valid.length
                                     if (oversize > 0) alert(`${oversize} fichier(s) ignorés ( > 20 Mo)`)
                                     if (valid.length === 0) { e.target.value = ''; return }
                                     setUploading(ed.id)
                                     let errors = 0
                                     for (const f of valid) {
                                       try {
                                         await uploadMedia(ed.id, f)
                                       } catch (err) {
                                         console.error('Upload error:', f.name, err)
                                         errors++
                                       }
                                     }
                                     setUploading(null)
                                     if (errors > 0) {
                                       alert(`${errors} fichier(s) sur ${valid.length} n'ont pas pu être importés.`)
                                     }
                                     const updated = await getMediaByEdition(ed.id)
                                     setMediaMap((prev) => ({ ...prev, [ed.id]: updated }))
                                     e.target.value = ''
                                   }} />
                              </label>
                              <button onClick={async () => {
                                const ok = await askConfirm('Supprimer l\'édition', `Supprimer "${ed.title}" ainsi que toutes ses photos ?`)
                                if (!ok) return
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
                                      const ok = await askConfirm('Supprimer le média', 'Cette action est irréversible.')
                                      if (!ok) return
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
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer les coachs ({coaches.length})</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-coach' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Ajouter un coach
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {coaches.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                        <div className="w-14 h-14 bg-gsc-gray/40 rounded-full overflow-hidden shrink-0">
                          {c.image_url ? (
                            <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gsc-white/20 font-heading text-xl">
                              {c.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gsc-white truncate">{c.name}</p>
                          <p className="text-xs text-gsc-white/40 truncate">{c.role}</p>
                          {c.featured && <span className="text-[10px] text-gsc-orange uppercase tracking-wider">À la une</span>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setDialog({ open: true, type: 'edit-coach', data: c })}
                            className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Edit size={16} /></button>
                          <button onClick={async () => {
                            const ok = await askConfirm('Supprimer le coach', `Supprimer "${c.name}" de l'équipe ?`)
                            if (!ok) return
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
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer la FAQ ({faqItems.length})</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-faq' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Ajouter une question
                    </button>
                  </div>
                  <div className="space-y-2">
                    {faqItems.length === 0 ? (
                      <p className="text-gsc-white/40 text-sm">Aucune question FAQ.</p>
                    ) : (
                      faqItems.map((f) => (
                        <div key={f.id} className="flex items-center justify-between bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                          <p className="text-sm text-gsc-white/70 flex-1 mr-4">{f.question}</p>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setDialog({ open: true, type: 'edit-faq', data: f })}
                              className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Edit size={16} /></button>
                            <button onClick={async () => {
                              const ok = await askConfirm('Supprimer la question', `Supprimer "${f.question}" ?`)
                              if (!ok) return
                              await deleteFAQItem(f.id)
                              setFAQItems(await getFAQItems())
                            }} className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ─── TÉMOIGNAGES ─── */}
              {activeTab === 'temoignages' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer les témoignages ({testimonials.length})</h2>
                    <button onClick={() => setDialog({ open: true, type: 'new-testimonial' })}
                      className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      <Plus size={16} /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {testimonials.length === 0 ? (
                      <p className="text-gsc-white/40 text-sm">Aucun témoignage.</p>
                    ) : (
                      testimonials.map((t) => (
                        <div key={t.id} className="bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-gsc-white">{t.author}</p>
                            <button onClick={async () => {
                              const ok = await askConfirm('Supprimer le témoignage', `Supprimer le témoignage de "${t.author}" ?`)
                              if (!ok) return
                              await deleteTestimonial(t.id)
                              setTestimonials(await getTestimonials())
                            }} className="text-gsc-white/40 hover:text-gsc-red transition-colors"><Trash2 size={16} /></button>
                          </div>
                          <p className="text-xs text-gsc-white/50">{t.role === 'parent' ? 'Parent' : t.role === 'jeune' ? 'Jeune' : 'Coach'}</p>
                          <p className="text-xs text-gsc-white/40 mt-2 italic line-clamp-2">{t.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ─── OFFRES ─── */}
              {activeTab === 'offres' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Modifier les offres</h2>
                    <div className="flex items-center gap-3">
                      {savedMessage && (
                        <span className="text-green-400 text-sm font-bold animate-pulse">{savedMessage}</span>
                      )}
                      <button disabled={saving}
                        onClick={async () => {
                          setSaving(true)
                          setSavedMessage('')
                          for (const draft of offerDrafts) {
                            try {
                              const updated = await updateOffer(draft.id, {
                                lieu: draft.lieu,
                                price_externat: draft.price_externat,
                                price_externat_avec_repas: draft.price_externat_avec_repas,
                                price_internat: draft.type === 'basket' ? draft.price_internat : undefined,
                              })
                              setOffers((prev) => prev.map((o) => o.id === updated.id ? updated : o))
                            } catch (e) {
                              console.error('Save offer error:', e)
                            }
                          }
                          setSavedMessage('Offres enregistrées ✓')
                          setTimeout(() => setSavedMessage(''), 3000)
                          setSaving(false)
                        }}
                        className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider disabled:opacity-50">
                        <Save size={16} /> {saving ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offerDrafts.length === 0 ? (
                      <p className="text-gsc-white/40 text-sm col-span-full">Aucune offre configurée.</p>
                    ) : (
                      offerDrafts.map((offer) => (
                        <div key={offer.id} className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                          <h3 className="font-heading text-xl text-gsc-white tracking-wider mb-4">
                            {offer.type === 'basket' ? 'Camp Basket' : 'Multisport'}
                          </h3>
                          <div className="space-y-4 text-sm">
                            <div>
                              <label className="text-gsc-white/40 text-xs uppercase tracking-wider">Lieu(x)</label>
                              <input value={offer.lieu}
                                onChange={(e) => setOfferDrafts((prev) => prev.map((o) => o.id === offer.id ? { ...o, lieu: e.target.value } : o))}
                                className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white mt-1 focus:outline-none focus:border-gsc-red" />
                            </div>

                            <div className="border border-gsc-gray/20 p-4">
                              <p className="text-gsc-white/50 text-xs uppercase tracking-wider mb-3 font-bold">Externat — Sans repas</p>
                              <p className="text-gsc-white/30 text-[10px] mb-2">Le jeune apporte son déjeuner et son goûter</p>
                              <div className="flex items-center gap-2">
                                <span className="text-gsc-white/50 text-xs">Prix :</span>
                                <input type="number" value={offer.price_externat}
                                  onChange={(e) => setOfferDrafts((prev) => prev.map((o) => o.id === offer.id ? { ...o, price_externat: Number(e.target.value) } : o))}
                                  className="w-24 bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white focus:outline-none focus:border-gsc-red" />
                                <span className="text-gsc-white/40 text-xs">€/semaine</span>
                              </div>
                            </div>

                            <div className="border border-gsc-red/30 bg-gsc-red/5 p-4">
                              <p className="text-gsc-orange text-xs uppercase tracking-wider mb-3 font-bold">✓ Externat — Avec repas (Recommandé)</p>
                              <p className="text-gsc-white/30 text-[10px] mb-2">Déjeuner et goûter fournis par le camp</p>
                              <div className="flex items-center gap-2">
                                <span className="text-gsc-white/50 text-xs">Prix :</span>
                                <input type="number" value={offer.price_externat_avec_repas || ''}
                                  onChange={(e) => setOfferDrafts((prev) => prev.map((o) => o.id === offer.id ? { ...o, price_externat_avec_repas: Number(e.target.value) } : o))}
                                  className="w-24 bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white focus:outline-none focus:border-gsc-red" />
                                <span className="text-gsc-white/40 text-xs">€/semaine</span>
                              </div>
                            </div>

                            {offer.type === 'basket' && (
                              <div className="border border-gsc-gray/20 p-4">
                                <p className="text-gsc-white/50 text-xs uppercase tracking-wider mb-3 font-bold">Internat — Pension complète</p>
                                <p className="text-gsc-white/30 text-[10px] mb-2">Hébergement + tous les repas (petit-déjeuner, déjeuner, dîner)</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-gsc-white/50 text-xs">Prix :</span>
                                  <input type="number" value={offer.price_internat || ''}
                                    onChange={(e) => setOfferDrafts((prev) => prev.map((o) => o.id === offer.id ? { ...o, price_internat: Number(e.target.value) } : o))}
                                    className="w-24 bg-gsc-black/50 border border-gsc-gray/30 px-3 py-2 text-gsc-white focus:outline-none focus:border-gsc-red" />
                                  <span className="text-gsc-white/40 text-xs">€/semaine</span>
                                </div>
                                <p className="text-gsc-white/20 text-[10px] mt-2 italic">Disponible uniquement pour le Camp Basket</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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

              {/* ─── ADMINS ─── */}
              {activeTab === 'admins' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Gérer les administrateurs ({adminUsers.length})</h2>
                  </div>
                  <div className="bg-gsc-gray/30 p-4 border border-gsc-gray/30 mb-6">
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider mb-1">Email du nouvel admin</label>
                        <input type="email" placeholder="email@exemple.com" value={adminEmailInput}
                          onChange={(e) => setAdminEmailInput(e.target.value)}
                          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
                      </div>
                      <button onClick={async () => {
                        console.log('adminEmailInput value:', JSON.stringify(adminEmailInput))
                        if (!adminEmailInput || !adminEmailInput.includes('@')) { alert('Email invalide: ' + adminEmailInput); return }
                        try {
                          const existing = await findAdminByEmail(adminEmailInput)
                          if (existing) { alert('Cet admin existe déjà'); return }
                          await createAdminUser(adminEmailInput)
                          setAdminUsers(await getAdminUsers())
                          setAdminEmailInput('')
                          alert(`Admin ${adminEmailInput} ajouté. Donne-lui le lien de connexion, il n'aura qu'à entrer son email et créer son mot de passe.`)
                        } catch (e) {
                          alert("Erreur : " + (e instanceof Error ? e.message : 'problème réseau'))
                        }
                      }} className="bg-gsc-red hover:bg-gsc-red/90 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
                        <UserPlus size={16} className="inline mr-1" /> Ajouter
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {adminUsers.map((a) => (
                      <div key={a.id} className="flex items-center justify-between bg-gsc-gray/30 p-4 border border-gsc-gray/30">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${a.password_set ? 'bg-green-400' : 'bg-yellow-400'}`} />
                          <span className="text-sm text-gsc-white">{a.email}</span>
                          <span className={`text-xs ${a.password_set ? 'text-green-400/60' : 'text-yellow-400/60'}`}>
                            {a.password_set ? 'Mot de passe défini' : 'En attente'}
                          </span>
                        </div>
                        <button onClick={async () => {
                          const ok = await askConfirm('Supprimer admin', `Supprimer l'accès de ${a.email} ?`)
                          if (!ok) return
                          try {
                            await deleteAdminUser(a.id)
                            setAdminUsers(await getAdminUsers())
                          } catch (e) {
                            alert("Erreur : " + (e instanceof Error ? e.message : 'problème réseau'))
                          }
                        }} className="text-gsc-white/40 hover:text-gsc-red transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {adminUsers.length === 0 && (
                      <p className="text-gsc-white/40 text-sm">Aucun administrateur pour le moment.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ─── CONFIG ─── */}
              {activeTab === 'config' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <h2 className="font-heading text-2xl text-gsc-white tracking-wider">Configuration du site</h2>
                    <div className="flex items-center gap-3">
                      {configSavedMessage && (
                        <span className="text-green-400 text-sm font-bold animate-pulse">{configSavedMessage}</span>
                      )}
                      <button disabled={savingConfig}
                        onClick={async () => {
                          setSavingConfig(true)
                          setConfigSavedMessage('')
                          try {
                            await saveSiteConfig(siteConfig)
                            setConfigSavedMessage('Config enregistrée ✓')
                            setTimeout(() => setConfigSavedMessage(''), 3000)
                          } catch (e) {
                            setConfigSavedMessage('Erreur : ' + (e instanceof Error ? e.message : 'problème réseau'))
                            setTimeout(() => setConfigSavedMessage(''), 5000)
                          }
                          setSavingConfig(false)
                        }}
                        className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-6 py-2 text-sm font-bold uppercase tracking-wider disabled:opacity-50">
                        <Save size={16} /> {savingConfig ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                    </div>
                  </div>
                  <div className="bg-gsc-gray/30 p-6 border border-gsc-gray/30">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-xl text-gsc-white tracking-wider">Sessions à venir</h3>
                      {siteConfig.sessions.length < 4 && (
                        <button onClick={() => setSiteConfig((prev) => ({ ...prev, sessions: [...prev.sessions, { basket_dates: '', multisport_dates: '' }] }))}
                          className="flex items-center gap-2 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider">
                          <Plus size={16} /> Ajouter une session
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gsc-white/40 mb-6">Les dates saisies s'afficheront sur la page d'accueil. Jusqu'à 4 sessions max.</p>
                    <div className="space-y-6">
                      {siteConfig.sessions.map((session, idx) => (
                        <div key={idx} className="bg-gsc-black/50 p-4 border border-gsc-gray/30">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-heading text-lg text-gsc-white tracking-wider">Session {idx + 1}</h4>
                            {siteConfig.sessions.length > 1 && (
                              <button onClick={() => setSiteConfig((prev) => ({ ...prev, sessions: prev.sessions.filter((_, i) => i !== idx) }))}
                                className="text-gsc-red text-xs hover:underline">Supprimer</button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gsc-white/40 uppercase tracking-wider mb-1">Camp Basket — dates</label>
                              <input value={session.basket_dates}
                                onChange={(e) => setSiteConfig((prev) => ({ ...prev, sessions: prev.sessions.map((s, i) => i === idx ? { ...s, basket_dates: e.target.value } : s) }))}
                                placeholder="ex: 4-11 juillet 2026"
                                className="w-full bg-gsc-gray/30 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
                            </div>
                            <div>
                              <label className="block text-xs text-gsc-white/40 uppercase tracking-wider mb-1">Multisport — dates</label>
                              <input value={session.multisport_dates}
                                onChange={(e) => setSiteConfig((prev) => ({ ...prev, sessions: prev.sessions.map((s, i) => i === idx ? { ...s, multisport_dates: e.target.value } : s) }))}
                                placeholder="ex: 6-13 juillet 2026"
                                className="w-full bg-gsc-gray/30 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── DIALOGS ─── */}

      {/* New Edition + upload images */}
      <Dialog open={dialog.type === 'new-edition'} onClose={() => setDialog({ open: false, type: '' })} title="Nouvelle édition">
        <NewEditionDialog
          onDone={() => {
            setDialog({ open: false, type: '' })
            loadData()
          }}
        />
      </Dialog>

      {/* New Coach */}
      <Dialog open={dialog.type === 'new-coach'} onClose={() => setDialog({ open: false, type: '' })} title="Ajouter un coach">
        <CoachForm
          onDone={() => {
            setDialog({ open: false, type: '' })
            loadData()
          }}
        />
      </Dialog>

      {/* Edit Coach */}
      <Dialog open={dialog.type === 'edit-coach'} onClose={() => setDialog({ open: false, type: '' })} title="Modifier un coach">
        <CoachForm
          coach={dialog.data as Coach}
          onDone={() => {
            setDialog({ open: false, type: '' })
            loadData()
          }}
        />
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
          await createTestimonial({ author: data.author, role: data.role as 'parent' | 'jeune' | 'coach', content: data.content, rating: Number(data.rating), created_at: new Date().toISOString() })
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

      {/* ─── Confirmation Modal ─── */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gsc-gray/90 border border-gsc-gray/30 w-full max-w-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 bg-gsc-red/20 shrink-0">
                <AlertTriangle size={24} className="text-gsc-red" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-xl text-gsc-white tracking-wider">{confirmModal.title}</h3>
                  <button onClick={handleConfirmNo} className="text-gsc-white/40 hover:text-gsc-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm text-gsc-white/60 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleConfirmNo}
                className="flex-1 border border-gsc-gray/40 text-gsc-white/70 hover:text-gsc-white hover:border-gsc-gray/30 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all">
                Annuler
              </button>
              <button onClick={handleConfirmYes}
                className="flex-1 bg-gsc-red hover:bg-gsc-red/90 text-white px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

// ─── New Edition Dialog with image upload ───

function NewEditionDialog({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [type, setType] = useState<'basket' | 'multisport'>('basket')
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !year) return
    setSaving(true)
    setError('')
    try {
      const edition = await createEdition({ title, year: Number(year), type, created_at: new Date().toISOString() })
      // Upload files in background, close dialog immediately
      onDone()
      for (const f of files) {
        try {
          await uploadMedia(edition.id, f)
        } catch (err) {
          console.error('Upload error:', f.name, err)
        }
      }
    } catch (err) {
      console.error('Edition save error:', err)
      setError('Erreur lors de la création. Vérifie ta connexion et réessaie.')
      setSaving(false)
    }
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    const valid = selected.filter(f => f.size <= 20 * 1024 * 1024)
    const oversize = selected.length - valid.length
    if (oversize > 0) alert(`${oversize} fichier(s) trop volumineux (> 20 Mo) ont été ignorés`)
    setFiles(valid)
    e.target.value = ''
  }

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Titre (ex: Été 2026)</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1" placeholder="Été 2026" />
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Année</label>
        <input type="number" required value={year} onChange={(e) => setYear(Number(e.target.value))}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red mt-1" />
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white focus:outline-none focus:border-gsc-red mt-1">
          <option value="basket">Basket</option>
          <option value="multisport">Multisport</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider mb-2">
          Photos
        </label>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gsc-gray/40 hover:border-gsc-red/50 px-4 py-6 cursor-pointer transition-colors">
          <ImageIcon size={20} className="text-gsc-white/40" />
          <span className="text-sm text-gsc-white/40">
            {files.length > 0 ? `${files.length} fichier(s) sélectionné(s)` : 'Clique pour choisir les photos'}
          </span>
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </label>
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((f, i) => (
              <div key={i} className="relative w-16 h-16 bg-gsc-gray/30 overflow-hidden group">
                <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeFile(i)}
                  className="absolute top-0 right-0 bg-gsc-red/80 text-white p-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-gsc-red text-sm">{error}</p>}
      <button type="submit" disabled={saving}
        className="w-full bg-gsc-red hover:bg-gsc-red/90 disabled:opacity-50 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all">
        {saving ? 'Création en cours...' : 'Créer l\'édition'}
      </button>
    </form>
  )
}

// ─── Coach Form with image upload ───

function CoachForm({ coach, onDone }: { coach?: Coach; onDone: () => void }) {
  const [name, setName] = useState(coach?.name || '')
  const [role, setRole] = useState(coach?.role || '')
  const [bio, setBio] = useState(coach?.bio || '')
  const [diplomas, setDiplomas] = useState(coach?.diplomas.join(', ') || '')
  const [citation, setCitation] = useState(coach?.citation || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(coach?.image_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !role || !bio) return
    setSaving(true)

    try {
      let image_url = coach?.image_url || ''
      if (imageFile) {
        image_url = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(imageFile)
        })
      }

      const data: any = {
        name, role, bio,
        diplomas: diplomas.split(',').map((d) => d.trim()).filter(Boolean),
        citation,
        image_url,
      }

      if (coach) {
        await updateCoach(coach.id, data)
      } else {
        await createCoach({ ...data, featured: false, order: Date.now() })
      }

      setSaving(false)
      onDone()
    } catch (err) {
      console.error('Coach save error:', err)
      setError("Erreur lors de l'enregistrement. Vérifie les champs et réessaie.")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Photo du coach</label>
        <div className="flex items-center gap-4 mt-1">
          <div className="w-16 h-16 bg-gsc-gray/40 rounded-full overflow-hidden shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gsc-white/20 font-heading text-2xl">
                ?
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs text-gsc-white/50 hover:text-gsc-red cursor-pointer transition-colors">
            <Upload size={14} /> {imagePreview ? 'Changer la photo' : 'Importer une photo'}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Nom complet</label>
        <input required value={name} onChange={(e) => setName(e.target.value)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1" placeholder="Prénom NOM" />
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Rôle / Titre</label>
        <input required value={role} onChange={(e) => setRole(e.target.value)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1" placeholder="Entraîneur Club" />
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Biographie</label>
        <textarea required rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1" />
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Diplômes (séparés par des virgules)</label>
        <input value={diplomas} onChange={(e) => setDiplomas(e.target.value)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1" placeholder="DEJEPS, BPJEPS" />
      </div>
      <div>
        <label className="block text-xs text-gsc-white/40 uppercase tracking-wider">Citation</label>
        <textarea rows={2} value={citation} onChange={(e) => setCitation(e.target.value)}
          className="w-full bg-gsc-black/50 border border-gsc-gray/30 px-4 py-3 text-gsc-white placeholder:text-gsc-white/30 focus:outline-none focus:border-gsc-red mt-1" />
      </div>
      {error && <p className="text-sm text-gsc-red">{error}</p>}
      <button type="submit" disabled={saving}
        className="w-full bg-gsc-red hover:bg-gsc-red/90 disabled:opacity-50 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all">
        {saving ? 'Enregistrement...' : coach ? 'Enregistrer les modifications' : 'Ajouter le coach'}
      </button>
    </form>
  )
}

// ─── Form helpers ───

function Form({ children, onSubmit, initialData }: { children: React.ReactNode; onSubmit: (data: Record<string, string>) => Promise<void>; initialData?: Record<string, string> }) {
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (initialData) return initialData
    const defaults: Record<string, string> = {}
    const arr = Array.isArray(children) ? children : [children]
    arr.forEach((child: any) => {
      if (child?.type === FormSelect) {
        defaults[child.props.name] = child.props.options?.[0]?.value || ''
      }
    })
    return defaults
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit(values)
      setSaving(false)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch (err: any) {
      setSaving(false)
      setError(err?.message || 'Une erreur est survenue')
    }
  }

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Array.isArray(children) ? (children as React.ReactElement[]).map((child) => {
        if (child.type === FormInput) {
          return (
            <child.type
              key={(child.props as any).name}
              {...(child.props as any)}
              value={values[(child.props as any).name] || ''}
              onChange={(val: string) => setValue((child.props as any).name, val)}
            />
          )
        }
        if (child.type === FormSelect) {
          return (
            <child.type
              key={(child.props as any).name}
              {...(child.props as any)}
              value={values[(child.props as any).name] ?? ''}
              onChange={(val: string) => setValue((child.props as any).name, val)}
            />
          )
        }
        return child
      }) : children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
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
