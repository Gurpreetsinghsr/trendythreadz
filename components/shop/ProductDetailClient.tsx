"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, ChevronDown, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import type { Product, Artisan } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { useCartSheet } from "@/lib/cart-sheet-context";

type Props = { product: Product; artisan?: Artisan | null };

export function ProductDetailClient({ product, artisan }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const { addToCart } = useCart();
  const { openCart } = useCartSheet();
  const isSoldOut = product.stock === 0;
  const isLowStock = !isSoldOut && product.stock <= product.lowStockThreshold;

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product.id);
    toast.success(`${product.name} × ${qty} added to cart`, {
      style: { background: "var(--brown)", color: "var(--white)", borderRadius: "10px" },
    });
    openCart();
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }} className="product-detail-grid">
      {/* Gallery */}
      <div>
        <div style={{ aspectRatio: "4/3", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--cream-dark)", position: "relative", marginBottom: "1rem" }}>
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        {product.images.length > 1 && (
          <div style={{ display: "flex", gap: ".6rem" }}>
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                style={{
                  width: 70, height: 70, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                  border: `2px solid ${i === selectedImage ? "var(--gold)" : "var(--border)"}`,
                  cursor: "pointer", background: "none", padding: 0,
                }}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" width={70} height={70} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <div className="breadcrumb">
          <Link href="/products">Products</Link>
          <span className="breadcrumb-sep">/</span>
          <Link href={`/collections/${product.collectionId}`} style={{ textTransform: "capitalize" }}>{product.category}</Link>
          <span className="breadcrumb-sep">/</span>
          <span style={{ color: "var(--brown-light)" }}>{product.name}</span>
        </div>

        <span className="product-category">{product.category}</span>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: 0 }}>{product.name}</h1>

        {artisan && (
          <Link href={`/empowerment/${artisan.id}`} style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "var(--brown-light)", fontSize: ".9rem" }}>
            <MapPin size={14} />
            Made by <strong>{artisan.name}</strong> · {artisan.village}, {artisan.state}
          </Link>
        )}

        <div className="product-price-row" style={{ gap: ".8rem" }}>
          <span className="product-price" style={{ fontSize: "1.5rem" }}>₹{product.price.toLocaleString("en-IN")}</span>
          {product.comparePrice && (
            <span className="product-compare" style={{ fontSize: "1.1rem" }}>₹{product.comparePrice.toLocaleString("en-IN")}</span>
          )}
          {product.comparePrice && (
            <span className="badge badge-terracotta">
              {Math.round((1 - product.price / product.comparePrice) * 100)}% off
            </span>
          )}
        </div>

        <p style={{ color: "var(--brown-light)", lineHeight: 1.7 }}>{product.description}</p>

        {isLowStock && (
          <p style={{ color: "var(--terracotta)", fontWeight: 600, fontSize: ".88rem" }}>
            ⚡ Only {product.stock} left in stock!
          </p>
        )}

        {/* Qty + Add */}
        {!isSoldOut && (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", border: "1.5px solid var(--border)", borderRadius: 999, padding: ".3rem .6rem" }}>
              <button className="cart-qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1}>
                <Minus size={14} />
              </button>
              <span style={{ minWidth: "2ch", textAlign: "center", fontWeight: 600 }}>{qty}</span>
              <button className="cart-qty-btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>
                <Plus size={14} />
              </button>
            </div>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>
              <ShoppingBag size={16} /> Add to Cart · ₹{(product.price * qty).toLocaleString("en-IN")}
            </button>
          </div>
        )}
        {isSoldOut && (
          <button className="btn btn-secondary" disabled style={{ width: "100%" }}>Sold Out</button>
        )}

        {/* Accordion */}
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          {[
            { key: "details", label: "Product Details", content: <ul style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>{product.details.map((d, i) => <li key={i} style={{ listStyle: "disc", fontSize: ".88rem", color: "var(--brown-light)" }}>{d}</li>)}</ul> },
            { key: "artisan", label: "About the Artisan", content: artisan ? <p style={{ fontSize: ".88rem", color: "var(--brown-light)", lineHeight: 1.7 }}>{artisan.bio} <Link href={`/empowerment/${artisan.id}`} style={{ color: "var(--gold)", fontWeight: 600 }}>Read full story →</Link></p> : null },
            { key: "shipping", label: "Shipping & Returns", content: <p style={{ fontSize: ".88rem", color: "var(--brown-light)", lineHeight: 1.7 }}>Free shipping on orders above ₹999. Standard delivery in 5–7 business days. Easy returns within 15 days of delivery.</p> },
          ].map(({ key, label, content }) => content && (
            <div key={key} className="accordion-item">
              <button className="accordion-trigger" onClick={() => setOpenAccordion(openAccordion === key ? null : key)}>
                {label}
                <ChevronDown size={16} style={{ transition: ".2s", transform: openAccordion === key ? "rotate(180deg)" : "none" }} />
              </button>
              {openAccordion === key && <div className="accordion-content">{content}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
