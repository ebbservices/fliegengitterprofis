'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">Cookie-Einstellungen</h3>
              <p className="text-sm text-slate-600">
                Wir verwenden nur technisch notwendige Cookies für den Betrieb des Shops (Warenkorb, Anmeldung).
                Weitere Informationen finden Sie in unserer{' '}
                <Link href="/datenschutz" className="text-orange-600 underline hover:text-orange-700">
                  Datenschutzerklärung
                </Link>.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={decline}
                className="px-5 py-2.5 border-2 border-gray-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Nur notwendige
              </button>
              <button
                onClick={accept}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
