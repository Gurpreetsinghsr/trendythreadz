import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCollectionBySlug } from "@/lib/db/collections";
import { getProductsByCollection } from "@/lib/db/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = await getCollectionBySlug(slug);
  if (!col) return { title: "Collection Not Found" };
  return { title: col.name, description: col.description };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();
  const products = await getProductsByCollection(collection.id);

  return (
    <section className="section">
      <div className="container">
        <p className="section-eyebrow">Collection</p>
        <h1 style={{ marginBottom: ".5rem" }}>{collection.name}</h1>
        <p style={{ color: "var(--brown-light)", marginBottom: "2.5rem", maxWidth: "52ch" }}>{collection.description}</p>
        {products.length === 0 ? (
          <div className="empty-state"><p>No products in this collection yet.</p></div>
        ) : (
          <div className="grid products-grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
