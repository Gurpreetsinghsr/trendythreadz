"use client";

import { useParams, notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = getProductById(params.id);
  const { addToCart } = useCart();

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
          <button className="btn btn-primary" onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
    </section>
  );
}
