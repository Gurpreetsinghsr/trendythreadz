"use client";

import { useEffect, useState } from "react";
import { Search, Star, Trash2, CheckCircle, EyeOff, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/AdminLayout";
import { getReviews, updateReview, deleteReview } from "@/lib/db";
import type { Review } from "@/lib/types";

type Filter = "all" | "pending" | "approved";

export default function ReviewsPage() {
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<Filter>("all");

  async function load() {
    setLoading(true);
    setReviews(await getReviews());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function approve(r: Review) {
    await updateReview(r.id, { approved: true });
    setReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, approved: true } : x));
    toast.success("Review approved");
  }

  async function unapprove(r: Review) {
    await updateReview(r.id, { approved: false });
    setReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, approved: false } : x));
    toast.success("Review unapproved");
  }

  async function handleDelete(r: Review) {
    if (!confirm("Delete this review permanently?")) return;
    await deleteReview(r.id);
    setReviews((prev) => prev.filter((x) => x.id !== r.id));
    toast.success("Review deleted");
  }

  const FILTER_TABS: { key: Filter; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "pending",  label: "Pending"  },
    { key: "approved", label: "Approved" },
  ];

  const filtered = reviews.filter((r) => {
    if (search && !r.authorName?.toLowerCase().includes(search.toLowerCase()) &&
        !r.body?.toLowerCase().includes(search.toLowerCase()) &&
        !r.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "pending")  return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  function Stars({ n }: { n: number }) {
    return (
      <div style={{ display: "flex", gap: 1 }}>
        {[1,2,3,4,5].map((i) => (
          <Star key={i} size={13} fill={i <= n ? "var(--accent)" : "none"} color={i <= n ? "var(--accent)" : "var(--border)"} />
        ))}
      </div>
    );
  }

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <AdminLayout title="Reviews">
      <div className="card">
        <div className="table-toolbar">
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            {FILTER_TABS.map((t) => (
              <button
                key={t.key}
                className={`btn btn-sm ${filter === t.key ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
                {t.key === "pending" && pendingCount > 0 && (
                  <span style={{ background: "var(--danger)", color: "#fff", borderRadius: "999px", fontSize: ".68rem", padding: "1px 6px", marginLeft: ".3rem" }}>{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <Search size={15} />
            <input placeholder="Search reviews…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Reviewer</th><th>Rating</th><th>Review</th><th>Product</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-sm)" }}>No reviews found</td></tr>}
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.authorName || "Anonymous"}</div>
                    {r.verified && <span style={{ fontSize: ".7rem", color: "var(--success)" }}>✓ Verified purchase</span>}
                  </td>
                  <td><Stars n={r.rating} /></td>
                  <td style={{ maxWidth: 320 }}>
                    {r.title && <div style={{ fontWeight: 500, marginBottom: ".2rem", fontSize: ".85rem" }}>{r.title}</div>}
                    <div style={{ fontSize: ".8rem", color: "var(--text-sm)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{r.body}</div>
                  </td>
                  <td style={{ fontSize: ".8rem", color: "var(--text-sm)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.productId || "—"}</td>
                  <td style={{ fontSize: ".78rem", color: "var(--text-sm)", whiteSpace: "nowrap" }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td>
                    {r.approved
                      ? <span className="badge badge-delivered">Approved</span>
                      : <span className="badge badge-pending">Pending</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      {!r.approved
                        ? <button className="btn btn-ghost btn-icon" title="Approve" onClick={() => approve(r)} style={{ color: "var(--success)" }}><CheckCircle size={14} /></button>
                        : <button className="btn btn-ghost btn-icon" title="Unapprove" onClick={() => unapprove(r)}><EyeOff size={14} /></button>
                      }
                      <button className="btn btn-ghost btn-icon" title="Delete" onClick={() => handleDelete(r)} style={{ color: "var(--danger)" }}><Trash2 size={14} /></button>
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
