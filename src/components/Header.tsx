'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const navLinks = [
  { href: '/', key: 'nav.home' },
  { href: '/camp-basket', key: 'nav.campBasket' },
  { href: '/multisport', key: 'nav.multisport' },
  { href: '/coachs', key: 'nav.coaches' },
  { href: '/programme', key: 'nav.programme' },
  { href: '/memories', key: 'nav.memories' },
  { href: '/faq', key: 'nav.faq' },
  { href: '/contact', key: 'nav.contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t, toggleLang, lang } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gsc-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Genevois Summer Camp"
              width={111}
              height={48}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gsc-white/80 hover:text-gsc-red transition-colors uppercase tracking-wider"
              >
                {t(link.key)}
              </Link>
            ))}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gsc-white/50 hover:text-gsc-red transition-colors px-2"
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              <Globe size={14} />
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <Link
              href="/inscription"
              className="bg-gsc-red hover:bg-gsc-red/90 text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
            >
              {t('nav.register')}
            </Link>
          </nav>

          <button
            className="lg:hidden text-gsc-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={t('nav.menu')}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gsc-black border-t border-gsc-gray/30"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-base font-medium text-gsc-white/80 hover:text-gsc-red transition-colors uppercase tracking-wider"
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { toggleLang(); setIsOpen(false) }}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gsc-white/50 hover:text-gsc-red transition-colors"
                >
                  <Globe size={14} />
                  {lang === 'fr' ? 'EN' : 'FR'}
                </button>
                <Link
                  href="/inscription"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center bg-gsc-red text-white px-5 py-3 font-bold uppercase tracking-wider"
                >
                  {t('nav.register')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
