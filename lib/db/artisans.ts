import { getAdminDb } from "@/lib/firebase-admin";
import { seedArtisans } from "@/lib/seed-data";
import type { Artisan } from "@/lib/types";

function toArtisan(id: string, data: Record<string, unknown>): Artisan {
  return { id, ...data } as Artisan;
}

export async function getAllArtisans(): Promise<Artisan[]> {
  const db = getAdminDb();
  if (!db) return seedArtisans;
  const snap = await db.collection("artisans").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => toArtisan(d.id, d.data()));
}

export async function getActiveArtisans(): Promise<Artisan[]> {
  const db = getAdminDb();
  if (!db) return seedArtisans.filter((a) => (a as Artisan & { active?: boolean }).active !== false);
  const snap = await db.collection("artisans").where("active", "==", true).get();
  return snap.docs.map((d) => toArtisan(d.id, d.data()));
}

export async function getFeaturedArtisans(): Promise<Artisan[]> {
  const db = getAdminDb();
  if (!db) return seedArtisans.filter((a) => a.featured).slice(0, 3);
  const snap = await db
    .collection("artisans")
    .where("featured", "==", true)
    .where("active", "==", true)
    .limit(3)
    .get();
  return snap.docs.map((d) => toArtisan(d.id, d.data()));
}

export async function getArtisanById(id: string): Promise<Artisan | null> {
  const db = getAdminDb();
  if (!db) return seedArtisans.find((a) => a.id === id) ?? null;
  const doc = await db.collection("artisans").doc(id).get();
  if (!doc.exists) return null;
  return toArtisan(doc.id, doc.data()!);
}
