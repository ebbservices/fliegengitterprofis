'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/use-cart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'address' | 'shipping' | 'payment' | 'review';

interface Address {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  postal_code: string;
  city: string;
  country_code: string;
  phone: string;
}

const emptyAddress: Address = {
  first_name: '',
  last_name: '',
  address_1: '',
  address_2: '',
  postal_code: '',
  city: '',
  country_code: 'de',
  phone: '',
};

export default function CheckoutPage() {
  const { localCart, clearCart, cartCount } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState<Address>(emptyAddress);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const getTotalPrice = () => {
    return localCart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  const getShippingCost = () => (shippingMethod === 'express' ? 14.90 : 5.90);
  const getSubtotal = () => getTotalPrice();
  const getTotal = () => getSubtotal() + getShippingCost();

  if (cartCount === 0) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Warenkorb ist leer</h1>
          <p className="text-slate-600 mb-8">Fügen Sie Produkte hinzu, bevor Sie zur Kasse gehen.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold">
            Zum Shop
          </Link>
        </div>
      </section>
    );
  }

  const steps: { key: Step; label: string; number: number }[] = [
    { key: 'address', label: 'Adresse', number: 1 },
    { key: 'shipping', label: 'Versand', number: 2 },
    { key: 'payment', label: 'Zahlung', number: 3 },
    { key: 'review', label: 'Übersicht', number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Wenn Medusa Backend läuft, hier sdk.store.cart.complete() aufrufen
      // Für jetzt: Bestellung simulieren
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await clearCart();
      router.push('/shop/checkout/danke');
    } catch {
      setError('Bestellung konnte nicht aufgegeben werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const AddressField = ({
    label,
    value,
    onChange,
    type = 'text',
    required = true,
    placeholder = '',
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
      />
    </div>
  );

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, idx) => (
            <div key={s.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx <= currentStepIndex
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.number}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden sm:inline ${
                  idx <= currentStepIndex ? 'text-slate-900' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    idx < currentStepIndex ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 'address' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Rechnungs- & Lieferadresse</h2>

                <div className="space-y-4">
                  <AddressField label="E-Mail-Adresse" value={email} onChange={setEmail} type="email" placeholder="ihre@email.de" />

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField label="Vorname" value={billingAddress.first_name} onChange={(v) => setBillingAddress({ ...billingAddress, first_name: v })} />
                    <AddressField label="Nachname" value={billingAddress.last_name} onChange={(v) => setBillingAddress({ ...billingAddress, last_name: v })} />
                  </div>

                  <AddressField label="Straße & Hausnummer" value={billingAddress.address_1} onChange={(v) => setBillingAddress({ ...billingAddress, address_1: v })} />
                  <AddressField label="Adresszusatz" value={billingAddress.address_2} onChange={(v) => setBillingAddress({ ...billingAddress, address_2: v })} required={false} placeholder="z.B. Wohnung 4" />

                  <div className="grid grid-cols-2 gap-4">
                    <AddressField label="PLZ" value={billingAddress.postal_code} onChange={(v) => setBillingAddress({ ...billingAddress, postal_code: v })} />
                    <AddressField label="Stadt" value={billingAddress.city} onChange={(v) => setBillingAddress({ ...billingAddress, city: v })} />
                  </div>

                  <AddressField label="Telefon" value={billingAddress.phone} onChange={(v) => setBillingAddress({ ...billingAddress, phone: v })} type="tel" required={false} placeholder="Für Rückfragen zur Lieferung" />
                </div>

                <button
                  onClick={() => {
                    if (!email || !billingAddress.first_name || !billingAddress.last_name || !billingAddress.address_1 || !billingAddress.postal_code || !billingAddress.city) {
                      setError('Bitte füllen Sie alle Pflichtfelder aus.');
                      return;
                    }
                    setError('');
                    setStep('shipping');
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Weiter zur Versandart
                </button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 'shipping' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Versandart wählen</h2>

                <div className="space-y-4">
                  <label
                    className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: shippingMethod === 'standard' ? '#ff8c42' : '#e5e7eb' }}
                  >
                    <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-5 h-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Standardversand</p>
                      <p className="text-sm text-slate-600">Lieferung in 5-7 Werktagen</p>
                    </div>
                    <p className="font-bold text-slate-900">5,90 €</p>
                  </label>

                  <label
                    className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: shippingMethod === 'express' ? '#ff8c42' : '#e5e7eb' }}
                  >
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-5 h-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Expressversand</p>
                      <p className="text-sm text-slate-600">Lieferung in 2-3 Werktagen</p>
                    </div>
                    <p className="font-bold text-slate-900">14,90 €</p>
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep('address')} className="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                    Zurück
                  </button>
                  <button onClick={() => setStep('payment')} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all">
                    Weiter zur Zahlung
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Zahlungsart</h2>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border-2 border-orange-500 rounded-xl bg-orange-50">
                    <input type="radio" name="payment" checked readOnly className="w-5 h-5 text-orange-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Vorkasse / Banküberweisung</p>
                      <p className="text-sm text-slate-600">
                        Sie erhalten unsere Bankdaten per E-Mail. Die Bestellung wird nach Zahlungseingang bearbeitet.
                      </p>
                    </div>
                  </label>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900">
                      <strong>Weitere Zahlungsarten</strong> (Stripe, PayPal) werden in Kürze verfügbar sein.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep('shipping')} className="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                    Zurück
                  </button>
                  <button onClick={() => setStep('review')} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all">
                    Weiter zur Übersicht
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 'review' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Bestellübersicht</h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Rechnungsadresse</h3>
                      <div className="text-sm text-slate-600">
                        <p>{billingAddress.first_name} {billingAddress.last_name}</p>
                        <p>{billingAddress.address_1}</p>
                        {billingAddress.address_2 && <p>{billingAddress.address_2}</p>}
                        <p>{billingAddress.postal_code} {billingAddress.city}</p>
                        <p>{email}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Versand & Zahlung</h3>
                      <div className="text-sm text-slate-600">
                        <p>{shippingMethod === 'express' ? 'Expressversand (2-3 Werktage)' : 'Standardversand (5-7 Werktage)'}</p>
                        <p>Vorkasse / Banküberweisung</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-3">Artikel</h3>
                  <div className="space-y-3">
                    {localCart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-semibold text-slate-900">{item.product}</p>
                          <p className="text-sm text-slate-600">{item.height} × {item.width} mm</p>
                          {item.color && <p className="text-sm text-slate-600">Farbe: {item.color}</p>}
                          {item.frameType && <p className="text-sm text-slate-600">Rahmen: {item.frameType}</p>}
                          {item.meshType && <p className="text-sm text-slate-600">Gitter: {item.meshType}</p>}
                          {item.option && <p className="text-sm text-slate-600">Option: {item.option}</p>}
                        </div>
                        <p className="font-bold text-slate-900">{item.price} €</p>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep('payment')} className="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                    Zurück
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Bestellung wird aufgegeben...' : 'Kostenpflichtig bestellen'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Bestellwert</h3>

              <div className="space-y-3 text-sm">
                {localCart.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-slate-600 truncate mr-2">{item.product}</span>
                    <span className="font-semibold text-slate-900 whitespace-nowrap">{item.price} €</span>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Zwischensumme</span>
                    <span className="font-semibold">{getSubtotal().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-600">Versand</span>
                    <span className="font-semibold">{getShippingCost().toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-600">MwSt. (19%)</span>
                    <span className="font-semibold">{(getTotal() * 0.19).toFixed(2)} €</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Gesamt</span>
                    <span>{getTotal().toFixed(2)} €</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">inkl. MwSt.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
