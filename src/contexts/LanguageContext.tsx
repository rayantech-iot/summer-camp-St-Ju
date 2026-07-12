'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { t as translate, type Lang } from '@/lib/i18n/translations'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr')

  useEffect(() => {
    const saved = localStorage.getItem('gsc_lang') as Lang | null
    if (saved === 'en' || saved === 'fr') setLang(saved)
  }, [])

  const handleSetLang = useCallback((l: Lang) => {
    setLang(l)
    localStorage.setItem('gsc_lang', l)
  }, [])

  const toggleLang = useCallback(() => {
    handleSetLang(lang === 'fr' ? 'en' : 'fr')
  }, [lang, handleSetLang])

  const tFn = useCallback((key: string) => translate(key, lang), [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, toggleLang, t: tFn }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
