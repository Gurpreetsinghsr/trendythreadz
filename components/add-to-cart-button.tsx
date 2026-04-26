"use client";

import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ id, name }: { id: string; name: string }) {
  const { addToCart } = useCart();

  return (
    <button className="btn btn-primary" onClick={() => addToCart(id)} aria-label={`Add ${name} to cart`}>
      Add to Cart
    </button>
  );
}
