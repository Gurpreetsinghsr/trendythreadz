import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Leaf, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about Trendy Threadz — our mission to empower rural Indian women artisans.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--brown)", color: "var(--white)", padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <p className="section-eyebrow" style={{ color: "var(--gold-light)" }}>Our Story</p>
          <h1 style={{ color: "var(--white)", maxWidth: "20ch", margin: "0 auto .8rem" }}>A Business Built on Dignity, Craft, and Community</h1>
          <p style={{ maxWidth: "52ch", margin: "0 auto", opacity: .75, lineHeight: 1.7 }}>
            Born from a belief that the world&apos;s most beautiful things are made by hand — and the hands that make them deserve to be paid fairly.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <p className="section-eyebrow">How it started</p>
            <h2 style={{ marginBottom: "1rem" }}>The Story Behind the Stitches</h2>
            <p style={{ color: "var(--brown-light)", lineHeight: 1.8, marginBottom: "1rem" }}>
              In 2020, our founder Priya visited a village fair in Sanganer, Rajasthan, and discovered extraordinary crochet work — wall hangings and jewellery
              unlike anything in any boutique.
            </p>
            <p style={{ color: "var(--brown-light)", lineHeight: 1.8, marginBottom: "1rem" }}>
              The artisan, Asha Devi, was selling a three-day piece for under ₹200. &quot;I could sell it to you for that,&quot; she said, &quot;but I could not sell it for more.&quot;
              There were simply no buyers who would pay a fair price.
            </p>
            <p style={{ color: "var(--brown-light)", lineHeight: 1.8 }}>
              Priya drove home with Asha&apos;s number and a new purpose. Six months later, Trendy Threadz was live.
            </p>
          </div>
          <div style={{ background: "var(--cream-dark)", borderRadius: "var(--radius)", padding: "2rem", border: "1px solid var(--border)" }}>
            <blockquote style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontStyle: "italic", lineHeight: 1.5, color: "var(--brown)", marginBottom: "1rem" }}>
              &ldquo;I could sell it to you for ₹200, but I could not sell it for more. There are simply no buyers who will pay a fair price.&rdquo;
            </blockquote>
            <p style={{ fontSize: ".88rem", color: "var(--taupe)", fontWeight: 600 }}>— Asha Devi, founding artisan, Sanganer, Rajasthan</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: "var(--cream-dark)" }} id="impact">
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="section-eyebrow">Our Journey</p>
          <h2 style={{ marginBottom: "2rem" }}>How We Grew</h2>
          <div className="timeline">
            {[
              { year: "2020", title: "The First Stitch", text: "Founder Priya meets Asha Devi and launches Trendy Threadz with 4 artisans and 12 products." },
              { year: "2021", title: "A Collective Forms", text: "We expand to Gujarat and Maharashtra. Revenue crosses ₹10 lakh. Meera and Kavita join." },
              { year: "2022", title: "Going National", text: "150 artisans across 4 states. First international order shipped to the UK." },
              { year: "2023", title: "Impact Milestone", text: "300+ women earning fair wages. Average artisan income up 340%. Awarded Best Social Enterprise, India Craft Council." },
              { year: "2024", title: "Today", text: "500+ artisans, 5,000+ products sold. Every stitch still supports a sister's dream." },
            ].map((item) => (
              <div key={item.year} className="timeline-item">
                <p className="timeline-year">{item.year}</p>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" id="mission">
        <div className="container">
          <p className="section-eyebrow" style={{ textAlign: "center" }}>What we stand for</p>
          <h2 style={{ textAlign: "center", marginBottom: "2.5rem" }}>Our Values</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              { icon: Heart, title: "Dignity First", text: "Every artisan is credited by name, paid within 7 days, and free to price her work fairly." },
              { icon: Leaf, title: "Earth Friendly", text: "Natural, eco-dyed yarns and biodegradable packaging. No synthetic fibres, no plastic." },
              { icon: Award, title: "Quality Always", text: "Every product is hand-inspected before shipping. We'd rather delay a sale than send something below standard." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ width: 48, height: 48, background: "rgba(196,154,60,.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} style={{ color: "var(--gold)" }} />
                </div>
                <h3 style={{ fontSize: "1.2rem" }}>{title}</h3>
                <p style={{ fontSize: ".88rem", color: "var(--brown-light)", lineHeight: 1.65 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--brown)", color: "var(--white)", padding: "3.5rem 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ color: "var(--white)", marginBottom: ".6rem" }}>Join the Movement</h2>
          <p style={{ opacity: .75, marginBottom: "1.5rem" }}>Shop handmade. Support livelihoods. Make a difference, one stitch at a time.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-gold btn-lg">Shop Now</Link>
            <Link href="/empowerment" className="btn btn-secondary btn-lg" style={{ color: "var(--brown)" }}>
              Meet the Artisans <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
