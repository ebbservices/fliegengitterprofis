import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Beispiele() {
  const galleryImages = [
    1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-[#FF8C42] to-[#ff6b1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unsere <span className="text-white drop-shadow-lg">Arbeiten</span>
            </h1>
            <p className="text-xl md:text-2xl">
              Einige unserer bisherigen Projekte bei zufriedenen Kunden
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Referenzprojekte
              </h2>
              <p className="text-xl text-[#6B6B6B] max-w-3xl mx-auto">
                Von Einfamilienhäusern bis zu Wohnmobilen – wir haben bereits hunderte Projekte erfolgreich umgesetzt. Überzeugen Sie sich selbst von unserer Arbeit!
              </p>
            </div>

            {/* Masonry Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((num) => (
                <div 
                  key={num} 
                  className="group relative aspect-square bg-[#F5F5F5] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <Image 
                    src={`/images/gallery-img-${num}.jpg`} 
                    alt={`Projekt ${num}`} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-lg font-semibold">Projekt #{num}</p>
                      <p className="text-sm text-gray-300">Fliegengitter Installation</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">175+</div>
                <p className="text-xl text-[#6B6B6B]">Zufriedene Kunden</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">500+</div>
                <p className="text-xl text-[#6B6B6B]">Installierte Gitter</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">100%</div>
                <p className="text-xl text-[#6B6B6B]">Qualitätsgarantie</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">5★</div>
                <p className="text-xl text-[#6B6B6B]">Durchschnittsbewertung</p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Von der Beratung bis zur Montage
              </h2>
              <p className="text-xl text-[#6B6B6B]">
                So läuft ein typisches Projekt bei uns ab
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-2">Erstberatung</h3>
                    <p className="text-[#6B6B6B]">
                      Wir besprechen Ihre Wünsche und Anforderungen und beraten Sie zu den besten Lösungen für Ihr Zuhause.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-2">Aufmaß vor Ort</h3>
                    <p className="text-[#6B6B6B]">
                      Unser Team nimmt präzise Maß bei Ihnen zu Hause und erstellt ein individuelles Angebot.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-2">Maßanfertigung</h3>
                    <p className="text-[#6B6B6B]">
                      Ihre Fliegengitter werden millimetergenau nach Ihren Maßen und in Ihrer Wunschfarbe gefertigt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-2">Professionelle Montage</h3>
                    <p className="text-[#6B6B6B]">
                      Wir installieren Ihre Fliegengitter fachgerecht und sorgen für ein perfektes Ergebnis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/gallery-img-1.jpg" 
                  alt="Installation" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ihr Projekt könnte das nächste sein!
            </h2>
            <p className="text-xl mb-10 text-gray-300">
              Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="bg-[#FF8C42] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#ff6b1a] transition-all"
              >
                Jetzt Anfragen
              </Link>
              <Link 
                href="/kundenstimmen" 
                className="bg-white text-[#2C2C2C] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Kundenbewertungen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
