import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider mb-12">
            Politique de confidentialité
          </h1>
          <div className="space-y-8 text-sm text-gsc-white/60 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">1. Collecte des données</h2>
              <p>Les données personnelles collectées via les formulaires d&apos;inscription et de contact sont utilisées uniquement dans le cadre de la gestion du camp et de la relation avec les participants.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">2. Protection des données</h2>
              <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous par email ou par téléphone.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">3. Cookies</h2>
              <p>Ce site n&apos;utilise pas de cookies tiers. Des cookies techniques strictement nécessaires au fonctionnement du site peuvent être utilisés.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
