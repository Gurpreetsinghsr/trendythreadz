import { getAdminDb } from "@/lib/firebase-admin";
import { seedProducts } from "@/lib/seed-data";
import type { Product } from "@/lib/types";

function toProduct(id: string, data: Record<string, unknown>): Product {
  return { id, ...data } as Product;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) return seedProducts;
  const snap = await db.collection("products").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getActiveProducts(): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) return seedProducts.filter((p) => (p as Product & { active?: boolean }).active !== false);
  const snap = await db.collection("products").where("active", "==", true).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) return seedProducts.filter((p) => p.featured).slice(0, 4);
  const snap = await db
    .collection("products")
    .where("featured", "==", true)
    .where("active", "==", true)
    .limit(4)
    .get();
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getAdminDb();
  if (!db) return seedProducts.find((p) => p.id === id) ?? null;
  const doc = await db.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return toProduct(doc.id, doc.data()!);
}

export async function getProductsByCollection(collectionId: string): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) return seedProducts.filter((p) => p.collectionId === collectionId);
  const snap = await db
    .collection("products")
    .where("collectionId", "==", collectionId)
    .where("active", "==", true)
    .get();
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getProductsByArtisan(artisanId: string): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) return seedProducts.filter((p) => p.artisanId === artisanId);
  const snap = await db
    .collection("products")
    .where("artisanId", "==", artisanId)
    .where("active", "==", true)
    .get();
  return snap.docs.map((d) => toProduct(d.id, d.data()));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) {
    return seedProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  }
  const snap = await db
    .collection("products")
    .where("category", "==", product.category)
    .where("active", "==", true)
    .limit(limit + 1)
    .get();
  return snap.docs
    .map((d) => toProduct(d.id, d.data()))
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}
