import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // Demo mode — return a fake Razorpay order
      return NextResponse.json({
        id: `order_demo_${Date.now()}`,
        amount: amount * 100,
        currency: "INR",
        demo: true,
      });
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency: "INR",
      receipt:  orderId ?? `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay create order error:", err);
    return NextResponse.json({ error: "Payment gateway error" }, { status: 500 });
  }
}
