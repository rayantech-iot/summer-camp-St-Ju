export interface Coach {
  id: string
  name: string
  role: string
  bio: string
  diplomas: string[]
  citation: string
  image_url: string
  featured: boolean
  order: number
}

export interface Edition {
  id: string
  year: number
  type: 'basket' | 'multisport'
  title: string
  created_at: string
}

export interface MemoryMedia {
  id: string
  edition_id: string
  url: string
  type: 'image' | 'video'
  thumbnail_url?: string
  alt?: string
  created_at: string
}

export interface Testimonial {
  id: string
  author: string
  role: 'parent' | 'jeune' | 'coach'
  content: string
  rating: number
  video_url?: string
  edition_id?: string
  created_at: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  order: number
}

export interface Inscription {
  id: string
  child_name: string
  child_age: number
  parent_name: string
  email: string
  phone: string
  camp_type: 'basket' | 'multisport'
  session: string
  formule: 'externat' | 'internat'
  message?: string
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export interface CampOffer {
  id: string
  type: 'basket' | 'multisport'
  dates: string[]
  price_externat: number
  price_internat?: number
  lieu: string
  public: string
  description: string
}

export interface AdminUser {
  id: string
  email: string
  password_set: boolean
  password_hash?: string
  created_at: string
}

export interface SiteSession {
  basket_dates: string
  multisport_dates: string
}

export interface SiteConfig {
  sessions: SiteSession[]
}
