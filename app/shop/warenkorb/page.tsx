'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/use-cart';

export default function WarenkorbPage() {
  const { localCart, removeItemLocal, clearCart, cartCount, isLoading } = useCart();

  const getTotalPrice = () => {
    return localCart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-slate-600">Lädt...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pt-20">
        <section className="py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto">
            <Link href="/shop" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zum Shop
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Warenkorb
            </h1>
            <p className="text-xl text-slate-300">
              {cartCount} {cartCount === 1 ? 'Artikel' : 'Artikel'} in Ihrem Warenkorb
            </p>
          </div>
        </section>

        <section className="py-12 px-4 bg-white min-h-screen">
          <div className="container mx-auto max-w-6xl">
            {localCart.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Ihr Warenkorb ist leer
                </h2>
                <p className="text-slate-600 mb-8">
                  Entdecken Sie unsere Produkte und konfigurieren Sie Ihr Wunschprodukt
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Zum Shop
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {localCart.map((item, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {item.product}
                          </h3>
                          <div className="space-y-1 text-sm text-slate-600">
                            <p><strong>Maße:</strong> {item.height} × {item.width} mm</p>
                            {item.color && <p><strong>Farbe:</strong> {item.color}</p>}
                            {item.frameType && <p><strong>Rahmen:</strong> {item.frameType}</p>}
                            {item.meshType && <p><strong>Gittertyp:</strong> {item.meshType}</p>}
                            {item.option && <p><strong>Option:</strong> {item.option}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600 mb-2">
                            {item.price} €
                          </p>
                          <button
                            onClick={() => removeItemLocal(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Entfernen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 mt-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Warenkorb leeren
                  </button>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 text-white sticky top-20">
                    <h3 className="text-2xl font-bold mb-6">Zusammenfassung</h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between pb-3 border-b border-white/20">
                        <span className="text-orange-100">Zwischensumme</span>
                        <span className="font-semibold">{getTotalPrice()} €</span>
                      </div>

                      <div className="flex justify-between pb-3 border-b border-white/20">
                        <span className="text-orange-100">MwSt. (19%)</span>
                        <span className="font-semibold">{(parseFloat(getTotalPrice()) * 0.19).toFixed(2)} €</span>
                      </div>

                      <div className="flex justify-between text-xl font-bold">
                        <span>Gesamt</span>
                        <span>{getTotalPrice()} €</span>
                      </div>
                    </div>

                    <Link
                      href="/shop/checkout"
                      className="block w-full text-center bg-white text-orange-600 px-6 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl mb-3"
                    >
                      Zur Kasse
                    </Link>

                    <Link
                      href="/shop"
                      className="block w-full text-center border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                    >
                      Weiter einkaufen
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
