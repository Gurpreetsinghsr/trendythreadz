"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getOrders } from "@/lib/db";
import type { Order } from "@/lib/types";

const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-pending", confirmed: "badge-confirmed",
  processing: "badge-processing", shipped: "badge-shipped",
  delivered: "badge-delivered", cancelled: "badge-cancelled",
};

export default function OrdersPage() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState<typeof STATUSES[number]>("all");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    setLoading(true);
    const status = tab === "all" ? undefined : tab;
    getOrders(status).then((o) => { setOrders(o); setLoading(false); });
  }, [tab]);

  const filtered = orders.filter((o) =>
    !search ||
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
    o.guestEmail?.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Orders">
      <div className="card">
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={15} />
            <input placeholder="Search order, email, name…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="status-tabs">
            {STATUSES.map((s) => (
              <button key={s} className={`status-tab ${tab === s ? "active" : ""}`} onClick={() => setTab(s)}>
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading orders…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>No orders found</td></tr>}
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>{o.orderNumber ?? o.id?.slice(0, 8)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.shippingAddress?.fullName}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--text-sm)" }}>{o.guestEmail}</div>
                  </td>
                  <td style={{ color: "var(--text-sm)" }}>{o.items?.length ?? 0} item(s)</td>
                  <td style={{ fontWeight: 600 }}>₹{o.total?.toLocaleString("en-IN")}</td>
                  <td><span className={`badge ${o.paymentStatus === "paid" ? "badge-paid" : "badge-failed"}`}>{o.paymentStatus}</span></td>
                  <td><span className={`badge ${STATUS_BADGE[o.status] ?? ""}`}>{o.status}</span></td>
                  <td style={{ color: "var(--text-sm)", fontSize: ".8rem", whiteSpace: "nowrap" }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td><Link href={`/orders/${o.id}`} className="btn btn-secondary btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
