"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { ADMIN_EMAIL, ADMIN_PASSWORD, useAdminAuth } from "@/lib/auth";

export default function LoginPage() {
  const { user, isAdmin, loading, signIn } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) router.replace("/");
  }, [loading, user, isAdmin, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch {
      setError("The email or password is incorrect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-group" htmlFor="email">
            <span className="form-label">Email</span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="form-group" htmlFor="password">
            <span className="form-label">Password</span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="btn btn-primary btn-lg" style={{ width: "100%" }} type="submit" disabled={loading || isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
