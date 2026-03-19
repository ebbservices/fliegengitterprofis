'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/use-auth';

export default function KontoDashboard() {
  const { customer, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-slate-600">Lädt...</p>
        </div>
      </section>
    );
  }

  if (!customer) {
    return null; // Layout leitet zum Login um
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Mein Konto
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Profil */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Profil</h2>
                <p className="text-sm text-slate-600">Ihre persönlichen Daten</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
              <p><strong>E-Mail:</strong> {customer.email}</p>
            </div>
          </div>

          {/* Bestellungen */}
          <Link href="/konto/bestellungen" className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Bestellungen</h2>
                <p className="text-sm text-slate-600">Ihre Bestellhistorie einsehen</p>
              </div>
            </div>
            <p className="text-sm text-orange-600 font-semibold">Alle Bestellungen anzeigen &rarr;</p>
          </Link>
        </div>

        {/* Schnell-Links */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Schnellzugriff</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Zum Shop
            </Link>
            <Link
              href="/shop/warenkorb"
              className="inline-flex items-center gap-2 bg-white border-2 border-orange-500 text-orange-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-all"
            >
              Warenkorb
            </Link>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Abmelden
        </button>
      </div>
    </section>
  );
}
