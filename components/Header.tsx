'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/lib/hooks/use-cart';
import { useAuth } from '@/lib/hooks/use-auth';

const SHOP_CATEGORIES = [
  { name: 'Fliegengitter', href: '/shop/fliegengitter' },
  { name: 'Plissee', href: '/shop/plissee' },
  { name: 'Lichtschachtabdeckungen', href: '/shop/lichtschacht' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAuthenticated, customer } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <Image 
              src="/images/logo.svg" 
              alt="Die Fliegengitter Profis" 
              width={90} 
              height={27}
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

          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:gap-3 absolute lg:relative top-full left-0 right-0 bg-white/95 backdrop-blur-md lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0`}>
            <a href="/#start" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Start
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#insektenschutz" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Insektenschutz
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#leistungen" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Leistungen
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#video" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Video
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#beispiele" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Beispiele
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="/#kundenstimmen" onClick={() => setIsMenuOpen(false)} className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative group">
              Kundenstimmen
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            {/* Desktop: Hover-Dropdown */}
            <div className="hidden lg:block relative group/shop">
              <Link href="/shop" className="flex items-center gap-1 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm relative">
                Shop
                <svg className="w-3.5 h-3.5 transition-transform group-hover/shop:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="invisible group-hover/shop:visible opacity-0 group-hover/shop:opacity-100 transition-all duration-200 absolute top-full left-0 pt-2 z-50">
                <div className="bg-white shadow-xl rounded-xl py-2 min-w-[220px] border border-gray-100">
                  {SHOP_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Mobile: Toggle Sub-Items */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between">
                <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="block py-3 text-slate-700 hover:text-orange-500 transition-all font-medium text-sm">
                  Shop
                </Link>
                <button
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  className="p-2 text-slate-500 hover:text-orange-500 transition-colors"
                  aria-label="Kategorien anzeigen"
                >
                  <svg className={`w-4 h-4 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {isShopOpen && (
                <div className="pl-4 pb-2 space-y-1">
                  {SHOP_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => { setIsMenuOpen(false); setIsShopOpen(false); }}
                      className="block py-2 text-sm text-slate-600 hover:text-orange-500 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/konto" className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all relative group" title={isAuthenticated ? 'Mein Konto' : 'Anmelden'}>
              <span className="flex items-center gap-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="lg:hidden text-sm font-medium">
                  {isAuthenticated ? (customer?.first_name || 'Konto') : 'Anmelden'}
                </span>
              </span>
            </Link>
            <Link href="/shop/warenkorb" className="block py-3 lg:py-0 text-slate-700 hover:text-orange-500 transition-all relative group" title="Warenkorb">
              <span className="flex items-center gap-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
            <a href="/#kontakt" onClick={() => setIsMenuOpen(false)} className="block mt-4 lg:mt-0 lg:ml-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105">
              Kontakt
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
