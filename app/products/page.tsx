import type { Metadata } from "next";
import { ProductFilterGrid } from "@/components/shop/ProductFilterGrid";
import { getActiveProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Products",
  description: "Explore our full range of handcrafted crochet products by rural Indian women artisans.",
};

export default async function ProductsPage() {
  const products = await getActiveProducts();

  return (
    <section className="section">
      <div className="container">
        <p className="section-eyebrow">Handmade with love</p>
        <h1 style={{ marginBottom: ".5rem" }}>All Products</h1>
        <p style={{ color: "var(--brown-light)", marginBottom: "2rem", maxWidth: "52ch" }}>
          Every piece is hand-crafted by a skilled woman artisan in rural India.
          Filter by category, sort by price, or search for exactly what you need.
        </p>
        <ProductFilterGrid initialProducts={products} />
      </div>
    </section>
  );
}
