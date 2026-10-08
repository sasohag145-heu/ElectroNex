import type { Metadata } from "next";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "ElectroNex — Electronics, Gadgets & Accessories in Bangladesh", template: "%s | ElectroNex" },
  description: "Buy earbuds, headphones, smart watches, speakers, chargers and power banks in Bangladesh. Cash on delivery.",
  openGraph: { siteName: "ElectroNex", type: "website", locale: "en_BD" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><CartProvider><Header />{children}<Footer /></CartProvider></body>
    </html>
  );
}
