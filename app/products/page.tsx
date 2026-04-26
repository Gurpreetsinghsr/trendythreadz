import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function ProductsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontFamily: "Playfair Display, serif" }}>All Products</h1>
        <p>Explore handcrafted crochet made with love.</p>
        <div className="grid products" style={{ marginTop: "1rem" }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
