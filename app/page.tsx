import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="pt-14">
        {/* Hero Section - Kompakt und Mobile-optimiert */}
        <section id="start" className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-30">
            <Image 
              src="/images/hero-image.jpg" 
              alt="Fliegengitter Profis" 
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-white text-center py-8 md:py-12">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs md:text-sm font-semibold">Über 175 Kunden</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight max-w-4xl mx-auto">
              Endlich Schluss mit lästigen{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Insekten
              </span>
            </h1>
            
            <p className="text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto text-slate-300 leading-relaxed px-4">
              Premium Insektenschutzgitter nach Maß – Perfekter Schutz für Ihr Zuhause
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
              <Link 
                href="/kontakt" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:from-orange-600 hover:to-orange-700 transition-all shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
              >
                Kostenlose Beratung
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/leistungen" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-white hover:text-slate-900 transition-all"
              >
                Unsere Leistungen
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator - nur auf Desktop */}
          <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Features Section mit 3D-Effekt */}
        <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Warum Die Fliegengitter Profis?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Qualität, Service und Expertise - Ihr Partner für maßgeschneiderten Insektenschutz
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Premium Qualität</h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Hochwertige Materialien aus robustem Aluminium für langlebigen Schutz
                </p>
              </div>

              <div className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Maßanfertigung</h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Jedes Fliegengitter wird exakt nach Ihren Maßen gefertigt - perfekte Passform garantiert
                </p>
              </div>

              <div className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">Professionelle Montage</h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Inklusive Beratung und fachgerechter Montage durch unsere Experten
                </p>
              </div>
            </div>

            {/* Product Showcase mit 3D-Effekt */}
            <div className="grid md:grid-cols-2 gap-16 items-center bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                <Image 
                  src="/images/image-2.jpg" 
                  alt="Premium Insektenschutzgitter" 
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  Premium Insektenschutzgitter
                </h2>
                <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                  Unsere hochwertigen Fliegengitter nach Maß bestehen aus robustem Aluminium und eignen sich für alle Fenster. Insbesondere für Räume mit 17 mm Rollladen zwischen Fenster und Rollladen.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Verschiedene Farben erhältlich</span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Befestigung durch Schrauben oder praktisches Klicksystem</span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Ungehinderte Luftzirkulation</span>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Schutz vor Pollen, Staub und Allergenen</span>
                  </li>
                </ul>
                <Link 
                  href="/insektenschutz" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Mehr erfahren
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="insektenschutz" className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-6">
                  Premium Insektenschutzgitter
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-4">
                  Unsere hochwertigen Fliegengitter für Maß bestehen aus robustem Aluminium und eignen sich für alle Fenster, insbesondere für Räume mit 17 mm Platz zwischen Rollladen und Fenster. Unsere Produkte lassen sich mühelos entweder durch Schrauben oder mit einem praktischen Klicksystem installieren. Das einzigartige Merkmal unserer Fliegengitter ist die Magnethalterung beim Schließen, die für eine stabile und sichere Versiegelung sorgt, wodurch keine Insekten eindringen können.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Für barrierefreie Fenster und Balkone bieten wir ein flaches, stufenloses System von nur 0,5 mm Höhe an. Unsere Produkte sind in verschiedenen Farben erhältlich und zeichnen sich durch ihre erstklassige Qualität aus. Zusätzlich berücksichtigen wir die Bedürfnisse von Allergikern und Katzenbesitzern, um ein angenehmes und praktisches Nutzungserlebnis zu gewährleisten.
                </p>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-6">
                  Sicher & praktisch
                </h2>
                <p className="text-[#6B6B6B] leading-relaxed mb-4">
                  Unsere Premium-Insektenschutzgitter bieten eine Vielzahl von Vorteilen. Sie schützen nicht nur vor lästigen Insekten wie Mücken, Fliegen und Wespen, sondern auch vor anderen ungebetenen Gästen wie Spinnen und Nagetieren. Darüber hinaus ermöglichen sie eine gute Belüftung Ihrer Räume und lassen frische Luft in den Raum, ohne dass dabei Insekten eindringen können. Sie sind zudem einfach zu installieren und pflegeleicht, da sie leicht zu reinigen sind. Sie bieten somit einen effektiven Schutz vor Insekten und tragen gleichzeitig zu einem angenehmen Raumklima bei.
                </p>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Sie können sie entweder mit einem handelsüblichen Staubsauger vorsichtig absaugen oder mit einem feuchten Lappen reinigen. Diese Pflegeoptionen ermöglichen eine problemlose Reinigung und gewährleisten, dass Ihre Fliegengitter stets sauber und funktional bleiben.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="leistungen" className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
                Unsere Leistungen
              </h2>
              <p className="text-[#6B6B6B] text-lg max-w-3xl mx-auto">
                Neben professionellen Insektenschutzgittern, bieten wir eine Vielzahl an weiteren Leistungen an. Verschaffen Sie sich einen ersten Eindruck und sprechen Sie uns bei Fragen jederzeit an!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Fliegengitter nach Maß',
                  icon: '/images/icon-fliegengitter-nach-mass.png',
                  description: 'Fliegengitter nach Maß bieten die ideale Lösung für individuelle Bedürfnisse. Diese maßgefertigten Gitter passen exakt zu Ihren Fenstern und werden in einer Vielzahl von Farben angeboten, um sich harmonisch in Ihr Zuhause einzufügen. Die flexible Installation ermöglicht entweder ein benutzerfreundliches Klick-System oder die klassische Schraubmontage – ganz nach Ihren Vorlieben. Ob zwischen Rolladen und Fenster oder davor platziert, diese Fliegengitter bieten nicht nur effektiven Schutz vor lästigen Insekten, sondern passen sich auch nahtlos der Architektur Ihres Hauses an.'
                },
                {
                  title: 'Große Farbauswahl',
                  icon: '/images/icon-grosse-farbauswahl.png',
                  description: 'Unsere Fliegengitter nach Maß stehen nicht nur für perfekte Passform, sondern auch für individuellen Stil. Erhältlich in einer breiten Palette von Farben, können unsere Gitter sogar in besonderen Farbtönen lackiert werden, um sich nahtlos in Ihr Wohnambiente einzufügen. Darüber hinaus bieten wir auch Holzlackierungen an, die eine ansprechende Option für eine warme und natürliche Optik darstellen. So kombinieren wir Funktionalität mit ästhetischer Vielfalt, um Ihren Bedürfnissen und Ihrem Geschmack gerecht zu werden.'
                },
                {
                  title: 'Preisgarantie',
                  icon: '/images/icon-preisgarantie.png',
                  description: 'Unsere Preisgarantie vermittelt Ihnen die Gewissheit, dass Sie stets das beste Angebot erhalten. Mit unserem Engagement für transparente und faire Preise versichern wir Ihnen, dass der vereinbarte Preis für unsere Produkte stabil bleibt. So können Sie bedenkenlos planen und sich darauf verlassen, dass Qualität und Kostensicherheit Hand in Hand gehen. Unsere Preisgarantie ist unser Versprechen an Sie, herausragende Produkte zu einem festen und verlässlichen Preis zu erhalten.'
                },
                {
                  title: 'Kostenlose Beratung',
                  icon: '/images/icon-kostenlose-beratung.png',
                  description: 'Unsere kostenlose Beratung steht Ihnen zur Verfügung, um sicherzustellen, dass Sie die bestmöglichen Entscheidungen treffen. Unser engagiertes Team von Experten nimmt sich die Zeit, um auf Ihre individuellen Bedürfnisse einzugehen und maßgeschneiderte Lösungen zu bieten. Egal, ob es um Produktauswahl, Anpassungen oder technische Fragen geht – wir sind hier, um Ihnen fachkundige Unterstützung zu bieten. Vertrauen Sie auf unsere kostenlose Beratung, um informierte Entscheidungen zu treffen und das optimale Ergebnis für Ihre Anforderungen zu erzielen.'
                },
                {
                  title: 'Inklusive Beratung & Montage',
                  icon: '/images/icon-montage.png',
                  description: 'Unsere umfassenden Dienstleistungen umfassen nicht nur eine kostenlose Beratung, sondern auch die Montage Ihrer Produkte. Unser engagiertes Expertenteam steht Ihnen zur Seite, um sicherzustellen, dass Sie die richtigen Entscheidungen treffen und Ihre Anforderungen erfüllt werden. Beachten Sie bitte, dass in einem Umkreis von 50 Kilometern, abhängig von der Entfernung, möglicherweise Kosten anfallen können. Wir bieten flexible Lösungen, um Ihnen den besten Service zu gewährleisten. Verlassen Sie sich auf uns für eine maßgeschneiderte Beratung und professionelle Montage.'
                },
                {
                  title: 'Pollenfliegengitter',
                  icon: '/images/icon-pollenfliegengitter.png',
                  description: 'Unsere Pollenfliegengitter sind die optimale Lösung, um Ihr Zuhause vor Pollen und Insekten zu schützen. Mit feinen Mesh-Geweben blockieren sie effektiv Pollen und lassen gleichzeitig frische Luft hindurch. Diese hochwertigen Gitter sind speziell entwickelt, um Allergikern eine pollenfreie Umgebung zu bieten. Die maßgefertigten Pollenfliegengitter passen exakt zu Ihren Fenstern und ermöglichen es Ihnen, die Natur zu genießen, ohne auf Komfort verzichten zu müssen. Investieren Sie in eine pollenfreie Wohnatmosphäre und erleben Sie ungestörtes Wohlbefinden in Ihrem Zuhause.'
                },
                {
                  title: 'Plissee',
                  icon: '/images/icon-plissee.png',
                  description: 'Entdecken Sie unseren vielseitigen Plisse-Sonnenschutz, der Funktionalität und Ästhetik perfekt kombiniert. Diese innovativen Plisse-Vorhänge bieten nicht nur effektiven Sonnenschutz, sondern sind auch als Verdunklungslösung verfügbar, um eine optimale Lichtregulierung in Ihren Räumen zu gewährleisten. Die maßgefertigten Plissees passen sich exakt Ihren Fenstern an und sind in einer breiten Palette von Farben erhältlich, sodass Sie die perfekte harmonische Integration in Ihr Wohnambiente finden können. Genießen Sie flexiblen Sonnenschutz mit Stil und wählen Sie aus unserer umfassenden Auswahl an Plissee-Optionen für ein individuelles Wohngefühl.'
                },
                {
                  title: 'Lichtschachtabdeckungen',
                  icon: '/images/icon-lichtschachtabdeckungen.png',
                  description: 'Unsere Lichtschachtabdeckungen auf Sondermaß bieten die ideale Lösung, um Lichtschächte effektiv zu schützen und dabei eine maßgeschneiderte Passform zu gewährleisten. Egal, welche individuellen Anforderungen Ihr Lichtschacht hat, wir fertigen Abdeckungen exakt nach Ihren Spezifikationen an. Diese hochwertigen Abdeckungen dienen nicht nur dem Schutz vor Schmutz, Laub und Ungeziefer, sondern auch der Sicherheit und Ästhetik. Mit einer breiten Auswahl an Materialien und Designs können Sie sicherstellen, dass die Lichtschachtabdeckung nicht nur funktional, sondern auch optisch ansprechend ist – eine perfekte Ergänzung für Ihr Zuhause.'
                },
                {
                  title: 'Wohnmobil-Montage',
                  icon: '/images/icon-wohnmobilmontage.png',
                  description: 'Entdecken Sie die vielseitige Anwendung unserer Fliegengitter – nicht nur für Wohnungen, sondern auch für Wohnmobile. Unsere maßgefertigten Fliegengitter passen sich perfekt den Fenstern Ihres Wohnmobils an und bieten effektiven Schutz vor lästigen Insekten, ohne die frische Luft zu beeinträchtigen. Die flexible Installation sorgt dafür, dass Sie unterwegs eine insektenfreie Umgebung genießen können. Investieren Sie in Komfort und Unbeschwertheit während Ihrer Reisen – unsere Fliegengitter sind die ideale Ergänzung für jedes Wohnmobilabenteuer.'
                }
              ].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  {service.icon && (
                    <div className="mb-4 flex justify-center">
                      <Image 
                        src={service.icon} 
                        alt={service.title} 
                        width={80} 
                        height={80}
                      />
                    </div>
                  )}
                  <h4 className="text-xl font-semibold text-[#2C2C2C] mb-3">
                    {service.title}
                  </h4>
                  <p className="text-[#6B6B6B] leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-6 text-center">
              Fenster richtig abmessen
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed text-center text-lg mb-8">
              Bitte messen Sie Ihre geöffneten Fenster von innen ab und addieren Sie 2cm zur Breite und Höhe. Die Maße können Sie uns gerne bei Ihrer Anfrage mitteilen, so können wir Ihnen genauere Angaben zum Preis machen.
            </p>
            <div className="flex justify-center">
              <Image 
                src="/images/fenster-abmessen.png" 
                alt="Fenster richtig abmessen" 
                width={600} 
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        <section id="video" className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-6">
              Unser Promo-Video
            </h2>
            <p className="text-[#6B6B6B] mb-8 text-lg">
              Manchmal sagen Videos mehr als tausend Worte. Unser neues Werbevideo!
            </p>
            <div className="aspect-video bg-[#2C2C2C] rounded-lg overflow-hidden">
              <video 
                controls 
                className="w-full h-full"
                poster="/images/hero-image.jpg"
              >
                <source src="/videos/dfgp-promo.mp4" type="video/mp4" />
                Ihr Browser unterstützt das Video-Tag nicht.
              </video>
            </div>
          </div>
        </section>

        <section id="beispiele" className="py-20 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-12 text-center">
              Unsere Arbeiten
            </h2>
            <p className="text-[#6B6B6B] text-center mb-8">
              Einige unserer bisherigen Arbeiten bei Kunden.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-[#F5F5F5] rounded-lg overflow-hidden relative">
                  <Image 
                    src={`/images/gallery-img-${item}.jpg`} 
                    alt={`Beispiel ${item}`} 
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kundenstimmen" className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4 text-center">
              Kundenstimmen
            </h2>
            <p className="text-[#6B6B6B] text-center mb-12 text-lg">
              Ob Firma oder Privat – Die Fliegengitter Profis stehen für Qualität und zufriedene Kunden!
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Hüseyin',
                  location: 'Düsseldorf',
                  text: 'Ich bin sehr zufrieden mit den Fliegengitter Profis, die Fliegengitter für unsere fünf Fenster und eine Balkontür geliefert und montiert hat. Der Service war schnell und professionell. Im ersten Termin wurde alles von einem freundlichen Mitarbeiter ausgemessen und im zweiten Termin wurde alles fachgerecht montiert. Die Fliegengitter sind von hoher Qualität und passen perfekt zu den Fenstern und der Tür (Obwohl sie sehr groß ist). Die Kommunikation war auch sehr gut, ich wurde immer über den Stand der Bestellung informiert. Ich kann die Fliegengitter Profis nur weiterempfehlen, sie hat meine Erwartungen übertroffen. Klare Kaufempfehlung!'
                },
                {
                  name: 'Michael E.',
                  location: 'Neuss',
                  text: 'Ich habe kürzlich Fliegengitter für mein gesamtes Haus bei der Firma bestellt und war rundum begeistert. Die Beratung war äußerst hilfreich und professionell, und die Montage verlief reibungslos. Die Produkte selbst sind von ausgezeichneter Qualität und erfüllen meine Erwartungen voll und ganz. Ich bin mit dem Service und den Produkten so zufrieden, dass ich nun in Erwägung ziehe, auch Plisés hier zu bestellen. Die Firma bietet ein beeindruckendes Maß an Service und Qualität, das ich uneingeschränkt weiterempfehlen kann!'
                },
                {
                  name: 'Dirk S.',
                  location: 'Niederkassel',
                  text: 'Ich habe maßgeschneiderte Sonnenschutzrollos für meine verglaste Veranda bei den Fliegengitterprofis G&K bestellt und bin begeistert! Die Vielfalt an Farben und die Möglichkeit, Sonnenschutz und Abdunkelung individuell anzupassen, sind fantastisch. Die Qualität der Produkte ist erstklassig, die Beratung war äußerst hilfreich und inspirierend, und die pünktliche Lieferung sowie die einwandfreie Montage haben mich überzeugt. Sehr empfehlenswert! Zudem haben zwei meiner Nachbarn, die die Rollos sahen, sich ebenso begeistert gezeigt und direkt im Anschluss ebenfalls Bestellungen aufgegeben.'
                },
                {
                  name: 'Jutta S.',
                  location: 'Ratingen',
                  text: 'Die Erfahrung mit den Fliegengitterprofis war nichts weniger als phänomenal. Von der ersten Kontaktaufnahme bis zur abschließenden Montage war jeder Schritt herausragend. Die Beratung war äußerst informativ, die Lieferung erfolgte sogar früher als erwartet, und die Handwerker haben die Plissees mit beispielloser Sorgfalt montiert. Ein Service, der in jeder Hinsicht die Erwartungen übertrifft. Uneingeschränkt empfehlenswert!'
                },
                {
                  name: 'Mario',
                  location: 'Bedburg',
                  text: 'Die Fliegengitter-Profis haben einen exzellenten Service geboten. Von der Beratung bis zur Installation verlief alles reibungslos. Das Team arbeitete professionell, pünktlich und hinterließ keinen Schmutz. Die maßgefertigten Fliegengitter passen perfekt und erfüllen ihren Zweck optimal. Die freundliche Kommunikation und das kundenorientierte Vorgehen haben einen positiven Eindruck hinterlassen. Insgesamt kann ich die Fliegengitter-Profis uneingeschränkt empfehlen.'
                },
                {
                  name: 'Nico',
                  location: 'Solingen',
                  text: 'Die Fliegengitter-Profis haben meine Erwartungen übertroffen, als ich einen Pollen-Insektenschutz bei ihnen bestellt habe. Das Produkt nicht nur funktional, sondern auch optisch äußerst ansprechend. Die maßgefertigte Lösung integriert sich nahtlos in meine Fenster und bietet nicht nur Schutz vor Insekten, sondern auch effektive Filterung von Pollen. Der Service der Firma war herausragend, von der Beratung bis zur Installation. Die Qualität des Schutzes und die ästhetische Gestaltung haben mich überzeugt. Insgesamt eine herausragende Leistung der Fliegengitter-Profis, die ich gerne lobend hervorhebe.'
                },
                {
                  name: 'Thomas K.',
                  location: 'Bergheim',
                  text: 'Die Fliegengitterprofis verdienen meine höchste Anerkennung! Ihre Beratung war exzellent, die Lieferung kam sogar früher als geplant und die Montage war makellos. Diese Firma übertrifft in jedem Bereich die Erwartungen und ich kann sie uneingeschränkt weiterempfehlen.'
                },
                {
                  name: 'Thomas G.',
                  location: 'Pulheim',
                  text: 'Sehr freundliche und kompetente Beratung, ich wurde über jedes Detail und den gesamten Verlauf informiert. Zeitfenster wurde exakt eingehalten und das besondere es wurde keine Anfahrtspauschale berechnet, was bei vielen anderen leider der Fall ist. Klare Weiterempfehlung'
                },
                {
                  name: 'Yücel',
                  location: 'Dortmund',
                  text: 'Ich wollte mich nochmal für die zuverlässige und saubere Arbeit bedanken. Ihr seid einfach die besten! Ich bin total zufrieden mit den Fliegengittern. Bleibt weiterhin so wie ihr seid und viel Erfolg in der Zukunft.'
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-[#6B6B6B] leading-relaxed mb-4 italic">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-[#2C2C2C]">{testimonial.name}</p>
                    <p className="text-sm text-[#6B6B6B]">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <h3 className="text-2xl font-bold text-[#2C2C2C] mb-4">
                Haben wir Sie überzeugt?
              </h3>
              <p className="text-xl text-[#6B6B6B] mb-6">
                Schluss mit lästigen Insekten in Ihren vier Wänden!
              </p>
              <Link 
                href="#kontakt" 
                className="inline-block bg-[#FF8C42] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#ff6b1a] transition-colors"
              >
                Jetzt anfragen!
              </Link>
            </div>
          </div>
        </section>

        <section id="kontakt" className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-8 text-center">
              Haben Sie Interesse an unseren Produkten?
            </h3>
            <p className="text-[#6B6B6B] text-center mb-12 text-lg">
              Sie haben Fragen zu Ihrem kommenden Projekt oder möchten Informationen zu unseren Fliegengittern, Plissees oder anderen Produkten? Wir freuen uns auf Ihre Kontaktaufnahme!
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <a 
                href="tel:+4915737952490"
                className="flex flex-col items-center p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#FF8C42] hover:text-white transition-colors group"
              >
                <div className="mb-3">
                  <Image src="/images/call-icon.svg" alt="Telefon" width={48} height={48} />
                </div>
                <h4 className="font-semibold mb-2">Anruf unter</h4>
                <p className="text-sm">+49 1573 7952490</p>
              </a>

              <a 
                href="mailto:info@diefliegengitterprofis.de"
                className="flex flex-col items-center p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#FF8C42] hover:text-white transition-colors group"
              >
                <div className="mb-3">
                  <Image src="/images/mail-icon.svg" alt="E-Mail" width={48} height={48} />
                </div>
                <h4 className="font-semibold mb-2">E-Mail an</h4>
                <p className="text-sm">info@diefliegengitterprofis.de</p>
              </a>

              <a 
                href="https://api.whatsapp.com/send?phone=4915737952490"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-[#F5F5F5] rounded-lg hover:bg-[#FF8C42] hover:text-white transition-colors group"
              >
                <div className="mb-3">
                  <Image src="/images/whatsapp-icon.png" alt="WhatsApp" width={48} height={48} />
                </div>
                <h4 className="font-semibold mb-2">WhatsApp an</h4>
                <p className="text-sm">+49 1573 7952490</p>
              </a>
            </div>

            <div className="bg-[#F5F5F5] p-8 rounded-lg">
              <h4 className="text-2xl font-bold text-[#2C2C2C] mb-6 text-center">
                Projektanfrage
              </h4>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Ihr Name" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Ihre E-Mail" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
                  />
                </div>
                <input 
                  type="tel" 
                  placeholder="Ihre Telefonnummer" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
                />
                <textarea 
                  placeholder="Ihre Nachricht" 
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
                ></textarea>
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-[#6B6B6B]">
                    Ich habe die <Link href="/datenschutz" className="text-[#FF8C42] hover:underline">Datenschutzbestimmungen</Link> gelesen und akzeptiert.
                  </label>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#FF8C42] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#ff6b1a] transition-colors"
                >
                  Anfrage senden
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
