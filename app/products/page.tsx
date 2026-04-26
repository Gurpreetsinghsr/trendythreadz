import { ProductFilterGrid } from "@/components/product-filter-grid";

export default function ProductsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontFamily: "Playfair Display, serif" }}>All Products</h1>
        <p>Explore handcrafted crochet made with love, filter by category, and sort by price.</p>
        <ProductFilterGrid />
      </div>
    </section>
  );
}
