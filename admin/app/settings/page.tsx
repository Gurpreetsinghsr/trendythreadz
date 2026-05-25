"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getSiteConfig, saveSiteConfig } from "@/lib/db";
import type { SiteConfig } from "@/lib/types";

const DEFAULT: SiteConfig = {
  siteName: "Trendy Threadz",
  tagline: "Handcrafted with love, empowering artisans",
  heroTitle: "Crafted by Hand.\nEmpowered by Purpose.",
  heroSubtitle: "Discover handcrafted treasures made by women artisans from rural India.",
  announcementBar: "Free shipping on orders above ₹999 · Made by women artisans of India 🇮🇳",
  announcementBarEnabled: true,
  shippingFreeThreshold: 999,
  shippingFlatRate: 99,
  statsWomenEmpowered: 120,
  statsProductsSold: 5000,
  email: "hello@trendythreadz.in",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  socialInstagram: "https://instagram.com/trendythreadz",
  socialFacebook: "",
  socialTwitter: "",
  socialYoutube: "",
  metaDescription: "Handcrafted products by women artisans across rural India.",
  bannerImage: "",
  bannerAlt: "",
};

export default function SettingsPage() {
  const [form,    setForm]    = useState<SiteConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    getSiteConfig().then((cfg) => {
      setForm((prev) => ({ ...prev, ...cfg }));
      setLoading(false);
    });
  }, []);

  function set<K extends keyof SiteConfig>(k: K, v: SiteConfig[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveSiteConfig(form);
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  }

  if (loading) return <AdminLayout title="Settings"><p style={{ padding: "2rem" }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout title="Settings">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Announcement Bar */}
          <div className="card">
            <div className="card-header"><h2>Announcement Bar</h2></div>
            <div className="card-body form-grid">
              <div className="toggle-wrap" style={{ marginBottom: ".5rem" }}>
                <div className={`toggle ${form.announcementBarEnabled ? "on" : ""}`} onClick={() => set("announcementBarEnabled", !form.announcementBarEnabled)} />
                <span className="toggle-label">Show announcement bar</span>
              </div>
              <div className="form-group">
                <label className="form-label">Announcement Text</label>
                <input
                  value={form.announcementBar}
                  onChange={(e) => set("announcementBar", e.target.value)}
                  placeholder="e.g. Free shipping on orders above ₹999"
                  disabled={!form.announcementBarEnabled}
                />
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="card">
            <div className="card-header"><h2>Homepage Hero</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Site Name</label>
                <input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Title (use \n for line break)</label>
                <textarea value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Subtitle</label>
                <textarea value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Banner Image URL (optional override)</label>
                <input value={form.bannerImage ?? ""} onChange={(e) => set("bannerImage", e.target.value)} placeholder="https://…" />
              </div>
              {form.bannerImage && (
                <>
                  <div className="form-group">
                    <label className="form-label">Banner Alt Text</label>
                    <input value={form.bannerAlt ?? ""} onChange={(e) => set("bannerAlt", e.target.value)} />
                  </div>
                  <img src={form.bannerImage} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                </>
              )}
            </div>
          </div>

          {/* Homepage Stats */}
          <div className="card">
            <div className="card-header"><h2>Homepage Stats</h2></div>
            <div className="card-body form-grid">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Women Empowered</label>
                  <input type="number" value={form.statsWomenEmpowered} onChange={(e) => set("statsWomenEmpowered", Number(e.target.value))} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Products Sold</label>
                  <input type="number" value={form.statsProductsSold} onChange={(e) => set("statsProductsSold", Number(e.target.value))} min={0} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Contact Details */}
          <div className="card">
            <div className="card-header"><h2>Contact Details</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hello@yourdomain.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone (display)</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number (no spaces/dashes)</label>
                <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+919876543210" />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card">
            <div className="card-header"><h2>Social Media</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input value={form.socialInstagram} onChange={(e) => set("socialInstagram", e.target.value)} placeholder="https://instagram.com/yourhandle" />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook URL</label>
                <input value={form.socialFacebook} onChange={(e) => set("socialFacebook", e.target.value)} placeholder="https://facebook.com/yourpage" />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter / X URL</label>
                <input value={form.socialTwitter} onChange={(e) => set("socialTwitter", e.target.value)} placeholder="https://twitter.com/yourhandle" />
              </div>
              <div className="form-group">
                <label className="form-label">YouTube URL</label>
                <input value={form.socialYoutube} onChange={(e) => set("socialYoutube", e.target.value)} placeholder="https://youtube.com/@yourchannel" />
              </div>
            </div>
          </div>

          {/* Shipping Config */}
          <div className="card">
            <div className="card-header"><h2>Shipping</h2></div>
            <div className="card-body form-grid">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Free Shipping Threshold (₹)</label>
                  <input type="number" value={form.shippingFreeThreshold} onChange={(e) => set("shippingFreeThreshold", Number(e.target.value))} min={0} />
                </div>
                <div className="form-group">
                  <label className="form-label">Flat Shipping Rate (₹)</label>
                  <input type="number" value={form.shippingFlatRate} onChange={(e) => set("shippingFlatRate", Number(e.target.value))} min={0} />
                </div>
              </div>
              <p style={{ fontSize: ".78rem", color: "var(--text-sm)", margin: 0 }}>
                Orders above ₹{form.shippingFreeThreshold.toLocaleString("en-IN")} get free shipping; others pay ₹{form.shippingFlatRate}.
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="card">
            <div className="card-header"><h2>SEO</h2></div>
            <div className="card-body form-grid">
              <div className="form-group">
                <label className="form-label">Meta Description</label>
                <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} placeholder="One sentence describing your store…" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky save bar */}
      <div style={{ position: "sticky", bottom: 0, background: "var(--sidebar-bg)", borderTop: "1px solid var(--border)", padding: "1rem 0", marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving} style={{ minWidth: 160 }}>
          {saving ? "Saving…" : "Save All Settings"}
        </button>
      </div>
    </AdminLayout>
  );
}
