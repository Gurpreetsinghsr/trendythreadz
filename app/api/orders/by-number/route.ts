import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import type { Order } from "@/lib/types";

export async function GET(req: NextRequest) {
  const number = req.nextUrl.searchParams.get("number");
  if (!number) return NextResponse.json({ error: "Missing order number" }, { status: 400 });

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const snap = await db
    .collection("orders")
    .where("orderNumber", "==", number.trim())
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const doc = snap.docs[0];
  const order: Order = { id: doc.id, ...doc.data() } as Order;
  return NextResponse.json({ order });
}
