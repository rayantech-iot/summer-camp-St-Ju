import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl text-gsc-white tracking-wider mb-12">
            Mentions légales
          </h1>
          <div className="space-y-8 text-sm text-gsc-white/60 leading-relaxed">
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">1. Éditeur du site</h2>
              <p>Le site Genevois Summer Camp est édité par :</p>
              <p className="mt-2">Association Genevois Summer Camp<br />Valleiry (74520)<br />Haute-Savoie, France</p>
              <p className="mt-2">Contact : Dodzi — +33 6 58 15 29 27</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">2. Directeur de la publication</h2>
              <p>Le directeur de la publication est le président de l&apos;association Genevois Summer Camp.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">3. Hébergement</h2>
              <p>Le site est hébergé par Vercel Inc.<br />340 Brannan St, Suite 100, San Francisco, CA 94107, États-Unis.</p>
            </section>
            <section>
              <h2 className="font-heading text-xl text-gsc-white tracking-wider mb-3">4. Propriété intellectuelle</h2>
              <p>L&apos;ensemble des contenus du site (textes, images, vidéos, logo) est la propriété exclusive de l&apos;association Genevois Summer Camp. Toute reproduction ou utilisation sans autorisation est interdite.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
