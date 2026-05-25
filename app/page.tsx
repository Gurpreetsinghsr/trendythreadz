import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Heart, Award } from "lucide-react";
import { ProductCard }    from "@/components/shop/ProductCard";
import { ArtisanCard }    from "@/components/shop/ArtisanCard";
import { getSiteConfig }  from "@/lib/db/config";
import { getFeaturedProducts } from "@/lib/db/products";
import { getActiveCollections } from "@/lib/db/collections";
import { getFeaturedArtisans }  from "@/lib/db/artisans";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [config, featuredProducts, collections, featuredArtisans] = await Promise.all([
    getSiteConfig(),
    getFeaturedProducts(),
    getActiveCollections(),
    getFeaturedArtisans(),
  ]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="hero-eyebrow">
            <Leaf size={12} /> Handcrafted in India
          </div>
          <h1>{config.heroTitle}</h1>
          <p className="hero-subtitle">{config.heroSubtitle}</p>
          <div className="hero-actions">
            <Link href="/products"    className="btn btn-primary btn-lg">Shop Collection</Link>
            <Link href="/empowerment" className="btn btn-secondary btn-lg">Meet the Artisans</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{config.statsWomenEmpowered}+</strong>
              <span>Women Empowered</span>
            </div>
            <div className="hero-stat">
              <strong>{config.statsProductsSold.toLocaleString("en-IN")}+</strong>
              <span>Products Sold</span>
            </div>
            <div className="hero-stat">
              <strong>98%</strong>
              <span>Happy Customers</span>
            </div>
            <div className="hero-stat">
              <strong>4</strong>
              <span>Indian States</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Handpicked</p>
                <h2>Featured Products</h2>
              </div>
              <Link href="/products" className="btn btn-ghost" style={{ gap: ".4rem" }}>
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid products-grid">
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  artisanName={featuredArtisans.find((a) => a.id === p.artisanId)?.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Collections ──────────────────────────────────────── */}
      {collections.length > 0 && (
        <section className="section" style={{ background: "var(--cream-dark)" }}>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Browse by theme</p>
                <h2>Our Collections</h2>
              </div>
              <Link href="/collections" className="btn btn-ghost" style={{ gap: ".4rem" }}>
                All Collections <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid collections-grid">
              {collections.map((col) => (
                <Link href={`/collections/${col.slug}`} key={col.id} className="collection-card">
                  <Image
                    src={col.coverImage}
                    alt={col.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                  <div className="collection-overlay" />
                  <div className="collection-arrow"><ArrowRight size={16} /></div>
                  <div className="collection-info">
                    <h3>{col.name}</h3>
                    <p>{col.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mission Quote ─────────────────────────────────────── */}
      <section className="mission-section" id="mission">
        <div className="container">
          <p className="section-eyebrow" style={{ color: "var(--gold-light)", marginBottom: "1.2rem" }}>Our Purpose</p>
          <blockquote className="mission-quote">&ldquo;Every purchase you make is a vote for the world you want to live in.&rdquo;</blockquote>
          <p className="mission-text">
            Trendy Threadz was founded to bridge the gap between India&apos;s extraordinary rural artisans
            and the global customers who would love their work. We pay fair prices, tell honest stories,
            and reinvest in the communities that make us possible.
          </p>
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem" }}>
              <Leaf size={24} style={{ color: "var(--gold-light)" }} />
              <span style={{ fontSize: ".82rem", opacity: .75 }}>Eco-Friendly</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem" }}>
              <Heart size={24} style={{ color: "var(--gold-light)" }} />
              <span style={{ fontSize: ".82rem", opacity: .75 }}>Fair Wages</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem" }}>
              <Award size={24} style={{ color: "var(--gold-light)" }} />
              <span style={{ fontSize: ".82rem", opacity: .75 }}>Quality Craft</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Artisans ─────────────────────────────────────────── */}
      {featuredArtisans.length > 0 && (
        <section className="section" id="artisans">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">The Women Behind Every Stitch</p>
                <h2>Meet Our Artisans</h2>
              </div>
              <Link href="/empowerment" className="btn btn-ghost" style={{ gap: ".4rem" }}>
                All Artisans <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid artisans-grid">
              {featuredArtisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="section cta-section" style={{ background: "var(--cream-dark)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ marginBottom: ".6rem" }}>Every Stitch Supports a Sister&apos;s Dream</h2>
          <p style={{ color: "var(--brown-light)", maxWidth: "48ch", margin: "0 auto 1.5rem", lineHeight: 1.7 }}>
            Join thousands of customers who have brought a little of India&apos;s craft heritage into their homes —
            while making a real difference.
          </p>
          <Link href="/products" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </section>
    </>
  );
}
