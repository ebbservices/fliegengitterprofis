'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_PATHS = ['/konto/login', '/konto/registrieren'];

export default function KontoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, backendAvailable } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (isLoading) return;

    // Wenn Backend nicht erreichbar, zeige trotzdem die Seite
    if (!backendAvailable) return;

    // Eingeloggt + auf Login/Register → zum Dashboard
    if (isAuthenticated && isPublicPath) {
      router.replace('/konto');
      return;
    }

    // Nicht eingeloggt + auf geschützter Seite → zum Login
    if (!isAuthenticated && !isPublicPath) {
      router.replace('/konto/login');
    }
  }, [isAuthenticated, isLoading, isPublicPath, backendAvailable, router]);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}
