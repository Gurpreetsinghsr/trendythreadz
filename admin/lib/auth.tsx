"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged, signOut as fbSignOut,
  GoogleAuthProvider, signInWithPopup, type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

type AdminAuthCtx = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AdminAuthCtx>({
  user: null, isAdmin: false, loading: true,
  signIn: async () => {}, signOut: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase isn't configured (e.g. env vars not set), stop loading and bail out.
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
          .split(",").map((e) => e.trim()).filter(Boolean);

        if (adminEmails.includes(u.email ?? "")) {
          setIsAdmin(true);
        } else {
          const snap = await getDoc(doc(db!, "admins", u.uid));
          setIsAdmin(snap.exists());
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn() {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function signOut() {
    if (!auth) return;
    await fbSignOut(auth);
    setIsAdmin(false);
  }

  return <Ctx.Provider value={{ user, isAdmin, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAdminAuth = () => useContext(Ctx);
