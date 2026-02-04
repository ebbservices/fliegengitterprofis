import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Leistungen() {
  const services = [
    {
      title: 'Fliegengitter nach Maß',
      icon: '/images/icon-fliegengitter-nach-mass.png',
      description: 'Fliegengitter nach Maß bieten die ideale Lösung für individuelle Bedürfnisse. Diese maßgefertigten Gitter passen exakt zu Ihren Fenstern und werden in einer Vielzahl von Farben angeboten, um sich harmonisch in Ihr Zuhause einzufügen. Die flexible Installation ermöglicht entweder ein benutzerfreundliches Klick-System oder die klassische Schraubmontage – ganz nach Ihren Vorlieben.'
    },
    {
      title: 'Große Farbauswahl',
      icon: '/images/icon-grosse-farbauswahl.png',
      description: 'Unsere Fliegengitter nach Maß stehen nicht nur für perfekte Passform, sondern auch für individuellen Stil. Erhältlich in einer breiten Palette von Farben, können unsere Gitter sogar in besonderen Farbtönen lackiert werden, um sich nahtlos in Ihr Wohnambiente einzufügen. Darüber hinaus bieten wir auch Holzlackierungen an.'
    },
    {
      title: 'Preisgarantie',
      icon: '/images/icon-preisgarantie.png',
      description: 'Unsere Preisgarantie vermittelt Ihnen die Gewissheit, dass Sie stets das beste Angebot erhalten. Mit unserem Engagement für transparente und faire Preise versichern wir Ihnen, dass der vereinbarte Preis für unsere Produkte stabil bleibt. So können Sie bedenkenlos planen und sich darauf verlassen, dass Qualität und Kostensicherheit Hand in Hand gehen.'
    },
    {
      title: 'Kostenlose Beratung',
      icon: '/images/icon-kostenlose-beratung.png',
      description: 'Unsere kostenlose Beratung steht Ihnen zur Verfügung, um sicherzustellen, dass Sie die bestmöglichen Entscheidungen treffen. Unser engagiertes Team von Experten nimmt sich die Zeit, um auf Ihre individuellen Bedürfnisse einzugehen und maßgeschneiderte Lösungen zu bieten.'
    },
    {
      title: 'Inklusive Beratung & Montage',
      icon: '/images/icon-montage.png',
      description: 'Unsere umfassenden Dienstleistungen umfassen nicht nur eine kostenlose Beratung, sondern auch die Montage Ihrer Produkte. Unser engagiertes Expertenteam steht Ihnen zur Seite, um sicherzustellen, dass Sie die richtigen Entscheidungen treffen und Ihre Anforderungen erfüllt werden.'
    },
    {
      title: 'Pollenfliegengitter',
      icon: '/images/icon-pollenfliegengitter.png',
      description: 'Unsere Pollenfliegengitter sind die optimale Lösung, um Ihr Zuhause vor Pollen und Insekten zu schützen. Mit feinen Mesh-Geweben blockieren sie effektiv Pollen und lassen gleichzeitig frische Luft hindurch. Diese hochwertigen Gitter sind speziell entwickelt, um Allergikern eine pollenfreie Umgebung zu bieten.'
    },
    {
      title: 'Plissee',
      icon: '/images/icon-plissee.png',
      description: 'Entdecken Sie unseren vielseitigen Plisse-Sonnenschutz, der Funktionalität und Ästhetik perfekt kombiniert. Diese innovativen Plisse-Vorhänge bieten nicht nur effektiven Sonnenschutz, sondern sind auch als Verdunklungslösung verfügbar, um eine optimale Lichtregulierung in Ihren Räumen zu gewährleisten.'
    },
    {
      title: 'Lichtschachtabdeckungen',
      icon: '/images/icon-lichtschachtabdeckungen.png',
      description: 'Unsere Lichtschachtabdeckungen auf Sondermaß bieten die ideale Lösung, um Lichtschächte effektiv zu schützen und dabei eine maßgeschneiderte Passform zu gewährleisten. Diese hochwertigen Abdeckungen dienen nicht nur dem Schutz vor Schmutz, Laub und Ungeziefer, sondern auch der Sicherheit und Ästhetik.'
    },
    {
      title: 'Wohnmobil-Montage',
      icon: '/images/icon-wohnmobilmontage.png',
      description: 'Entdecken Sie die vielseitige Anwendung unserer Fliegengitter – nicht nur für Wohnungen, sondern auch für Wohnmobile. Unsere maßgefertigten Fliegengitter passen sich perfekt den Fenstern Ihres Wohnmobils an und bieten effektiven Schutz vor lästigen Insekten, ohne die frische Luft zu beeinträchtigen.'
    }
  ];

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF8C42] to-[#ff6b1a]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Unsere <span className="text-white drop-shadow-lg">Leistungen</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Von Insektenschutzgittern bis Plissees – Ihr Komplettanbieter für Schutz und Komfort
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Professionelle Lösungen für Ihr Zuhause
              </h2>
              <p className="text-xl text-[#6B6B6B] max-w-3xl mx-auto">
                Neben professionellen Insektenschutzgittern bieten wir eine Vielzahl an weiteren Leistungen an. Verschaffen Sie sich einen ersten Eindruck und sprechen Sie uns bei Fragen jederzeit an!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="bg-white border-2 border-gray-100 p-8 rounded-2xl hover:shadow-2xl hover:border-[#FF8C42] transition-all duration-300 group"
                >
                  <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Image 
                      src={service.icon} 
                      alt={service.title} 
                      width={100} 
                      height={100}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2C2C] mb-4 text-center group-hover:text-[#FF8C42] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#6B6B6B] leading-relaxed text-center">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                So einfach geht's
              </h2>
              <p className="text-xl text-[#6B6B6B]">
                In nur 4 Schritten zu Ihrem perfekten Insektenschutz
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-[#FF8C42] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Kontaktaufnahme</h3>
                <p className="text-[#6B6B6B]">
                  Rufen Sie uns an oder senden Sie eine Anfrage über unser Kontaktformular
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#FF8C42] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Beratung & Aufmaß</h3>
                <p className="text-[#6B6B6B]">
                  Wir beraten Sie vor Ort und nehmen präzise Maß für Ihre Fenster
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#FF8C42] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Anfertigung</h3>
                <p className="text-[#6B6B6B]">
                  Ihre Fliegengitter werden maßgenau und in Ihrer Wunschfarbe gefertigt
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#FF8C42] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                  4
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">Montage</h3>
                <p className="text-[#6B6B6B]">
                  Professionelle Installation durch unser erfahrenes Team
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Fenster abmessen */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-[#2C2C2C] mb-6">
                  Fenster richtig abmessen
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-6 text-lg">
                  Bitte messen Sie Ihre geöffneten Fenster von innen ab und addieren Sie 2cm zur Breite und Höhe.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed mb-8">
                  Die Maße können Sie uns gerne bei Ihrer Anfrage mitteilen, so können wir Ihnen genauere Angaben zum Preis machen.
                </p>
                <Link 
                  href="/kontakt" 
                  className="inline-block bg-[#FF8C42] text-white px-8 py-4 rounded-full font-bold hover:bg-[#ff6b1a] transition-colors"
                >
                  Jetzt Anfrage senden
                </Link>
              </div>
              
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/fenster-abmessen.png" 
                  alt="Fenster richtig abmessen" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#2C2C2C] to-[#1a1a1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">
              Haben Sie Fragen zu unseren Leistungen?
            </h2>
            <p className="text-xl mb-10 text-gray-300">
              Wir beraten Sie gerne kostenlos und unverbindlich
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kontakt" 
                className="bg-[#FF8C42] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#ff6b1a] transition-all"
              >
                Kontakt aufnehmen
              </Link>
              <a 
                href="tel:+4915737952490"
                className="bg-white text-[#2C2C2C] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
              >
                📞 01573 7952490
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
