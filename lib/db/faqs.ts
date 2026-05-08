import { getAdminDb } from "@/lib/firebase-admin";
import type { FAQ } from "@/lib/types";

const seedFaqs: FAQ[] = [
  { id: "f1", question: "What materials are used in your products?", answer: "All our products are handmade using natural, eco-friendly materials — cotton, jute, bamboo, and recycled fabric. We never use synthetic materials that harm the environment.", category: "Product", order: 1, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "f2", question: "How long does delivery take?", answer: "Standard delivery takes 5–7 business days across India. Express delivery (2–3 days) is available in major cities. International shipping takes 10–15 business days.", category: "Shipping", order: 2, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "f3", question: "Can I return or exchange a product?", answer: "Yes! We accept returns within 7 days of delivery for unused, undamaged items. Exchange is free of charge. Please contact us at support@trendythreadz.in with your order ID.", category: "Returns", order: 3, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "f4", question: "Are the products safe for children?", answer: "Most of our products are suitable for children aged 3+. Each product listing mentions the recommended age. Our materials are non-toxic and tested for safety.", category: "Product", order: 4, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "f5", question: "How are the artisans paid?", answer: "We pay our artisans 60% of the selling price — well above industry standards. Payments are made within 48 hours of order confirmation. We believe fair wages create sustainable livelihoods.", category: "Empowerment", order: 5, active: true, createdAt: "2024-01-01T00:00:00Z" },
  { id: "f6", question: "Do you offer bulk / corporate orders?", answer: "Absolutely! We offer special pricing for orders above 50 units, custom packaging, and branding options. Write to us at corporate@trendythreadz.in for a quote.", category: "Orders", order: 6, active: true, createdAt: "2024-01-01T00:00:00Z" },
];

function toFaq(id: string, data: Record<string, unknown>): FAQ {
  return { id, ...data } as FAQ;
}

export async function getActiveFaqs(): Promise<FAQ[]> {
  const db = getAdminDb();
  if (!db) return seedFaqs.filter((f) => f.active);
  const snap = await db
    .collection("faqs")
    .where("active", "==", true)
    .orderBy("order", "asc")
    .get();
  return snap.docs.map((d) => toFaq(d.id, d.data()));
}

export async function getAllFaqs(): Promise<FAQ[]> {
  const db = getAdminDb();
  if (!db) return seedFaqs;
  const snap = await db.collection("faqs").orderBy("order", "asc").get();
  return snap.docs.map((d) => toFaq(d.id, d.data()));
}
