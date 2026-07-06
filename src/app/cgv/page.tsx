import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider mb-12">
            Conditions Générales de Vente
          </h1>
          <div className="space-y-8 text-sm text-gsc-white/60 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">1. Objet</h2>
              <p>Les présentes CGV régissent les inscriptions au Genevois Summer Camp. Toute inscription implique l&apos;acceptation pleine et entière des présentes conditions.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">2. Tarifs</h2>
              <p>Les tarifs sont indiqués en euros et comprennent les activités encadrées et les repas selon la formule choisie. L&apos;hébergement est inclus uniquement pour la formule internat.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">3. Annulation</h2>
              <p>Toute annulation doit être communiquée par écrit. Les conditions d&apos;annulation et de remboursement sont détaillées dans le règlement intérieur remis lors de l&apos;inscription.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">4. Responsabilité</h2>
              <p>L&apos;association Genevois Summer Camp est couverte par une assurance responsabilité civile. Les participants doivent être couverts par une assurance individuelle accident.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
