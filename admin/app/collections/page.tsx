"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getCollections, saveCollection, deleteCollection } from "@/lib/db";
import type { Collection } from "@/lib/types";

const BLANK: Omit<Collection, "id"> = {
  name: "", slug: "", description: "", coverImage: "", featured: false, active: true, order: 0,
};

export default function CollectionsPage() {
  const [items,   setItems]   = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<{ open: boolean; id: string | null; form: Omit<Collection, "id"> }>({ open: false, id: null, form: BLANK });
  const [saving,  setSaving]  = useState(false);

  async function load() { setLoading(true); setItems(await getCollections()); setLoading(false); }
  useEffect(() => { load(); }, []);

  function openNew() { setModal({ open: true, id: null, form: BLANK }); }
  function openEdit(c: Collection) { const { id, ...rest } = c; setModal({ open: true, id, form: rest }); }

  async function handleSave() {
    if (!modal.form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const slug = modal.form.slug || modal.form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await saveCollection(modal.id, { ...modal.form, slug });
      toast.success(modal.id ? "Collection updated" : "Collection created");
      setModal({ open: false, id: null, form: BLANK });
      load();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(c: Collection) {
    if (!confirm(`Delete "${c.name}"?`)) return;
    await deleteCollection(c.id);
    toast.success("Collection deleted");
    setItems((prev) => prev.filter((x) => x.id !== c.id));
  }

  function setF<K extends keyof Omit<Collection,"id">>(k: K, v: Omit<Collection,"id">[K]) {
    setModal((m) => ({ ...m, form: { ...m.form, [k]: v } }));
  }

  return (
    <AdminLayout title="Collections">
      <div className="card">
        <div className="table-toolbar">
          <h2 style={{ fontSize: ".95rem" }}>All Collections</h2>
          <button className="btn btn-primary btn-sm" onClick={openNew}><Plus size={15} /> Add Collection</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Collection</th><th>Slug</th><th>Order</th><th>Featured</th><th>Active</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading…</td></tr>}
              {items.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      {c.coverImage && <img src={c.coverImage} alt="" className="img-preview" style={{ width: 40, height: 30, objectFit: "cover" }} />}
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: ".75rem", color: "var(--text-sm)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: ".8rem", color: "var(--text-sm)" }}>{c.slug}</td>
                  <td>{c.order}</td>
                  <td><span className={`badge ${c.featured ? "badge-confirmed" : "badge-cancelled"}`}>{c.featured ? "Yes" : "No"}</span></td>
                  <td><span className={`badge ${c.active !== false ? "badge-delivered" : "badge-cancelled"}`}>{c.active !== false ? "Active" : "Hidden"}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      <button className="btn btn-ghost btn-icon" onClick={() => openEdit(c)}><Edit size={14} /></button>
                      <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(c)} style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal({ open: false, id: null, form: BLANK })}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal.id ? "Edit Collection" : "New Collection"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setModal({ open: false, id: null, form: BLANK })}><X size={18} /></button>
            </div>
            <div className="modal-body form-grid">
              <div className="form-group"><label className="form-label">Name *</label><input value={modal.form.name} onChange={(e) => setF("name", e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Slug</label><input value={modal.form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="auto-generated" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea value={modal.form.description} onChange={(e) => setF("description", e.target.value)} rows={2} /></div>
              <div className="form-group"><label className="form-label">Cover Image URL</label><input value={modal.form.coverImage} onChange={(e) => setF("coverImage", e.target.value)} placeholder="https://…" /></div>
              {modal.form.coverImage && <img src={modal.form.coverImage} alt="" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />}
              <div className="form-row">
                <div className="form-group"><label className="form-label">Display Order</label><input type="number" value={modal.form.order} onChange={(e) => setF("order", Number(e.target.value))} /></div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <div className="toggle-wrap">
                  <div className={`toggle ${modal.form.featured ? "on" : ""}`} onClick={() => setF("featured", !modal.form.featured)} />
                  <span className="toggle-label">Featured</span>
                </div>
                <div className="toggle-wrap">
                  <div className={`toggle ${modal.form.active !== false ? "on" : ""}`} onClick={() => setF("active", !modal.form.active)} />
                  <span className="toggle-label">Active</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal({ open: false, id: null, form: BLANK })}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Collection"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
