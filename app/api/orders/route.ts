import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db/orders";
import type { Order } from "@/lib/types";

function generateOrderNumber(): string {
  const date = new Date();
  const ymd  = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `TT-${ymd}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingAddress, subtotal, shippingFee, total, guestEmail, userId } = body;

    if (!items?.length || !shippingAddress || !guestEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderData: Omit<Order, "id"> = {
      orderNumber: generateOrderNumber(),
      guestEmail,
      userId:         userId ?? undefined,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
      status:         "pending",
      paymentStatus:  "pending",
      createdAt:      new Date().toISOString(),
      updatedAt:      new Date().toISOString(),
    };

    const order = await createOrder(orderData);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
