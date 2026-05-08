"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Layers, Users,
  HelpCircle, Star, Settings, LogOut, ChevronRight,
} from "lucide-react";
import { useAdminAuth } from "@/lib/auth";
import { Toaster } from "react-hot-toast";

const NAV = [
  { section: "Overview" },
  { label: "Dashboard",   href: "/",            icon: LayoutDashboard },
  { section: "Commerce" },
  { label: "Orders",      href: "/orders",       icon: ShoppingCart },
  { label: "Products",    href: "/products",     icon: Package },
  { label: "Collections", href: "/collections",  icon: Layers },
  { section: "Content" },
  { label: "Artisans",    href: "/artisans",     icon: Users },
  { label: "FAQs",        href: "/faqs",         icon: HelpCircle },
  { label: "Reviews",     href: "/reviews",      icon: Star },
  { section: "System" },
  { label: "Settings",    href: "/settings",     icon: Settings },
];

export function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isAdmin, loading, signOut } = useAdminAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/login");
  }, [loading, user, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--brand)" }}>
        <div style={{ color: "#fff", opacity: .6, fontSize: ".9rem" }}>Loading…</div>
      </div>
    );
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <div className="admin-shell">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>Trendy Threadz</span>
          <small>Admin Panel</small>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if ("section" in item) {
              return <p key={i} className="sidebar-section-label">{item.section}</p>;
            }
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}>
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            {user?.photoURL && <img src={user.photoURL} alt="" />}
            <span className="sidebar-user-name">{user?.displayName ?? user?.email}</span>
          </div>
          <button className="sidebar-link" onClick={signOut} style={{ padding: ".4rem .5rem" }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">{title}</span>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: ".25rem", fontSize: ".8rem", color: "var(--text-sm)" }}>
            View Store <ChevronRight size={14} />
          </Link>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
