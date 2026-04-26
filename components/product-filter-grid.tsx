"use client";

import { useMemo, useState } from "react";
import { Product, products } from "@/lib/products";
import { ProductCard } from "./product-card";

function filterProducts(items: Product[], category: string, search: string, sortBy: string) {
  let list = items;
  if (category !== "All") list = list.filter((p) => p.category === category);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((p) => [p.name, p.description, p.artisan].join(" ").toLowerCase().includes(q));
  }

  return [...list].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return a.name.localeCompare(b.name);
  });
}

export function ProductFilterGrid() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], []);
  const filtered = useMemo(() => filterProducts(products, category, search, sortBy), [category, search, sortBy]);

  return (
    <>
      <div className="filters" aria-label="Product filters">
        <input
          placeholder="Search products or artisan"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <p aria-live="polite">Showing {filtered.length} products</p>
      <div className="grid products" style={{ marginTop: "1rem" }}>
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
