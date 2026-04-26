"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const { count } = useCart();

  return (
    <header className="header" aria-label="Site header">
      <div className="container header-inner">
        <Link href="/" className="brand">Trendy Threadz</Link>
        <nav className="nav" aria-label="Main navigation">
          <Link href="/products">Products</Link>
          <Link href="/about">Our Story</Link>
          <Link href="/checkout" aria-label={`Checkout with ${count} items in cart`}>Cart ({count})</Link>
        </nav>
      </div>
    </header>
  );
}
