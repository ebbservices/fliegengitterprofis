'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Link from 'next/link';

export default function LichtschachtKonfigurator() {
  const [height, setHeight] = useState(800);
  const [width, setWidth] = useState(1000);
  const [color, setColor] = useState('verzinkt');

  const colors = [
    { id: 'verzinkt', name: 'Verzinkt', description: 'Klassisch, rostfrei', price: 0 },
    { id: 'anthrazit', name: 'Anthrazit (RAL 7016)', description: 'Elegant und modern', price: 25 },
    { id: 'weiss', name: 'Weiß (RAL 9016)', description: 'Hell und freundlich', price: 25 }
  ];

  const calculatePrice = () => {
    const area = (height / 1000) * (width / 1000);
    const basePrice = area * 85;
    const colorPrice = colors.find(c => c.id === color)?.price || 0;
    
    const total = basePrice + colorPrice;
    return Math.max(total, 149).toFixed(2);
  };

  const addToCart = () => {
    const item = {
      product: 'Lichtschachtabdeckung nach Maß',
      height,
      width,
      color: colors.find(c => c.id === color)?.name,
      price: calculatePrice()
    };
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert('Produkt wurde zum Warenkorb hinzugefügt!');
  };

  return (
    <>
      <Header />
      
      <main className="pt-14">
        <section className="py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto">
            <Link href="/shop" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zum Shop
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Lichtschachtabdeckung nach Maß konfigurieren
            </h1>
            <p className="text-xl text-slate-300">
              Stellen Sie Ihre individuelle Lichtschachtabdeckung zusammen
            </p>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                
                {/* Maße */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Maße eingeben
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Höhe (mm)
                      </label>
                      <input 
                        type="number"
                        min="100"
                        max="2500"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                      />
                      <p className="text-sm text-slate-500 mt-2">Min: 100mm, Max: 2500mm</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Breite (mm)
                      </label>
                      <input 
                        type="number"
                        min="100"
                        max="2500"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                      />
                      <p className="text-sm text-slate-500 mt-2">Min: 100mm, Max: 2500mm</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>Fläche:</strong> {((height / 1000) * (width / 1000)).toFixed(2)} m²
                    </p>
                  </div>
                </div>

                {/* Farbe */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Farbe wählen
                  </h2>
                  
                  <div className="space-y-4">
                    {colors.map((col) => (
                      <label key={col.id} className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: color === col.id ? '#ff8c42' : '#e5e7eb' }}>
                        <input 
                          type="radio"
                          name="color"
                          value={col.id}
                          checked={color === col.id}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{col.name}</p>
                          <p className="text-sm text-slate-600">{col.description}</p>
                          {col.price > 0 && <p className="text-sm text-orange-600 mt-1">+{col.price.toFixed(2)} €</p>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Wichtige Hinweise</h3>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Alle Abdeckungen werden aus robustem Edelstahl gefertigt</li>
                        <li>• Inklusive Befestigungsmaterial</li>
                        <li>• Wetterfest und langlebig</li>
                        <li>• Schützt vor Schmutz, Laub und Ungeziefer</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Zusammenfassung */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 text-white sticky top-20">
                  <h3 className="text-2xl font-bold mb-6">Ihre Konfiguration</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="pb-3 border-b border-white/20">
                      <p className="text-sm text-orange-100">Maße</p>
                      <p className="font-semibold">{height} × {width} mm</p>
                      <p className="text-sm text-orange-100">({((height / 1000) * (width / 1000)).toFixed(2)} m²)</p>
                    </div>
                    
                    <div className="pb-3 border-b border-white/20">
                      <p className="text-sm text-orange-100">Farbe</p>
                      <p className="font-semibold">{colors.find(c => c.id === color)?.name}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <p className="text-sm text-orange-100 mb-1">Gesamtpreis</p>
                    <p className="text-4xl font-bold">{calculatePrice()} €</p>
                    <p className="text-xs text-orange-100 mt-2">inkl. MwSt.</p>
                  </div>
                  
                  <button 
                    onClick={addToCart}
                    className="w-full bg-white text-orange-600 px-6 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl mb-3"
                  >
                    In den Warenkorb
                  </button>
                  
                  <Link 
                    href="/shop/warenkorb"
                    className="block w-full text-center border-2 border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                  >
                    Zum Warenkorb
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
