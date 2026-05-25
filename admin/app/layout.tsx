import type { Metadata } from "next";
import "./globals.css";
import { AdminAuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin — Trendy Threadz", template: "%s | Admin" },
  description: "Trendy Threadz Admin Panel",
  robots: "noindex,nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminAuthProvider>
          {children}
        </AdminAuthProvider>
      </body>
    </html>
  );
}
