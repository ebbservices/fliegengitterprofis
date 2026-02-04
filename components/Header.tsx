'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.svg" 
              alt="Die Fliegengitter Profis" 
              width={200} 
              height={60}
              priority
            />
          </Link>

          <button
            className="lg:hidden text-[#2C2C2C] text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:gap-8 absolute lg:relative top-full left-0 right-0 bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0`}>
            <Link href="/" className="block py-2 lg:py-0 text-[#2C2C2C] hover:text-[#FF8C42] transition-colors font-medium">
              Start
            </Link>
            <Link href="/insektenschutz" className="block py-2 lg:py-0 text-[#2C2C2C] hover:text-[#FF8C42] transition-colors font-medium">
              Insektenschutz
            </Link>
            <Link href="/leistungen" className="block py-2 lg:py-0 text-[#2C2C2C] hover:text-[#FF8C42] transition-colors font-medium">
              Leistungen
            </Link>
            <Link href="/video" className="block py-2 lg:py-0 text-[#2C2C2C] hover:text-[#FF8C42] transition-colors font-medium">
              Video
            </Link>
            <Link href="/beispiele" className="block py-2 lg:py-0 text-[#2C2C2C] hover:text-[#FF8C42] transition-colors font-medium">
              Beispiele
            </Link>
            <Link href="/kundenstimmen" className="block py-2 lg:py-0 text-[#2C2C2C] hover:text-[#FF8C42] transition-colors font-medium">
              Kundenstimmen
            </Link>
            <Link href="/kontakt" className="block py-2 lg:py-0 bg-[#FF8C42] text-white px-6 py-2 rounded-full hover:bg-[#ff6b1a] transition-colors font-semibold">
              Kontakt
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
