"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, GripVertical, X, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getFaqs, saveFaq, deleteFaq } from "@/lib/db";
import type { FAQ } from "@/lib/types";

const BLANK: Omit<FAQ, "id"> = { question: "", answer: "", category: "General", order: 0, active: true, createdAt: new Date().toISOString() };

export default function FAQsPage() {
  const [faqs,    setFaqs]    = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<{ open: boolean; id: string | null; form: Omit<FAQ, "id"> }>({ open: false, id: null, form: BLANK });
  const [saving,  setSaving]  = useState(false);

  async function load() {
    setLoading(true);
    const data = await getFaqs();
    setFaqs(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openNew()          { setModal({ open: true, id: null, form: { ...BLANK, order: faqs.length } }); }
  function openEdit(f: FAQ)   { const { id, ...rest } = f; setModal({ open: true, id, form: rest }); }
  function closeModal()       { setModal({ open: false, id: null, form: BLANK }); }

  function setF<K extends keyof Omit<FAQ, "id">>(k: K, v: Omit<FAQ, "id">[K]) {
    setModal((m) => ({ ...m, form: { ...m.form, [k]: v } }));
  }

  async function handleSave() {
    if (!modal.form.question.trim()) { toast.error("Question is required"); return; }
    if (!modal.form.answer.trim())   { toast.error("Answer is required");   return; }
    setSaving(true);
    try {
      await saveFaq(modal.id, modal.form);
      toast.success(modal.id ? "FAQ updated" : "FAQ created");
      closeModal();
      load();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(f: FAQ) {
    if (!confirm(`Delete this FAQ?`)) return;
    await deleteFaq(f.id);
    toast.success("FAQ deleted");
    setFaqs((prev) => prev.filter((x) => x.id !== f.id));
  }

  async function toggleActive(f: FAQ) {
    await saveFaq(f.id, { ...f, active: !f.active });
    setFaqs((prev) => prev.map((x) => x.id === f.id ? { ...x, active: !x.active } : x));
    toast.success(f.active ? "FAQ hidden" : "FAQ visible");
  }

  async function moveOrder(f: FAQ, dir: -1 | 1) {
    const sorted = [...faqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex((x) => x.id === f.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      saveFaq(a.id, { ...a, order: b.order ?? swapIdx }),
      saveFaq(b.id, { ...b, order: a.order ?? idx }),
    ]);
    toast.success("Order updated");
    load();
  }

  const CATEGORIES = ["General", "Orders & Shipping", "Returns", "Products", "Payment"];

  return (
    <AdminLayout title="FAQs">
      <div className="card">
        <div className="table-toolbar">
          <h2 style={{ fontSize: ".95rem" }}>All FAQs</h2>
          <button className="btn btn-primary btn-sm" onClick={openNew}><Plus size={15} /> Add FAQ</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th style={{ width: 40 }}>#</th><th>Question</th><th>Category</th><th>Active</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading…</td></tr>}
              {!loading && faqs.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>No FAQs yet</td></tr>}
              {faqs.map((f, i) => (
                <tr key={f.id}>
                  <td style={{ color: "var(--text-sm)", fontSize: ".8rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: ".1rem" }}>
                      <button className="btn btn-ghost btn-icon" onClick={() => moveOrder(f, -1)} disabled={i === 0} style={{ padding: "2px" }}><ChevronUp size={12} /></button>
                      <button className="btn btn-ghost btn-icon" onClick={() => moveOrder(f, 1)} disabled={i === faqs.length - 1} style={{ padding: "2px" }}><ChevronDown size={12} /></button>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, marginBottom: ".2rem" }}>{f.question}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--text-sm)", maxWidth: 420, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{f.answer}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: ".78rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "999px", padding: ".2rem .6rem" }}>{f.category}</span>
                  </td>
                  <td>
                    <button className="toggle-wrap" onClick={() => toggleActive(f)}>
                      <div className={`toggle ${f.active !== false ? "on" : ""}`} />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      <button className="btn btn-ghost btn-icon" onClick={() => openEdit(f)}><Edit size={14} /></button>
                      <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(f)} style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal.id ? "Edit FAQ" : "New FAQ"}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={18} /></button>
            </div>
            <div className="modal-body form-grid">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={modal.form.category} onChange={(e) => setF("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Question *</label>
                <input value={modal.form.question} onChange={(e) => setF("question", e.target.value)} placeholder="e.g. What is your return policy?" />
              </div>
              <div className="form-group">
                <label className="form-label">Answer *</label>
                <textarea value={modal.form.answer} onChange={(e) => setF("answer", e.target.value)} rows={5} placeholder="Write the answer…" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" value={modal.form.order} onChange={(e) => setF("order", Number(e.target.value))} min={0} />
                </div>
                <div className="form-group" style={{ justifyContent: "flex-end", display: "flex", alignItems: "flex-end" }}>
                  <div className="toggle-wrap">
                    <div className={`toggle ${modal.form.active !== false ? "on" : ""}`} onClick={() => setF("active", !modal.form.active)} />
                    <span className="toggle-label">Active / Visible</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save FAQ"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
