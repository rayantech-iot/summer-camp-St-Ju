import { supabase } from './supabase'
import { compressImage } from './compress-image'
import { getItem, setItem } from './storage'

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
import type {
  Edition,
  MemoryMedia,
  Coach,
  Testimonial,
  FAQItem,
  CampOffer,
  Inscription,
  ContactMessage,
  AdminUser,
  SiteConfig,
} from './types'
import { coaches as fallbackCoaches, testimonials as fallbackTestimonials, faqItems as fallbackFAQ } from './data'

const SUPABASE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getLocalData<T>(key: string): Promise<T[]> {
  if (typeof window === 'undefined') return []
  const data = await getItem<T[]>(key)
  return data ?? []
}

async function setLocalData<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  await setItem(key, data)
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Editions ───

export async function getEditions(): Promise<Edition[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('editions').select('*').order('year', { ascending: false })
    if (error) throw new Error("Erreur de chargement des éditions : " + error.message)
    return data || []
  }
  return getLocalData<Edition>('editions')
}

export async function createEdition(edition: Omit<Edition, 'id'>): Promise<Edition> {
  const newEdition: Edition = { ...edition, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('editions').insert(newEdition).select().single()
    if (error) throw new Error("Erreur de création de l'édition : " + error.message)
    return data
  }
  const items = [...await getLocalData<Edition>('editions'), newEdition]
  await setLocalData('editions', items)
  return newEdition
}

export async function deleteEdition(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('editions').delete().eq('id', id)
    if (error) throw new Error("Erreur de suppression de l'édition : " + error.message)
    return
  }
  const items = (await getLocalData<Edition>('editions')).filter((e) => e.id !== id)
  await setLocalData('editions', items)
}

// ─── Memories / Media ───

export async function getMediaByEdition(editionId: string): Promise<MemoryMedia[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase
      .from('memory_media')
      .select('*')
      .eq('edition_id', editionId)
      .order('created_at', { ascending: false })
    if (error) throw new Error("Erreur de chargement des médias : " + error.message)
    return data || []
  }
  const allMedia = await getLocalData<MemoryMedia>('media')
  return allMedia.filter((m) => m.edition_id === editionId)
}

function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.onloadeddata = () => {
      video.currentTime = 0.5
    }
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Échec génération vignette')); return }
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      }, 'image/jpeg', 0.7)
    }
    video.onerror = () => reject(new Error('Erreur chargement vidéo pour vignette'))
    video.src = URL.createObjectURL(file)
  })
}

export async function uploadMedia(editionId: string, file: File): Promise<MemoryMedia> {
  let processedFile = file
  if (file.type.startsWith('image/') && file.size > 50_000) {
    processedFile = await compressImage(file)
  }

  const id = generateId()
  const type = processedFile.type.startsWith('video/') ? 'video' : 'image'

  let thumbnail_url: string | undefined
  if (type === 'video') {
    try {
      thumbnail_url = await generateVideoThumbnail(processedFile)
    } catch { /* fallback: pas de vignette */ }
  }

  const b64 = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(processedFile)
  })

  const media: MemoryMedia = { id, edition_id: editionId, url: b64, type, created_at: new Date().toISOString(), thumbnail_url }

  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('memory_media').insert(media).select().single()
    if (error) throw new Error("Erreur d'upload du média : " + error.message)
    return data
  }

  const items = [...await getLocalData<MemoryMedia>('media'), media]
  await setLocalData('media', items)
  return media
}

export async function deleteMedia(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('memory_media').delete().eq('id', id)
    if (error) throw new Error("Erreur de suppression du média : " + error.message)
    return
  }
  const items = (await getLocalData<MemoryMedia>('media')).filter((m) => m.id !== id)
  await setLocalData('media', items)
}

export async function getAllMedia(): Promise<MemoryMedia[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('memory_media').select('*').order('created_at', { ascending: false })
    if (error) throw new Error("Erreur de chargement des médias : " + error.message)
    return data || []
  }
  return getLocalData<MemoryMedia>('media')
}

// ─── Coachs ───

export async function getCoaches(): Promise<Coach[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('coaches').select('*').order('order', { ascending: true })
    if (error) throw new Error("Erreur de chargement des coachs : " + error.message)
    if (data && data.length > 0) return data
    // Supabase vide → fallback affichage (mais pas sauvegardé dans Supabase)
    return fallbackCoaches
  }
  const local = await getLocalData<Coach>('coaches')
  return local.length > 0 ? local : fallbackCoaches
}

export async function createCoach(coach: Omit<Coach, 'id'>): Promise<Coach> {
  const newCoach: Coach = { ...coach, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('coaches').insert(newCoach).select().single()
    if (error) throw new Error("Erreur de création du coach : " + error.message)
    return data
  }
  const items = [...await getLocalData<Coach>('coaches'), newCoach]
  await setLocalData('coaches', items)
  return newCoach
}

export async function updateCoach(id: string, data: Partial<Coach>): Promise<Coach> {
  if (SUPABASE_CONFIGURED) {
    const { data: updated, error } = await supabase.from('coaches').update(data).eq('id', id).select().single()
    if (error) throw new Error("Erreur de mise à jour du coach : " + error.message)
    return updated
  }
  const items = await getLocalData<Coach>('coaches')
  const idx = items.findIndex((c) => c.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...data }
    await setLocalData('coaches', items)
    return items[idx]
  }
  throw new Error('Coach not found')
}

export async function deleteCoach(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('coaches').delete().eq('id', id)
    if (error) throw new Error("Erreur de suppression du coach : " + error.message)
    return
  }
  const items = (await getLocalData<Coach>('coaches')).filter((c) => c.id !== id)
  await setLocalData('coaches', items)
}

// ─── Testimonials ───

export async function getTestimonials(): Promise<Testimonial[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (error) throw new Error("Erreur de chargement des témoignages : " + error.message)
    if (data && data.length > 0) return data
    return fallbackTestimonials
  }
  const local = await getLocalData<Testimonial>('testimonials')
  return local.length > 0 ? local : fallbackTestimonials
}

export async function createTestimonial(t: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const newItem: Testimonial = { ...t, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('testimonials').insert(newItem).select().single()
    if (error) throw new Error("Erreur de création du témoignage : " + error.message)
    return data
  }
  const items = [...await getLocalData<Testimonial>('testimonials'), newItem]
  await setLocalData('testimonials', items)
  return newItem
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) throw new Error("Erreur de suppression du témoignage : " + error.message)
    return
  }
  const items = (await getLocalData<Testimonial>('testimonials')).filter((t) => t.id !== id)
  await setLocalData('testimonials', items)
}

// ─── FAQ ───

export async function getFAQItems(): Promise<FAQItem[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('faq_items').select('*').order('order', { ascending: true })
    if (error) throw new Error("Erreur de chargement de la FAQ : " + error.message)
    if (data && data.length > 0) return data
    return fallbackFAQ
  }
  const local = await getLocalData<FAQItem>('faq')
  return local.length > 0 ? local : fallbackFAQ
}

export async function createFAQItem(item: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const newItem: FAQItem = { ...item, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('faq_items').insert(newItem).select().single()
    if (error) throw new Error("Erreur de création de la question FAQ : " + error.message)
    return data
  }
  const items = [...await getLocalData<FAQItem>('faq'), newItem]
  await setLocalData('faq', items)
  return newItem
}

export async function updateFAQItem(id: string, data: Partial<FAQItem>): Promise<FAQItem> {
  if (SUPABASE_CONFIGURED) {
    const { data: updated, error } = await supabase.from('faq_items').update(data).eq('id', id).select().single()
    if (error) throw new Error("Erreur de mise à jour de la FAQ : " + error.message)
    return updated
  }
  const items = await getLocalData<FAQItem>('faq')
  const idx = items.findIndex((f) => f.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...data }
    await setLocalData('faq', items)
    return items[idx]
  }
  throw new Error('FAQ item not found')
}

export async function deleteFAQItem(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('faq_items').delete().eq('id', id)
    if (error) throw new Error("Erreur de suppression de la question FAQ : " + error.message)
    return
  }
  const items = (await getLocalData<FAQItem>('faq')).filter((f) => f.id !== id)
  await setLocalData('faq', items)
}

// ─── Offers ───

export async function getOffers(): Promise<CampOffer[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('offers').select('*')
    if (error) throw new Error("Erreur de chargement des offres : " + error.message)
    return data || []
  }
  return getLocalData<CampOffer>('offers')
}

export async function updateOffer(id: string, data: Partial<CampOffer>): Promise<CampOffer> {
  if (SUPABASE_CONFIGURED) {
    const { data: updated, error } = await supabase.from('offers').update(data).eq('id', id).select().single()
    if (error) throw new Error("Erreur de mise à jour de l'offre : " + error.message)
    return updated
  }
  const items = await getLocalData<CampOffer>('offers')
  const idx = items.findIndex((o) => o.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...data }
    await setLocalData('offers', items)
    return items[idx]
  }
  throw new Error('Offer not found')
}

// ─── Inscriptions ───

export async function getInscriptions(): Promise<Inscription[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false })
    if (error) throw new Error("Erreur de chargement des inscriptions : " + error.message)
    return data || []
  }
  return getLocalData<Inscription>('inscriptions')
}

export async function createInscription(inscription: Omit<Inscription, 'id'>): Promise<Inscription> {
  const newItem: Inscription = { ...inscription, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('inscriptions').insert(newItem).select().single()
    if (error) throw new Error("Erreur de création de l'inscription : " + error.message)
    return data
  }
  const items = await getLocalData<Inscription>('inscriptions')
  items.push(newItem)
  await setLocalData('inscriptions', items)
  return newItem
}

export function exportInscriptionsCSV(inscriptions: Inscription[]): string {
  const header = 'Enfant,Âge,Parent,Email,Téléphone,Camp,Session,Formule,Message,Date'
  const rows = inscriptions.map(
    (i) =>
      `"${i.child_name}","${i.child_age}","${i.parent_name}","${i.email}","${i.phone}","${i.camp_type}","${i.session}","${i.formule}","${i.message || ''}","${i.created_at}"`
  )
  return [header, ...rows].join('\n')
}

// ─── Contact Messages ───

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (error) throw new Error("Erreur de chargement des messages : " + error.message)
    return data || []
  }
  return getLocalData<ContactMessage>('messages')
}

export async function createContactMessage(msg: Omit<ContactMessage, 'id'>): Promise<ContactMessage> {
  const newItem: ContactMessage = { ...msg, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('contact_messages').insert(newItem).select().single()
    if (error) throw new Error("Erreur d'envoi du message : " + error.message)
    return data
  }
  const items = await getLocalData<ContactMessage>('messages')
  items.push(newItem)
  await setLocalData('messages', items)
  return newItem
}

export function exportMessagesCSV(messages: ContactMessage[]): string {
  const header = 'Nom,Email,Sujet,Message,Date'
  const rows = messages.map(
    (m) => `"${m.name}","${m.email}","${m.subject}","${m.message}","${m.created_at}"`
  )
  return [header, ...rows].join('\n')
}

export async function getEditionById(id: string): Promise<Edition | null> {
  const editions = await getEditions()
  return editions.find((e) => e.id === id) || null
}

// ─── Site Config ───

const DEFAULT_CONFIG: SiteConfig = {
  sessions: [{ basket_dates: '', multisport_dates: '' }],
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('site_config').select('sessions').maybeSingle()
    if (error) throw new Error("Erreur de chargement de la configuration : " + error.message)
    if (data) return { sessions: data.sessions || DEFAULT_CONFIG.sessions }
    return DEFAULT_CONFIG
  }
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const stored = localStorage.getItem('gsc_site_config')
    if (stored) return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_CONFIG
}

export async function saveSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  if (SUPABASE_CONFIGURED) {
    const payload = { sessions: config.sessions }
    const { data: existing, error: selErr } = await supabase.from('site_config').select('id').maybeSingle()
    if (selErr) throw new Error("Erreur de sauvegarde de la configuration : " + selErr.message)
    if (existing) {
      const { error } = await supabase.from('site_config').update(payload).eq('id', existing.id)
      if (error) throw new Error("Erreur de sauvegarde de la configuration : " + error.message)
    } else {
      const { error } = await supabase.from('site_config').insert(payload)
      if (error) throw new Error("Erreur de sauvegarde de la configuration : " + error.message)
    }
    return config
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('gsc_site_config', JSON.stringify(config))
  }
  return config
}

// ─── Admin Users (Supabase only) ───

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
    if (error) throw new Error('Erreur de chargement des administrateurs : ' + error.message)
    return data || []
  }
  // Fallback local-only quand Supabase n'est pas configuré
  return getLocalData<AdminUser>('admin_users')
}

export async function createAdminUser(email: string): Promise<AdminUser> {
  const newItem: AdminUser = { id: generateId(), email, password_set: false, created_at: new Date().toISOString() }
  if (SUPABASE_CONFIGURED) {
    const { data, error } = await supabase.from('admin_users').insert(newItem).select().single()
    if (error) throw new Error("Erreur de création de l'administrateur : " + error.message)
    return data
  }
  const existing = await getLocalData<AdminUser>('admin_users')
  const filtered = existing.filter((a) => a.email.toLowerCase() !== email.toLowerCase())
  const items = [...filtered, newItem]
  await setLocalData('admin_users', items)
  return newItem
}

export async function deleteAdminUser(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('admin_users').delete().eq('id', id)
    if (error) throw new Error("Erreur de suppression de l'administrateur : " + error.message)
    return
  }
  const items = (await getLocalData<AdminUser>('admin_users')).filter((a) => a.id !== id)
  await setLocalData('admin_users', items)
}

export async function markAdminPasswordSet(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('admin_users').update({ password_set: true }).eq('id', id)
    if (error) throw new Error("Erreur de mise à jour de l'administrateur : " + error.message)
    return
  }
  const items = await getLocalData<AdminUser>('admin_users')
  const idx = items.findIndex((a) => a.id === id)
  if (idx !== -1) { items[idx].password_set = true; await setLocalData('admin_users', items) }
}

export async function setAdminPassword(id: string, password: string): Promise<void> {
  const hash = await hashPassword(password)
  if (SUPABASE_CONFIGURED) {
    const { error } = await supabase.from('admin_users').update({ password_hash: hash, password_set: true }).eq('id', id)
    if (error) throw new Error("Erreur de définition du mot de passe : " + error.message)
    return
  }
  const items = await getLocalData<AdminUser>('admin_users')
  const idx = items.findIndex((a) => a.id === id)
  if (idx !== -1) { items[idx].password_hash = hash; items[idx].password_set = true; await setLocalData('admin_users', items) }
}

export async function verifyAdminPassword(email: string, password: string): Promise<boolean> {
  const admin = await findAdminByEmail(email)
  if (!admin || !admin.password_set || !admin.password_hash) return false
  const hash = await hashPassword(password)
  return hash === admin.password_hash
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const items = await getAdminUsers()
  return items.find((a) => a.email.toLowerCase() === email.toLowerCase()) || null
}
