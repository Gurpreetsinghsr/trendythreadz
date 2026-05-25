"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Truck, CheckCircle, Package, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getOrderDoc, updateOrder } from "@/lib/db";
import type { Order } from "@/lib/types";

const PIPELINE: { status: Order["status"]; label: string; icon: React.FC<{size:number}> }[] = [
  { status: "pending",    label: "Pending",    icon: Clock },
  { status: "confirmed",  label: "Confirmed",  icon: CheckCircle },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped",    label: "Shipped",    icon: Truck },
  { status: "delivered",  label: "Delivered",  icon: CheckCircle },
];

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-pending", confirmed: "badge-confirmed",
  processing: "badge-processing", shipped: "badge-shipped",
  delivered: "badge-delivered", cancelled: "badge-cancelled",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [tracking, setTracking] = useState("");
  const [notes,    setNotes]    = useState("");

  useEffect(() => {
    getOrderDoc(id).then((o) => {
      setOrder(o); setTracking(o?.trackingNumber ?? ""); setNotes(o?.notes ?? "");
      setLoading(false);
    });
  }, [id]);

  async function setStatus(status: Order["status"]) {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrder(id, { status, trackingNumber: tracking || undefined, notes: notes || undefined });
      setOrder((prev) => prev ? { ...prev, status } : prev);
      toast.success(`Status updated to ${status}`);
    } catch { toast.error("Failed to update status"); }
    finally { setSaving(false); }
  }

  async function saveDetails() {
    setSaving(true);
    try {
      await updateOrder(id, { trackingNumber: tracking || undefined, notes: notes || undefined });
      toast.success("Order details saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  if (loading) return <AdminLayout title="Order Detail"><p style={{ padding: "2rem", color: "var(--text-sm)" }}>Loading…</p></AdminLayout>;
  if (!order)  return <AdminLayout title="Order Detail"><p style={{ padding: "2rem", color: "var(--text-sm)" }}>Order not found.</p></AdminLayout>;

  const pipelineIdx = PIPELINE.findIndex((p) => p.status === order.status);

  return (
    <AdminLayout title={`Order ${order.orderNumber ?? id.slice(0, 8)}`}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button className="btn btn-secondary btn-sm" onClick={() => router.push("/orders")}>
          <ChevronLeft size={14} /> Orders
        </button>
        <h1 style={{ fontSize: "1.1rem" }}>Order {order.orderNumber}</h1>
        <span className={`badge ${STATUS_BADGE[order.status] ?? ""}`}>{order.status}</span>
        {order.status !== "cancelled" && (
          <button className="btn btn-danger btn-sm" style={{ marginLeft: "auto" }} onClick={() => setStatus("cancelled")} disabled={saving}>
            <X size={14} /> Cancel Order
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Status Pipeline */}
          {order.status !== "cancelled" && (
            <div className="card">
              <div className="card-header"><h2>Order Status Pipeline</h2></div>
              <div className="card-body">
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {PIPELINE.map((step, i) => {
                    const Icon = step.icon;
                    const done    = i < pipelineIdx;
                    const current = i === pipelineIdx;
                    return (
                      <button
                        key={step.status}
                        className={`btn ${current ? "btn-primary" : done ? "btn-accent" : "btn-secondary"} btn-sm`}
                        onClick={() => setStatus(step.status)}
                        disabled={saving || current}
                        style={{ gap: ".35rem" }}
                      >
                        <Icon size={13} /> {step.label}
                        {current && " ✓"}
                      </button>
                    );
                  })}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Tracking Number</label>
                    <input placeholder="e.g. DTDC1234567890" value={tracking} onChange={(e) => setTracking(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Internal Notes</label>
                    <input placeholder="Notes for this order…" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                  <div><button className="btn btn-primary btn-sm" onClick={saveDetails} disabled={saving}>Save Details</button></div>
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="card">
            <div className="card-header"><h2>Items Ordered</h2></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.productId}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                          {item.image && <img src={item.image} alt="" className="img-preview" style={{ width: 40, height: 40 }} />}
                          <span style={{ fontWeight: 500 }}>{item.name}</span>
                        </div>
                      </td>
                      <td>₹{item.price?.toLocaleString("en-IN")}</td>
                      <td>{item.qty}</td>
                      <td style={{ fontWeight: 600 }}>₹{(item.price * item.qty)?.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: ".35rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
                <span style={{ color: "var(--text-sm)" }}>Subtotal</span><span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".88rem" }}>
                <span style={{ color: "var(--text-sm)" }}>Shipping</span>
                <span style={{ color: order.shippingFee === 0 ? "var(--success)" : "inherit" }}>
                  {order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem", paddingTop: ".25rem", borderTop: "1px solid var(--border)", marginTop: ".25rem" }}>
                <span>Total</span><span>₹{order.total?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Customer */}
          <div className="card">
            <div className="card-header"><h2>Customer</h2></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: ".4rem", fontSize: ".875rem" }}>
              <p style={{ fontWeight: 600 }}>{order.shippingAddress?.fullName}</p>
              <p style={{ color: "var(--text-sm)" }}>{order.guestEmail}</p>
              <p style={{ color: "var(--text-sm)" }}>{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card">
            <div className="card-header"><h2>Shipping Address</h2></div>
            <div className="card-body" style={{ fontSize: ".875rem", lineHeight: 1.7, color: "var(--text-sm)" }}>
              <p>{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pinCode}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="card-header"><h2>Payment</h2></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: ".4rem", fontSize: ".875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-sm)" }}>Status</span>
                <span className={`badge ${order.paymentStatus === "paid" ? "badge-paid" : "badge-failed"}`}>{order.paymentStatus}</span>
              </div>
              {order.razorpayPaymentId && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-sm)" }}>Razorpay ID</span>
                  <span style={{ fontFamily: "monospace", fontSize: ".78rem" }}>{order.razorpayPaymentId}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-sm)" }}>Date</span>
                <span>{order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
