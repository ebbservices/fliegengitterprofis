'use client';

import Link from 'next/link';

export default function DankePage() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Vielen Dank für Ihre Bestellung!
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            Ihre Bestellung wurde erfolgreich aufgegeben. Sie erhalten in Kürze eine Bestätigung per E-Mail mit unseren Bankdaten für die Überweisung.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-left">
            <h2 className="font-semibold text-blue-900 mb-2">Nächste Schritte:</h2>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Prüfen Sie Ihre E-Mail-Adresse für die Bestellbestätigung</li>
              <li>Überweisen Sie den Betrag mit der angegebenen Referenznummer</li>
              <li>Nach Zahlungseingang beginnen wir mit der Fertigung</li>
              <li>Sie erhalten eine Versandbenachrichtigung per E-Mail</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
            >
              Weiter einkaufen
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
