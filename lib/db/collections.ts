import { getAdminDb } from "@/lib/firebase-admin";
import { seedCollections } from "@/lib/seed-data";
import type { Collection } from "@/lib/types";

function toCollection(id: string, data: Record<string, unknown>): Collection {
  return { id, ...data } as Collection;
}

export async function getAllCollections(): Promise<Collection[]> {
  const db = getAdminDb();
  if (!db) return seedCollections;
  const snap = await db.collection("collections").orderBy("order", "asc").get();
  return snap.docs.map((d) => toCollection(d.id, d.data()));
}

export async function getActiveCollections(): Promise<Collection[]> {
  const db = getAdminDb();
  if (!db) return seedCollections;
  const snap = await db
    .collection("collections")
    .where("active", "==", true)
    .orderBy("order", "asc")
    .get();
  return snap.docs.map((d) => toCollection(d.id, d.data()));
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const db = getAdminDb();
  if (!db) return seedCollections.find((c) => c.slug === slug) ?? null;
  const snap = await db.collection("collections").where("slug", "==", slug).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return toCollection(doc.id, doc.data());
}
