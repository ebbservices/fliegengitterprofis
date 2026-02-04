import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Insektenschutz() {
  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image 
              src="/images/image-2.jpg" 
              alt="Premium Insektenschutzgitter" 
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium <span className="text-[#FF8C42]">Insektenschutzgitter</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Maßgefertigter Schutz vor Insekten – ohne Kompromisse bei Qualität und Design
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-4xl font-bold text-[#2C2C2C] mb-6">
                  Hochwertige Fliegengitter nach Maß
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-6 text-lg">
                  Unsere hochwertigen Fliegengitter für Maß bestehen aus robustem Aluminium und eignen sich für alle Fenster, insbesondere für Räume mit 17 mm Platz zwischen Rollladen und Fenster.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed mb-6">
                  Unsere Produkte lassen sich mühelos entweder durch Schrauben oder mit einem praktischen Klicksystem installieren. Das einzigartige Merkmal unserer Fliegengitter ist die Magnethalterung beim Schließen, die für eine stabile und sichere Versiegelung sorgt, wodurch keine Insekten eindringen können.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Für barrierefreie Fenster und Balkone bieten wir ein flaches, stufenloses System von nur 0,5 mm Höhe an. Unsere Produkte sind in verschiedenen Farben erhältlich und zeichnen sich durch ihre erstklassige Qualität aus.
                </p>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/window-frame.png" 
                  alt="Fliegengitter Fenster" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Robustes Aluminium</h3>
                <p className="text-[#6B6B6B]">Langlebige Materialien für dauerhaften Schutz</p>
              </div>
              
              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Farbauswahl</h3>
                <p className="text-[#6B6B6B]">Verschiedene Farben passend zu Ihrem Zuhause</p>
              </div>
              
              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">🧲</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Magnethalterung</h3>
                <p className="text-[#6B6B6B]">Sicherer Verschluss ohne Lücken</p>
              </div>
              
              <div className="text-center p-6 bg-[#F5F5F5] rounded-xl">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Einfache Montage</h3>
                <p className="text-[#6B6B6B]">Schrauben oder Klicksystem – Sie wählen</p>
              </div>
            </div>

            {/* Sicher & praktisch */}
            <div className="bg-gradient-to-br from-[#FF8C42] to-[#ff6b1a] rounded-3xl p-12 text-white mb-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-center">
                  Sicher & praktisch
                </h2>
                <p className="text-lg leading-relaxed mb-6">
                  Unsere Premium-Insektenschutzgitter bieten eine Vielzahl von Vorteilen. Sie schützen nicht nur vor lästigen Insekten wie Mücken, Fliegen und Wespen, sondern auch vor anderen ungebetenen Gästen wie Spinnen und Nagetieren.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Darüber hinaus ermöglichen sie eine gute Belüftung Ihrer Räume und lassen frische Luft in den Raum, ohne dass dabei Insekten eindringen können. Sie sind zudem einfach zu installieren und pflegeleicht, da sie leicht zu reinigen sind.
                </p>
                <p className="text-lg leading-relaxed">
                  Sie können sie entweder mit einem handelsüblichen Staubsauger vorsichtig absaugen oder mit einem feuchten Lappen reinigen. Diese Pflegeoptionen ermöglichen eine problemlose Reinigung und gewährleisten, dass Ihre Fliegengitter stets sauber und funktional bleiben.
                </p>
              </div>
            </div>

            {/* Vorteile Liste */}
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-[#2C2C2C] mb-8">Ihre Vorteile</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="text-[#FF8C42] text-3xl font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-1">Effektiver Insektenschutz</h4>
                      <p className="text-[#6B6B6B]">Schutz vor Mücken, Fliegen, Wespen und Spinnen</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#FF8C42] text-3xl font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-1">Optimale Luftzirkulation</h4>
                      <p className="text-[#6B6B6B]">Frische Luft ohne Insekten</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#FF8C42] text-3xl font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-1">Pollenschutz</h4>
                      <p className="text-[#6B6B6B]">Ideal für Allergiker</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#FF8C42] text-3xl font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-1">Pflegeleicht</h4>
                      <p className="text-[#6B6B6B]">Einfache Reinigung mit Staubsauger oder Lappen</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#FF8C42] text-3xl font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-1">Barrierefreie Option</h4>
                      <p className="text-[#6B6B6B]">Nur 0,5 mm Höhe für Balkone und Terrassen</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-[#FF8C42] text-3xl font-bold">✓</span>
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-1">Katzenfreundlich</h4>
                      <p className="text-[#6B6B6B]">Spezielle Lösungen für Haustierbesitzer</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/hero-image.jpg" 
                  alt="Fliegengitter Installation" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-6">
              Bereit für Ihr maßgeschneidertes Fliegengitter?
            </h2>
            <p className="text-xl text-[#6B6B6B] mb-10">
              Kontaktieren Sie uns für eine kostenlose Beratung und ein unverbindliches Angebot
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="bg-[#FF8C42] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#ff6b1a] transition-all shadow-lg hover:shadow-xl"
              >
                Jetzt Anfragen
              </Link>
              <Link 
                href="/leistungen" 
                className="bg-white text-[#2C2C2C] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all border-2 border-[#2C2C2C]"
              >
                Alle Leistungen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
