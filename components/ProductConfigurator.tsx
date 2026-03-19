'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddToCartModal from '@/components/AddToCartModal';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/use-cart';
import { MEDUSA_BACKEND_URL } from '@/lib/config';
import type { ConfiguratorMetadata } from '@/lib/types';
import type { LocalCartItem } from '@/lib/context/cart-context';

interface OptionItem {
  name: string;
  surcharge_cents: number;
}

interface OptionGroup {
  title: string;
  options: OptionItem[];
}

interface ProductConfiguratorProps {
  productId: string;
  productTitle: string;
  productDescription: string;
  metadata: ConfiguratorMetadata;
  variantId?: string;
}

function buildOptionGroups(metadata: ConfiguratorMetadata): OptionGroup[] {
  return Object.entries(metadata.options_config).map(([title, values]) => ({
    title,
    options: Object.entries(values)
      .map(([name, config]) => ({
        name,
        surcharge_cents: config.surcharge_cents,
      }))
      .sort((a, b) => a.surcharge_cents - b.surcharge_cents),
  }));
}

function formatSurcharge(cents: number): string | null {
  if (cents === 0) return null;
  const euros = cents / 100;
  return `${euros > 0 ? '+' : ''}${euros.toFixed(2)} €`;
}

export default function ProductConfigurator({
  productId,
  productTitle,
  productDescription,
  metadata,
  variantId,
}: ProductConfiguratorProps) {
  const optionGroups = buildOptionGroups(metadata);
  const dims = metadata.dimensions;

  const [height, setHeight] = useState(
    Math.round((dims.height_min + dims.height_max) / 2 / 100) * 100
  );
  const [width, setWidth] = useState(
    Math.round((dims.width_min + dims.width_max) / 2 / 100) * 100
  );
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const group of optionGroups) {
      if (group.options.length > 0) {
        initial[group.title] = group.options[0].name;
      }
    }
    return initial;
  });
  const [label, setLabel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItemLocal } = useCart();

  const calculatePrice = () => {
    const area = (height / 1000) * (width / 1000);
    const baseCents = area * metadata.pricing.base_price_per_sqm_cents;

    let surchargeTotal = 0;
    for (const [groupTitle, selectedName] of Object.entries(selections)) {
      const groupConfig = metadata.options_config[groupTitle];
      if (groupConfig && groupConfig[selectedName]) {
        surchargeTotal += groupConfig[selectedName].surcharge_cents;
      }
    }

    const totalCents = Math.max(
      baseCents + surchargeTotal,
      metadata.pricing.min_price_cents
    );
    return (totalCents / 100).toFixed(2);
  };

  const addToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    let finalPrice = calculatePrice();

    // Server-seitige Preisvalidierung
    try {
      const selectionMap: Record<string, string> = {};
      for (const [groupTitle, selectedName] of Object.entries(selections)) {
        selectionMap[groupTitle] = selectedName;
      }

      const res = await fetch(`${MEDUSA_BACKEND_URL}/store/calculate-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          width,
          height,
          selections: selectionMap,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        finalPrice = (data.price_cents / 100).toFixed(2);
      }
    } catch {
      // Fallback auf Client-Preis wenn Backend nicht erreichbar
    }

    const item: LocalCartItem = {
      product: productTitle,
      Bezeichnung: label || undefined,
      height,
      width,
      price: finalPrice,
    };

    for (const [groupTitle, selectedName] of Object.entries(selections)) {
      item[groupTitle] = selectedName;
    }

    addItemLocal(item);
    setIsAdding(false);
    setShowModal(true);
  };

  return (
    <>
      <Header />

      <main className="pt-20">
        <section className="py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zum Shop
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {productTitle} konfigurieren
            </h1>
            <p className="text-xl text-slate-300">{productDescription}</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Maße */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    Maße eingeben
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bezeichnung
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="z.B. Küchenfenster, Schlafzimmer links, Balkon..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                    />
                    <p className="text-sm text-slate-500 mt-2">Optional — hilft Ihnen die Bestellung zuzuordnen</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Höhe (mm)
                      </label>
                      <input
                        type="number"
                        min={dims.height_min}
                        max={dims.height_max}
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Min: {dims.height_min}mm, Max: {dims.height_max}mm
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Breite (mm)
                      </label>
                      <input
                        type="number"
                        min={dims.width_min}
                        max={dims.width_max}
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none text-lg font-semibold"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Min: {dims.width_min}mm, Max: {dims.width_max}mm
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>Fläche:</strong>{' '}
                      {((height / 1000) * (width / 1000)).toFixed(2)} m²
                    </p>
                  </div>
                </div>

                {/* Dynamische Optionsgruppen */}
                {optionGroups.map((group, groupIdx) => (
                  <div
                    key={group.title}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {groupIdx + 2}
                      </span>
                      {group.title} wählen
                    </h2>

                    <div className="space-y-4">
                      {group.options.map((opt) => (
                        <label
                          key={opt.name}
                          className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{
                            borderColor:
                              selections[group.title] === opt.name
                                ? '#ff8c42'
                                : '#e5e7eb',
                          }}
                        >
                          <input
                            type="radio"
                            name={group.title}
                            value={opt.name}
                            checked={selections[group.title] === opt.name}
                            onChange={() =>
                              setSelections((prev) => ({
                                ...prev,
                                [group.title]: opt.name,
                              }))
                            }
                            className="w-5 h-5 text-orange-500"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {opt.name}
                            </p>
                            {formatSurcharge(opt.surcharge_cents) && (
                              <p className="text-sm text-orange-600">
                                {formatSurcharge(opt.surcharge_cents)}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Zusammenfassung */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 text-white sticky top-20">
                  <h3 className="text-2xl font-bold mb-6">Ihre Konfiguration</h3>

                  <div className="space-y-4 mb-6">
                    {label && (
                      <div className="pb-3 border-b border-white/20">
                        <p className="text-sm text-orange-100">Bezeichnung</p>
                        <p className="font-semibold">{label}</p>
                      </div>
                    )}

                    <div className="pb-3 border-b border-white/20">
                      <p className="text-sm text-orange-100">Maße</p>
                      <p className="font-semibold">
                        {height} × {width} mm
                      </p>
                      <p className="text-sm text-orange-100">
                        ({((height / 1000) * (width / 1000)).toFixed(2)} m²)
                      </p>
                    </div>

                    {optionGroups.map((group) => (
                      <div
                        key={group.title}
                        className="pb-3 border-b border-white/20"
                      >
                        <p className="text-sm text-orange-100">{group.title}</p>
                        <p className="font-semibold">
                          {selections[group.title]}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <p className="text-sm text-orange-100 mb-1">Gesamtpreis</p>
                    <p className="text-4xl font-bold">{calculatePrice()} €</p>
                    <p className="text-xs text-orange-100 mt-2">inkl. MwSt.</p>
                  </div>

                  <button
                    onClick={addToCart}
                    disabled={isAdding}
                    className="w-full bg-white text-orange-600 px-6 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl mb-3 disabled:opacity-50"
                  >
                    {isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
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
        productName={productTitle}
      />
    </>
  );
}
