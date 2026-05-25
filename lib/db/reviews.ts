import { getAdminDb } from "@/lib/firebase-admin";
import type { Review } from "@/lib/types";

function toReview(id: string, data: Record<string, unknown>): Review {
  return { id, ...data } as Review;
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("reviews")
    .where("productId", "==", productId)
    .where("approved", "==", true)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => toReview(d.id, d.data()));
}

export async function getAllReviews(): Promise<Review[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db.collection("reviews").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => toReview(d.id, d.data()));
}

export async function approveReview(id: string, approved: boolean): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase not configured");
  await db.collection("reviews").doc(id).update({ approved });
}

export async function deleteReview(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase not configured");
  await db.collection("reviews").doc(id).delete();
}
