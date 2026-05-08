import Link from "next/link";
import { ShieldCheck, Leaf, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand-col">
            <div className="brand">Trendy Threadz</div>
            <p className="footer-tagline">
              Every stitch supports a sister&apos;s dream. Handmade in India, loved worldwide.
            </p>
            <div className="trust-badges">
              <span className="trust-badge"><ShieldCheck size={14} /> Secure Payments</span>
              <span className="trust-badge"><Leaf size={14} /> Eco-Friendly</span>
              <span className="trust-badge"><Heart size={14} /> Women Empowered</span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="footer-col-title">Shop</p>
            <ul className="footer-links">
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/collections/home-decor">Home Decor</Link></li>
              <li><Link href="/collections/accessories">Accessories</Link></li>
              <li><Link href="/collections/jewelry">Jewelry</Link></li>
              <li><Link href="/collections/gifting">Gifting</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-col-title">Company</p>
            <ul className="footer-links">
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/empowerment">Artisans</Link></li>
              <li><Link href="/about#mission">Our Mission</Link></li>
              <li><Link href="/about#impact">Impact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="footer-col-title">Support</p>
            <ul className="footer-links">
              <li><Link href="/account">My Orders</Link></li>
              <li><Link href="/track">Track Order</Link></li>
              <li><a href="mailto:hello@trendythreadz.com">Contact Us</a></li>
              <li><Link href="/about#faq">FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Trendy Threadz. All rights reserved.</span>
          <span>Made with ♥ for Indian artisans</span>
        </div>
      </div>
    </footer>
  );
}
