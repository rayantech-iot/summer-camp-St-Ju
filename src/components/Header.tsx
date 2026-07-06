'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/camp-basket', label: 'Camp Basket' },
  { href: '/multisport', label: 'Multisport' },
  { href: '/coachs', label: 'Coachs' },
  { href: '/programme', label: 'Programme' },
  { href: '/memories', label: 'Memories' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-2xl sm:text-3xl text-gsc-white tracking-wider">
              GENEVOIS<span className="text-gsc-red">.</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gsc-white/80 hover:text-gsc-red transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/inscription"
              className="bg-gsc-red hover:bg-gsc-red/90 text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
            >
              Je m&rsquo;inscris
            </Link>
          </nav>

          <button
            className="lg:hidden text-gsc-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
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
                  {link.label}
                </Link>
              ))}
              <Link
                href="/inscription"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-gsc-red text-white px-5 py-3 mt-4 font-bold uppercase tracking-wider"
              >
                Je m&rsquo;inscris
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
