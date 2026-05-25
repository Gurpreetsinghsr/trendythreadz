import { getAdminDb } from "@/lib/firebase-admin";
import type { Order } from "@/lib/types";

function toOrder(id: string, data: Record<string, unknown>): Order {
  return { id, ...data } as Order;
}

export async function createOrder(data: Omit<Order, "id">): Promise<Order> {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase not configured");
  const ref = await db.collection("orders").add({
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const doc = await ref.get();
  return toOrder(doc.id, doc.data()!);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = getAdminDb();
  if (!db) return null;
  const doc = await db.collection("orders").doc(id).get();
  if (!doc.exists) return null;
  return toOrder(doc.id, doc.data()!);
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snap = await db
    .collection("orders")
    .where("guestEmail", "==", email)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => toOrder(d.id, d.data()));
}

export async function getAllOrders(filters?: {
  status?: Order["status"];
  limit?: number;
}): Promise<Order[]> {
  const db = getAdminDb();
  if (!db) return [];
  let q = db.collection("orders").orderBy("createdAt", "desc") as FirebaseFirestore.Query;
  if (filters?.status) q = q.where("status", "==", filters.status);
  if (filters?.limit) q = q.limit(filters.limit);
  const snap = await q.get();
  return snap.docs.map((d) => toOrder(d.id, d.data()));
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  extra?: { trackingNumber?: string; notes?: string }
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase not configured");
  await db
    .collection("orders")
    .doc(id)
    .update({
      status,
      updatedAt: new Date().toISOString(),
      ...(extra?.trackingNumber ? { trackingNumber: extra.trackingNumber } : {}),
      ...(extra?.notes ? { notes: extra.notes } : {}),
    });
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: Order["paymentStatus"],
  extra?: { razorpayOrderId?: string; razorpayPaymentId?: string }
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase not configured");
  await db.collection("orders").doc(id).update({
    paymentStatus,
    updatedAt: new Date().toISOString(),
    ...extra,
  });
}

export async function getOrderStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  todayRevenue: number;
  totalRevenue: number;
}> {
  const db = getAdminDb();
  if (!db) return { totalOrders: 0, pendingOrders: 0, todayRevenue: 0, totalRevenue: 0 };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [allSnap, pendingSnap, todaySnap] = await Promise.all([
    db.collection("orders").where("paymentStatus", "==", "paid").get(),
    db.collection("orders").where("status", "==", "pending").get(),
    db
      .collection("orders")
      .where("paymentStatus", "==", "paid")
      .where("createdAt", ">=", todayStart.toISOString())
      .get(),
  ]);

  const totalRevenue  = allSnap.docs.reduce((s, d) => s + (d.data().total ?? 0), 0);
  const todayRevenue  = todaySnap.docs.reduce((s, d) => s + (d.data().total ?? 0), 0);

  return {
    totalOrders: allSnap.size,
    pendingOrders: pendingSnap.size,
    todayRevenue,
    totalRevenue,
  };
}
