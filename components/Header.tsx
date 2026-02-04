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

          <ul className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } lg:flex flex-col lg:flex-row absolute lg:relative top-full left-0 right-0 bg-white lg:bg-transparent shadow-md lg:shadow-none gap-4 lg:gap-8 p-4 lg:p-0`}>
            <li>
              <Link href="#start" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Start
              </Link>
            </li>
            <li>
              <Link href="#insektenschutz" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Insektenschutz
              </Link>
            </li>
            <li>
              <Link href="#leistungen" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Leistungen
              </Link>
            </li>
            <li>
              <Link href="#video" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Video
              </Link>
            </li>
            <li>
              <Link href="#beispiele" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Beispiele
              </Link>
            </li>
            <li>
              <Link href="#kundenstimmen" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Kundenstimmen
              </Link>
            </li>
            <li>
              <Link href="#kontakt" className="text-[#2C2C2C] hover:text-[#FF8C42] transition-colors">
                Kontakt
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
