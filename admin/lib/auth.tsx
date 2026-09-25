"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const ADMIN_EMAIL = "trendythreadz@gmail.com";
export const ADMIN_PASSWORD = "Vikram@123";

const ADMIN_SESSION_KEY = "trendythreadz-admin-session";

type AdminUser = {
  email: string;
  displayName: string;
  photoURL: null;
};

type AdminAuthCtx = {
  user: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AdminAuthCtx>({
  user: null, isAdmin: false, loading: true,
  signIn: async () => {}, signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSession = window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    if (hasSession) {
      setUser({ email: ADMIN_EMAIL, displayName: "Trendy Threadz Admin", photoURL: null });
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new Error("Invalid admin credentials");
    }

    const adminUser = { email: ADMIN_EMAIL, displayName: "Trendy Threadz Admin", photoURL: null };
    window.localStorage.setItem(ADMIN_SESSION_KEY, "true");
    setUser(adminUser);
    setIsAdmin(true);
  }

  async function signOut() {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    setUser(null);
    setIsAdmin(false);
  }

  return <Ctx.Provider value={{ user, isAdmin, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAdminAuth = () => useContext(Ctx);
