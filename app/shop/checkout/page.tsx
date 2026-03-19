'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/lib/hooks/use-cart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config';

type Step = 'address' | 'payment' | 'review';

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

interface ShippingConfig {
  shipping_cost_cents: number;
  free_shipping_threshold_cents: number | null;
  delivery_days_min: number;
  delivery_days_max: number;
}

interface AvailableCountry {
  iso_2: string;
  display_name: string;
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

const defaultShippingConfig: ShippingConfig = {
  shipping_cost_cents: 590,
  free_shipping_threshold_cents: null,
  delivery_days_min: 10,
  delivery_days_max: 14,
};

function AddressField({
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
}) {
  return (
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
}

const COUNTRY_NAMES: Record<string, string> = {
  de: 'Deutschland',
  at: 'Österreich',
  fr: 'Frankreich',
  nl: 'Niederlande',
  be: 'Belgien',
  it: 'Italien',
  es: 'Spanien',
  pl: 'Polen',
  cz: 'Tschechien',
  dk: 'Dänemark',
  se: 'Schweden',
  lu: 'Luxemburg',
  ch: 'Schweiz',
  pt: 'Portugal',
  ie: 'Irland',
  fi: 'Finnland',
  gr: 'Griechenland',
  hu: 'Ungarn',
  hr: 'Kroatien',
  si: 'Slowenien',
  sk: 'Slowakei',
  ro: 'Rumänien',
  bg: 'Bulgarien',
  ee: 'Estland',
  lv: 'Lettland',
  lt: 'Litauen',
  mt: 'Malta',
  cy: 'Zypern',
};

export default function CheckoutPage() {
  const { localCart, clearCart, cartCount } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState<Address>(emptyAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(defaultShippingConfig);
  const [availableCountries, setAvailableCountries] = useState<AvailableCountry[]>([
    { iso_2: 'de', display_name: 'Deutschland' },
  ]);

  const fetchShippingConfig = useCallback(async (countryCode: string) => {
    try {
      const headers: Record<string, string> = {};
      if (MEDUSA_PUBLISHABLE_KEY) {
        headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
      }
      const res = await fetch(
        `${MEDUSA_BACKEND_URL}/store/shipping-config?country_code=${countryCode}`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setShippingConfig({
          shipping_cost_cents: data.shipping_cost_cents,
          free_shipping_threshold_cents: data.free_shipping_threshold_cents,
          delivery_days_min: data.delivery_days_min,
          delivery_days_max: data.delivery_days_max,
        });
        if (data.available_countries?.length) {
          setAvailableCountries(
            data.available_countries.map((c: any) => ({
              iso_2: c.iso_2,
              display_name: COUNTRY_NAMES[c.iso_2] || c.display_name || c.iso_2.toUpperCase(),
            }))
          );
        }
      }
    } catch {
      // Fallback auf Standardwerte
    }
  }, []);

  useEffect(() => {
    fetchShippingConfig(billingAddress.country_code);
  }, [fetchShippingConfig, billingAddress.country_code]);

  const getSubtotal = () => {
    return localCart.reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    const thresholdEur = shippingConfig.free_shipping_threshold_cents
      ? shippingConfig.free_shipping_threshold_cents / 100
      : null;

    if (thresholdEur !== null && subtotal >= thresholdEur) {
      return 0;
    }
    return shippingConfig.shipping_cost_cents / 100;
  };

  const getTotal = () => getSubtotal() + getShippingCost();

  const isFreeShipping = () => getShippingCost() === 0;

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
    { key: 'payment', label: 'Zahlung', number: 2 },
    { key: 'review', label: 'Übersicht', number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = async () => {
    if (!acceptedTerms) {
      setError('Bitte akzeptieren Sie die AGB und Datenschutzerklärung.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (MEDUSA_PUBLISHABLE_KEY) {
        headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
      }

      const orderItems = localCart.map((item) => {
        const selections: Record<string, string> = {};
        for (const [key, value] of Object.entries(item)) {
          if (!['product', 'height', 'width', 'price', 'Bezeichnung'].includes(key) && value !== undefined && value !== '') {
            selections[key] = String(value);
          }
        }
        return {
          product: item.product,
          bezeichnung: item.Bezeichnung ? String(item.Bezeichnung) : undefined,
          height: item.height,
          width: item.width,
          price: item.price,
          selections,
        };
      });

      const res = await fetch(`${MEDUSA_BACKEND_URL}/store/place-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          billing_address: billingAddress,
          items: orderItems,
          shipping_cost_cents: Math.round(getShippingCost() * 100),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Bestellung fehlgeschlagen');
      }

      await clearCart();
      router.push('/shop/checkout/danke');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bestellung konnte nicht aufgegeben werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Land</label>
                    <select
                      value={billingAddress.country_code}
                      onChange={(e) => setBillingAddress({ ...billingAddress, country_code: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none bg-white"
                    >
                      {availableCountries
                        .sort((a, b) => a.display_name.localeCompare(b.display_name, 'de'))
                        .map((country) => (
                          <option key={country.iso_2} value={country.iso_2}>
                            {country.display_name}
                          </option>
                        ))}
                    </select>
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
                    setStep('payment');
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  Weiter zur Zahlung
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
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
                  <button onClick={() => setStep('address')} className="flex-1 border-2 border-gray-300 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all">
                    Zurück
                  </button>
                  <button onClick={() => setStep('review')} className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all">
                    Weiter zur Übersicht
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
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
                        <p>{COUNTRY_NAMES[billingAddress.country_code] || billingAddress.country_code.toUpperCase()}</p>
                        <p>{email}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Versand & Zahlung</h3>
                      <div className="text-sm text-slate-600">
                        <p>Lieferzeit: {shippingConfig.delivery_days_min}–{shippingConfig.delivery_days_max} Werktage</p>
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
                          {item.Bezeichnung && (
                            <p className="text-sm text-orange-600">{String(item.Bezeichnung)}</p>
                          )}
                          <p className="text-sm text-slate-600">{item.height} × {item.width} mm</p>
                          {Object.entries(item)
                            .filter(([key]) => !['product', 'height', 'width', 'price', 'Bezeichnung'].includes(key))
                            .filter(([, value]) => value !== undefined && value !== '')
                            .map(([key, value]) => (
                              <p key={key} className="text-sm text-slate-600">{key}: {String(value)}</p>
                            ))}
                        </div>
                        <p className="font-bold text-slate-900">{item.price} €</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <span className="text-sm text-slate-700">
                      Ich habe die{' '}
                      <Link href="/datenschutz" target="_blank" className="text-orange-600 underline hover:text-orange-700">
                        Datenschutzerklärung
                      </Link>{' '}
                      zur Kenntnis genommen und stimme den Allgemeinen Geschäftsbedingungen zu.
                      Mit Klick auf &bdquo;Kostenpflichtig bestellen&ldquo; bestätige ich meinen Kauf. *
                    </span>
                  </label>
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
                    disabled={isSubmitting || !acceptedTerms}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="truncate mr-2">
                      <span className="text-slate-600">{item.product}</span>
                      {item.Bezeichnung && (
                        <p className="text-xs text-slate-400">{String(item.Bezeichnung)}</p>
                      )}
                    </div>
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
                    <span className={`font-semibold ${isFreeShipping() ? 'text-green-600' : ''}`}>
                      {isFreeShipping() ? 'Kostenlos' : `${getShippingCost().toFixed(2)} €`}
                    </span>
                  </div>
                  {shippingConfig.free_shipping_threshold_cents && !isFreeShipping() && (
                    <p className="text-xs text-green-600 mt-1">
                      Ab {(shippingConfig.free_shipping_threshold_cents / 100).toFixed(2)} € versandkostenfrei
                    </p>
                  )}
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

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">
                      Lieferzeit: {shippingConfig.delivery_days_min}–{shippingConfig.delivery_days_max} Werktage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
