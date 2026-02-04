'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export default function AddToCartModal({ isOpen, onClose, productName }: AddToCartModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Erfolgreich hinzugefügt!
          </h3>
          
          <p className="text-slate-600 mb-6">
            <strong>{productName}</strong> wurde zu Ihrem Warenkorb hinzugefügt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Weiter einkaufen
            </button>
            <Link
              href="/shop/warenkorb"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all text-center"
            >
              Zum Warenkorb
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
