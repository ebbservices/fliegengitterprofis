import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Die Fliegengitter Profis"
              width={90}
              height={27}
              priority
              className="h-auto"
            />
          </Link>
          <Link
            href="/shop/warenkorb"
            className="text-sm text-slate-600 hover:text-orange-600 transition-colors"
          >
            Zurück zum Warenkorb
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
