"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { CartItem } from "./types";
import { seedProducts } from "./seed-data";

type CartState = { items: CartItem[] };

type CartAction =
  | { type: "ADD"; id: string }
  | { type: "DECREASE"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };
    case "ADD": {
      const exists = state.items.find((x) => x.id === action.id);
      if (exists) {
        return { items: state.items.map((x) => x.id === action.id ? { ...x, qty: x.qty + 1 } : x) };
      }
      return { items: [...state.items, { id: action.id, qty: 1 }] };
    }
    case "DECREASE":
      return {
        items: state.items.flatMap((x) => {
          if (x.id !== action.id) return [x];
          return x.qty === 1 ? [] : [{ ...x, qty: x.qty - 1 }];
        }),
      };
    case "REMOVE":
      return { items: state.items.filter((x) => x.id !== action.id) };
    case "CLEAR":
      return { items: [] };
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addToCart: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "trendythreadz-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    const subtotal = state.items.reduce((s, i) => {
      const p = seedProducts.find((x) => x.id === i.id);
      return s + (p ? p.price * i.qty : 0);
    }, 0);
    return {
      items: state.items,
      count,
      subtotal,
      addToCart: (id) => dispatch({ type: "ADD", id }),
      decreaseQty: (id) => dispatch({ type: "DECREASE", id }),
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
