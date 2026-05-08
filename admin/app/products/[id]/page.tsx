"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getProduct, saveProduct, getCollections, getArtisans } from "@/lib/db";
import type { Product, Collection, Artisan } from "@/lib/types";

const BLANK: Omit<Product, "id"> = {
  name: "", slug: "", price: 0, comparePrice: undefined, category: "Home Decor",
  collectionId: "", description: "", details: [], images: [], artisanId: "",
  stock: 0, lowStockThreshold: 3, featured: false, active: true, tags: [],
  weight: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
};

export default function ProductFormPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const isNew     = id === "new";

  const [form,        setForm]        = useState<Omit<Product, "id">>(BLANK);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artisans,    setArtisans]    = useState<Artisan[]>([]);
  const [loading,     setLoading]     = useState(!isNew);
  const [saving,      setSaving]      = useState(false);
  const [tagInput,    setTagInput]    = useState("");
  const [imageInput,  setImageInput]  = useState("");
  const [detailInput, setDetailInput] = useState("");

  useEffect(() => {
    Promise.all([getCollections(), getArtisans()]).then(([c, a]) => {
      setCollections(c); setArtisans(a);
    });
    if (!isNew) {
      getProduct(id).then((p) => {
        if (p) { const { id: _, ...rest } = p; setForm(rest as Omit<Product, "id">); }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await saveProduct(isNew ? null : id, { ...form, slug, updatedAt: new Date().toISOString() });
      toast.success(isNew ? "Product created!" : "Product updated!");
      router.push("/products");
    } catch { toast.error("Failed to save product"); }
    finally { setSaving(false); }
  }

  if (loading) return <AdminLayout title="Product"><p style={{ padding: "2rem" }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout title={isNew ? "Add Product" : "Edit Product"}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
        <button className="btn btn-secondary btn-sm" onClick={() => router.push("/products")}><ChevronLeft size={14} /> Products</button>
        <h1 style={{ fontSize: "1.1rem" }}>{isNew ? "Add New Product" : `Edit: ${form.name}`}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
        {/* Main fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card">
            <div className="card-header"><h2>Basic Info</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Hand-Woven Wall Hanging" />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (auto-generated if blank)</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="hand-woven-wall-hanging" />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Describe the product…" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Product Details (bullet points)</h2></div>
            <div className="card-body">
              {form.details.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: ".4rem", marginBottom: ".4rem" }}>
                  <input value={d} onChange={(e) => set("details", form.details.map((x, j) => j === i ? e.target.value : x))} />
                  <button className="btn btn-ghost btn-icon" onClick={() => set("details", form.details.filter((_, j) => j !== i))} style={{ color: "var(--danger)", flexShrink: 0 }}><X size={14} /></button>
                </div>
              ))}
              <div style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}>
                <input value={detailInput} onChange={(e) => setDetailInput(e.target.value)} placeholder="Add a detail…" onKeyDown={(e) => { if (e.key === "Enter" && detailInput.trim()) { set("details", [...form.details, detailInput.trim()]); setDetailInput(""); e.preventDefault(); } }} />
                <button className="btn btn-secondary btn-sm" onClick={() => { if (detailInput.trim()) { set("details", [...form.details, detailInput.trim()]); setDetailInput(""); } }}>Add</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Images (URLs)</h2></div>
            <div className="card-body">
              <div className="img-list">
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={img} alt="" className="img-preview" />
                    <button style={{ position: "absolute", top: -4, right: -4, background: "var(--danger)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => set("images", form.images.filter((_, j) => j !== i))}><X size={10} /></button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: ".4rem", marginTop: ".75rem" }}>
                <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="Paste image URL…" onKeyDown={(e) => { if (e.key === "Enter" && imageInput.trim()) { set("images", [...form.images, imageInput.trim()]); setImageInput(""); e.preventDefault(); } }} />
                <button className="btn btn-secondary btn-sm" onClick={() => { if (imageInput.trim()) { set("images", [...form.images, imageInput.trim()]); setImageInput(""); } }}>Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Side fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card">
            <div className="card-header"><h2>Pricing & Stock</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Compare Price (₹)</label>
                <input type="number" value={form.comparePrice ?? ""} onChange={(e) => set("comparePrice", e.target.value ? Number(e.target.value) : undefined)} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} min={0} />
              </div>
              <div className="form-group">
                <label className="form-label">Low Stock Threshold</label>
                <input type="number" value={form.lowStockThreshold} onChange={(e) => set("lowStockThreshold", Number(e.target.value))} min={1} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (grams)</label>
                <input type="number" value={form.weight} onChange={(e) => set("weight", Number(e.target.value))} min={0} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Organisation</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value as Product["category"])}>
                  {["Home Decor","Accessories","Jewelry","Gifting"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Collection</label>
                <select value={form.collectionId} onChange={(e) => set("collectionId", e.target.value)}>
                  <option value="">None</option>
                  {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Artisan</label>
                <select value={form.artisanId} onChange={(e) => set("artisanId", e.target.value)}>
                  <option value="">None</option>
                  {artisans.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Tags</h2></div>
            <div className="card-body">
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", marginBottom: ".6rem" }}>
                {form.tags.map((t, i) => (
                  <span key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "999px", padding: ".2rem .65rem", fontSize: ".78rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                    {t}
                    <button onClick={() => set("tags", form.tags.filter((_, j) => j !== i))} style={{ color: "var(--text-sm)", cursor: "pointer" }}><X size={10} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: ".4rem" }}>
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag…" onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); e.preventDefault(); } }} />
                <button className="btn btn-secondary btn-sm" onClick={() => { if (tagInput.trim()) { set("tags", [...form.tags, tagInput.trim()]); setTagInput(""); } }}>Add</button>
              </div>
            </div>
          </div>

          <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div className="toggle-wrap">
              <div className={`toggle ${form.featured ? "on" : ""}`} onClick={() => set("featured", !form.featured)} />
              <span className="toggle-label">Featured on homepage</span>
            </div>
            <div className="toggle-wrap">
              <div className={`toggle ${form.active !== false ? "on" : ""}`} onClick={() => set("active", form.active === false ? true : false)} />
              <span className="toggle-label">Active / visible in store</span>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
