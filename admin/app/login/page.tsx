"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chrome, Lock } from "lucide-react";
import { useAdminAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, isAdmin, loading, signIn } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && isAdmin) router.replace("/");
  }, [loading, user, isAdmin, router]);

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-logo">Trendy Threadz</p>
        <p className="login-sub">Admin Panel</p>

        <div style={{ width: 56, height: 56, background: "rgba(45,33,24,.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <Lock size={24} style={{ color: "var(--brand)" }} />
        </div>

        <h1 style={{ fontSize: "1.3rem", marginBottom: ".5rem" }}>Sign in to continue</h1>
        <p style={{ fontSize: ".85rem", color: "var(--text-sm)", marginBottom: "1.5rem" }}>
          Only authorized administrators can access this panel.
        </p>

        {user && !isAdmin && !loading && (
          <div style={{ background: "rgba(240,68,56,.08)", border: "1px solid rgba(240,68,56,.25)", borderRadius: "var(--radius-sm)", padding: ".75rem 1rem", marginBottom: "1rem", fontSize: ".85rem", color: "var(--danger)" }}>
            ⚠️ Your account ({user.email}) is not authorized as an admin.
          </div>
        )}

        <button className="btn btn-primary btn-lg" style={{ width: "100%", gap: ".6rem" }} onClick={signIn} disabled={loading}>
          <Chrome size={18} />
          {loading ? "Signing in…" : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
