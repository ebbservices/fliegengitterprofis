import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ShopPage() {
  return (
    <>
      <Header />
      
      <main className="pt-14">
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 min-h-screen">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl">
              <div className="mb-8">
                <svg className="w-24 h-24 mx-auto text-orange-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Shop kommt bald!
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Unser Online-Shop mit Konfigurator für maßgefertigte Fliegengitter ist derzeit in Entwicklung. 
                Bald können Sie hier Ihre Produkte direkt online konfigurieren und bestellen.
              </p>
              
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Was Sie erwarten können:
                </h3>
                <ul className="text-left space-y-3 max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Interaktiver Produkt-Konfigurator</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Echtzeit-Preisberechnung</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Sichere Online-Bestellung</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">Alle Farben und Optionen verfügbar</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-slate-600 mb-8">
                In der Zwischenzeit kontaktieren Sie uns gerne für eine persönliche Beratung!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/#kontakt" 
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Jetzt Kontakt aufnehmen
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Zurück zur Startseite
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
