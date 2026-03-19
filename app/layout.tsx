import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/cart-context";
import { AuthProvider } from "@/lib/context/auth-context";
import CookieConsent from "@/components/CookieConsent";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Die Fliegengitter Profis OHG Pulheim · Insektenschutz & Fliegengitter",
  description: "Insektenschutzgitter und mehr!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${openSans.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CookieConsent />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
