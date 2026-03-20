'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config';

function VerifizierenContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Kein Bestätigungstoken gefunden.');
      return;
    }

    async function verify() {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (MEDUSA_PUBLISHABLE_KEY) {
          headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
        }

        const res = await fetch(`${MEDUSA_BACKEND_URL}/store/verify-email`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Verifizierung fehlgeschlagen');
        }

        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Der Bestätigungslink ist ungültig oder abgelaufen.'
        );
      }
    }

    verify();
  }, [token]);

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">E-Mail wird bestätigt...</h1>
              <p className="text-slate-600">Bitte warten Sie einen Moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-4">E-Mail bestätigt!</h1>
              <p className="text-slate-600 mb-8">
                Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können sich jetzt anmelden.
              </p>
              <Link
                href="/konto/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Zum Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Bestätigung fehlgeschlagen</h1>
              <p className="text-slate-600 mb-8">{errorMessage}</p>
              <Link
                href="/konto/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Zum Login
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function VerifizierenPage() {
  return (
    <Suspense fallback={
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-md text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    }>
      <VerifizierenContent />
    </Suspense>
  );
}
