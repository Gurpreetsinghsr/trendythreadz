"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getProducts, saveProduct, deleteProduct } from "@/lib/db";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  async function load() {
    setLoading(true);
    setProducts(await getProducts());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggleActive(p: Product) {
    await saveProduct(p.id, { ...p, active: !p.active });
    toast.success(p.active ? "Product hidden" : "Product active");
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x));
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await deleteProduct(p.id);
    toast.success("Product deleted");
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
  }

  const filtered = products.filter((p) =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Products">
      <div className="card">
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={15} />
            <input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Link href="/products/new" className="btn btn-primary btn-sm" style={{ gap: ".4rem" }}>
            <Plus size={15} /> Add Product
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>No products found</td></tr>}
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="img-preview" style={{ width: 40, height: 40 }} />}
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: ".75rem", color: "var(--text-sm)" }}>{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: ".8rem" }}>{p.category}</span></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>₹{p.price?.toLocaleString("en-IN")}</div>
                    {p.comparePrice && <div style={{ fontSize: ".78rem", color: "var(--text-sm)", textDecoration: "line-through" }}>₹{p.comparePrice?.toLocaleString("en-IN")}</div>}
                  </td>
                  <td>
                    <span style={{ color: p.stock <= p.lowStockThreshold ? "var(--danger)" : "inherit", fontWeight: p.stock <= p.lowStockThreshold ? 600 : 400 }}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button className="toggle-wrap" onClick={() => saveProduct(p.id, { ...p, featured: !p.featured }).then(() => setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, featured: !x.featured } : x)))}>
                      <div className={`toggle ${p.featured ? "on" : ""}`} />
                    </button>
                  </td>
                  <td>
                    <button className="toggle-wrap" onClick={() => toggleActive(p)}>
                      <div className={`toggle ${p.active !== false ? "on" : ""}`} />
                      <span className="toggle-label" style={{ fontSize: ".78rem" }}>{p.active !== false ? "Active" : "Hidden"}</span>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      <Link href={`/products/${p.id}`} className="btn btn-ghost btn-icon" title="Edit"><Edit size={14} /></Link>
                      <button className="btn btn-ghost btn-icon" title="Delete" onClick={() => handleDelete(p)} style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
