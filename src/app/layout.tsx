import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AppFrame from "@/components/Layout/AppFrame";

export const metadata: Metadata = {
  title: "Underworld",
  description: "Crafted by Den",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <CartProvider>
          <AppFrame>{children}</AppFrame>
        </CartProvider>
      </body>
    </html>
  );
}
