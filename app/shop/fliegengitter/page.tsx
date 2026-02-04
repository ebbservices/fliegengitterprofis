'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddToCartModal from '@/components/AddToCartModal';
import { useState } from 'react';
import Link from 'next/link';

export default function FliegengitterKonfigurator() {
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1200);
  const [color, setColor] = useState('weiss');
  const [ralColor, setRalColor] = useState('');
  const [useRal, setUseRal] = useState(false);
  const [frameType, setFrameType] = useState('aluminium');
  const [meshType, setMeshType] = useState('standard');
  const [showModal, setShowModal] = useState(false);

  const standardColors = [
    { id: 'weiss', name: 'Weiß (RAL 9016)', price: 0 },
    { id: 'anthrazit', name: 'Anthrazit (RAL 7016)', price: 15 },
    { id: 'braun', name: 'Braun (RAL 8014)', price: 15 }
  ];

  const frameTypes = [
    { id: 'aluminium', name: 'Aluminium-Rahmen', price: 0 },
    { id: 'kunststoff', name: 'Kunststoff-Rahmen', price: -10 },
    { id: 'premium', name: 'Premium Aluminium', price: 25 }
  ];

  const meshTypes = [
    { id: 'standard', name: 'Standard-Polenfilter', description: 'Für normale Insekten', price: 0 },
    { id: 'pollen', name: 'Pollenschutzgewebe', description: 'Für Allergiker', price: 20 },
    { id: 'katzen', name: 'Katzennetz', description: 'Verstärkt, kratzfest', price: 15 }
  ];

  const calculatePrice = () => {
    const area = (height / 1000) * (width / 1000);
    const basePrice = area * 45;
    
    const colorPrice = useRal ? 35 : (standardColors.find(c => c.id === color)?.price || 0);
    const framePrice = frameTypes.find(f => f.id === frameType)?.price || 0;
    const meshPrice = meshTypes.find(m => m.id === meshType)?.price || 0;
    
    const total = basePrice + colorPrice + framePrice + meshPrice;
    return Math.max(total, 89).toFixed(2);
  };

  const addToCart = () => {
    const item = {
      product: 'Fliegengitter nach Maß',
      height,
      width,
      color: useRal ? `RAL ${ralColor}` : standardColors.find(c => c.id === color)?.name,
      frameType: frameTypes.find(f => f.id === frameType)?.name,
      meshType: meshTypes.find(m => m.id === meshType)?.name,
      price: calculatePrice()
    };
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.dispatchEvent(new Event('cartUpdated'));
    setShowModal(true);
  };

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
              Fliegengitter nach Maß konfigurieren
            </h1>
            <p className="text-xl text-slate-300">
              Stellen Sie Ihr individuelles Fliegengitter zusammen
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
                        max="3000"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                      />
                      <p className="text-sm text-slate-500 mt-2">Min: 100mm, Max: 3000mm</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Breite (mm)
                      </label>
                      <input 
                        type="number"
                        min="100"
                        max="3000"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                      />
                      <p className="text-sm text-slate-500 mt-2">Min: 100mm, Max: 3000mm</p>
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
                    {standardColors.map((col) => (
                      <label key={col.id} className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: !useRal && color === col.id ? '#ff8c42' : '#e5e7eb' }}>
                        <input 
                          type="radio"
                          name="color"
                          value={col.id}
                          checked={!useRal && color === col.id}
                          onChange={(e) => {
                            setColor(e.target.value);
                            setUseRal(false);
                          }}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{col.name}</p>
                          {col.price > 0 && <p className="text-sm text-orange-600">+{col.price.toFixed(2)} €</p>}
                        </div>
                      </label>
                    ))}
                    
                    <div className="border-t-2 pt-4">
                      <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: useRal ? '#ff8c42' : '#e5e7eb' }}>
                        <input 
                          type="radio"
                          name="color"
                          checked={useRal}
                          onChange={() => setUseRal(true)}
                          className="w-5 h-5 text-orange-500 mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 mb-2">RAL-Farbe nach Wahl</p>
                          <input 
                            type="text"
                            placeholder="z.B. RAL 7016"
                            value={ralColor}
                            onChange={(e) => {
                              setRalColor(e.target.value);
                              setUseRal(true);
                            }}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                          />
                          <p className="text-sm text-orange-600 mt-2">+35.00 € Aufpreis</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Rahmentyp */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Rahmentyp wählen
                  </h2>
                  
                  <div className="space-y-4">
                    {frameTypes.map((frame) => (
                      <label key={frame.id} className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: frameType === frame.id ? '#ff8c42' : '#e5e7eb' }}>
                        <input 
                          type="radio"
                          name="frameType"
                          value={frame.id}
                          checked={frameType === frame.id}
                          onChange={(e) => setFrameType(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{frame.name}</p>
                          {frame.price !== 0 && (
                            <p className="text-sm text-orange-600">
                              {frame.price > 0 ? '+' : ''}{frame.price.toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gittertyp */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Gittertyp wählen
                  </h2>
                  
                  <div className="space-y-4">
                    {meshTypes.map((mesh) => (
                      <label key={mesh.id} className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: meshType === mesh.id ? '#ff8c42' : '#e5e7eb' }}>
                        <input 
                          type="radio"
                          name="meshType"
                          value={mesh.id}
                          checked={meshType === mesh.id}
                          onChange={(e) => setMeshType(e.target.value)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{mesh.name}</p>
                          <p className="text-sm text-slate-600">{mesh.description}</p>
                          {mesh.price > 0 && <p className="text-sm text-orange-600 mt-1">+{mesh.price.toFixed(2)} €</p>}
                        </div>
                      </label>
                    ))}
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
                      <p className="font-semibold">
                        {useRal ? `RAL ${ralColor || '(nicht angegeben)'}` : standardColors.find(c => c.id === color)?.name}
                      </p>
                    </div>
                    
                    <div className="pb-3 border-b border-white/20">
                      <p className="text-sm text-orange-100">Rahmen</p>
                      <p className="font-semibold">{frameTypes.find(f => f.id === frameType)?.name}</p>
                    </div>
                    
                    <div className="pb-3 border-b border-white/20">
                      <p className="text-sm text-orange-100">Gittertyp</p>
                      <p className="font-semibold">{meshTypes.find(m => m.id === meshType)?.name}</p>
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
      <AddToCartModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productName="Fliegengitter nach Maß"
      />
    </>
  );
}
