"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { products } from "@/lib/products";

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const { items, total, addToCart, decreaseQty, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [address, setAddress] = useState({ fullName: "", email: "", city: "", pin: "" });
  const [paid, setPaid] = useState(false);

  const cartRows = useMemo(() => items.map((item) => ({ item, product: products.find((x) => x.id === item.id) })).filter((x) => x.product), [items]);

  const canContinue = address.fullName && address.email && address.city && address.pin;

  if (paid) {
    return (
      <section className="section">
        <div className="container">
          <h1 style={{ fontFamily: "Playfair Display, serif" }}>Order Confirmed ✅</h1>
          <p>Thank you for supporting women artisans. Your order is being prepared.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontFamily: "Playfair Display, serif" }}>Checkout</h1>
        <p>Step {step} of 3</p>

        {step === 1 && (
          <>
            {items.length === 0 ? <p>Your cart is empty.</p> : (
              <div className="grid" style={{ gap: ".8rem", marginTop: "1rem" }}>
                {cartRows.map(({ item, product }) => (
                  <div key={item.id} className="card" style={{ padding: "1rem" }}>
                    <p><strong>{product!.name}</strong></p>
                    <p className="price">${(product!.price * item.qty).toFixed(2)}</p>
                    <div style={{ display: "flex", gap: ".5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <button className="btn btn-secondary" onClick={() => decreaseQty(item.id)}>-</button>
                      <span>Qty: {item.qty}</span>
                      <button className="btn btn-secondary" onClick={() => addToCart(item.id)}>+</button>
                      <button className="btn btn-secondary" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <h2>Total: ${total.toFixed(2)}</h2>
            <button className="btn btn-primary" onClick={() => setStep(2)} disabled={items.length === 0}>Continue</button>
          </>
        )}

        {step === 2 && (
          <div className="grid" style={{ maxWidth: 550 }}>
            <input placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
            <input placeholder="Email" type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
            <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            <input placeholder="PIN Code" value={address.pin} onChange={(e) => setAddress({ ...address, pin: e.target.value })} />
            <div style={{ display: "flex", gap: ".6rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" disabled={!canContinue} onClick={() => setStep(3)}>Continue to Payment</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid" style={{ maxWidth: 550 }}>
            <p>Secure Payment (demo): ending card **** 4242</p>
            <div style={{ display: "flex", gap: ".6rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" onClick={() => { clearCart(); setPaid(true); }}>Pay ${total.toFixed(2)}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
