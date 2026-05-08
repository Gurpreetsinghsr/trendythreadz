import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Package, Clock, Users } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { getArtisanById } from "@/lib/db/artisans";
import { getProductsByArtisan } from "@/lib/db/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const artisan = await getArtisanById(id);
  if (!artisan) return { title: "Artisan Not Found" };
  return { title: `${artisan.name} — Artisan Story`, description: artisan.shortBio };
}

export default async function ArtisanPage({ params }: Props) {
  const { id } = await params;
  const artisan = await getArtisanById(id);
  if (!artisan) notFound();
  const products = await getProductsByArtisan(artisan.id);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--cream-dark)", padding: "3rem 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/empowerment">Artisans</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: "var(--brown-light)" }}>{artisan.name}</span>
          </div>
          <div className="artisan-hero-grid">
            <div style={{ borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "3/4", position: "relative" }}>
              <Image src={artisan.photo} alt={artisan.name} fill style={{ objectFit: "cover" }} sizes="(max-width:640px) 100vw, 280px" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p className="section-eyebrow">{artisan.craft}</p>
              <h1 style={{ marginBottom: 0 }}>{artisan.name}</h1>
              <p style={{ display: "flex", alignItems: "center", gap: ".4rem", color: "var(--taupe)", fontSize: ".9rem" }}>
                <MapPin size={14} /> {artisan.village}, {artisan.state}
              </p>
              <p style={{ color: "var(--brown-light)", lineHeight: 1.7, maxWidth: "52ch" }}>{artisan.bio}</p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: ".5rem" }}>
                {[
                  { icon: Clock,   label: "Years",         value: `${artisan.yearsOfExperience}+` },
                  { icon: Package, label: "Products Made",  value: `${artisan.productsMade}+` },
                  { icon: Users,   label: "Family Size",    value: `${artisan.familySize}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--white)", border: "1px solid var(--border)", borderRadius: 12, padding: ".8rem 1.2rem", textAlign: "center" }}>
                    <Icon size={18} style={{ color: "var(--gold)", marginBottom: ".3rem" }} />
                    <strong style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem" }}>{value}</strong>
                    <span style={{ fontSize: ".72rem", color: "var(--taupe)", fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <p className="section-eyebrow">Her Story</p>
          <h2 style={{ marginBottom: "1.5rem" }}>In Her Own Words</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {artisan.story.split("\n\n").map((para, i) => (
              <p key={i} style={{ color: "var(--brown-light)", lineHeight: 1.8, fontSize: "1.02rem" }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {artisan.galleryImages.length > 0 && (
        <section className="section-sm" style={{ background: "var(--cream-dark)" }}>
          <div className="container">
            <p className="section-eyebrow" style={{ marginBottom: ".8rem" }}>Gallery</p>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {artisan.galleryImages.map((img, i) => (
                <div key={i} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
                  <Image src={img} alt={`${artisan.name} work ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="220px" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="section-eyebrow">Handmade by {artisan.name}</p>
            <h2 style={{ marginBottom: "2rem" }}>Her Products</h2>
            <div className="grid products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
