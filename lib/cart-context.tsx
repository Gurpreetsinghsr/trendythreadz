"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "./products";

type CartItem = { id: string; qty: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("trendythreadz-cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("trendythreadz-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const total = items.reduce((sum, i) => {
      const p = products.find((prod) => prod.id === i.id);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);

    return {
      items,
      addToCart: (id: string) => {
        setItems((prev) => {
          const exists = prev.find((x) => x.id === id);
          if (exists) return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x));
          return [...prev, { id, qty: 1 }];
        });
      },
      decreaseQty: (id: string) => {
        setItems((prev) => prev.flatMap((x) => {
          if (x.id !== id) return [x];
          if (x.qty === 1) return [];
          return [{ ...x, qty: x.qty - 1 }];
        }));
      },
      removeFromCart: (id: string) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      },
      clearCart: () => setItems([]),
      count,
      total
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
