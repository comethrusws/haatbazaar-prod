import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/components/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Haatbazaar: Expect More. Pay Less",
  description: "Premium Marketplace: Expect more. Pay Less",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className}>
            <Header />
            <main className="min-h-screen container-main py-4">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
