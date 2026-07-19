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
  const local = await getLocalData<Edition>('editions')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('editions').select('*').order('year', { ascending: false })
    if (data && data.length > 0) {
      await setLocalData('editions', data)
      return data
    }
  }
  return local
}

export async function createEdition(edition: Omit<Edition, 'id'>): Promise<Edition> {
  const newEdition: Edition = { ...edition, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    try {
      const { data } = await supabase.from('editions').insert(newEdition).select().single()
      if (data) {
        const items = [...await getLocalData<Edition>('editions'), data]
        await setLocalData('editions', items)
        return data
      }
    } catch (e) {
      console.warn('Supabase create edition error, using local storage:', e)
    }
  }
  const items = [...await getLocalData<Edition>('editions'), newEdition]
  await setLocalData('editions', items)
  return newEdition
}

export async function deleteEdition(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { error } = await supabase.from('editions').delete().eq('id', id)
      if (error) console.warn('Supabase delete edition:', error.message)
    } catch (e) {
      console.warn('Supabase delete edition error:', e)
    }
  }
  const items = (await getLocalData<Edition>('editions')).filter((e) => e.id !== id)
  await setLocalData('editions', items)
}

// ─── Memories / Media ───

export async function getMediaByEdition(editionId: string): Promise<MemoryMedia[]> {
  let supabaseData: MemoryMedia[] = []
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase
      .from('memory_media')
      .select('*')
      .eq('edition_id', editionId)
      .order('created_at', { ascending: false })
    if (data) supabaseData = data
  }

  const allMedia = await getLocalData<MemoryMedia>('media')
  const local = allMedia.filter((m) => m.edition_id === editionId)

  if (supabaseData.length > 0) {
    const existingIds = new Set(supabaseData.map((m) => m.id))
    const merged = [...supabaseData, ...local.filter((m) => !existingIds.has(m.id))]
    const allExisting = new Set(allMedia.map((m) => m.id))
    const updatedAll = [...allMedia, ...supabaseData.filter((m) => !allExisting.has(m.id))]
    await setLocalData('media', updatedAll)
    return merged
  }

  return local
}

export async function uploadMedia(editionId: string, file: File): Promise<MemoryMedia> {
  let processedFile = file
  if (file.type.startsWith('image/') && file.size > 50_000) {
    processedFile = await compressImage(file)
  }

  const id = generateId()
  const type = processedFile.type.startsWith('video/') ? 'video' : 'image'
  const b64 = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(processedFile)
  })

  const media: MemoryMedia = { id, edition_id: editionId, url: b64, type, created_at: new Date().toISOString() }
  const items = [...await getLocalData<MemoryMedia>('media'), media]
  await setLocalData('media', items)

  if (SUPABASE_CONFIGURED) {
    ;(async () => {
      const { error } = await supabase.from('memory_media').insert(media)
      if (error) console.warn('Supabase insert error:', error.message)
    })()
  }

  return media
}

export async function deleteMedia(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { error } = await supabase.from('memory_media').delete().eq('id', id)
      if (error) console.warn('Supabase delete media:', error.message)
    } catch (e) {
      console.warn('Supabase delete media error:', e)
    }
  }
  const items = (await getLocalData<MemoryMedia>('media')).filter((m) => m.id !== id)
  await setLocalData('media', items)
}

// ─── Coachs ───

export async function getCoaches(): Promise<Coach[]> {
  const local = await getLocalData<Coach>('coaches')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('coaches').select('*').order('order', { ascending: true })
    if (data && data.length > 0) {
      const existingIds = new Set(data.map((c) => c.id))
      const merged = [...data]
      for (const fb of fallbackCoaches) {
        if (!existingIds.has(fb.id)) merged.push(fb)
      }
      merged.sort((a, b) => a.order - b.order)
      await setLocalData('coaches', merged)
      return merged
    }
  }
  return local.length > 0 ? local : fallbackCoaches
}

export async function createCoach(coach: Omit<Coach, 'id'>): Promise<Coach> {
  const newCoach: Coach = { ...coach, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    try {
      const { data } = await supabase.from('coaches').insert(newCoach).select().single()
      if (data) {
        const items = [...await getLocalData<Coach>('coaches'), data]
        await setLocalData('coaches', items)
        return data
      }
    } catch (e) {
      console.warn('Supabase create coach error, using local storage:', e)
    }
  }
  const items = [...await getLocalData<Coach>('coaches'), newCoach]
  await setLocalData('coaches', items)
  return newCoach
}

export async function updateCoach(id: string, data: Partial<Coach>): Promise<Coach> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { data: updated } = await supabase.from('coaches').update(data).eq('id', id).select().single()
      if (updated) {
        const items = await getLocalData<Coach>('coaches')
        const idx = items.findIndex((c) => c.id === id)
        if (idx !== -1) items[idx] = { ...items[idx], ...updated }
        else items.push(updated)
        await setLocalData('coaches', items)
        return updated
      }
    } catch (e) {
      console.warn('Supabase update coach error, using local storage:', e)
    }
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
    try {
      const { error } = await supabase.from('coaches').delete().eq('id', id)
      if (error) console.warn('Supabase delete coach:', error.message)
    } catch (e) {
      console.warn('Supabase delete coach error:', e)
    }
  }
  const items = (await getLocalData<Coach>('coaches')).filter((c) => c.id !== id)
  await setLocalData('coaches', items)
}

// ─── Testimonials ───

export async function getTestimonials(): Promise<Testimonial[]> {
  const local = await getLocalData<Testimonial>('testimonials')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) {
      await setLocalData('testimonials', data)
      return data
    }
  }
  return local.length > 0 ? local : fallbackTestimonials
}

export async function createTestimonial(t: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const newItem: Testimonial = { ...t, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    try {
      const { data } = await supabase.from('testimonials').insert(newItem).select().single()
      if (data) {
        const items = [...await getLocalData<Testimonial>('testimonials'), data]
        await setLocalData('testimonials', items)
        return data
      }
    } catch (e) {
      console.warn('Supabase create testimonial error, using local storage:', e)
    }
  }
  const items = [...await getLocalData<Testimonial>('testimonials'), newItem]
  await setLocalData('testimonials', items)
  return newItem
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      if (error) console.warn('Supabase delete testimonial:', error.message)
    } catch (e) {
      console.warn('Supabase delete testimonial error:', e)
    }
  }
  const items = (await getLocalData<Testimonial>('testimonials')).filter((t) => t.id !== id)
  await setLocalData('testimonials', items)
}

// ─── FAQ ───

export async function getFAQItems(): Promise<FAQItem[]> {
  const local = await getLocalData<FAQItem>('faq')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('faq_items').select('*').order('order', { ascending: true })
    if (data && data.length > 0) {
      await setLocalData('faq', data)
      return data
    }
  }
  return local.length > 0 ? local : fallbackFAQ
}

export async function createFAQItem(item: Omit<FAQItem, 'id'>): Promise<FAQItem> {
  const newItem: FAQItem = { ...item, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    try {
      const { data } = await supabase.from('faq_items').insert(newItem).select().single()
      if (data) {
        const items = [...await getLocalData<FAQItem>('faq'), data]
        await setLocalData('faq', items)
        return data
      }
    } catch (e) {
      console.warn('Supabase create FAQ error, using local storage:', e)
    }
  }
  const items = [...await getLocalData<FAQItem>('faq'), newItem]
  await setLocalData('faq', items)
  return newItem
}

export async function updateFAQItem(id: string, data: Partial<FAQItem>): Promise<FAQItem> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { data: updated } = await supabase.from('faq_items').update(data).eq('id', id).select().single()
      if (updated) {
        const items = await getLocalData<FAQItem>('faq')
        const idx = items.findIndex((f) => f.id === id)
        if (idx !== -1) items[idx] = { ...items[idx], ...updated }
        else items.push(updated)
        await setLocalData('faq', items)
        return updated
      }
    } catch (e) {
      console.warn('Supabase update FAQ error, using local storage:', e)
    }
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
    try {
      const { error } = await supabase.from('faq_items').delete().eq('id', id)
      if (error) console.warn('Supabase delete FAQ:', error.message)
    } catch (e) {
      console.warn('Supabase delete FAQ error:', e)
    }
  }
  const items = (await getLocalData<FAQItem>('faq')).filter((f) => f.id !== id)
  await setLocalData('faq', items)
}

// ─── Offers ───

export async function getOffers(): Promise<CampOffer[]> {
  const local = await getLocalData<CampOffer>('offers')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('offers').select('*')
    if (data && data.length > 0) {
      await setLocalData('offers', data)
      return data
    }
  }
  return local
}

export async function updateOffer(id: string, data: Partial<CampOffer>): Promise<CampOffer> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { data: updated } = await supabase.from('offers').update(data).eq('id', id).select().single()
      if (updated) {
        const items = await getLocalData<CampOffer>('offers')
        const idx = items.findIndex((o) => o.id === id)
        if (idx !== -1) items[idx] = { ...items[idx], ...updated }
        else items.push(updated)
        await setLocalData('offers', items)
        return updated
      }
    } catch (e) {
      console.warn('Supabase update offer error, using local storage:', e)
    }
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
  const local = await getLocalData<Inscription>('inscriptions')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false })
    if (data) {
      await setLocalData('inscriptions', data)
      return data
    }
  }
  return local
}

export async function createInscription(inscription: Omit<Inscription, 'id'>): Promise<Inscription> {
  const newItem: Inscription = { ...inscription, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('inscriptions').insert(newItem).select().single()
    if (data) return data
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
  const local = await getLocalData<ContactMessage>('messages')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (data) {
      await setLocalData('messages', data)
      return data
    }
  }
  return local
}

export async function createContactMessage(msg: Omit<ContactMessage, 'id'>): Promise<ContactMessage> {
  const newItem: ContactMessage = { ...msg, id: generateId() }
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('contact_messages').insert(newItem).select().single()
    if (data) return data
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
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const stored = localStorage.getItem('gsc_site_config')
    if (stored) return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
  } catch {}
  if (SUPABASE_CONFIGURED) {
    try {
      const { data } = await supabase.from('site_config').select('*').single()
      if (data) {
        localStorage.setItem('gsc_site_config', JSON.stringify(data))
        return { ...DEFAULT_CONFIG, ...data }
      }
    } catch {}
  }
  return DEFAULT_CONFIG
}

export async function saveSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gsc_site_config', JSON.stringify(config))
  }
  if (SUPABASE_CONFIGURED) {
    try {
      const { data: existing } = await supabase.from('site_config').select('id').single()
      if (existing) {
        await supabase.from('site_config').update(config).eq('id', existing.id)
      } else {
        await supabase.from('site_config').insert(config)
      }
    } catch (e) {
      console.warn('Supabase save config error:', e)
    }
  }
  return config
}

// ─── Admin Users ───

export async function getAdminUsers(): Promise<AdminUser[]> {
  const local = await getLocalData<AdminUser>('admin_users')
  let server: AdminUser[] = []
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
    if (data) server = data
  }
  // Merge: local wins (has latest password_set/password_hash), Supabase fills gaps
  const merged: AdminUser[] = []
  const seen = new Set<string>()
  for (const a of local) {
    merged.push(a)
    seen.add(a.id)
    // Sync local → Supabase if missing on server
    if (SUPABASE_CONFIGURED && !server.find((s) => s.id === a.id)) {
      try { await supabase.from('admin_users').upsert(a) } catch { /* ignore */ }
    }
  }
  for (const a of server) {
    if (!seen.has(a.id)) {
      merged.push(a)
      seen.add(a.id)
    }
  }
  await setLocalData('admin_users', merged)
  return merged
}

export async function createAdminUser(email: string): Promise<AdminUser> {
  const newItem: AdminUser = { id: generateId(), email, password_set: false, created_at: new Date().toISOString() }
  if (SUPABASE_CONFIGURED) {
    try {
      const { data } = await supabase.from('admin_users').insert(newItem).select().single()
      if (data) {
        const items = [...await getLocalData<AdminUser>('admin_users'), data]
        await setLocalData('admin_users', items)
        return data
      }
    } catch (e) {
      console.warn('Supabase create admin error, using local storage:', e)
    }
  }
  const items = [...await getLocalData<AdminUser>('admin_users'), newItem]
  await setLocalData('admin_users', items)
  return newItem
}

export async function deleteAdminUser(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', id)
      if (error) console.warn('Supabase delete admin:', error.message)
    } catch (e) {
      console.warn('Supabase delete admin error:', e)
    }
  }
  const items = (await getLocalData<AdminUser>('admin_users')).filter((a) => a.id !== id)
  await setLocalData('admin_users', items)
}

export async function markAdminPasswordSet(id: string): Promise<void> {
  if (SUPABASE_CONFIGURED) {
    try {
      await supabase.from('admin_users').update({ password_set: true }).eq('id', id)
    } catch (e) {
      console.warn('Supabase update admin error:', e)
    }
  }
  const items = await getLocalData<AdminUser>('admin_users')
  const idx = items.findIndex((a) => a.id === id)
  if (idx !== -1) {
    items[idx].password_set = true
    await setLocalData('admin_users', items)
  }
}

export async function setAdminPassword(id: string, password: string): Promise<void> {
  const hash = await hashPassword(password)
  if (SUPABASE_CONFIGURED) {
    try {
      await supabase.from('admin_users').update({ password_hash: hash, password_set: true }).eq('id', id)
    } catch (e) {
      console.warn('Supabase update admin password error:', e)
    }
  }
  const items = await getLocalData<AdminUser>('admin_users')
  const idx = items.findIndex((a) => a.id === id)
  if (idx !== -1) {
    items[idx].password_hash = hash
    items[idx].password_set = true
    await setLocalData('admin_users', items)
  }
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

export async function getAllMedia(): Promise<MemoryMedia[]> {
  const local = await getLocalData<MemoryMedia>('media')
  if (local.length > 0) return local
  if (SUPABASE_CONFIGURED) {
    const { data } = await supabase.from('memory_media').select('*').order('created_at', { ascending: false })
    if (data) {
      await setLocalData('media', data)
      return data
    }
  }
  return local
}
