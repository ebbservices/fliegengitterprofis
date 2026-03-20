'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MEDUSA_BACKEND_URL, MEDUSA_PUBLISHABLE_KEY } from '@/lib/config';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacy: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Bitte geben Sie Ihren Namen ein.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Bitte geben Sie eine Nachricht ein.');
      return;
    }
    if (!formData.privacy) {
      setErrorMessage('Bitte akzeptieren Sie die Datenschutzbestimmungen.');
      return;
    }

    setStatus('submitting');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (MEDUSA_PUBLISHABLE_KEY) {
        headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
      }

      const res = await fetch(`${MEDUSA_BACKEND_URL}/store/contact`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Anfrage fehlgeschlagen');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '', privacy: false });
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.'
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#F5F5F5] p-8 rounded-lg">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-2xl font-bold text-[#2C2C2C] mb-3">Vielen Dank!</h4>
          <p className="text-[#6B6B6B]">
            Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 text-[#FF8C42] hover:underline font-medium"
          >
            Neue Anfrage senden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] p-8 rounded-lg">
      <h4 className="text-2xl font-bold text-[#2C2C2C] mb-6 text-center">
        Projektanfrage
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Ihr Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
          />
          <input
            type="email"
            placeholder="Ihre E-Mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
          />
        </div>
        <input
          type="tel"
          placeholder="Ihre Telefonnummer"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
        />
        <textarea
          placeholder="Ihre Nachricht"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#FF8C42] focus:outline-none"
        ></textarea>
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="privacy"
            checked={formData.privacy}
            onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
            className="mt-1"
          />
          <label htmlFor="privacy" className="text-sm text-[#6B6B6B]">
            Ich habe die <Link href="/datenschutz" className="text-[#FF8C42] hover:underline">Datenschutzbestimmungen</Link> gelesen und akzeptiert.
          </label>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-[#FF8C42] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#ff6b1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Wird gesendet...' : 'Anfrage senden'}
        </button>
      </form>
    </div>
  );
}
