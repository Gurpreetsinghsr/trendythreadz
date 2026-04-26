export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  artisan: string;
};

export const products: Product[] = [
  {
    id: "sunflower-pot",
    name: "Sunflower Pot",
    price: 35,
    category: "Home Decor",
    description: "Hand-crocheted sunflower pot crafted by women artisans in Rajasthan.",
    image: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&w=900&q=80",
    artisan: "Asha Devi"
  },
  {
    id: "boho-clutch",
    name: "Boho Crochet Clutch",
    price: 49,
    category: "Accessories",
    description: "Elegant hand-stitched clutch with cotton lining and magnetic clasp.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    artisan: "Meera Kumari"
  },
  {
    id: "lotus-earrings",
    name: "Lotus Thread Earrings",
    price: 22,
    category: "Jewelry",
    description: "Lightweight crochet earrings inspired by lotus blooms.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
    artisan: "Kavita Ben"
  },
  {
    id: "heritage-keychain",
    name: "Heritage Keychain",
    price: 15,
    category: "Gifting",
    description: "Colorful crochet keychain made with eco-friendly dyed yarn.",
    image: "https://images.unsplash.com/photo-1616627452249-3adf9f4f0db2?auto=format&fit=crop&w=900&q=80",
    artisan: "Parvati Bai"
  }
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
