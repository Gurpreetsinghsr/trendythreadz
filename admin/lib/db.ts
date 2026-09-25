import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, limit, setDoc,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Collection, Artisan, Order, Review, FAQ, SiteConfig } from "./types";

// ─── Re-export types ─────────────────────────────────────────────────────────
export type { Product, Collection, Artisan, Order, Review, FAQ, SiteConfig };

// Throw a helpful error at call-time (never at build/import time) when Firebase
// hasn't been configured yet. All db.ts functions are only called from
// "use client" components, so this only runs in the browser.
function requireDb() {
  if (!db) throw new Error("Firebase is not configured. Add your NEXT_PUBLIC_FIREBASE_* env vars.");
  return db;
}

function snap<T>(s: { id: string; data(): object }): T {
  return { id: s.id, ...s.data() } as T;
}

// Firestore rejects `undefined` values. Optional fields are common in the
// admin forms, so omit them before every write instead of failing the save.
function omitUndefined<T extends Record<string, unknown>>(data: T): T {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as T;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const s = await getDocs(query(collection(requireDb(), "products"), orderBy("createdAt", "desc")));
  return s.docs.map((d) => snap<Product>(d));
}
export async function getProduct(id: string): Promise<Product | null> {
  const d = await getDoc(doc(requireDb(), "products", id));
  return d.exists() ? snap<Product>(d) : null;
}
export async function saveProduct(id: string | null, data: Omit<Product, "id">): Promise<string> {
  const payload = omitUndefined({ ...data, updatedAt: new Date().toISOString() });
  if (id) { await updateDoc(doc(requireDb(), "products", id), payload); return id; }
  const ref = await addDoc(collection(requireDb(), "products"), { ...payload, createdAt: new Date().toISOString() });
  return ref.id;
}
export async function deleteProduct(id: string) { await deleteDoc(doc(requireDb(), "products", id)); }

// ─── Collections ──────────────────────────────────────────────────────────────
export async function getCollections(): Promise<Collection[]> {
  const s = await getDocs(query(collection(requireDb(), "collections"), orderBy("order", "asc")));
  return s.docs.map((d) => snap<Collection>(d));
}
export async function saveCollection(id: string | null, data: Omit<Collection, "id">): Promise<string> {
  if (id) { await updateDoc(doc(requireDb(), "collections", id), data); return id; }
  const ref = await addDoc(collection(requireDb(), "collections"), data);
  return ref.id;
}
export async function deleteCollection(id: string) { await deleteDoc(doc(requireDb(), "collections", id)); }

// ─── Artisans ─────────────────────────────────────────────────────────────────
export async function getArtisans(): Promise<Artisan[]> {
  const s = await getDocs(query(collection(requireDb(), "artisans"), orderBy("createdAt", "desc")));
  return s.docs.map((d) => snap<Artisan>(d));
}
export async function getArtisan(id: string): Promise<Artisan | null> {
  const d = await getDoc(doc(requireDb(), "artisans", id));
  return d.exists() ? snap<Artisan>(d) : null;
}
export async function saveArtisan(id: string | null, data: Omit<Artisan, "id">): Promise<string> {
  const payload = omitUndefined({ ...data, updatedAt: new Date().toISOString() });
  if (id) { await updateDoc(doc(requireDb(), "artisans", id), payload); return id; }
  const ref = await addDoc(collection(requireDb(), "artisans"), { ...payload, createdAt: new Date().toISOString() });
  return ref.id;
}
export async function deleteArtisan(id: string) { await deleteDoc(doc(requireDb(), "artisans", id)); }

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getOrders(statusFilter?: Order["status"], lim = 200): Promise<Order[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(lim)];
  if (statusFilter) constraints.push(where("status", "==", statusFilter));
  const s = await getDocs(query(collection(requireDb(), "orders"), ...constraints));
  return s.docs.map((d) => snap<Order>(d));
}
export async function getOrderDoc(id: string): Promise<Order | null> {
  const d = await getDoc(doc(requireDb(), "orders", id));
  return d.exists() ? snap<Order>(d) : null;
}
export async function updateOrder(id: string, data: Partial<Order>) {
  await updateDoc(doc(requireDb(), "orders", id), { ...data, updatedAt: new Date().toISOString() });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export async function getReviews(): Promise<Review[]> {
  const s = await getDocs(query(collection(requireDb(), "reviews"), orderBy("createdAt", "desc")));
  return s.docs.map((d) => snap<Review>(d));
}
export async function updateReview(id: string, data: Partial<Review>) {
  await updateDoc(doc(requireDb(), "reviews", id), data);
}
export async function deleteReview(id: string) { await deleteDoc(doc(requireDb(), "reviews", id)); }

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export async function getFaqs(): Promise<FAQ[]> {
  const s = await getDocs(query(collection(requireDb(), "faqs"), orderBy("order", "asc")));
  return s.docs.map((d) => snap<FAQ>(d));
}
export async function saveFaq(id: string | null, data: Omit<FAQ, "id">): Promise<string> {
  if (id) { await updateDoc(doc(requireDb(), "faqs", id), data); return id; }
  const ref = await addDoc(collection(requireDb(), "faqs"), { ...data, createdAt: new Date().toISOString() });
  return ref.id;
}
export async function deleteFaq(id: string) { await deleteDoc(doc(requireDb(), "faqs", id)); }

// ─── Site Config ──────────────────────────────────────────────────────────────
export async function getSiteConfig(): Promise<Partial<SiteConfig>> {
  const d = await getDoc(doc(requireDb(), "config", "site"));
  return d.exists() ? (d.data() as SiteConfig) : {};
}
export async function saveSiteConfig(data: Partial<SiteConfig>) {
  await setDoc(doc(requireDb(), "config", "site"), data, { merge: true });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [allOrders, products, artisans] = await Promise.all([
    getDocs(collection(requireDb(), "orders")),
    getDocs(collection(requireDb(), "products")),
    getDocs(collection(requireDb(), "artisans")),
  ]);

  const orders = allOrders.docs.map((d) => snap<Order>(d));
  const today  = new Date().toISOString().slice(0, 10);
  const paidOrders   = orders.filter((o) => o.paymentStatus === "paid");
  const todayOrders  = paidOrders.filter((o) => o.createdAt?.slice(0, 10) === today);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const newCount     = orders.filter((o) => o.status === "confirmed").length;

  return {
    totalRevenue:  paidOrders.reduce((s, o) => s + (o.total ?? 0), 0),
    todayRevenue:  todayOrders.reduce((s, o) => s + (o.total ?? 0), 0),
    totalOrders:   paidOrders.length,
    pendingOrders: pendingCount + newCount,
    productCount:  products.size,
    artisanCount:  artisans.size,
    recentOrders:  orders.slice(0, 5),
  };
}
