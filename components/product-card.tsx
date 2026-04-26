"use client";

import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <article className="card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={`${product.name} handmade crochet product`} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
      <div className="card-content">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <Link href={`/products/${product.id}`} className="btn btn-secondary">Details</Link>
          <button className="btn btn-primary" onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to cart`}>Add to Cart</button>
        </div>
      </div>
    </article>
  );
}
