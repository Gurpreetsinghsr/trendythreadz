import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getActiveProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
