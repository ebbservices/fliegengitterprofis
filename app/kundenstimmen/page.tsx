import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Kundenstimmen() {
  const testimonials = [
    {
      name: 'Hüseyin',
      location: 'Düsseldorf',
      rating: 5,
      text: 'Ich bin sehr zufrieden mit den Fliegengitter Profis, die Fliegengitter für unsere fünf Fenster und eine Balkontür geliefert und montiert hat. Der Service war schnell und professionell. Im ersten Termin wurde alles von einem freundlichen Mitarbeiter ausgemessen und im zweiten Termin wurde alles fachgerecht montiert. Die Fliegengitter sind von hoher Qualität und passen perfekt zu den Fenstern und der Tür (Obwohl sie sehr groß ist). Die Kommunikation war auch sehr gut, ich wurde immer über den Stand der Bestellung informiert. Ich kann die Fliegengitter Profis nur weiterempfehlen, sie hat meine Erwartungen übertroffen. Klare Kaufempfehlung!'
    },
    {
      name: 'Michael E.',
      location: 'Neuss',
      rating: 5,
      text: 'Ich habe kürzlich Fliegengitter für mein gesamtes Haus bei der Firma bestellt und war rundum begeistert. Die Beratung war äußerst hilfreich und professionell, und die Montage verlief reibungslos. Die Produkte selbst sind von ausgezeichneter Qualität und erfüllen meine Erwartungen voll und ganz. Ich bin mit dem Service und den Produkten so zufrieden, dass ich nun in Erwägung ziehe, auch Plisés hier zu bestellen. Die Firma bietet ein beeindruckendes Maß an Service und Qualität, das ich uneingeschränkt weiterempfehlen kann!'
    },
    {
      name: 'Sarah M.',
      location: 'Köln',
      rating: 5,
      text: 'Absolut empfehlenswert! Die Beratung war kompetent und freundlich. Die Montage erfolgte termingerecht und sauber. Die Fliegengitter sind qualitativ hochwertig und sehen toll aus. Endlich können wir im Sommer lüften, ohne dass Insekten ins Haus kommen!'
    },
    {
      name: 'Thomas K.',
      location: 'Dormagen',
      rating: 5,
      text: 'Sehr professionelle Arbeit! Von der ersten Kontaktaufnahme bis zur fertigen Montage lief alles reibungslos. Die Preise sind fair und transparent. Besonders beeindruckt hat mich die Qualität der Materialien und die Präzision bei der Anfertigung.'
    },
    {
      name: 'Julia W.',
      location: 'Pulheim',
      rating: 5,
      text: 'Wir haben für unser ganzes Haus Fliegengitter bestellt und sind begeistert! Die Beratung war ausführlich, die Montage schnell und sauber. Auch unser Hund kann jetzt nicht mehr durch die Gitter - perfekt! Preis-Leistung ist top!'
    },
    {
      name: 'Andreas B.',
      location: 'Düsseldorf',
      rating: 5,
      text: 'Hervorragender Service! Die Fliegengitter wurden exakt nach Maß gefertigt und passen perfekt. Die Montage war professionell und ging schnell. Besonders gut gefällt mir, dass man die Gitter in verschiedenen Farben bestellen kann - so passen sie perfekt zu unseren Fenstern.'
    },
    {
      name: 'Petra S.',
      location: 'Neuss',
      rating: 5,
      text: 'Ich bin Allergikerin und habe mich für Pollenfliegengitter entschieden. Seitdem geht es mir im Sommer viel besser! Die Beratung war sehr kompetent und auf meine Bedürfnisse zugeschnitten. Absolute Empfehlung!'
    },
    {
      name: 'Markus L.',
      location: 'Köln',
      rating: 5,
      text: 'Schnelle Terminvergabe, pünktliche Montage und einwandfreie Qualität. Die Fliegengitter lassen sich leicht öffnen und schließen und halten dicht. Auch die Reinigung ist unkompliziert. Sehr zufrieden!'
    },
    {
      name: 'Familie Schmidt',
      location: 'Dormagen',
      rating: 5,
      text: 'Wir haben für unser Wohnmobil Fliegengitter anfertigen lassen und sind super zufrieden! Die Profis haben sich die Zeit genommen, alles genau auszumessen. Jetzt können wir endlich im Urlaub die Fenster offen lassen, ohne von Mücken geplagt zu werden.'
    }
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-[#FF8C42] to-[#ff6b1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Image key={i} src="/images/star-solid.svg" alt="Star" width={32} height={32} />
                ))}
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Kundenstimmen
            </h1>
            <p className="text-xl md:text-2xl">
              Über 175 zufriedene Kunden sprechen für unsere Qualität
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">175+</div>
                <p className="text-lg text-[#6B6B6B]">Bewertungen</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">5.0</div>
                <p className="text-lg text-[#6B6B6B]">Durchschnitt</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">100%</div>
                <p className="text-lg text-[#6B6B6B]">Weiterempfehlung</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-[#FF8C42] mb-2">500+</div>
                <p className="text-lg text-[#6B6B6B]">Projekte</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Das sagen unsere Kunden
              </h2>
              <p className="text-xl text-[#6B6B6B]">
                Ob Firma oder Privat – Die Fliegengitter Profis stehen für Qualität und zufriedene Kunden!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#FF8C42] text-2xl">★</span>
                    ))}
                  </div>
                  
                  <p className="text-[#6B6B6B] mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="font-bold text-[#2C2C2C] text-lg">{testimonial.name}</p>
                    <p className="text-[#6B6B6B] text-sm">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Warum Kunden uns vertrauen
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-[#F5F5F5] rounded-2xl">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3">Premium Qualität</h3>
                <p className="text-[#6B6B6B]">
                  Hochwertige Materialien und erstklassige Verarbeitung für langlebigen Schutz
                </p>
              </div>

              <div className="text-center p-8 bg-[#F5F5F5] rounded-2xl">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3">Schneller Service</h3>
                <p className="text-[#6B6B6B]">
                  Von der Beratung bis zur Montage – wir arbeiten zügig und zuverlässig
                </p>
              </div>

              <div className="text-center p-8 bg-[#F5F5F5] rounded-2xl">
                <div className="text-6xl mb-4">💯</div>
                <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3">Faire Preise</h3>
                <p className="text-[#6B6B6B]">
                  Transparente Preisgestaltung und beste Preis-Leistung garantiert
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Werden Sie unser nächster zufriedener Kunde!
            </h2>
            <p className="text-xl mb-10 text-gray-300">
              Überzeugen Sie sich selbst von unserer Qualität und unserem Service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="bg-[#FF8C42] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#ff6b1a] transition-all"
              >
                Jetzt Anfragen
              </Link>
              <Link 
                href="/beispiele" 
                className="bg-white text-[#2C2C2C] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
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
