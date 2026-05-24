export interface Product {
  slug: string;
  name: string;
  description: string;
  details: string[];
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  stock?: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  gradient: string;
  count: number;
}

export const categories: Category[] = [
  { slug: 'textiles',  name: 'Textiles & Sarees',       description: 'Silk, cotton & handloom fabrics',    gradient: 'from-rose-100 to-orange-100',    count: 45 },
  { slug: 'decor',     name: 'Home Decor',               description: 'Brass, wood & artisan pieces',       gradient: 'from-amber-100 to-yellow-100',   count: 62 },
  { slug: 'bedding',   name: 'Bedding & Cushions',       description: 'Bedspreads, quilts & pillow covers', gradient: 'from-sky-100 to-blue-100',        count: 38 },
  { slug: 'kitchen',   name: 'Kitchen & Cookware',       description: 'Brass, iron & steel cookware',       gradient: 'from-stone-100 to-orange-100',   count: 54 },
  { slug: 'dining',    name: 'Dining & Tableware',       description: 'Serving sets & dining ware',         gradient: 'from-emerald-100 to-teal-100',   count: 29 },
  { slug: 'storage',   name: 'Storage & Organisation',   description: 'Baskets, boxes & organisers',        gradient: 'from-orange-100 to-amber-100',   count: 33 },
  { slug: 'bath',      name: 'Bath & Wellness',          description: 'Soaps, candles & self-care',         gradient: 'from-violet-100 to-purple-100',  count: 21 },
  { slug: 'garden',    name: 'Garden & Plants',          description: 'Planters, decor & wind chimes',      gradient: 'from-green-100 to-emerald-100',  count: 18 },
];

export const categoryGradients: Record<string, string> = {
  textiles: 'from-rose-50 via-orange-50   to-amber-50',
  decor:    'from-amber-50 via-yellow-50  to-orange-50',
  bedding:  'from-sky-50   via-blue-50    to-indigo-50',
  kitchen:  'from-stone-100 via-stone-50  to-orange-50',
  dining:   'from-emerald-50 via-teal-50  to-cyan-50',
  storage:  'from-orange-50 via-amber-50  to-yellow-50',
  bath:     'from-violet-50 via-purple-50 to-pink-50',
  garden:   'from-green-50  via-emerald-50 to-teal-50',
};

export const products: Product[] = [
  {
    slug: 'kanchi-silk-saree',
    name: 'Kanchipuram Silk Saree',
    description: 'Authentic Kanchipuram silk saree with pure gold zari border, woven by master artisans in Kancheepuram.',
    details: ['100% pure mulberry silk', 'Pure gold zari border', 'Length: 6.4 metres', 'Dry clean recommended', 'Comes in a gift box', 'Available in 6 colour variants'],
    price: 3499,
    category: 'textiles',
    rating: 4.8,
    reviewCount: 256,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    slug: 'mysore-silk-saree',
    name: 'Mysore Crepe Silk Saree',
    description: 'Lightweight Mysore silk saree with intricate woven motifs, perfect for daily wear and festive occasions.',
    details: ['Pure Mysore silk', 'Traditional woven motifs', 'Length: 5.5 metres', 'Machine wash gentle', 'Soft drape', 'Available in 4 colours'],
    price: 2799,
    originalPrice: 3499,
    category: 'textiles',
    rating: 4.6,
    reviewCount: 128,
    isOnSale: true,
  },
  {
    slug: 'handloom-cotton-dupatta',
    name: 'Handloom Cotton Dupatta Set',
    description: 'Pair of handloom cotton dupattas with block-print borders, crafted by artisans in Tamil Nadu.',
    details: ['100% handloom cotton', 'Natural block-print dyes', 'Set of 2', 'Length: 2.5 metres each', 'Machine washable', 'Breathable & lightweight'],
    price: 1299,
    category: 'textiles',
    rating: 4.7,
    reviewCount: 89,
    isNewArrival: true,
  },
  {
    slug: 'brass-lotus-diya-set',
    name: 'Brass Lotus Diya Set',
    description: 'Exquisite handcrafted brass diya set shaped like lotus flowers, ideal for puja rooms and festive decor.',
    details: ['Pure brass construction', 'Set of 5 diyas', 'Hand-polished finish', 'Height: 8–14 cm (assorted)', 'Includes wooden tray', 'Gift-ready packaging'],
    price: 1299,
    category: 'decor',
    rating: 4.9,
    reviewCount: 384,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    slug: 'terracotta-planter-set',
    name: 'Terracotta Planter Set',
    description: 'Set of 3 handmade terracotta planters with traditional etched patterns, breathable and perfect for indoor plants.',
    details: ['Handmade terracotta', 'Set of 3 (S/M/L)', 'Traditional etch designs', 'Drainage holes included', 'Suitable for succulents & herbs', 'Natural earth finish'],
    price: 899,
    category: 'decor',
    rating: 4.5,
    reviewCount: 67,
    isNewArrival: true,
  },
  {
    slug: 'wooden-photo-frame-set',
    name: 'Mango Wood Photo Frame Set',
    description: 'Rustic mango wood photo frames with a natural finish, bringing warmth to any wall or shelf display.',
    details: ['Solid mango wood', 'Set of 3 frames', 'Sizes: 4×6, 5×7, 8×10 inches', 'Easel back + wall hanging', 'Hand-rubbed oil finish', 'Holds standard photo prints'],
    price: 649,
    originalPrice: 849,
    category: 'decor',
    rating: 4.3,
    reviewCount: 92,
    isOnSale: true,
  },
  {
    slug: 'handcrafted-bedspread',
    name: 'Handcrafted Block-Print Bedspread',
    description: 'Soft cotton bedspread with traditional Rajasthani block-print motifs, adding colour and culture to your bedroom.',
    details: ['100% breathable cotton', 'King size (274 × 228 cm)', 'Natural vegetable dyes', 'Machine wash cold', 'Reversible design', 'Pre-washed, minimal shrinkage'],
    price: 2199,
    category: 'bedding',
    rating: 4.7,
    reviewCount: 203,
    isFeatured: true,
    isBestSeller: true,
  },
  {
    slug: 'cotton-pillow-covers',
    name: 'Embroidered Cotton Pillow Covers',
    description: 'Set of 5 pure cotton pillow covers with hand-embroidered floral motifs, soft and vibrant for everyday use.',
    details: ['100% combed cotton', 'Set of 5 covers', 'Standard size 45 × 68 cm', 'Hand-embroidered florals', 'Envelope closure', 'Machine washable'],
    price: 899,
    category: 'bedding',
    rating: 4.4,
    reviewCount: 156,
  },
  {
    slug: 'pure-cotton-duvet-cover',
    name: 'Pure Cotton Duvet Cover',
    description: 'Crisp 400-thread-count cotton duvet cover in timeless white with a subtle woven stripe, luxuriously soft.',
    details: ['400 thread count cotton', 'Double size (200 × 200 cm)', 'Button closure', 'Inner ties to secure duvet', 'Hotel-quality finish', 'Machine washable at 60°C'],
    price: 1899,
    category: 'bedding',
    rating: 4.8,
    reviewCount: 41,
    isNewArrival: true,
  },
  {
    slug: 'ceramic-tea-set',
    name: 'Ceramic Tea Set — 7 Piece',
    description: 'Artisan ceramic tea set with a matte glaze and minimalist form, crafted for everyday indulgence.',
    details: ['High-fired ceramic', '6 cups + 1 teapot', 'Capacity: 220 ml cups / 1 L pot', 'Microwave & dishwasher safe', 'Lead-free glaze', 'Elegant gift box included'],
    price: 1599,
    category: 'kitchen',
    rating: 4.6,
    reviewCount: 178,
    isFeatured: true,
  },
  {
    slug: 'stainless-steel-kadai',
    name: 'Triply Stainless Steel Kadai',
    description: 'Professional-grade triply stainless steel kadai with induction compatibility, distributes heat evenly for perfect cooking.',
    details: ['3-ply stainless steel construction', 'Diameter: 28 cm', 'Capacity: 3.5 litres', 'Induction compatible', 'Stay-cool handle', 'Dishwasher safe'],
    price: 2499,
    category: 'kitchen',
    rating: 4.8,
    reviewCount: 312,
    isBestSeller: true,
  },
  {
    slug: 'cast-iron-tawa',
    name: 'Pre-Seasoned Cast Iron Tawa',
    description: 'Heavy-duty pre-seasoned cast iron tawa for dosas, rotis and everything in between — gets better with every use.',
    details: ['Pure cast iron', 'Diameter: 30 cm', 'Pre-seasoned with food-grade oil', 'Compatible with all cooktops', 'Lifetime durability', 'Requires no non-stick coating'],
    price: 1199,
    originalPrice: 1499,
    category: 'kitchen',
    rating: 4.7,
    reviewCount: 267,
    isOnSale: true,
    isBestSeller: true,
  },
  {
    slug: 'copper-water-bottle',
    name: 'Pure Copper Water Bottle',
    description: 'Traditional pure copper water bottle with an Ayurvedic-approved design that naturally purifies and enriches water.',
    details: ['99.5% pure copper', 'Capacity: 950 ml', 'Leak-proof cap', 'Hand-hammered texture', 'Anti-microbial properties', 'Includes cleaning brush'],
    price: 799,
    category: 'kitchen',
    rating: 4.5,
    reviewCount: 93,
    isNewArrival: true,
  },
  {
    slug: 'rustic-mango-wood-tray',
    name: 'Rustic Mango Wood Serving Tray',
    description: 'Solid mango wood serving tray with carved handles, perfect for breakfast in bed, chai service or decorative display.',
    details: ['Solid mango wood', 'Dimensions: 45 × 28 cm', 'Carved cut-out handles', 'Hand-finished with natural oil', 'Suitable for food use', 'Easy to wipe clean'],
    price: 799,
    category: 'dining',
    rating: 4.6,
    reviewCount: 134,
  },
  {
    slug: 'bamboo-dinner-set',
    name: 'Eco Bamboo Dinner Set — 16 Piece',
    description: 'Complete sustainable bamboo dinner set for four, sturdy and food-safe with a natural warm finish.',
    details: ['Organic bamboo', '4 plates, 4 bowls, 4 cups, 4 spoons', 'BPA-free & food-safe', 'Lightweight & sturdy', 'Hand wash recommended', 'Eco-conscious packaging'],
    price: 1299,
    category: 'dining',
    rating: 4.4,
    reviewCount: 28,
    isNewArrival: true,
  },
  {
    slug: 'handpainted-serving-bowl',
    name: 'Handpainted Ceramic Serving Bowl',
    description: 'Large handpainted ceramic serving bowl with traditional floral motifs, a statement piece for your dining table.',
    details: ['High-fired ceramic', 'Diameter: 32 cm', 'Capacity: 3 litres', 'Food-safe paint & glaze', 'Dishwasher safe', 'Microwave safe'],
    price: 1099,
    originalPrice: 1399,
    category: 'dining',
    rating: 4.7,
    reviewCount: 88,
    isOnSale: true,
    isFeatured: true,
  },
  {
    slug: 'bamboo-storage-baskets',
    name: 'Woven Bamboo Storage Basket Set',
    description: 'Set of 3 handwoven bamboo baskets with lids, ideal for organising shelves, wardrobes and pantries beautifully.',
    details: ['Natural bamboo weave', 'Set of 3 (S/M/L)', 'Removable lids included', 'Strong & lightweight', 'Multi-purpose use', 'Folds flat for storage'],
    price: 1499,
    category: 'storage',
    rating: 4.5,
    reviewCount: 102,
  },
  {
    slug: 'jute-rope-organizer',
    name: 'Jute Rope Desk Organiser',
    description: 'Handcrafted jute rope desk organiser with multiple compartments, bringing rustic charm to your workspace.',
    details: ['Natural jute rope', '5 compartment design', 'Dimensions: 30 × 15 × 12 cm', 'Wooden base', 'Holds pens, scissors, remotes', 'Eco-friendly materials'],
    price: 699,
    category: 'storage',
    rating: 4.3,
    reviewCount: 55,
    isNewArrival: true,
  },
  {
    slug: 'handmade-soap-gift-set',
    name: 'Handmade Artisan Soap Gift Set',
    description: 'Collection of 6 cold-process artisan soaps made with natural oils, botanicals and essential oils from South India.',
    details: ['Cold-process method', 'Set of 6 bars (100g each)', 'Coconut, neem, turmeric, rose, sandalwood, charcoal', 'No SLS or parabens', 'Cruelty-free', 'Gift-ready wooden box'],
    price: 699,
    category: 'bath',
    rating: 4.8,
    reviewCount: 189,
    isBestSeller: true,
  },
  {
    slug: 'aromatherapy-candle-set',
    name: 'Soy Wax Aromatherapy Candle Set',
    description: 'Set of 4 luxury soy wax candles with South Indian botanical scents: jasmine, sandalwood, vetiver and rose.',
    details: ['100% natural soy wax', 'Set of 4 (180g each)', 'Cotton wicks (no lead)', 'Burn time: ~45 hours each', 'Hand-poured in small batches', 'Reusable glass jars'],
    price: 1299,
    category: 'bath',
    rating: 4.9,
    reviewCount: 76,
    isNewArrival: true,
    isFeatured: true,
  },
  {
    slug: 'coconut-shell-decor-set',
    name: 'Upcycled Coconut Shell Decor Set',
    description: 'Artisan-crafted decorative set made from upcycled coconut shells, celebrating South Indian craft traditions.',
    details: ['Upcycled coconut shells', 'Set of 5 pieces', 'Hand-carved patterns', 'Lacquered finish', 'Suitable for display or planters', 'Each piece unique'],
    price: 1099,
    category: 'garden',
    rating: 4.4,
    reviewCount: 47,
  },
  {
    slug: 'bamboo-wind-chime',
    name: 'Bamboo & Brass Wind Chime',
    description: 'Melodic wind chime combining natural bamboo tubes and brass bells, filling your home with calming sounds.',
    details: ['Natural bamboo tubes', 'Brass bell accents', 'Length: 65 cm', 'Suitable for indoor & outdoor', 'Resonant, soothing tones', 'Weather-resistant finish'],
    price: 849,
    originalPrice: 999,
    category: 'garden',
    rating: 4.6,
    reviewCount: 63,
    isOnSale: true,
  },
];

export const filterCategories = [
  { slug: 'all', name: 'All Categories' },
  ...categories.map((c) => ({ slug: c.slug, name: c.name })),
];

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string) {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellers() {
  return products.filter((p) => p.isBestSeller);
}

export function getNewArrivals() {
  return products.filter((p) => p.isNewArrival);
}

export function getSaleProducts() {
  return products.filter((p) => p.isOnSale);
}

export function getRelatedProducts(slug: string, category: string) {
  return products.filter((p) => p.category === category && p.slug !== slug).slice(0, 4);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getDiscountPercent(price: number, originalPrice: number) {
  return Math.round((1 - price / originalPrice) * 100);
}
