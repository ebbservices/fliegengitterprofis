import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopPage() {
  const products = [
    {
      id: 'fliegengitter',
      title: 'Fliegengitter nach Maß',
      description: 'Individuell konfigurierbare Fliegengitter für Fenster und Türen',
      image: '/images/image-2.jpg',
      features: ['Höhe & Breite frei wählbar', 'Verschiedene Farben & RAL-Optionen', 'Rahmen- & Gittertyp auswählbar'],
      startPrice: 'ab 89,00 €'
    },
    {
      id: 'plissee',
      title: 'Plissee nach Maß',
      description: 'Maßgefertigte Plissees für perfekten Sonnenschutz',
      image: '/images/image-2.jpg',
      features: ['Höhe & Breite individuell', '3 verschiedene Optionen', 'Optional RAL-Farben'],
      startPrice: 'ab 129,00 €'
    },
    {
      id: 'lichtschacht',
      title: 'Lichtschachtabdeckungen',
      description: 'Sichere Abdeckungen für Lichtschächte nach Maß',
      image: '/images/image-2.jpg',
      features: ['Individuelle Maße', '3 Farboptionen', 'Robust & langlebig'],
      startPrice: 'ab 149,00 €'
    }
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        <section className="py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zur Startseite
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unser Online-Shop
            </h1>
            <p className="text-xl text-slate-300">
              Konfigurieren Sie Ihre Produkte nach Maß und bestellen Sie direkt online
            </p>
          </div>
        </section>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="relative h-64">
                    <Image 
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                      {product.startPrice}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {product.title}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {product.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      href={`/shop/${product.id}`}
                      className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Jetzt konfigurieren
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Haben Sie Fragen?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Unser Team berät Sie gerne persönlich zu allen Produkten
            </p>
            <Link 
              href="/#kontakt"
              className="inline-flex items-center gap-2 bg-white border-2 border-orange-500 text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all"
            >
              Jetzt Kontakt aufnehmen
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
