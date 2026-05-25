"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getArtisans, saveArtisan, deleteArtisan } from "@/lib/db";
import type { Artisan } from "@/lib/types";

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");

  async function load() {
    setLoading(true);
    setArtisans(await getArtisans());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggleActive(a: Artisan) {
    await saveArtisan(a.id, { ...a, active: !a.active });
    toast.success(a.active ? "Artisan hidden" : "Artisan visible");
    setArtisans((prev) => prev.map((x) => x.id === a.id ? { ...x, active: !x.active } : x));
  }

  async function toggleFeatured(a: Artisan) {
    await saveArtisan(a.id, { ...a, featured: !a.featured });
    toast.success(a.featured ? "Removed from featured" : "Marked as featured");
    setArtisans((prev) => prev.map((x) => x.id === a.id ? { ...x, featured: !x.featured } : x));
  }

  async function handleDelete(a: Artisan) {
    if (!confirm(`Delete "${a.name}"? This cannot be undone.`)) return;
    await deleteArtisan(a.id);
    toast.success("Artisan deleted");
    setArtisans((prev) => prev.filter((x) => x.id !== a.id));
  }

  const filtered = artisans.filter((a) =>
    !search ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.craft?.toLowerCase().includes(search.toLowerCase()) ||
    a.village?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Artisans">
      <div className="card">
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={15} />
            <input placeholder="Search artisans…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Link href="/artisans/new" className="btn btn-primary btn-sm" style={{ gap: ".4rem" }}>
            <Plus size={15} /> Add Artisan
          </Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Artisan</th>
                <th>Craft</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>No artisans found</td></tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                      {a.photo
                        ? <img src={a.photo} alt="" className="img-preview" style={{ width: 40, height: 50, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                        : <div style={{ width: 40, height: 50, background: "var(--bg)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-sm)", fontSize: ".7rem" }}>No photo</div>
                      }
                      <div>
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                        <div style={{ fontSize: ".75rem", color: "var(--text-sm)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.shortBio}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: ".85rem" }}>{a.craft || "—"}</td>
                  <td style={{ fontSize: ".85rem", color: "var(--text-sm)" }}>
                    {[a.village, a.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td style={{ fontSize: ".85rem" }}>
                    {a.yearsOfExperience ? `${a.yearsOfExperience} yrs` : "—"}
                  </td>
                  <td>
                    <button className="toggle-wrap" onClick={() => toggleFeatured(a)}>
                      <div className={`toggle ${a.featured ? "on" : ""}`} />
                    </button>
                  </td>
                  <td>
                    <button className="toggle-wrap" onClick={() => toggleActive(a)}>
                      <div className={`toggle ${a.active !== false ? "on" : ""}`} />
                      <span className="toggle-label" style={{ fontSize: ".78rem" }}>{a.active !== false ? "Active" : "Hidden"}</span>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      <Link href={`/artisans/${a.id}`} className="btn btn-ghost btn-icon" title="Edit"><Edit size={14} /></Link>
                      <button className="btn btn-ghost btn-icon" title="Delete" onClick={() => handleDelete(a)} style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
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
