import type { Metadata } from "next";
import { ArtisanCard }     from "@/components/shop/ArtisanCard";
import { getActiveArtisans } from "@/lib/db/artisans";
import { getSiteConfig }   from "@/lib/db/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artisan Empowerment",
  description: "Meet the rural Indian women artisans behind every Trendy Threadz product.",
};

export default async function EmpowermentPage() {
  const [artisans, config] = await Promise.all([getActiveArtisans(), getSiteConfig()]);

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--brown)", color: "var(--white)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <p className="section-eyebrow" style={{ color: "var(--gold-light)" }}>The Women Behind Every Stitch</p>
          <h1 style={{ color: "var(--white)", marginBottom: ".8rem" }}>Artisan Empowerment</h1>
          <p style={{ maxWidth: "52ch", margin: "0 auto", opacity: .75, lineHeight: 1.7 }}>
            Every Trendy Threadz product is made by a skilled woman artisan in rural India.
            We pay fair prices, tell honest stories, and reinvest in the communities that make us possible.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <div className="impact-bar">
        <div className="container">
          <div className="grid impact-grid">
            <div>
              <p className="impact-number">{config.statsWomenEmpowered}+</p>
              <p className="impact-label">Women Artisans</p>
            </div>
            <div>
              <p className="impact-number">4</p>
              <p className="impact-label">Indian States</p>
            </div>
            <div>
              <p className="impact-number">{config.statsProductsSold.toLocaleString("en-IN")}+</p>
              <p className="impact-label">Products Made</p>
            </div>
            <div>
              <p className="impact-number">100%</p>
              <p className="impact-label">Fair Wages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Artisan Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Our Community</p>
              <h2>Meet the Artisans</h2>
            </div>
          </div>
          <div className="grid artisans-grid">
            {artisans.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "var(--cream-dark)" }}>
        <div className="container" style={{ maxWidth: 720, textAlign: "center" }}>
          <p className="section-eyebrow">How We Work</p>
          <h2 style={{ marginBottom: "2rem" }}>The Trendy Threadz Model</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", textAlign: "left" }}>
            {[
              { num: "01", title: "Discover", text: "We find exceptional artisans in rural communities through NGO partners and word of mouth." },
              { num: "02", title: "Partner",  text: "Each artisan sets their own price. We add a transparent platform fee and ship worldwide." },
              { num: "03", title: "Empower",  text: "Artisans receive payment within 7 days of sale, with full story credit on every product." },
              { num: "04", title: "Grow",     text: "We reinvest 5% of revenue in artisan skill-building workshops and community programs." },
            ].map((s) => (
              <div key={s.num} style={{ background: "var(--white)", borderRadius: "var(--radius)", padding: "1.5rem", border: "1px solid var(--border)" }}>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>{s.num}</p>
                <h3 style={{ margin: ".4rem 0 .6rem" }}>{s.title}</h3>
                <p style={{ fontSize: ".87rem", color: "var(--brown-light)", lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
