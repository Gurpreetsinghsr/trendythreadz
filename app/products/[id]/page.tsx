import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProductById, getRelatedProducts } from "@/lib/db/products";
import { getArtisanById } from "@/lib/db/artisans";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found" };
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [related, artisan] = await Promise.all([
    getRelatedProducts(product, 4),
    product.artisanId ? getArtisanById(product.artisanId) : Promise.resolve(null),
  ]);

  return (
    <div className="section">
      <div className="container">
        <ProductDetailClient product={product} artisan={artisan} />
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <div className="section-header">
              <div>
                <p className="section-eyebrow">You may also like</p>
                <h2>Related Products</h2>
              </div>
              <Link href="/products" className="btn btn-ghost" style={{ gap: ".4rem", fontSize: ".88rem" }}>
                View All →
              </Link>
            </div>
            <div className="grid products-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
