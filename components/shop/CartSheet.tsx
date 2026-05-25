"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCartSheet } from "@/lib/cart-sheet-context";
import type { Product } from "@/lib/types";

type Config = { shippingFreeThreshold: number; shippingFlatRate: number };
const DEFAULT_CONFIG: Config = { shippingFreeThreshold: 999, shippingFlatRate: 99 };

export function CartSheet() {
  const { isOpen, closeCart } = useCartSheet();
  const { items, subtotal, addToCart, decreaseQty, removeFromCart } = useCart();
  const [config,   setConfig]   = useState<Config>(DEFAULT_CONFIG);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch config and products once on mount
  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {});
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
  }, []);

  const shippingFee = subtotal >= config.shippingFreeThreshold ? 0 : config.shippingFlatRate;
  const total = subtotal + shippingFee;

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} aria-hidden />
      <aside className="cart-sheet" aria-label="Shopping cart">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="cart-close btn btn-ghost btn-icon" onClick={closeCart} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} strokeWidth={1} />
            <p style={{ fontWeight: 600 }}>Your cart is empty</p>
            <p style={{ fontSize: ".85rem" }}>Add something handmade and beautiful.</p>
            <button className="btn btn-primary btn-sm" onClick={closeCart}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-items">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return (
                <div key={item.id} className="cart-item" style={{ opacity: 0.5 }}>
                  <div style={{ width: 70, height: 70, background: "var(--cream-dark)", borderRadius: 8, flexShrink: 0 }} />
                  <div className="cart-item-info">
                    <p className="cart-item-name">Loading…</p>
                    <p className="cart-item-price">× {item.qty}</p>
                  </div>
                </div>
              );
              return (
                <div key={item.id} className="cart-item">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={70}
                      height={70}
                      className="cart-item-img"
                    />
                  ) : (
                    <div style={{ width: 70, height: 70, background: "var(--cream-dark)", borderRadius: 8, flexShrink: 0 }} />
                  )}
                  <div className="cart-item-info">
                    <p className="cart-item-name">{product.name}</p>
                    <p className="cart-item-price">₹{(product.price * item.qty).toLocaleString("en-IN")}</p>
                    <div className="cart-qty">
                      <button className="cart-qty-btn" onClick={() => decreaseQty(item.id)} aria-label="Decrease quantity">
                        <Minus size={12} />
                      </button>
                      <span>{item.qty}</span>
                      <button className="cart-qty-btn" onClick={() => addToCart(item.id)} aria-label="Increase quantity">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button className="cart-remove btn-icon" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? <span style={{ color: "var(--olive)" }}>Free</span> : `₹${shippingFee}`}</span>
            </div>
            <div className="cart-subtotal" style={{ fontWeight: 700 }}>
              <span>Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>
            {subtotal < config.shippingFreeThreshold && (
              <p className="cart-shipping-note">
                Add ₹{(config.shippingFreeThreshold - subtotal).toLocaleString("en-IN")} more for free shipping
              </p>
            )}
            <Link href="/checkout" className="btn btn-primary" onClick={closeCart} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              Checkout · ₹{total.toLocaleString("en-IN")}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
