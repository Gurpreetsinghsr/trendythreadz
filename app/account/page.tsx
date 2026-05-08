"use client";

import { useAuth } from "@/lib/auth-context";

export default function AccountPage() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--taupe)" }}>Loading…</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ marginBottom: ".6rem" }}>My Account</h1>
          <p style={{ color: "var(--brown-light)", marginBottom: "1.5rem" }}>
            Sign in with Google to view your order history and manage your account.
          </p>
          <button className="btn btn-primary btn-lg" onClick={signInWithGoogle} style={{ width: "100%" }}>
            Sign in with Google
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ marginBottom: "1.5rem" }}>My Account</h1>
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontWeight: 700 }}>{user.displayName}</p>
          <p style={{ color: "var(--taupe)", fontSize: ".88rem" }}>{user.email}</p>
        </div>
        <h2 style={{ marginBottom: "1rem" }}>Order History</h2>
        <div className="empty-state">
          <p style={{ color: "var(--taupe)" }}>No orders yet. <a href="/products" style={{ color: "var(--gold)", fontWeight: 600 }}>Start shopping →</a></p>
        </div>
      </div>
    </section>
  );
}
