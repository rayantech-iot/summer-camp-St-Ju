import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gsc-black border-t border-gsc-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src="/images/logo.png" alt="Genevois Summer Camp" className="h-12 w-auto mb-4" />
            <p className="text-sm text-gsc-white/60 leading-relaxed">
              Une semaine dans la peau d&apos;un basketteur de haut niveau — sans quitter le Genevois.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg text-gsc-white tracking-wider mb-4">Liens</h3>
            <ul className="space-y-2">
              {[
                { href: '/camp-basket', label: 'Camp Basket' },
                { href: '/multisport', label: 'Multisport' },
                { href: '/coachs', label: 'Les Coachs' },
                { href: '/memories', label: 'Memories' },
                { href: '/faq', label: 'FAQ' },
                { href: '/inscription', label: 'Inscription' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gsc-white/60 hover:text-gsc-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg text-gsc-white tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gsc-white/60">
              <li>Dodzi +33 6 58 15 29 27</li>
              <li>Valleiry (74520) &amp; Vulbens (74520)</li>
              <li>Haute-Savoie, France</li>
              <li>À 20 minutes de Genève</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg text-gsc-white tracking-wider mb-4">Réseaux</h3>
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
                Mentions légales
              </Link>
              <Link href="/cgv" className="block text-xs text-gsc-white/40 hover:text-gsc-red transition-colors">
                CGV
              </Link>
              <Link href="/confidentialite" className="block text-xs text-gsc-white/40 hover:text-gsc-red transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gsc-gray/20 text-center text-xs text-gsc-white/30">
          &copy; {new Date().getFullYear()} Genevois Summer Camp. Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}
