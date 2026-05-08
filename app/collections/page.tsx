import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getActiveCollections } from "@/lib/db/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse our curated collections of handcrafted crochet products.",
};

export default async function CollectionsPage() {
  const collections = await getActiveCollections();

  return (
    <section className="section">
      <div className="container">
        <p className="section-eyebrow">Browse by theme</p>
        <h1 style={{ marginBottom: ".5rem" }}>Our Collections</h1>
        <p style={{ color: "var(--brown-light)", marginBottom: "2.5rem", maxWidth: "52ch" }}>
          Each collection tells the story of a craft, a region, and the women who keep those traditions alive.
        </p>
        <div className="grid collections-grid">
          {collections.map((col) => (
            <Link href={`/collections/${col.slug}`} key={col.id} className="collection-card" style={{ aspectRatio: "16/9" }}>
              <Image src={col.coverImage} alt={col.name} fill style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw, 50vw" />
              <div className="collection-overlay" />
              <div className="collection-arrow"><ArrowRight size={16} /></div>
              <div className="collection-info">
                <h3>{col.name}</h3>
                <p>{col.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
