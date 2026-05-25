"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import type { Product } from "@/lib/types";

type Step = 1 | 2 | 3;
type Address = {
  fullName: string; email: string; phone: string;
  line1: string; line2: string; city: string; state: string; pinCode: string;
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Puducherry",
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step,       setStep]       = useState<Step>(1);
  const [address,    setAddress]    = useState<Address>({ fullName: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pinCode: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; orderNumber: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [shippingFreeThreshold, setShippingFreeThreshold] = useState(999);
  const [shippingFlatRate,      setShippingFlatRate]      = useState(99);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts).catch(() => {});
    fetch("/api/site-config").then((r) => r.json()).then((cfg) => {
      if (cfg.shippingFreeThreshold) setShippingFreeThreshold(cfg.shippingFreeThreshold);
      if (cfg.shippingFlatRate)      setShippingFlatRate(cfg.shippingFlatRate);
    }).catch(() => {});
  }, []);

  const shippingFee = subtotal >= shippingFreeThreshold ? 0 : shippingFlatRate;
  const total = subtotal + shippingFee;

  const cartRows = useMemo(() =>
    items.map((item) => ({ item, product: products.find((x) => x.id === item.id) })).filter((x) => x.product),
    [items, products]
  );

  const addressValid = address.fullName && address.email && address.phone && address.line1 && address.city && address.state && address.pinCode;

  async function handlePay() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: address.email,
          userId: user?.uid,
          items: cartRows.map(({ item, product }) => ({
            productId: item.id, name: product!.name,
            price: product!.price, qty: item.qty, image: product!.images[0],
          })),
          shippingAddress: address,
          subtotal, shippingFee, total,
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      const { order } = await res.json();

      const rzpRes = await fetch("/api/razorpay/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, orderId: order.id }),
      });
      const rzpOrder = await rzpRes.json();

      // Demo mode — skip real Razorpay
      await fetch("/api/razorpay/verify-payment", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, razorpayOrderId: rzpOrder.id, razorpayPaymentId: "demo", razorpaySignature: "demo" }),
      });
      clearCart();
      setConfirmedOrder({ id: order.id, orderNumber: order.orderNumber });
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function Field({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string }) {
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={id}>{label}</label>
        <input id={id} {...props} value={(props.value as string) ?? ""} onChange={props.onChange} />
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "var(--olive)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <Check size={32} color="white" />
          </div>
          <h1 style={{ marginBottom: ".5rem" }}>Order Confirmed!</h1>
          <p style={{ color: "var(--brown-light)", marginBottom: ".5rem" }}>
            Thank you for supporting India&apos;s women artisans. Your order is being prepared with love.
          </p>
          <p style={{ color: "var(--taupe)", fontSize: ".88rem", marginBottom: "1.5rem" }}>
            Order: <strong style={{ color: "var(--brown)" }}>{confirmedOrder.orderNumber}</strong>
          </p>
          <div style={{ display: "flex", gap: ".8rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
            <Link href={`/track?order=${confirmedOrder.orderNumber}`} className="btn btn-secondary">Track Order</Link>
          </div>
        </div>
      </section>
    );
  }

  const STEPS = [
    { n: 1, label: "Cart" },
    { n: 2, label: "Shipping" },
    { n: 3, label: "Payment" },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Checkout</h1>

        {/* Step indicator */}
        <div className="checkout-steps" style={{ marginBottom: "2.5rem" }}>
          {STEPS.map((s, i) => (
            <>
              <div key={s.n} className={`checkout-step-item ${step === s.n ? "active" : step > s.n ? "done" : ""}`}>
                <div className="checkout-step-num">
                  {step > s.n ? <Check size={14} /> : s.n}
                </div>
                <span className="checkout-step-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`checkout-divider ${step > s.n ? "done" : ""}`} key={`div-${s.n}`} />}
            </>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left panel */}
          <div>
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <div>
                <h2 style={{ marginBottom: "1rem" }}>Review Your Cart</h2>
                {items.length === 0 ? (
                  <div className="empty-state">
                    <p>Your cart is empty.</p>
                    <Link href="/products" className="btn btn-primary btn-sm">Continue Shopping</Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                    {cartRows.map(({ item, product }) => (
                      <div key={item.id} style={{ display: "flex", gap: "1rem", background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem" }}>
                        <Image src={product!.images[0]} alt={product!.name} width={72} height={72} style={{ objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600 }}>{product!.name}</p>
                          <p style={{ fontSize: ".82rem", color: "var(--taupe)" }}>{product!.category}</p>
                          <p style={{ color: "var(--olive)", fontWeight: 700 }}>₹{(product!.price * item.qty).toLocaleString("en-IN")}</p>
                        </div>
                        <span style={{ color: "var(--taupe)", fontSize: ".88rem", alignSelf: "center" }}>× {item.qty}</span>
                      </div>
                    ))}
                    <button className="btn btn-primary" onClick={() => setStep(2)} style={{ marginTop: ".5rem" }}>
                      Continue to Shipping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div>
                <h2 style={{ marginBottom: "1rem" }}>Shipping Address</h2>
                <div className="form-grid">
                  <Field label="Full Name *" id="fullName" placeholder="Your full name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                  <div className="form-row">
                    <Field label="Email *" id="email" type="email" placeholder="you@example.com" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                    <Field label="Phone *" id="phone" type="tel" placeholder="+91 98765 43210" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                  </div>
                  <Field label="Address Line 1 *" id="line1" placeholder="House/flat number, street" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                  <Field label="Address Line 2" id="line2" placeholder="Landmark, area (optional)" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
                  <div className="form-row">
                    <Field label="City *" id="city" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    <Field label="PIN Code *" id="pinCode" placeholder="400001" value={address.pinCode} onChange={(e) => setAddress({ ...address, pinCode: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="state">State *</label>
                    <select id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}>
                      <option value="">Select state…</option>
                      {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: ".8rem" }}>
                    <button className="btn btn-secondary" onClick={() => setStep(1)}><ChevronLeft size={16} /> Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!addressValid} style={{ flex: 1 }}>
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <h2 style={{ marginBottom: "1rem" }}>Payment</h2>
                <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: "1rem" }}>
                  <p style={{ fontSize: ".9rem", color: "var(--brown-light)", marginBottom: "1rem" }}>
                    🔒 Secure payment powered by Razorpay — UPI, cards, net banking and wallets accepted.
                  </p>
                  <div style={{ background: "var(--cream-dark)", borderRadius: 10, padding: "1rem", fontSize: ".88rem", color: "var(--taupe)", textAlign: "center" }}>
                    <p style={{ fontWeight: 600, color: "var(--brown-light)" }}>Demo Mode Active</p>
                    <p>Razorpay will be live with your API keys. Click Pay to simulate a successful order.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: ".8rem" }}>
                  <button className="btn btn-secondary" onClick={() => setStep(2)} disabled={submitting}><ChevronLeft size={16} /> Back</button>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: "1rem" }} onClick={handlePay} disabled={submitting}>
                    {submitting
                      ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Processing…</>
                      : `Pay ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="checkout-order-summary">
            <h3 style={{ marginBottom: "1rem" }}>Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1rem" }}>
              {cartRows.map(({ item, product }) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
                  <span style={{ color: "var(--brown-light)" }}>{product!.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600 }}>₹{(product!.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: ".8rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
                <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
                <span>Shipping</span>
                <span style={{ color: shippingFee === 0 ? "var(--olive)" : "inherit" }}>
                  {shippingFee === 0 ? "Free" : `₹${shippingFee}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem", marginTop: ".4rem" }}>
                <span>Total</span><span style={{ color: "var(--olive)" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
