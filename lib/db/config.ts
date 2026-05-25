import { getAdminDb } from "@/lib/firebase-admin";
import { seedSiteConfig } from "@/lib/seed-data";
import type { SiteConfig } from "@/lib/types";

const defaultConfig: SiteConfig = {
  ...seedSiteConfig,
  siteName: "Trendy Threadz",
  tagline: "Handmade with Love from India",
  email: "hello@trendythreadz.in",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  socialInstagram: "https://instagram.com/trendythreadz",
  socialFacebook: "https://facebook.com/trendythreadz",
  socialTwitter: "https://twitter.com/trendythreadz",
  socialYoutube: "",
  metaDescription:
    "Discover handcrafted crochet products by India's rural women artisans. Every purchase empowers a sister's dream.",
};

export async function getSiteConfig(): Promise<SiteConfig> {
  const db = getAdminDb();
  if (!db) return defaultConfig;
  const doc = await db.collection("config").doc("site").get();
  if (!doc.exists) return defaultConfig;
  return { ...defaultConfig, ...doc.data() } as SiteConfig;
}

export async function updateSiteConfig(data: Partial<SiteConfig>): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firebase not configured");
  await db.collection("config").doc("site").set(data, { merge: true });
}
