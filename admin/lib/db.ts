import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, limit, serverTimestamp, setDoc,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Collection, Artisan, Order, Review, FAQ, SiteConfig } from "./types";

// ─── Re-export types ─────────────────────────────────────────────────────────
export type { Product, Collection, Artisan, Order, Review, FAQ, SiteConfig };

function snap<T>(s: { id: string; data(): object }): T {
  return { id: s.id, ...s.data() } as T;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const s = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  return s.docs.map((d) => snap<Product>(d));
}
export async function getProduct(id: string): Promise<Product | null> {
  const d = await getDoc(doc(db, "products", id));
  return d.exists() ? snap<Product>(d) : null;
}
export async function saveProduct(id: string | null, data: Omit<Product, "id">): Promise<string> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  if (id) { await updateDoc(doc(db, "products", id), payload); return id; }
  const ref = await addDoc(collection(db, "products"), { ...payload, createdAt: new Date().toISOString() });
  return ref.id;
}
export async function deleteProduct(id: string) { await deleteDoc(doc(db, "products", id)); }

// ─── Collections ──────────────────────────────────────────────────────────────
export async function getCollections(): Promise<Collection[]> {
  const s = await getDocs(query(collection(db, "collections"), orderBy("order", "asc")));
  return s.docs.map((d) => snap<Collection>(d));
}
export async function saveCollection(id: string | null, data: Omit<Collection, "id">): Promise<string> {
  if (id) { await updateDoc(doc(db, "collections", id), data); return id; }
  const ref = await addDoc(collection(db, "collections"), data);
  return ref.id;
}
export async function deleteCollection(id: string) { await deleteDoc(doc(db, "collections", id)); }

// ─── Artisans ─────────────────────────────────────────────────────────────────
export async function getArtisans(): Promise<Artisan[]> {
  const s = await getDocs(query(collection(db, "artisans"), orderBy("createdAt", "desc")));
  return s.docs.map((d) => snap<Artisan>(d));
}
export async function getArtisan(id: string): Promise<Artisan | null> {
  const d = await getDoc(doc(db, "artisans", id));
  return d.exists() ? snap<Artisan>(d) : null;
}
export async function saveArtisan(id: string | null, data: Omit<Artisan, "id">): Promise<string> {
  const payload = { ...data, updatedAt: new Date().toISOString() };
  if (id) { await updateDoc(doc(db, "artisans", id), payload); return id; }
  const ref = await addDoc(collection(db, "artisans"), { ...payload, createdAt: new Date().toISOString() });
  return ref.id;
}
export async function deleteArtisan(id: string) { await deleteDoc(doc(db, "artisans", id)); }

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getOrders(statusFilter?: Order["status"], lim = 200): Promise<Order[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc"), limit(lim)];
  if (statusFilter) constraints.push(where("status", "==", statusFilter));
  const s = await getDocs(query(collection(db, "orders"), ...constraints));
  return s.docs.map((d) => snap<Order>(d));
}
export async function getOrderDoc(id: string): Promise<Order | null> {
  const d = await getDoc(doc(db, "orders", id));
  return d.exists() ? snap<Order>(d) : null;
}
export async function updateOrder(id: string, data: Partial<Order>) {
  await updateDoc(doc(db, "orders", id), { ...data, updatedAt: new Date().toISOString() });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export async function getReviews(): Promise<Review[]> {
  const s = await getDocs(query(collection(db, "reviews"), orderBy("createdAt", "desc")));
  return s.docs.map((d) => snap<Review>(d));
}
export async function updateReview(id: string, data: Partial<Review>) {
  await updateDoc(doc(db, "reviews", id), data);
}
export async function deleteReview(id: string) { await deleteDoc(doc(db, "reviews", id)); }

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export async function getFaqs(): Promise<FAQ[]> {
  const s = await getDocs(query(collection(db, "faqs"), orderBy("order", "asc")));
  return s.docs.map((d) => snap<FAQ>(d));
}
export async function saveFaq(id: string | null, data: Omit<FAQ, "id">): Promise<string> {
  if (id) { await updateDoc(doc(db, "faqs", id), data); return id; }
  const ref = await addDoc(collection(db, "faqs"), { ...data, createdAt: new Date().toISOString() });
  return ref.id;
}
export async function deleteFaq(id: string) { await deleteDoc(doc(db, "faqs", id)); }

// ─── Site Config ──────────────────────────────────────────────────────────────
export async function getSiteConfig(): Promise<Partial<SiteConfig>> {
  const d = await getDoc(doc(db, "config", "site"));
  return d.exists() ? (d.data() as SiteConfig) : {};
}
export async function saveSiteConfig(data: Partial<SiteConfig>) {
  await setDoc(doc(db, "config", "site"), data, { merge: true });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [allOrders, products, artisans] = await Promise.all([
    getDocs(collection(db, "orders")),
    getDocs(collection(db, "products")),
    getDocs(collection(db, "artisans")),
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
