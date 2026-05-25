import { NextResponse } from "next/server";
import { getSiteConfig } from "@/lib/db/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
