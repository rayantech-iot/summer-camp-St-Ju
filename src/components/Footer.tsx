'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gsc-black border-t border-gsc-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Image src="/images/logo.png" alt="Genevois Summer Camp" width={111} height={48} className="h-12 w-auto mb-4" />
            <p className="text-sm text-gsc-white/60 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg text-gsc-white tracking-wider mb-4">{t('footer.links')}</h3>
            <ul className="space-y-2">
              {[
                { href: '/camp-basket', key: 'footer.campBasket' },
                { href: '/multisport', key: 'footer.multisport' },
                { href: '/coachs', key: 'footer.coaches' },
                { href: '/memories', key: 'footer.memories' },
                { href: '/faq', key: 'footer.faq' },
                { href: '/inscription', key: 'footer.register' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gsc-white/60 hover:text-gsc-red transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg text-gsc-white tracking-wider mb-4">{t('footer.contactTitle')}</h3>
            <ul className="space-y-2 text-sm text-gsc-white/60">
              <li>Dodzi +33 6 58 15 29 27</li>
              <li>{t('footer.location')}</li>
              <li>{t('footer.region')}</li>
              <li>{t('footer.distance')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg text-gsc-white tracking-wider mb-4">{t('footer.social')}</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/genevoissummercamp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gsc-white/60 hover:text-gsc-red transition-colors"
              >
                <ExternalLink size={16} /> Instagram
              </a>
            </div>
            <div className="mt-6 space-y-1">
              <Link href="/mentions-legales" className="block text-xs text-gsc-white/40 hover:text-gsc-red transition-colors">
                {t('footer.legal')}
              </Link>
              <Link href="/cgv" className="block text-xs text-gsc-white/40 hover:text-gsc-red transition-colors">
                {t('footer.cgv')}
              </Link>
              <Link href="/confidentialite" className="block text-xs text-gsc-white/40 hover:text-gsc-red transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gsc-gray/20 text-center text-xs text-gsc-white/30">
          &copy; {new Date().getFullYear()} Genevois Summer Camp. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
