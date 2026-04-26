import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getProductById, products } from "@/lib/products";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found | Trendy Threadz" };
  return {
    title: `${product.name} | Trendy Threadz`,
    description: product.description
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return notFound();

  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", alignItems: "start" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} style={{ borderRadius: 16, border: "1px solid #e7ddd1", width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
        <div>
          <h1 style={{ fontFamily: "Playfair Display, serif" }}>{product.name}</h1>
          <p>{product.description}</p>
          <p><strong>Crafted by:</strong> {product.artisan}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <AddToCartButton id={product.id} name={product.name} />
        </div>
      </div>
    </section>
  );
}
