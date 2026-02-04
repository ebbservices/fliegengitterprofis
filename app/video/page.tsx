import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Video() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unser <span className="text-[#FF8C42]">Promo-Video</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Manchmal sagen Videos mehr als tausend Worte. Schauen Sie sich unser Werbevideo an!
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="aspect-video bg-[#2C2C2C] rounded-2xl overflow-hidden shadow-2xl mb-12">
              <video 
                controls 
                className="w-full h-full"
                poster="/images/hero-image.jpg"
              >
                <source src="/videos/dfgp-promo.mp4" type="video/mp4" />
                Ihr Browser unterstützt das Video-Tag nicht.
              </video>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">
                Über Die Fliegengitter Profis
              </h2>
              <p className="text-lg text-[#6B6B6B] max-w-3xl mx-auto leading-relaxed">
                In unserem Video zeigen wir Ihnen, wie wir arbeiten und welche Qualitätsstandards wir bei der Installation von Insektenschutzgittern setzen. Sehen Sie selbst, warum bereits über 175 zufriedene Kunden uns ihr Vertrauen geschenkt haben.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Präzise Arbeit</h3>
                <p className="text-[#6B6B6B]">
                  Jedes Fliegengitter wird millimetergenau angepasst
                </p>
              </div>

              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Schnelle Montage</h3>
                <p className="text-[#6B6B6B]">
                  Professionelle Installation in kürzester Zeit
                </p>
              </div>

              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Perfektes Ergebnis</h3>
                <p className="text-[#6B6B6B]">
                  Zufriedenheit garantiert – sehen Sie selbst!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Preview */}
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Das sagen unsere Kunden
              </h2>
              <p className="text-xl text-[#6B6B6B]">
                Über 175 zufriedene Kunden sprechen für unsere Qualität
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[#FF8C42] text-2xl">★</span>
                  ))}
                </div>
                <p className="text-[#6B6B6B] mb-4 italic">
                  "Ich bin sehr zufrieden mit den Fliegengitter Profis. Der Service war schnell und professionell. Die Fliegengitter sind von hoher Qualität und passen perfekt."
                </p>
                <p className="font-bold text-[#2C2C2C]">Hüseyin, Düsseldorf</p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-[#FF8C42] text-2xl">★</span>
                  ))}
                </div>
                <p className="text-[#6B6B6B] mb-4 italic">
                  "Die Beratung war äußerst hilfreich und professionell, und die Montage verlief reibungslos. Die Produkte selbst sind von ausgezeichneter Qualität."
                </p>
                <p className="font-bold text-[#2C2C2C]">Michael E., Neuss</p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/kundenstimmen" 
                className="inline-block bg-[#FF8C42] text-white px-8 py-4 rounded-full font-bold hover:bg-[#ff6b1a] transition-colors"
              >
                Alle Bewertungen ansehen
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-6">
              Überzeugt? Kontaktieren Sie uns!
            </h2>
            <p className="text-xl text-[#6B6B6B] mb-10">
              Lassen Sie sich kostenlos beraten und erhalten Sie ein unverbindliches Angebot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="bg-[#FF8C42] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#ff6b1a] transition-all shadow-lg"
              >
                Jetzt Anfragen
              </Link>
              <Link 
                href="/beispiele" 
                className="bg-white text-[#2C2C2C] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all border-2 border-[#2C2C2C]"
              >
                Unsere Arbeiten
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
