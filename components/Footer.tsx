import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#2C2C2C] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FF8C42]">Kontakt</h3>
            <p className="text-sm mb-2">G&K Die Fliegengitter Profis OHG</p>
            <p className="text-sm mb-2">Wedaustraße 35</p>
            <p className="text-sm mb-4">41540 Dormagen</p>
            <p className="text-sm mb-2">
              <a href="tel:+4915737952490" className="hover:text-[#FF8C42] transition-colors">
                Tel: 01573 7952490
              </a>
            </p>
            <p className="text-sm">
              <a href="mailto:info@diefliegengitterprofis.de" className="hover:text-[#FF8C42] transition-colors">
                info@diefliegengitterprofis.de
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FF8C42]">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-sm hover:text-[#FF8C42] transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm hover:text-[#FF8C42] transition-colors">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-[#FF8C42]">Folgen Sie uns</h3>
            <div className="flex gap-4 mb-6">
              <a 
                href="https://www.instagram.com/diefliegengitterprofis/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image 
                  src="/images/instagram.svg" 
                  alt="Instagram" 
                  width={32} 
                  height={32}
                  className="brightness-0 invert"
                />
              </a>
              <a 
                href="https://www.tiktok.com/@diefliegengitterprofis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image 
                  src="/images/tiktok.svg" 
                  alt="TikTok" 
                  width={32} 
                  height={32}
                  className="brightness-0 invert"
                />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm mb-2">Webdesign & Programmierung:</p>
              <Link 
                href="https://www.mobatix.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity inline-block"
              >
                <Image 
                  src="/mobatix.png" 
                  alt="Mobatix Logo" 
                  width={120} 
                  height={36}
                  className="brightness-0 invert"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Die Fliegengitter Profis OHG. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
