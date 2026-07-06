import { supabase } from './supabase'
import type {
  Edition,
  MemoryMedia,
  Coach,
  Testimonial,
  FAQItem,
  CampOffer,
  Inscription,
  ContactMessage,
} from './types'
import { coaches as fallbackCoaches, testimonials as fallbackTestimonials, faqItems as fallbackFAQ } from './data'

const STORAGE_KEY = 'gsc_data'
const SUPABASE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getLocalData<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalData<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data))
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Editions ───

export async function getEditions(): Promise<Edition[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('editions').select('*').order('year', { ascending: false })
    if (data) return data
  }
  return getLocalData<Edition>('editions')
}

export async function createEdition(edition: Omit<Edition, 'id'>): Promise<Edition> {
  const newEdition: Edition = { ...edition, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('editions').insert(newEdition).select().single()
    if (data) return data
  }
  const items = getLocalData<Edition>('editions')
  items.push(newEdition)
  setLocalData('editions', items)
  return newEdition
}

export async function deleteEdition(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    await supabase.from('editions').delete().eq('id', id)
    return
  }
  setLocalData('editions', getLocalData<Edition>('editions').filter((e) => e.id !== id))
}

// ─── Memories / Media ───

export async function getMediaByEdition(editionId: string): Promise<MemoryMedia[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase
      .from('memory_media')
      .select('*')
      .eq('edition_id', editionId)
      .order('created_at', { ascending: false })
    if (data) return data
  }
  return getLocalData<MemoryMedia>('media').filter((m) => m.edition_id === editionId)
}

export async function uploadMedia(editionId: string, file: File): Promise<MemoryMedia> {
  const id = generateId()
  const ext = file.name.split('.').pop()
  const fileName = `${editionId}/${id}.${ext}`
  const type = file.type.startsWith('video/') ? 'video' : 'image'

  if (SUPABASE_CONFIGURED) {
    const { data: uploadData } = await supabase.storage.from('memories').upload(fileName, file)
    if (uploadData) {
      const { data: urlData } = supabase.storage.from('memories').getPublicUrl(fileName)
      const media: MemoryMedia = {
        id,
        edition_id: editionId,
        url: urlData.publicUrl,
        type,
        created_at: new Date().toISOString(),
      }
      await supabase.from('memory_media').insert(media)
      return media
    }
  }

  // Fallback: store as base64
  const b64 = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
  const media: MemoryMedia = {
    id,
    edition_id: editionId,
    url: b64,
    type,
    created_at: new Date().toISOString(),
  }
  const items = getLocalData<MemoryMedia>('media')
  items.push(media)
  setLocalData('media', items)
  return media
}

export async function deleteMedia(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    await supabase.from('memory_media').delete().eq('id', id)
    return
  }
  setLocalData('media', getLocalData<MemoryMedia>('media').filter((m) => m.id !== id))
}

// ─── Coachs ───

export async function getCoaches(): Promise<Coach[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('coaches').select('*').order('order', { ascending: true })
    if (data && data.length > 0) return data
  }
  const local = getLocalData<Coach>('coaches')
  return local.length > 0 ? local : fallbackCoaches
}

export async function createCoach(coach: Omit<Coach, 'id'>): Promise<Coach> {
  const newCoach: Coach = { ...coach, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('coaches').insert(newCoach).select().single()
    if (data) return data
  }
  const items = getLocalData<Coach>('coaches')
  items.push(newCoach)
  setLocalData('coaches', items)
  return newCoach
}

export async function updateCoach(id: string, data: Partial<Coach>): Promise<Coach> {
  if (SUPABASE_CONFIGURED) {
    const { data: updated } = await supabase.from('coaches').update(data).eq('id', id).select().single()
    if (updated) return updated
  }
  const items = getLocalData<Coach>('coaches')
  const idx = items.findIndex((c) => c.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...data }
    setLocalData('coaches', items)
    return items[idx]
  }
  throw new Error('Coach not found')
}

export async function deleteCoach(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    await supabase.from('coaches').delete().eq('id', id)
    return
  }
  setLocalData('coaches', getLocalData<Coach>('coaches').filter((c) => c.id !== id))
}

// ─── Testimonials ───

export async function getTestimonials(): Promise<Testimonial[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) return data
  }
  const local = getLocalData<Testimonial>('testimonials')
  return local.length > 0 ? local : fallbackTestimonials
}

export async function createTestimonial(t: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const newItem: Testimonial = { ...t, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('testimonials').insert(newItem).select().single()
    if (data) return data
  }
  const items = getLocalData<Testimonial>('testimonials')
  items.push(newItem)
  setLocalData('testimonials', items)
  return newItem
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    await supabase.from('testimonials').delete().eq('id', id)
    return
  }
  setLocalData('testimonials', getLocalData<Testimonial>('testimonials').filter((t) => t.id !== id))
}

// ─── FAQ ───

export async function getFAQItems(): Promise<FAQItem[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('faq_items').select('*').order('order', { ascending: true })
    if (data && data.length > 0) return data
  }
  const local = getLocalData<FAQItem>('faq')
  return local.length > 0 ? local : fallbackFAQ
}

export async function createFAQItem(item: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const newItem: FAQItem = { ...item, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('faq_items').insert(newItem).select().single()
    if (data) return data
  }
  const items = getLocalData<FAQItem>('faq')
  items.push(newItem)
  setLocalData('faq', items)
  return newItem
}

export async function updateFAQItem(id: string, data: Partial<FAQItem>): Promise<FAQItem> {
  if (SUPABASE_CONFIGURED) {
    const { data: updated } = await supabase.from('faq_items').update(data).eq('id', id).select().single()
    if (updated) return updated
  }
  const items = getLocalData<FAQItem>('faq')
  const idx = items.findIndex((f) => f.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...data }
    setLocalData('faq', items)
    return items[idx]
  }
  throw new Error('FAQ item not found')
}

export async function deleteFAQItem(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    await supabase.from('faq_items').delete().eq('id', id)
    return
  }
  setLocalData('faq', getLocalData<FAQItem>('faq').filter((f) => f.id !== id))
}

// ─── Offers ───

export async function getOffers(): Promise<CampOffer[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('offers').select('*')
    if (data && data.length > 0) return data
  }
  return getLocalData<CampOffer>('offers')
}

export async function updateOffer(id: string, data: Partial<CampOffer>): Promise<CampOffer> {
  if (SUPABASE_CONFIGURED) {
    const { data: updated } = await supabase.from('offers').update(data).eq('id', id).select().single()
    if (updated) return updated
  }
  const items = getLocalData<CampOffer>('offers')
  const idx = items.findIndex((o) => o.id === id)
  if (idx !== -1) {
    items[idx] = { ...items[idx], ...data }
    setLocalData('offers', items)
    return items[idx]
  }
  throw new Error('Offer not found')
}

// ─── Inscriptions ───

export async function getInscriptions(): Promise<Inscription[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false })
    if (data) return data
  }
  return getLocalData<Inscription>('inscriptions')
}

export async function createInscription(inscription: Omit<Inscription, 'id'>): Promise<Inscription> {
  const newItem: Inscription = { ...inscription, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('inscriptions').insert(newItem).select().single()
    if (data) return data
  }
  const items = getLocalData<Inscription>('inscriptions')
  items.push(newItem)
  setLocalData('inscriptions', items)
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
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (data) return data
  }
  return getLocalData<ContactMessage>('messages')
}

export async function createContactMessage(msg: Omit<ContactMessage, 'id'>): Promise<ContactMessage> {
  const newItem: ContactMessage = { ...msg, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('contact_messages').insert(newItem).select().single()
    if (data) return data
  }
  const items = getLocalData<ContactMessage>('messages')
  items.push(newItem)
  setLocalData('messages', items)
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

export async function getAllMedia(): Promise<MemoryMedia[]> {
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('memory_media').select('*').order('created_at', { ascending: false })
    if (data) return data
  }
  return getLocalData<MemoryMedia>('media')
}
