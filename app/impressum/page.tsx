import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Impressum · Die Fliegengitter Profis OHG Pulheim',
  description: 'Insektenschutzgitter und mehr!',
};

export default function Impressum() {
  return (
    <>
      <Header />
      
      <main className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Link 
            href="/" 
            className="inline-block mb-8 text-[#FF8C42] hover:text-[#ff6b1a] transition-colors"
          >
            ← Zurück zur Startseite
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-12">
            Impressum
          </h1>

          <div className="space-y-8 text-[#6B6B6B]">
            <section>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <p className="leading-relaxed">
                G&K Die Fliegengitter Profis OHG<br />
                Wedaustraße 35<br />
                41540 Dormagen
              </p>
              <p className="leading-relaxed mt-4">
                Handelsregister: HRA 8216<br />
                Registergericht: Amtsgericht Neuss
              </p>
              <p className="leading-relaxed mt-4">
                Vertreten durch: Muharrem Güngören & Hasan Kurulay
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">
                Kontakt
              </h2>
              <p className="leading-relaxed">
                Telefon: 01573 7952490<br />
                E-Mail: <a href="mailto:info@diefliegengitterprofis.de" className="text-[#FF8C42] hover:underline">info@diefliegengitterprofis.de</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">
                EU-Streitschlichtung
              </h2>
              <p className="leading-relaxed">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#FF8C42] hover:underline"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                . Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">
                Verbraucher­streit­beilegung/Universal­schlichtungs­stelle
              </h2>
              <p className="leading-relaxed">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2C2C2C] mb-4">
                Webdesign & Programmierung
              </h2>
              <p className="leading-relaxed">
                <a 
                  href="https://www.mobatix.de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#FF8C42] hover:underline font-semibold"
                >
                  Mobatix GmbH
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
