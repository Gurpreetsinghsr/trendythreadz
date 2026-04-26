"use client";

import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";

export default function CheckoutPage() {
  const { items, total, removeFromCart, clearCart } = useCart();

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontFamily: "Playfair Display, serif" }}>Checkout</h1>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="grid" style={{ gap: ".8rem", marginTop: "1rem" }}>
              {items.map((item) => {
                const p = products.find((x) => x.id === item.id);
                if (!p) return null;
                return (
                  <div key={item.id} className="card" style={{ padding: "1rem" }}>
                    <p><strong>{p.name}</strong> × {item.qty}</p>
                    <p className="price">${(p.price * item.qty).toFixed(2)}</p>
                    <button className="btn btn-secondary" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                );
              })}
            </div>
            <h2>Total: ${total.toFixed(2)}</h2>
            <button className="btn btn-primary" onClick={clearCart}>Place Order</button>
          </>
        )}
      </div>
    </section>
  );
}
