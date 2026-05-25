"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

const CATEGORIES = ["All", "Home Decor", "Accessories", "Jewelry", "Gifting"] as const;
const SORT_OPTIONS = [
  { label: "Newest",            value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name A–Z",          value: "name-asc" },
] as const;

export function ProductFilterGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [sort,     setSort]     = useState("newest");

  // Refresh from server if needed (e.g. after navigation)
  useEffect(() => { setProducts(initialProducts); }, [initialProducts]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    switch (sort) {
      case "price-asc":  return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "name-asc":   return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:           return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [products, search, category, sort]);

  return (
    <>
      {/* Search + Sort */}
      <div className="filters-top-row">
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <Search size={15} style={{ position: "absolute", left: ".85rem", top: "50%", transform: "translateY(-50%)", color: "var(--taupe)", pointerEvents: "none" }} />
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.4rem" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: ".4rem", flexShrink: 0 }}>
          <SlidersHorizontal size={15} style={{ color: "var(--taupe)", flexShrink: 0 }} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "auto" }}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="category-chips" role="group" aria-label="Filter by category">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`category-chip ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="filter-count">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No products match your filters.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(""); setCategory("All"); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid products-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}
