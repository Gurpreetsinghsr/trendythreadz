import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { CartSheetProvider } from "@/lib/cart-sheet-context";
import { AuthProvider } from "@/lib/auth-context";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartSheet } from "@/components/shop/CartSheet";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: { default: "Trendy Threadz | Handmade Crochet with Impact", template: "%s | Trendy Threadz" },
  description: "Premium handmade crochet products by rural Indian women artisans. Every stitch supports a sister's dream.",
  keywords: ["crochet", "handmade", "Indian artisans", "women empowerment", "sustainable", "home decor"],
  openGraph: {
    siteName: "Trendy Threadz",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <CartSheetProvider>
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
              <CartSheet />
              <Toaster position="bottom-right" />
            </CartSheetProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
