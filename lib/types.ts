export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  category: "Home Decor" | "Accessories" | "Jewelry" | "Gifting";
  collectionId: string;
  description: string;
  details: string[];
  images: string[];
  artisanId: string;
  stock: number;
  lowStockThreshold: number;
  featured: boolean;
  active: boolean;
  tags: string[];
  weight: number;
  createdAt: string;
  updatedAt: string;
};

export type Artisan = {
  id: string;
  name: string;
  village: string;
  state: string;
  bio: string;
  shortBio: string;
  photo: string;
  galleryImages: string[];
  youtubeUrl?: string;
  story: string;
  craft: string;
  yearsOfExperience: number;
  productsMade: number;
  familySize: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  featured: boolean;
  active: boolean;
  order: number;
};

export type Review = {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  verified: boolean;
  approved: boolean;
  createdAt: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pinCode: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type SiteConfig = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  announcementBar: string;
  announcementBarEnabled: boolean;
  shippingFreeThreshold: number;
  shippingFlatRate: number;
  statsWomenEmpowered: number;
  statsProductsSold: number;
  // Contact & social
  email: string;
  phone: string;
  whatsapp: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTwitter: string;
  socialYoutube: string;
  // SEO
  metaDescription: string;
  // Homepage banner (optional override)
  bannerImage?: string;
  bannerAlt?: string;
};

export type CartItem = {
  id: string;
  qty: number;
};

export type Notification = {
  id: string;
  type: "new_order" | "low_stock" | "system";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
};
