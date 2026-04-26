import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Handmade Crochet Gifts — Empowering Women</h1>
          <p>
            Every stitch at Trendy Threadz supports rural Indian women with sustainable income, dignified work,
            and global visibility for their craft.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/products">Shop Collection</Link>
            <Link className="btn btn-secondary" href="/about">Read Our Story</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid stats">
          <div className="stat"><h3>500+</h3><p>Women artisans empowered</p></div>
          <div className="stat"><h3>5,000+</h3><p>Handcrafted products sold</p></div>
          <div className="stat"><h3>98%</h3><p>Customer delight score</p></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="grid products" style={{ marginTop: "1rem" }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </>
  );
}
