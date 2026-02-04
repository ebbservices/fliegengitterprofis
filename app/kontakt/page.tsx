'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState } from 'react';

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert('Vielen Dank für Ihre Anfrage! Wir melden uns schnellstmöglich bei Ihnen.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-[#FF8C42] to-[#ff6b1a] text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Kontakt
            </h1>
            <p className="text-xl md:text-2xl">
              Wir freuen uns auf Ihre Anfrage und beraten Sie gerne kostenlos!
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4">
                Haben Sie Interesse an unseren Produkten?
              </h2>
              <p className="text-xl text-[#6B6B6B]">
                Sie haben Fragen zu Ihrem kommenden Projekt oder möchten Informationen zu unseren Fliegengittern, Plissees oder anderen Produkten?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <a 
                href="tel:+4915737952490"
                className="group flex flex-col items-center p-8 bg-[#F5F5F5] rounded-2xl hover:bg-[#FF8C42] hover:text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  <Image src="/images/call-icon.svg" alt="Telefon" width={64} height={64} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Anruf unter</h3>
                <p className="text-lg font-semibold">+49 1573 7952490</p>
                <p className="text-sm mt-2 opacity-75">Mo-Fr: 9:00 - 18:00 Uhr</p>
              </a>

              <a 
                href="mailto:info@diefliegengitterprofis.de"
                className="group flex flex-col items-center p-8 bg-[#F5F5F5] rounded-2xl hover:bg-[#FF8C42] hover:text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  <Image src="/images/mail-icon.svg" alt="E-Mail" width={64} height={64} />
                </div>
                <h3 className="text-2xl font-bold mb-3">E-Mail an</h3>
                <p className="text-lg font-semibold break-all">info@diefliegengitterprofis.de</p>
                <p className="text-sm mt-2 opacity-75">Antwort innerhalb 24h</p>
              </a>

              <a 
                href="https://api.whatsapp.com/send?phone=4915737952490"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center p-8 bg-[#F5F5F5] rounded-2xl hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  <Image src="/images/whatsapp-icon.png" alt="WhatsApp" width={64} height={64} />
                </div>
                <h3 className="text-2xl font-bold mb-3">WhatsApp an</h3>
                <p className="text-lg font-semibold">+49 1573 7952490</p>
                <p className="text-sm mt-2 opacity-75">Schnelle Antwort</p>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-3xl font-bold text-[#2C2C2C] mb-6">
                  Projektanfrage
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[#2C2C2C] font-semibold mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none transition-colors"
                      placeholder="Ihr Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[#2C2C2C] font-semibold mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none transition-colors"
                      placeholder="ihre.email@beispiel.de"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-[#2C2C2C] font-semibold mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none transition-colors"
                      placeholder="0123 456789"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[#2C2C2C] font-semibold mb-2">
                      Ihre Nachricht *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF8C42] focus:outline-none transition-colors resize-none"
                      placeholder="Beschreiben Sie Ihr Projekt..."
                    />
                  </div>

                  <div className="text-sm text-[#6B6B6B]">
                    Mit dem Absenden stimmen Sie unserer{' '}
                    <a href="/datenschutz" className="text-[#FF8C42] hover:underline">
                      Datenschutzerklärung
                    </a>{' '}
                    zu.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#FF8C42] text-white py-4 rounded-full font-bold text-lg hover:bg-[#ff6b1a] transition-all shadow-lg hover:shadow-xl"
                  >
                    Anfrage senden
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
                  <h3 className="text-3xl font-bold text-[#2C2C2C] mb-6">
                    Kontaktinformationen
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-2 text-lg">Adresse</h4>
                      <p className="text-[#6B6B6B]">
                        G&K Die Fliegengitter Profis OHG<br />
                        Wedaustraße 35<br />
                        41540 Dormagen
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-2 text-lg">Telefon</h4>
                      <a href="tel:+4915737952490" className="text-[#FF8C42] hover:underline text-lg">
                        01573 7952490
                      </a>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-2 text-lg">E-Mail</h4>
                      <a href="mailto:info@diefliegengitterprofis.de" className="text-[#FF8C42] hover:underline">
                        info@diefliegengitterprofis.de
                      </a>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#2C2C2C] mb-2 text-lg">Öffnungszeiten</h4>
                      <p className="text-[#6B6B6B]">
                        Montag - Freitag: 9:00 - 18:00 Uhr<br />
                        Samstag: Nach Vereinbarung<br />
                        Sonntag: Geschlossen
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FF8C42] to-[#ff6b1a] p-8 rounded-2xl text-white">
                  <h4 className="text-2xl font-bold mb-4">Kostenlose Beratung</h4>
                  <p className="mb-6">
                    Wir beraten Sie gerne kostenlos und unverbindlich zu allen Fragen rund um Insektenschutz, Fliegengitter und Plissees.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <span>Vor-Ort-Beratung im Umkreis von 50 km</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <span>Präzises Aufmaß</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <span>Unverbindliches Angebot</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <span>Professionelle Montage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Area */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-6">
              Unser Einzugsgebiet
            </h2>
            <p className="text-xl text-[#6B6B6B] mb-8">
              Wir sind hauptsächlich in folgenden Regionen tätig:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#F5F5F5] rounded-xl">
                <h3 className="font-bold text-[#2C2C2C] text-lg mb-2">Rhein-Kreis Neuss</h3>
                <p className="text-[#6B6B6B] text-sm">Dormagen, Neuss, Grevenbroich, Korschenbroich</p>
              </div>
              <div className="p-6 bg-[#F5F5F5] rounded-xl">
                <h3 className="font-bold text-[#2C2C2C] text-lg mb-2">Köln & Umgebung</h3>
                <p className="text-[#6B6B6B] text-sm">Köln, Pulheim, Frechen, Bergheim</p>
              </div>
              <div className="p-6 bg-[#F5F5F5] rounded-xl">
                <h3 className="font-bold text-[#2C2C2C] text-lg mb-2">Düsseldorf & Umgebung</h3>
                <p className="text-[#6B6B6B] text-sm">Düsseldorf, Monheim, Langenfeld</p>
              </div>
            </div>
            <p className="text-[#6B6B6B] mt-8">
              Auch außerhalb dieser Gebiete? Sprechen Sie uns an – wir finden eine Lösung!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
