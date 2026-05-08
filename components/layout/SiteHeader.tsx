"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useCartSheet } from "@/lib/cart-sheet-context";
import { useAuth } from "@/lib/auth-context";

type Config = { announcementBar?: string; announcementBarEnabled?: boolean };
const DEFAULT_CONFIG: Config = {
  announcementBar: "Free shipping on orders above ₹999 · Made by women artisans of India 🇮🇳",
  announcementBarEnabled: true,
};

export function SiteHeader() {
  const { count } = useCart();
  const { openCart } = useCartSheet();
  const { user, signInWithGoogle } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {/* keep defaults */});
  }, []);

  // Close menu on resize past mobile breakpoint
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 640) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {config.announcementBarEnabled && (
        <div className="announcement-bar">{config.announcementBar}</div>
      )}
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
            Trendy Threadz
          </Link>

          {/* Desktop Nav */}
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/products">Products</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/empowerment">Artisans</Link>
            <Link href="/about">Our Story</Link>
          </nav>

          <div className="header-actions">
            {/* Desktop: Sign In / Account */}
            {user ? (
              <Link href="/account" aria-label="My Account" className="cart-btn">
                <User size={18} />
              </Link>
            ) : (
              <button className="sign-in-btn" onClick={signInWithGoogle}>Sign In</button>
            )}

            {/* Cart button — always visible */}
            <button
              className="cart-btn"
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingBag size={18} />
              {count > 0 && <span className="cart-badge">{count > 9 ? "9+" : count}</span>}
            </button>

            {/* Hamburger — mobile only (shown via CSS) */}
            <button
              className="cart-btn hamburger-btn"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Panel — slides open inside the sticky header */}
        {mobileOpen && (
          <div className="mobile-nav-panel">
            <nav aria-label="Mobile navigation">
              <Link href="/products"     onClick={() => setMobileOpen(false)}>Products</Link>
              <Link href="/collections"  onClick={() => setMobileOpen(false)}>Collections</Link>
              <Link href="/empowerment"  onClick={() => setMobileOpen(false)}>Artisans</Link>
              <Link href="/about"        onClick={() => setMobileOpen(false)}>Our Story</Link>
              {user && (
                <Link href="/account" onClick={() => setMobileOpen(false)}>My Account</Link>
              )}
            </nav>
            {!user && (
              <div className="mobile-nav-footer">
                <button
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => { signInWithGoogle(); setMobileOpen(false); }}
                >
                  Sign In with Google
                </button>
                <Link
                  href="/track"
                  className="btn btn-secondary"
                  style={{ width: "100%", textAlign: "center" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Track Order
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
