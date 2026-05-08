"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IndianRupee, ShoppingCart, Package, Users, TrendingUp, Clock } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { getDashboardStats } from "@/lib/db";
import type { Order } from "@/lib/types";

const STATUS_BADGE: Record<string, string> = {
  pending: "badge-pending", confirmed: "badge-confirmed",
  processing: "badge-processing", shipped: "badge-shipped",
  delivered: "badge-delivered", cancelled: "badge-cancelled",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);

  useEffect(() => { getDashboardStats().then(setStats); }, []);

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon gold"><IndianRupee size={20} /></div>
          <div>
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}</p>
            <p className="stat-sub">₹{(stats?.todayRevenue ?? 0).toLocaleString("en-IN")} today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><ShoppingCart size={20} /></div>
          <div>
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{stats?.totalOrders ?? 0}</p>
            <p className="stat-sub">{stats?.pendingOrders ?? 0} need attention</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Package size={20} /></div>
          <div>
            <p className="stat-label">Products</p>
            <p className="stat-value">{stats?.productCount ?? 0}</p>
            <p className="stat-sub">Active listings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><Users size={20} /></div>
          <div>
            <p className="stat-label">Artisans</p>
            <p className="stat-value">{stats?.artisanCount ?? 0}</p>
            <p className="stat-sub">Women empowered</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Orders</h2>
          <Link href="/orders" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders ?? []).map((o: Order) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.orderNumber}</td>
                  <td style={{ color: "var(--text-sm)" }}>{o.guestEmail}</td>
                  <td style={{ fontWeight: 600 }}>₹{o.total?.toLocaleString("en-IN")}</td>
                  <td><span className={`badge ${STATUS_BADGE[o.status] ?? ""}`}>{o.status}</span></td>
                  <td style={{ color: "var(--text-sm)", fontSize: ".8rem" }}>
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td><Link href={`/orders/${o.id}`} className="btn btn-ghost btn-sm">View</Link></td>
                </tr>
              ))}
              {!stats && (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading…</td></tr>
              )}
              {stats && stats.recentOrders.length === 0 && (
                <tr><td colSpan={6} className="empty-state">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { label: "Add Product",    href: "/products/new",  icon: Package },
          { label: "Add Artisan",    href: "/artisans/new",  icon: Users },
          { label: "Manage FAQs",    href: "/faqs",          icon: Clock },
          { label: "Site Settings",  href: "/settings",      icon: TrendingUp },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="card" style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: ".75rem", color: "var(--text)", transition: "box-shadow .15s" }}>
            <a.icon size={18} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: ".875rem", fontWeight: 600 }}>{a.label}</span>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
