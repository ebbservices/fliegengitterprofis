'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    
    const handleStorage = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cartUpdated', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cartUpdated', handleStorage);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <Image 
              src="/images/logo.svg" 
              alt="Die Fliegengitter Profis" 
              width={100} 
              height={30}
              priority
              className="h-auto"
            />
          </Link>

          <button
            className="lg:hidden text-slate-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:gap-5 absolute lg:relative top-full left-0 right-0 bg-white/95 backdrop-blur-md lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0`}>
            <a href="#start" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Start
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#insektenschutz" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Insektenschutz
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#leistungen" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Leistungen
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#video" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Video
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#beispiele" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Beispiele
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#kundenstimmen" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Kundenstimmen
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link href="/shop" className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/shop/warenkorb" className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              <span className="flex items-center gap-2">
                Warenkorb
                {cartCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a href="#kontakt" onClick={() => setIsMenuOpen(false)} className="block mt-4 lg:mt-0 lg:ml-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105">
              Kontakt
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
