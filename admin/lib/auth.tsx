"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

export const ADMIN_EMAIL = "trendythreadz@gmail.com";

type AdminAuthCtx = {
  user: User | null;
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
  const [user,    setUser]    = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const firebaseAuth = auth;
    const firestore = db;
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const adminEmails = [
        ADMIN_EMAIL,
        ...(process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(","),
      ].map((email) => email.trim().toLowerCase()).filter(Boolean);

      if (adminEmails.includes((firebaseUser.email ?? "").toLowerCase())) {
        setIsAdmin(true);
      } else {
        const adminDoc = await getDoc(doc(firestore, "admins", firebaseUser.uid));
        setIsAdmin(adminDoc.exists());
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    if (!auth) throw new Error("Firebase is not configured.");
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function signOut() {
    if (auth) await firebaseSignOut(auth);
  }

  return <Ctx.Provider value={{ user, isAdmin, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAdminAuth = () => useContext(Ctx);
