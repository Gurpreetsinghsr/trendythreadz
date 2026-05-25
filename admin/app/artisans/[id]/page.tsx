"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getArtisan, saveArtisan } from "@/lib/db";
import type { Artisan } from "@/lib/types";

const BLANK: Omit<Artisan, "id"> = {
  name: "", village: "", state: "", bio: "", shortBio: "", photo: "",
  galleryImages: [], story: "", craft: "", youtubeUrl: "",
  yearsOfExperience: 0, productsMade: 0, familySize: 0,
  featured: false, active: true, createdAt: new Date().toISOString(),
};

export default function ArtisanFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew  = id === "new";

  const [form,        setForm]        = useState<Omit<Artisan, "id">>(BLANK);
  const [loading,     setLoading]     = useState(!isNew);
  const [saving,      setSaving]      = useState(false);
  const [galleryInput, setGalleryInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      getArtisan(id).then((a) => {
        if (a) { const { id: _, ...rest } = a; setForm(rest as Omit<Artisan, "id">); }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSave() {
    if (!form.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      await saveArtisan(isNew ? null : id, form);
      toast.success(isNew ? "Artisan created!" : "Artisan updated!");
      router.push("/artisans");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  if (loading) return <AdminLayout title="Artisan"><p style={{ padding: "2rem" }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout title={isNew ? "Add Artisan" : "Edit Artisan"}>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.25rem" }}>
        <button className="btn btn-secondary btn-sm" onClick={() => router.push("/artisans")}><ChevronLeft size={14} /> Artisans</button>
        <h1 style={{ fontSize: "1.1rem" }}>{isNew ? "Add New Artisan" : `Edit: ${form.name}`}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card">
            <div className="card-header"><h2>Personal Info</h2></div>
            <div className="card-body form-grid">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full Name *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Craft / Skill</label><input value={form.craft} onChange={(e) => set("craft", e.target.value)} placeholder="e.g. Crochet Weaving" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Village</label><input value={form.village} onChange={(e) => set("village", e.target.value)} /></div>
                <div className="form-group"><label className="form-label">State</label><input value={form.state} onChange={(e) => set("state", e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Short Bio (card tagline)</label><input value={form.shortBio} onChange={(e) => set("shortBio", e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Full Bio</label><textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} /></div>
              <div className="form-group">
                <label className="form-label">Story (use blank line between paragraphs)</label>
                <textarea value={form.story} onChange={(e) => set("story", e.target.value)} rows={6} />
              </div>
              <div className="form-group"><label className="form-label">YouTube URL</label><input value={form.youtubeUrl ?? ""} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/…" /></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Gallery Images (URLs)</h2></div>
            <div className="card-body">
              <div className="img-list">
                {form.galleryImages.map((img, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img src={img} alt="" className="img-preview" />
                    <button style={{ position: "absolute", top: -4, right: -4, background: "var(--danger)", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => set("galleryImages", form.galleryImages.filter((_, j) => j !== i))}><X size={10} /></button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: ".4rem", marginTop: ".75rem" }}>
                <input value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="Paste image URL…" onKeyDown={(e) => { if (e.key === "Enter" && galleryInput.trim()) { set("galleryImages", [...form.galleryImages, galleryInput.trim()]); setGalleryInput(""); e.preventDefault(); } }} />
                <button className="btn btn-secondary btn-sm" onClick={() => { if (galleryInput.trim()) { set("galleryImages", [...form.galleryImages, galleryInput.trim()]); setGalleryInput(""); } }}>Add</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card">
            <div className="card-header"><h2>Profile Photo</h2></div>
            <div className="card-body">
              {form.photo && <img src={form.photo} alt="" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: ".75rem" }} />}
              <input value={form.photo} onChange={(e) => set("photo", e.target.value)} placeholder="Photo URL…" />
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h2>Stats</h2></div>
            <div className="card-body form-grid">
              <div className="form-group"><label className="form-label">Years of Experience</label><input type="number" value={form.yearsOfExperience} onChange={(e) => set("yearsOfExperience", Number(e.target.value))} min={0} /></div>
              <div className="form-group"><label className="form-label">Products Made</label><input type="number" value={form.productsMade} onChange={(e) => set("productsMade", Number(e.target.value))} min={0} /></div>
              <div className="form-group"><label className="form-label">Family Size</label><input type="number" value={form.familySize} onChange={(e) => set("familySize", Number(e.target.value))} min={1} /></div>
            </div>
          </div>

          <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <div className="toggle-wrap">
              <div className={`toggle ${form.featured ? "on" : ""}`} onClick={() => set("featured", !form.featured)} />
              <span className="toggle-label">Featured on homepage</span>
            </div>
            <div className="toggle-wrap">
              <div className={`toggle ${form.active !== false ? "on" : ""}`} onClick={() => set("active", !form.active)} />
              <span className="toggle-label">Active / visible in store</span>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create Artisan" : "Save Changes"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
