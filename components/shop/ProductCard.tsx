"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useCartSheet } from "@/lib/cart-sheet-context";
type Props = { product: Product; artisanName?: string };

export function ProductCard({ product, artisanName }: Props) {
  const { addToCart } = useCart();
  const { openCart } = useCartSheet();
  const isSoldOut = product.stock === 0;
  const isLowStock = !isSoldOut && product.stock <= product.lowStockThreshold;
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (isSoldOut) return;
    addToCart(product.id);
    toast.success(`${product.name} added to cart`, {
      style: { background: "var(--brown)", color: "var(--white)", borderRadius: "10px" },
      iconTheme: { primary: "var(--gold)", secondary: "var(--white)" },
    });
    openCart();
  }

  return (
    <Link href={`/products/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: "cover" }}
        />
        {isSoldOut && <span className="product-badge sold-out">Sold Out</span>}
        {isLowStock && <span className="product-badge low-stock">Only {product.stock} left</span>}
        {!isSoldOut && !isLowStock && hasDiscount && <span className="product-badge sale">Sale</span>}
      </div>
      <div className="product-card-body">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          {artisanName && <span className="product-artisan">by {artisanName}</span>}
        </div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          {hasDiscount && (
            <span className="product-compare">₹{product.comparePrice!.toLocaleString("en-IN")}</span>
          )}
        </div>
        <button
          className="btn btn-primary product-add-btn btn-sm"
          onClick={handleAdd}
          disabled={isSoldOut}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={14} />
          {isSoldOut ? "Sold Out" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
