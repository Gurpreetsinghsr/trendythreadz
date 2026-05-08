import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updatePaymentStatus, updateOrderStatus } from "@/lib/db/orders";

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!process.env.RAZORPAY_KEY_SECRET) {
      // Demo mode — assume success
      if (orderId) {
        await updatePaymentStatus(orderId, "paid", { razorpayOrderId, razorpayPaymentId });
        await updateOrderStatus(orderId, "confirmed");
      }
      return NextResponse.json({ success: true, demo: true });
    }

    // Verify signature
    const body      = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected  = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature) {
      return NextResponse.json({ error: "Payment signature mismatch" }, { status: 400 });
    }

    // Mark order as paid + confirmed
    await updatePaymentStatus(orderId, "paid", { razorpayOrderId, razorpayPaymentId });
    await updateOrderStatus(orderId, "confirmed");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
