"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Package, Truck, CheckCircle, Clock, MapPin, Loader2 } from "lucide-react";
import type { Order } from "@/lib/types";

const STEPS = [
  { key: "confirmed",  label: "Confirmed",   icon: CheckCircle },
  { key: "processing", label: "Processing",  icon: Package },
  { key: "shipped",    label: "Shipped",     icon: Truck },
  { key: "delivered",  label: "Delivered",   icon: MapPin },
];

const STATUS_STEP: Record<string, number> = {
  pending: 0, confirmed: 0, processing: 1, shipped: 2, delivered: 3,
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId,  setOrderId]  = useState(searchParams.get("order") ?? "");
  const [loading,  setLoading]  = useState(false);
  const [order,    setOrder]    = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true); setNotFound(false); setOrder(null);
    try {
      const res = await fetch(`/api/orders/by-number?number=${encodeURIComponent(orderId.trim())}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      setOrder(data.order);
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  }

  // Auto-search if URL has ?order=
  useEffect(() => {
    if (searchParams.get("order")) handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doneIdx = order ? STATUS_STEP[order.status] ?? 0 : -1;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 600 }}>
        <p className="section-eyebrow">Order Status</p>
        <h1 style={{ marginBottom: ".6rem" }}>Track Your Order</h1>
        <p style={{ color: "var(--brown-light)", marginBottom: "2rem" }}>
          Enter the order number from your confirmation email.
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: ".6rem", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="e.g. TT-20240115-1234"
            value={orderId}
            onChange={(e) => { setOrderId(e.target.value); setOrder(null); setNotFound(false); }}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={!orderId.trim() || loading}>
            {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : "Track"}
          </button>
        </form>

        {notFound && (
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", textAlign: "center" }}>
            <p style={{ fontWeight: 600, marginBottom: ".4rem" }}>Order not found</p>
            <p style={{ fontSize: ".88rem", color: "var(--taupe)" }}>Please check your order number and try again.</p>
          </div>
        )}

        {order && (
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: ".5rem" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>Order {order.orderNumber}</p>
                <p style={{ fontSize: ".82rem", color: "var(--taupe)" }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <span className={`badge ${order.status === "delivered" ? "badge-green" : order.status === "cancelled" ? "badge-terracotta" : "badge-gold"}`}>
                <Clock size={10} /> {STATUS_LABEL[order.status] ?? order.status}
              </span>
            </div>

            {order.status !== "cancelled" && (
              <div className="tracking-stepper">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className={`tracking-step ${i <= doneIdx ? "done" : ""} ${i === doneIdx + 1 ? "active" : ""}`}>
                      <div className="tracking-icon"><Icon size={16} /></div>
                      <span className="tracking-step-label">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {order.trackingNumber && (
              <div style={{ background: "var(--cream-dark)", borderRadius: 10, padding: "1rem", marginTop: "1rem", fontSize: ".88rem" }}>
                <p style={{ fontWeight: 600, marginBottom: ".3rem" }}>Tracking Number</p>
                <p style={{ color: "var(--brown-light)", fontFamily: "monospace" }}>{order.trackingNumber}</p>
              </div>
            )}

            <div style={{ marginTop: "1.2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <p style={{ fontWeight: 600, fontSize: ".88rem", marginBottom: ".6rem" }}>Items Ordered</p>
              {order.items.map((item) => (
                <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", padding: ".25rem 0" }}>
                  <span style={{ color: "var(--brown-light)" }}>{item.name} × {item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid var(--border)", marginTop: ".5rem", paddingTop: ".5rem" }}>
                <span>Total</span><span style={{ color: "var(--olive)" }}>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {!order && !notFound && !loading && (
          <p style={{ fontSize: ".85rem", color: "var(--taupe)", textAlign: "center" }}>
            Find your order number in your confirmation email.
          </p>
        )}
      </div>
    </section>
  );
}
