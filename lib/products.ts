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
  { slug: 'electronics', name: 'Electronics',          description: 'TVs, ACs, appliances & gadgets',       gradient: 'from-blue-100 to-cyan-100',      count: 120 },
  { slug: 'kitchen',     name: 'Kitchen & Cookware',   description: 'Cookware, tools & storage',            gradient: 'from-stone-100 to-orange-100',   count: 80  },
  { slug: 'clothing',    name: 'Clothing & Apparel',   description: 'Men, women & kids fashion',            gradient: 'from-fuchsia-100 to-pink-100',   count: 75  },
  { slug: 'fashion',     name: 'Fashion Accessories',  description: 'Bags, wallets, belts & more',          gradient: 'from-rose-100 to-red-100',        count: 50  },
  { slug: 'decor',       name: 'Home Decor',           description: 'Brass, wood & artisan pieces',         gradient: 'from-amber-100 to-yellow-100',   count: 60  },
  { slug: 'linen',       name: 'Towels & Linen',       description: 'Bath towels, kitchen & hand towels',   gradient: 'from-sky-100 to-blue-100',        count: 45  },
  { slug: 'mats',        name: 'Mats & Rugs',          description: 'Door mats, bath mats & area rugs',     gradient: 'from-teal-100 to-emerald-100',   count: 40  },
  { slug: 'dining',      name: 'Dining & Tableware',   description: 'Dinner sets, serving & glassware',     gradient: 'from-emerald-100 to-teal-100',   count: 40  },
  { slug: 'storage',     name: 'Storage & Organise',   description: 'Baskets, boxes & kitchen racks',       gradient: 'from-orange-100 to-amber-100',   count: 35  },
  { slug: 'gifts',       name: 'Gifts & Hampers',      description: 'Curated gifts for every occasion',     gradient: 'from-pink-100 to-rose-100',      count: 30  },
  { slug: 'bath',        name: 'Bath & Wellness',      description: 'Soaps, candles & self-care',           gradient: 'from-violet-100 to-purple-100',  count: 25  },
  { slug: 'garden',      name: 'Garden & Outdoors',    description: 'Planters, tools & outdoor decor',      gradient: 'from-green-100 to-emerald-100',  count: 20  },
  { slug: 'furniture',   name: 'Furniture',            description: 'Sofas, beds, wardrobes & dining sets',  gradient: 'from-amber-100 to-orange-100',   count: 35  },
];

export const categoryGradients: Record<string, string> = {
  electronics: 'from-blue-50    via-cyan-50    to-sky-50',
  kitchen:     'from-stone-100  via-stone-50   to-orange-50',
  clothing:    'from-fuchsia-50 via-pink-50    to-rose-50',
  fashion:     'from-rose-50    via-red-50     to-orange-50',
  decor:       'from-amber-50   via-yellow-50  to-orange-50',
  linen:       'from-sky-50     via-blue-50    to-indigo-50',
  mats:        'from-teal-50    via-emerald-50 to-green-50',
  dining:      'from-emerald-50 via-teal-50    to-cyan-50',
  storage:     'from-orange-50  via-amber-50   to-yellow-50',
  gifts:       'from-pink-50    via-rose-50    to-orange-50',
  bath:        'from-violet-50  via-purple-50  to-pink-50',
  garden:      'from-green-50   via-emerald-50 to-teal-50',
  furniture:   'from-amber-50   via-orange-50  to-yellow-50',
};

// ─── ELECTRONICS ────────────────────────────────────────────────────────────
// ─── KITCHEN & COOKWARE ──────────────────────────────────────────────────────
// ─── HOME DECOR ──────────────────────────────────────────────────────────────
// ─── DINING & TABLEWARE ──────────────────────────────────────────────────────
// ─── STORAGE & ORGANISE ──────────────────────────────────────────────────────
// ─── GIFTS & HAMPERS ─────────────────────────────────────────────────────────
// ─── BATH & WELLNESS ─────────────────────────────────────────────────────────
// ─── GARDEN & OUTDOORS ───────────────────────────────────────────────────────

export const products: Product[] = [

  // ── ELECTRONICS ─────────────────────────────────────────────────────────
  {
    slug: '4k-smart-led-tv-43',
    name: '43″ 4K Smart LED TV',
    description: 'Ultra-HD 4K Smart TV with Android OS, built-in Wi-Fi, Dolby Audio and wide-angle display.',
    details: ['43-inch UHD 4K display', 'Android 11 OS', 'Built-in Wi-Fi & Bluetooth', 'Dolby Audio & DTS', '3×HDMI, 2×USB', '1 year warranty'],
    price: 28999, originalPrice: 35999, category: 'electronics', subcategory: 'Television',
    rating: 4.6, reviewCount: 312, isFeatured: true, isOnSale: true,
  },
  {
    slug: '32-hd-smart-tv',
    name: '32″ HD Smart LED TV',
    description: 'Compact HD Smart TV ideal for bedrooms and kitchens, with built-in streaming apps.',
    details: ['32-inch HD Ready', 'Built-in Netflix, YouTube', 'Wi-Fi enabled', '2×HDMI, 1×USB', 'Slim bezel design', '1 year warranty'],
    price: 14999, originalPrice: 18999, category: 'electronics', subcategory: 'Television',
    rating: 4.4, reviewCount: 189, isOnSale: true,
  },
  {
    slug: '1.5-ton-split-ac',
    name: '1.5 Ton 5-Star Split AC',
    description: 'Energy-efficient 1.5 ton inverter split AC with auto-clean, turbo cool and Wi-Fi control.',
    details: ['1.5 ton cooling capacity', '5-star BEE rating', 'Inverter compressor', 'Auto-clean function', 'Wi-Fi + app control', '5 yr compressor warranty'],
    price: 36999, originalPrice: 44999, category: 'electronics', subcategory: 'Air Conditioner',
    rating: 4.7, reviewCount: 241, isFeatured: true, isBestSeller: true, isOnSale: true,
  },
  {
    slug: '1-ton-window-ac',
    name: '1 Ton 3-Star Window AC',
    description: 'Reliable 1 ton window AC with fast cooling, sleep mode and auto-restart after power cut.',
    details: ['1 ton capacity', '3-star BEE rating', 'Auto-restart function', 'Sleep mode', 'Filter clean indicator', '1 yr warranty'],
    price: 21999, category: 'electronics', subcategory: 'Air Conditioner',
    rating: 4.3, reviewCount: 98,
  },
  {
    slug: 'double-door-refrigerator-340l',
    name: '340 L Double Door Refrigerator',
    description: 'Frost-free double door refrigerator with digital inverter technology and multi-air flow cooling.',
    details: ['340 litre capacity', 'Frost-free', 'Digital inverter compressor', 'Multi-air flow system', 'Toughened glass shelves', '10 yr compressor warranty'],
    price: 32999, originalPrice: 39999, category: 'electronics', subcategory: 'Refrigerator',
    rating: 4.8, reviewCount: 178, isFeatured: true, isOnSale: true,
  },
  {
    slug: 'single-door-refrigerator-190l',
    name: '190 L Single Door Refrigerator',
    description: 'Compact direct-cool single door fridge with large vegetable crisper, ideal for small families.',
    details: ['190 litre capacity', 'Direct cool', 'Large vegetable crisper', '5-star energy rating', 'Toughened glass shelf', '1 yr warranty'],
    price: 14999, category: 'electronics', subcategory: 'Refrigerator',
    rating: 4.4, reviewCount: 134,
  },
  {
    slug: 'front-load-washing-machine-7kg',
    name: '7 kg Front Load Washing Machine',
    description: 'Inverter direct drive front-load washing machine with steam wash, AI DD and 14 wash programs.',
    details: ['7 kg capacity', 'Front load', 'Inverter direct drive motor', 'Steam wash & AI DD', '14 wash programs', '10 yr motor warranty'],
    price: 37999, originalPrice: 46999, category: 'electronics', subcategory: 'Washing Machine',
    rating: 4.7, reviewCount: 209, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'top-load-washing-machine-8kg',
    name: '8 kg Semi-Automatic Washing Machine',
    description: 'Durable semi-automatic top load machine with rat mesh, in-built soak and lint filter.',
    details: ['8 kg capacity', 'Semi-automatic', 'In-built soak function', 'Rat mesh protection', 'Lint filter', 'Rust-proof body'],
    price: 12999, category: 'electronics', subcategory: 'Washing Machine',
    rating: 4.3, reviewCount: 167,
  },
  {
    slug: 'microwave-oven-25l-convection',
    name: '25 L Convection Microwave Oven',
    description: 'Multi-function convection microwave with grill, 101 auto-cook menus and child lock.',
    details: ['25 litre capacity', 'Microwave + grill + convection', '101 auto-cook menus', 'Slim fry & healthy steam', 'Child lock', '1 yr warranty'],
    price: 12499, originalPrice: 16999, category: 'electronics', subcategory: 'Microwave',
    rating: 4.5, reviewCount: 143, isOnSale: true,
  },
  {
    slug: 'solo-microwave-20l',
    name: '20 L Solo Microwave Oven',
    description: 'Compact and easy-to-use solo microwave with defrost, auto-cook and power levels.',
    details: ['20 litre capacity', 'Solo mode', '5 power levels', 'Auto defrost', '8 auto-cook menus', '1 yr warranty'],
    price: 5999, category: 'electronics', subcategory: 'Microwave',
    rating: 4.2, reviewCount: 88,
  },
  {
    slug: 'mixer-grinder-750w',
    name: '750W Mixer Grinder — 4 Jars',
    description: 'Powerful 750W mixer grinder with 4 stainless steel jars, overload protection and 3 speed settings.',
    details: ['750W motor', '4 SS jars (liquidising, grinding, chutney, dry)', '3 speed + pulse', 'Overload protection', 'Stainless steel blades', '2 yr warranty'],
    price: 3299, originalPrice: 4499, category: 'electronics', subcategory: 'Kitchen Appliances',
    rating: 4.6, reviewCount: 534, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'induction-cooktop-2000w',
    name: '2000W Induction Cooktop',
    description: 'High-efficiency induction cooktop with auto voltage regulation, 8 preset menus and boost mode.',
    details: ['2000W power', '8 cooking presets', 'Auto voltage regulation', 'Timer: up to 3 hrs', 'Crystal glass panel', '2 yr warranty'],
    price: 2499, category: 'electronics', subcategory: 'Kitchen Appliances',
    rating: 4.5, reviewCount: 312, isFeatured: true,
  },
  {
    slug: 'air-fryer-5l',
    name: '5 L Digital Air Fryer',
    description: 'XL capacity digital air fryer with 8 preset programs, rapid air circulation and non-stick basket.',
    details: ['5 litre basket', '8 preset programs', '40–200°C temperature range', 'Rapid air circulation', 'Non-stick basket', '360° viewing window'],
    price: 5999, originalPrice: 7999, category: 'electronics', subcategory: 'Kitchen Appliances',
    rating: 4.7, reviewCount: 278, isNewArrival: true, isOnSale: true,
  },
  {
    slug: 'electric-kettle-1-5l',
    name: '1.5 L Stainless Steel Electric Kettle',
    description: 'Fast-boil 1.5 L stainless steel kettle with auto shut-off, boil-dry protection and 360° base.',
    details: ['1.5 litre capacity', '1500W fast boil', 'Auto shut-off', 'Boil-dry protection', '360° cordless base', 'SS inner body'],
    price: 999, category: 'electronics', subcategory: 'Kitchen Appliances',
    rating: 4.4, reviewCount: 421, isBestSeller: true,
  },
  {
    slug: 'otg-oven-42l',
    name: '42 L OTG Oven',
    description: 'Large 42 L oven toaster griller with motorised rotisserie, 6 heating modes and convection fan.',
    details: ['42 litre capacity', '6 heating modes', 'Motorised rotisserie', 'Convection fan', 'Temperature: 100–250°C', '2 yr warranty'],
    price: 7499, originalPrice: 9499, category: 'electronics', subcategory: 'Kitchen Appliances',
    rating: 4.6, reviewCount: 156, isOnSale: true,
  },
  {
    slug: 'hand-blender-600w',
    name: '600W Hand Blender with Chopper',
    description: 'Ergonomic hand blender with turbo boost, stainless steel blade and dishwasher-safe chopper.',
    details: ['600W motor', 'Turbo boost function', 'SS blade', 'Dishwasher-safe parts', '500 ml chopper jar', '2 yr warranty'],
    price: 1999, category: 'electronics', subcategory: 'Kitchen Appliances',
    rating: 4.3, reviewCount: 94, isNewArrival: true,
  },
  {
    slug: 'room-heater-2000w',
    name: '2000W Quartz Room Heater',
    description: 'Instant-heat quartz room heater with 2 power settings, tip-over protection and cool-touch body.',
    details: ['2000W (1000W + 1000W)', '2 heat settings', 'Tip-over auto cut-off', 'Cool-touch body', 'Adjustable thermostat', 'ISI marked'],
    price: 2999, category: 'electronics', subcategory: 'Heating & Cooling',
    rating: 4.4, reviewCount: 67,
  },
  {
    slug: 'tower-fan-400mm',
    name: '400mm Pedestal Tower Fan',
    description: 'Slim tower fan with 3 speed settings, 7-hour timer, remote control and 70° wide oscillation.',
    details: ['400mm sweep', '3 speed settings', '7-hr timer', '70° oscillation', 'Remote control', 'LED display'],
    price: 3499, category: 'electronics', subcategory: 'Heating & Cooling',
    rating: 4.3, reviewCount: 112,
  },
  {
    slug: 'ceiling-fan-1200mm',
    name: '1200mm BEE-Rated Ceiling Fan',
    description: 'Energy-efficient 1200mm ceiling fan with aerodynamic blades, 5-star rating and remote.',
    details: ['1200mm blade span', '5-star BEE rating', 'BLDC motor', 'Remote with 6 speeds', 'Saves 55% energy vs regular', 'Aluminium blades'],
    price: 3999, originalPrice: 4999, category: 'electronics', subcategory: 'Heating & Cooling',
    rating: 4.5, reviewCount: 88, isOnSale: true,
  },
  {
    slug: 'water-purifier-ro-uv',
    name: 'RO+UV+UF Water Purifier — 7 Stage',
    description: '7-stage RO+UV+UF water purifier with mineral cartridge, 10 L tank and TDS controller.',
    details: ['7-stage purification', 'RO + UV + UF', '10 litre storage tank', 'TDS controller', 'Mineral cartridge', '1 yr warranty + free installation'],
    price: 8999, originalPrice: 12999, category: 'electronics', subcategory: 'Water Purifier',
    rating: 4.7, reviewCount: 203, isFeatured: true, isOnSale: true,
  },

  // ── KITCHEN & COOKWARE ───────────────────────────────────────────────────
  {
    slug: 'triply-stainless-steel-kadai',
    name: 'Triply Stainless Steel Kadai — 28 cm',
    description: 'Professional-grade triply stainless steel kadai with even heat distribution and induction base.',
    details: ['3-ply SS construction', '28 cm diameter', '3.5 L capacity', 'Induction compatible', 'Stay-cool handle', 'Dishwasher safe'],
    price: 2499, category: 'kitchen', subcategory: 'Cookware',
    rating: 4.8, reviewCount: 312, isBestSeller: true,
  },
  {
    slug: 'cast-iron-tawa',
    name: 'Pre-Seasoned Cast Iron Tawa — 30 cm',
    description: 'Heavy-duty cast iron tawa for dosas, rotis and parathas — gets better with every use.',
    details: ['Pure cast iron', '30 cm diameter', 'Pre-seasoned', 'All cooktops compatible', 'Lifetime durability', 'No non-stick coating needed'],
    price: 1199, originalPrice: 1499, category: 'kitchen', subcategory: 'Cookware',
    rating: 4.7, reviewCount: 267, isOnSale: true, isBestSeller: true,
  },
  {
    slug: 'aluminium-pressure-cooker-5l',
    name: 'Aluminium Pressure Cooker — 5 L',
    description: 'ISI-certified aluminium pressure cooker with metallic safety plug, direct flame compatible.',
    details: ['5 litre capacity', 'ISI certified', 'Metallic safety plug', 'Induction base', 'Extra gasket included', '5 yr warranty'],
    price: 1399, category: 'kitchen', subcategory: 'Cookware',
    rating: 4.5, reviewCount: 198, isFeatured: true,
  },
  {
    slug: 'stainless-steel-pressure-cooker-3l',
    name: 'Stainless Steel Pressure Cooker — 3 L',
    description: 'Triply stainless steel pressure cooker for gas and induction with ergonomic handles.',
    details: ['3 litre capacity', 'Triply SS', 'Induction compatible', 'Ergonomic side handles', 'Gasket & safety valve', '5 yr warranty'],
    price: 1899, category: 'kitchen', subcategory: 'Cookware',
    rating: 4.6, reviewCount: 145,
  },
  {
    slug: 'non-stick-fry-pan-set',
    name: 'Non-Stick Fry Pan Set — 3 Piece',
    description: 'PFOA-free granite non-stick fry pan set in 3 sizes, suitable for gas and induction cooktops.',
    details: ['Set of 3: 20, 24, 28 cm', 'PFOA-free granite coating', 'Induction base', 'Bakelite handle', 'Oven safe to 180°C', 'Dishwasher safe'],
    price: 1799, originalPrice: 2499, category: 'kitchen', subcategory: 'Cookware',
    rating: 4.5, reviewCount: 223, isOnSale: true,
  },
  {
    slug: 'copper-water-bottle',
    name: 'Pure Copper Water Bottle — 950 ml',
    description: 'Ayurvedic-approved pure copper bottle with hammer finish that naturally purifies water.',
    details: ['99.5% pure copper', '950 ml capacity', 'Leak-proof cap', 'Hand-hammered texture', 'Anti-microbial', 'Includes cleaning brush'],
    price: 799, category: 'kitchen', subcategory: 'Bottles & Flasks',
    rating: 4.5, reviewCount: 93, isNewArrival: true,
  },
  {
    slug: 'insulated-stainless-flask',
    name: 'Insulated Stainless Steel Flask — 750 ml',
    description: 'Double-wall vacuum insulated flask that keeps drinks hot 12 hrs and cold 24 hrs.',
    details: ['750 ml capacity', 'Double-wall vacuum', 'Hot 12 hr / cold 24 hr', 'Leak-proof flip lid', '18/8 stainless steel', 'BPA-free'],
    price: 699, category: 'kitchen', subcategory: 'Bottles & Flasks',
    rating: 4.6, reviewCount: 178, isBestSeller: true,
  },
  {
    slug: 'steel-lunch-box-3-tier',
    name: 'Stainless Steel 3-Tier Lunch Box',
    description: 'Leak-proof stainless steel 3-tier tiffin box with insulated carry bag, perfect for office and school.',
    details: ['3 containers (each 300 ml)', 'Leak-proof clip locks', '18/8 food-grade SS', 'Insulated carry bag included', 'Microwave-safe containers', 'Easy to clean'],
    price: 899, category: 'kitchen', subcategory: 'Lunch Boxes',
    rating: 4.4, reviewCount: 211,
  },
  {
    slug: 'ss-kitchen-knife-set',
    name: 'Stainless Steel Kitchen Knife Set — 6 Piece',
    description: '6-piece German steel kitchen knife set with full-tang blades, ergonomic handles and wooden block.',
    details: ['6 knives: chef, bread, paring, utility, santoku, carving', 'German SS blades', 'Full-tang construction', 'Non-slip ergonomic handles', 'Wooden storage block', 'Rust-resistant'],
    price: 2299, originalPrice: 3299, category: 'kitchen', subcategory: 'Kitchen Tools',
    rating: 4.7, reviewCount: 134, isOnSale: true,
  },
  {
    slug: 'bamboo-cutting-board',
    name: 'Bamboo Cutting Board Set — 3 Piece',
    description: 'Eco-friendly bamboo cutting board set in 3 sizes with juice groove and non-slip feet.',
    details: ['Set of 3 boards', 'Organic bamboo', 'Juice groove', 'Non-slip rubber feet', 'Anti-bacterial surface', 'Easy to wash'],
    price: 899, category: 'kitchen', subcategory: 'Kitchen Tools',
    rating: 4.4, reviewCount: 87,
  },
  {
    slug: 'spice-box-steel',
    name: 'Stainless Steel Spice Box — 7 Containers',
    description: 'Classic Indian masala dabba with 7 round SS spice containers, a spoon and a transparent lid.',
    details: ['7 round SS containers', 'Transparent lid', 'SS spoon included', 'Airtight seal', 'Mirror polish finish', 'Diameter: 24 cm'],
    price: 799, category: 'kitchen', subcategory: 'Kitchen Tools',
    rating: 4.8, reviewCount: 342, isBestSeller: true,
  },
  {
    slug: 'ceramic-tea-set-7pc',
    name: 'Ceramic Tea Set — 7 Piece',
    description: 'Artisan ceramic tea set with matte glaze and minimalist form for everyday indulgence.',
    details: ['6 cups + 1 teapot', 'High-fired ceramic', '220 ml cups / 1 L pot', 'Microwave & dishwasher safe', 'Lead-free glaze', 'Gift box included'],
    price: 1599, category: 'kitchen', subcategory: 'Tea & Coffee',
    rating: 4.6, reviewCount: 178, isFeatured: true,
  },
  {
    slug: 'electric-coffee-maker',
    name: 'Drip Coffee Maker — 6 Cup',
    description: '6-cup drip coffee maker with anti-drip valve, permanent filter and keep-warm plate.',
    details: ['6-cup carafe', 'Anti-drip valve', 'Permanent stainless filter', 'Keep-warm plate', '800W', '2 yr warranty'],
    price: 1799, category: 'kitchen', subcategory: 'Tea & Coffee',
    rating: 4.4, reviewCount: 92,
  },

  // ── HOME DECOR ───────────────────────────────────────────────────────────
  {
    slug: 'brass-lotus-diya-set',
    name: 'Brass Lotus Diya Set — Set of 5',
    description: 'Exquisite handcrafted brass diya set shaped like lotus flowers for puja rooms and festive decor.',
    details: ['Pure brass', 'Set of 5 diyas', 'Hand-polished', 'Height: 8–14 cm', 'Wooden tray included', 'Gift packaging'],
    price: 1299, category: 'decor', subcategory: 'Puja & Spiritual',
    rating: 4.9, reviewCount: 384, isFeatured: true, isBestSeller: true,
  },
  {
    slug: 'brass-puja-thali-set',
    name: 'Brass Puja Thali Set — 7 Piece',
    description: 'Engraved brass puja thali set with diya, bell, agarbatti stand, glass, spoon, plate and bowl.',
    details: ['7-piece set', 'Pure brass', 'Engraved floral pattern', 'Diya, bell, incense stand, glass, spoon, plate, bowl', 'Hand-polished', 'Velvet-lined gift box'],
    price: 2199, category: 'decor', subcategory: 'Puja & Spiritual',
    rating: 4.8, reviewCount: 156, isFeatured: true,
  },
  {
    slug: 'wooden-photo-frame-set',
    name: 'Mango Wood Photo Frame Set — 3 Piece',
    description: 'Rustic mango wood photo frames with natural finish, bringing warmth to any wall or shelf.',
    details: ['Solid mango wood', 'Set of 3: 4×6, 5×7, 8×10 in', 'Easel back + wall hanging', 'Hand-rubbed oil finish', 'Holds standard prints'],
    price: 649, originalPrice: 849, category: 'decor', subcategory: 'Photo Frames',
    rating: 4.3, reviewCount: 92, isOnSale: true,
  },
  {
    slug: 'decorative-wall-clock',
    name: 'Wrought Iron Decorative Wall Clock',
    description: 'Vintage-style wrought iron wall clock with Roman numerals and silent quartz movement.',
    details: ['40 cm diameter', 'Wrought iron frame', 'Silent quartz movement', 'Roman numerals', 'AA battery', 'Antique bronze finish'],
    price: 1499, category: 'decor', subcategory: 'Clocks',
    rating: 4.5, reviewCount: 78, isNewArrival: true,
  },
  {
    slug: 'terracotta-planter-set',
    name: 'Terracotta Planter Set — Set of 3',
    description: 'Handmade terracotta planters with traditional etched patterns, breathable for indoor plants.',
    details: ['Set of 3 (S/M/L)', 'Handmade terracotta', 'Drainage holes', 'Traditional etch designs', 'Suits succulents & herbs', 'Natural earth finish'],
    price: 899, category: 'decor', subcategory: 'Planters',
    rating: 4.5, reviewCount: 67, isNewArrival: true,
  },
  {
    slug: 'brass-ganesh-statue',
    name: 'Handcrafted Brass Ganesha Statue',
    description: 'Intricately detailed solid brass Ganesha idol in seated position, auspicious for home and office.',
    details: ['Solid brass', 'Height: 15 cm', 'Seated pose', 'Hand-cast & finished', 'Velvet base included', 'Gift-ready box'],
    price: 1799, category: 'decor', subcategory: 'Idols & Statues',
    rating: 4.9, reviewCount: 267, isBestSeller: true,
  },
  {
    slug: 'ceramic-flower-vase-set',
    name: 'Ceramic Flower Vase Set — Set of 3',
    description: 'Minimalist ceramic vases in 3 heights with matte glaze, ideal for dried and fresh flowers.',
    details: ['Set of 3 (15, 22, 30 cm)', 'Matte ceramic glaze', 'Watertight', 'Stable weighted base', 'Neutral tones', 'Dishwasher safe'],
    price: 1099, category: 'decor', subcategory: 'Vases',
    rating: 4.4, reviewCount: 53, isNewArrival: true,
  },

  // ── DINING & TABLEWARE ───────────────────────────────────────────────────
  {
    slug: 'ss-dinner-set-27pc',
    name: 'Stainless Steel Dinner Set — 27 Piece',
    description: 'Complete 27-piece stainless steel dinner set for 6 people with mirror-polish finish.',
    details: ['27 pieces for 6 persons', '18/8 food-grade SS', '6 plates, 6 bowls, 6 glasses, 6 spoons, 3 serving bowls', 'Mirror polish', 'Stackable design', 'Dishwasher safe'],
    price: 2999, originalPrice: 3999, category: 'dining', subcategory: 'Dinner Sets',
    rating: 4.7, reviewCount: 189, isFeatured: true, isOnSale: true,
  },
  {
    slug: 'ceramic-dinner-set-12pc',
    name: 'Ceramic Dinner Set — 12 Piece',
    description: 'Elegant off-white ceramic dinner set with subtle blue rim for 4 persons, oven and dishwasher safe.',
    details: ['12 pieces for 4 persons', '4 dinner plates, 4 side plates, 4 bowls', 'High-fired ceramic', 'Oven safe to 200°C', 'Dishwasher safe', 'Gift-ready box'],
    price: 2799, category: 'dining', subcategory: 'Dinner Sets',
    rating: 4.6, reviewCount: 112,
  },
  {
    slug: 'handpainted-serving-bowl',
    name: 'Handpainted Ceramic Serving Bowl — 3 L',
    description: 'Large handpainted ceramic serving bowl with traditional floral motifs, a table centrepiece.',
    details: ['3 litre capacity', '32 cm diameter', 'High-fired ceramic', 'Food-safe glaze', 'Dishwasher & microwave safe'],
    price: 1099, originalPrice: 1399, category: 'dining', subcategory: 'Serving Bowls',
    rating: 4.7, reviewCount: 88, isOnSale: true, isFeatured: true,
  },
  {
    slug: 'rustic-mango-wood-tray',
    name: 'Rustic Mango Wood Serving Tray',
    description: 'Solid mango wood serving tray with carved handles, for breakfast, chai or display.',
    details: ['Solid mango wood', '45 × 28 cm', 'Carved cut-out handles', 'Natural oil finish', 'Food safe', 'Easy to wipe clean'],
    price: 799, category: 'dining', subcategory: 'Serving Trays',
    rating: 4.6, reviewCount: 134,
  },
  {
    slug: 'bamboo-dinner-set-16pc',
    name: 'Eco Bamboo Dinner Set — 16 Piece',
    description: 'Sustainable bamboo dinner set for 4 — sturdy, food-safe and naturally antibacterial.',
    details: ['16 pieces for 4 persons', 'Organic bamboo', '4 plates, 4 bowls, 4 cups, 4 spoons', 'BPA-free', 'Hand wash recommended', 'Eco packaging'],
    price: 1299, category: 'dining', subcategory: 'Dinner Sets',
    rating: 4.4, reviewCount: 28, isNewArrival: true,
  },
  {
    slug: 'borosilicate-glass-set',
    name: 'Borosilicate Glass Water Set — 7 Piece',
    description: '7-piece borosilicate glass water set with 1 pitcher and 6 tumblers, thermal shock resistant.',
    details: ['1 L pitcher + 6 × 300 ml glasses', 'Borosilicate glass', 'Thermal shock resistant', 'Dishwasher safe', 'Lead & cadmium free', 'Elegant gift box'],
    price: 1499, category: 'dining', subcategory: 'Glassware',
    rating: 4.5, reviewCount: 67,
  },

  // ── STORAGE & ORGANISE ───────────────────────────────────────────────────
  {
    slug: 'bamboo-storage-baskets',
    name: 'Woven Bamboo Storage Basket Set — 3 Piece',
    description: 'Handwoven bamboo baskets with lids for shelves, wardrobes and pantries.',
    details: ['Set of 3 (S/M/L)', 'Natural bamboo weave', 'Removable lids', 'Lightweight & strong', 'Multi-purpose', 'Folds flat'],
    price: 1499, category: 'storage', subcategory: 'Baskets',
    rating: 4.5, reviewCount: 102,
  },
  {
    slug: 'jute-rope-organizer',
    name: 'Jute Rope Desk Organiser — 5 Compartment',
    description: 'Handcrafted jute rope desk organiser with wooden base and 5 compartments.',
    details: ['Natural jute rope', '5 compartments', '30 × 15 × 12 cm', 'Wooden base', 'Holds pens, scissors, remotes', 'Eco-friendly'],
    price: 699, category: 'storage', subcategory: 'Desk Organisers',
    rating: 4.3, reviewCount: 55, isNewArrival: true,
  },
  {
    slug: 'kitchen-rack-4-tier',
    name: '4-Tier Stainless Steel Kitchen Rack',
    description: 'Adjustable 4-tier SS kitchen rack for plates, vessels and pantry items, with anti-rust coating.',
    details: ['4 tiers', 'Stainless steel', 'Adjustable shelf height', 'Anti-rust coating', 'Stable wide base', 'Max load: 40 kg'],
    price: 2299, originalPrice: 2999, category: 'storage', subcategory: 'Kitchen Racks',
    rating: 4.6, reviewCount: 143, isOnSale: true,
  },
  {
    slug: 'fridge-storage-set',
    name: 'Refrigerator Storage Container Set — 6 Piece',
    description: 'Stackable BPA-free fridge containers with airtight lids to keep food fresh longer.',
    details: ['Set of 6 containers', 'BPA-free food-grade plastic', 'Airtight lids', 'Stackable design', 'Dishwasher safe', 'Label stickers included'],
    price: 899, category: 'storage', subcategory: 'Kitchen Containers',
    rating: 4.4, reviewCount: 198, isBestSeller: true,
  },
  {
    slug: 'ss-canister-set',
    name: 'Stainless Steel Canister Set — 5 Piece',
    description: 'Airtight stainless steel canisters for flour, sugar, rice, lentils and coffee with click-lock lids.',
    details: ['Set of 5 (700 ml to 2 L)', '18/8 food-grade SS', 'Click-lock airtight lid', 'Transparent lid window', 'Stackable', 'Rust-resistant'],
    price: 1599, category: 'storage', subcategory: 'Kitchen Containers',
    rating: 4.7, reviewCount: 87,
  },

  // ── GIFTS & HAMPERS ──────────────────────────────────────────────────────
  {
    slug: 'diwali-brass-gift-set',
    name: 'Diwali Brass Gift Hamper',
    description: 'Premium Diwali hamper with brass diya, puja thali, agarbatti stand and dry fruits box.',
    details: ['Brass diya set (3 pieces)', 'Engraved puja thali', 'Agarbatti stand', 'Dry fruits box (assorted)', 'Decorative box with ribbon', 'Card included'],
    price: 2499, originalPrice: 2999, category: 'gifts', subcategory: 'Festival Hampers',
    rating: 4.9, reviewCount: 203, isFeatured: true, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'kitchen-starter-gift-set',
    name: 'Kitchen Starter Gift Set',
    description: 'Complete kitchen gift set with copper bottle, spice box, knife set and wooden tray — perfect housewarming gift.',
    details: ['Copper water bottle (950 ml)', '7-container SS spice box', '3-piece knife set', 'Mango wood serving tray', 'Kraft gift box', 'Personalised card option'],
    price: 3499, category: 'gifts', subcategory: 'Housewarming',
    rating: 4.8, reviewCount: 89, isNewArrival: true,
  },
  {
    slug: 'handmade-soap-gift-set',
    name: 'Handmade Artisan Soap Gift Set — 6 Bars',
    description: 'Cold-process artisan soaps made with coconut, neem, turmeric, rose, sandalwood and charcoal.',
    details: ['6 bars (100 g each)', 'Cold-process method', 'Coconut, neem, turmeric, rose, sandalwood, charcoal', 'No SLS or parabens', 'Cruelty-free', 'Wooden gift box'],
    price: 699, category: 'gifts', subcategory: 'Wellness Gifts',
    rating: 4.8, reviewCount: 189, isBestSeller: true,
  },
  {
    slug: 'corporate-dry-fruit-box',
    name: 'Premium Dry Fruits & Nuts Gift Box',
    description: 'Elegant corporate gift box with 6 compartments of premium almonds, cashews, pistachios, raisins, walnuts and dates.',
    details: ['6 dry fruit varieties', '500 g total', 'Almonds, cashews, pistachios, raisins, walnuts, dates', 'Premium wooden box', 'Silk ribbon', 'Personalised card option'],
    price: 1899, category: 'gifts', subcategory: 'Corporate Gifts',
    rating: 4.7, reviewCount: 134,
  },
  {
    slug: 'pongal-festive-hamper',
    name: 'Pongal Festive Hamper',
    description: 'Traditional Pongal hamper with brass pot, traditional sweets, agarbatti and sugar cane tokens.',
    details: ['Brass pongal pot (500 ml)', 'Traditional sweet mix (250 g)', 'Agarbatti set', 'Sugar cane tokens (decorative)', 'Banana leaf motif packaging', 'Personalised card'],
    price: 1799, category: 'gifts', subcategory: 'Festival Hampers',
    rating: 4.8, reviewCount: 76, isNewArrival: true,
  },
  {
    slug: 'spa-wellness-gift-set',
    name: 'Spa & Wellness Gift Set',
    description: 'Luxurious spa gift set with soy candles, essential oils, artisan soap and a bamboo tray.',
    details: ['2 soy wax candles', '2 essential oil roll-ons', '2 artisan soaps', 'Bamboo tray', 'Linen pouch', 'Gift-ready packaging'],
    price: 2299, category: 'gifts', subcategory: 'Wellness Gifts',
    rating: 4.7, reviewCount: 58, isFeatured: true,
  },

  // ── BATH & WELLNESS ──────────────────────────────────────────────────────
  {
    slug: 'aromatherapy-candle-set',
    name: 'Soy Wax Aromatherapy Candle Set — 4 Candles',
    description: 'Luxury hand-poured soy candles in jasmine, sandalwood, vetiver and rose — in reusable glass jars.',
    details: ['4 × 180 g candles', '100% soy wax', 'Cotton wicks (no lead)', '~45 hr burn each', 'Reusable glass jars', 'South Indian botanical scents'],
    price: 1299, category: 'bath', subcategory: 'Candles',
    rating: 4.9, reviewCount: 76, isNewArrival: true, isFeatured: true,
  },
  {
    slug: 'essential-oil-set-6',
    name: 'Pure Essential Oil Set — 6 Oils',
    description: '100% pure therapeutic-grade essential oils: lavender, peppermint, eucalyptus, tea tree, lemon and orange.',
    details: ['6 × 10 ml oils', '100% pure, undiluted', 'Lavender, peppermint, eucalyptus, tea tree, lemon, orange', 'Dark glass bottles', 'Aromatherapy-grade', 'Gift box included'],
    price: 999, category: 'bath', subcategory: 'Essential Oils',
    rating: 4.7, reviewCount: 143, isBestSeller: true,
  },
  {
    slug: 'organic-soap-neem-turmeric',
    name: 'Organic Neem & Turmeric Soap Bar',
    description: 'Handmade cold-process neem and turmeric soap bar, antibacterial and brightening for all skin types.',
    details: ['100 g bar', 'Neem & turmeric', 'Cold-process method', 'No SLS, parabens or artificial color', 'Cruelty-free', 'Compostable packaging'],
    price: 199, category: 'bath', subcategory: 'Soaps',
    rating: 4.6, reviewCount: 312,
  },
  {
    slug: 'ubtan-face-scrub',
    name: 'Traditional Ubtan Face & Body Scrub',
    description: 'Ayurvedic ubtan made with sandalwood, turmeric, rose petals and chickpea flour for glowing skin.',
    details: ['150 g tub', 'Sandalwood, turmeric, rose, chickpea flour', 'Ayurvedic recipe', 'No chemicals or preservatives', 'Suitable for all skin types', 'Compostable packaging'],
    price: 349, category: 'bath', subcategory: 'Skincare',
    rating: 4.5, reviewCount: 87,
  },

  // ── GARDEN & OUTDOORS ────────────────────────────────────────────────────
  {
    slug: 'coconut-shell-decor-set',
    name: 'Upcycled Coconut Shell Decor Set — 5 Piece',
    description: 'Artisan-crafted decorative set from upcycled coconut shells, celebrating South Indian craft.',
    details: ['5 pieces', 'Upcycled coconut shells', 'Hand-carved', 'Lacquered finish', 'For display or planters', 'Each piece unique'],
    price: 1099, category: 'garden', subcategory: 'Outdoor Decor',
    rating: 4.4, reviewCount: 47,
  },
  {
    slug: 'bamboo-wind-chime',
    name: 'Bamboo & Brass Wind Chime — 65 cm',
    description: 'Melodic wind chime combining bamboo tubes and brass bells, bringing calm to any space.',
    details: ['65 cm length', 'Natural bamboo tubes', 'Brass bell accents', 'Indoor & outdoor', 'Soothing resonant tones', 'Weather-resistant finish'],
    price: 849, originalPrice: 999, category: 'garden', subcategory: 'Wind Chimes',
    rating: 4.6, reviewCount: 63, isOnSale: true,
  },
  {
    slug: 'ceramic-garden-planter-large',
    name: 'Hand-Painted Ceramic Garden Planter — Large',
    description: 'Large hand-painted ceramic planter with drainage hole, bold geometric pattern for patios and balconies.',
    details: ['35 cm diameter', 'Hand-painted ceramic', 'Drainage hole + saucer', 'Weather-resistant glaze', 'Bold geometric motif', 'Frost-resistant'],
    price: 1499, category: 'garden', subcategory: 'Planters',
    rating: 4.6, reviewCount: 54, isNewArrival: true,
  },
  {
    slug: 'garden-tool-set-5pc',
    name: 'Garden Tool Set — 5 Piece',
    description: 'Ergonomic 5-piece garden tool set with trowel, fork, weeder, rake and transplanter in a canvas roll.',
    details: ['5 tools: trowel, fork, weeder, rake, transplanter', 'Stainless steel heads', 'Rubberised ergonomic handles', 'Canvas roll-up pouch', 'Rust-resistant', 'Gift-ready'],
    price: 1299, category: 'garden', subcategory: 'Garden Tools',
    rating: 4.5, reviewCount: 38,
  },

  // ── CLOTHING & APPAREL ────────────────────────────────────────────────────
  {
    slug: 'mens-cotton-polo-tshirt',
    name: "Men's Cotton Polo T-Shirt",
    description: "Classic fit men's polo t-shirt in 100% combed cotton with ribbed collar and two-button placket.",
    details: ['100% combed cotton', 'Classic fit', 'Ribbed collar & cuffs', 'Available: S, M, L, XL, XXL', 'Machine washable', 'Multiple colours'],
    price: 599, originalPrice: 799, category: 'clothing', subcategory: "Men's Wear",
    rating: 4.4, reviewCount: 312, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'mens-formal-shirt',
    name: "Men's Formal Cotton Shirt",
    description: "Smart formal shirt in premium cotton with slim fit, wrinkle-resistant finish and spread collar.",
    details: ['100% premium cotton', 'Slim fit', 'Wrinkle-resistant', 'Spread collar', 'Available: S, M, L, XL', 'Dry-clean or machine wash cold'],
    price: 899, originalPrice: 1299, category: 'clothing', subcategory: "Men's Wear",
    rating: 4.5, reviewCount: 187, isOnSale: true,
  },
  {
    slug: 'mens-track-pant',
    name: "Men's Fleece Track Pants",
    description: "Comfortable fleece track pants with elastic waistband, drawstring and deep pockets.",
    details: ['Cotton-fleece blend', 'Elastic + drawstring waist', 'Two side pockets', 'Available: S, M, L, XL, XXL', 'Machine washable', 'Regular fit'],
    price: 699, category: 'clothing', subcategory: "Men's Wear",
    rating: 4.3, reviewCount: 145,
  },
  {
    slug: 'womens-cotton-kurta',
    name: "Women's Printed Cotton Kurta",
    description: "Soft pure cotton kurta with Jaipur block-print, straight cut with side slits and 3/4 sleeves.",
    details: ['100% pure cotton', 'Block-print pattern', 'Straight cut with side slits', '3/4 sleeves', 'Available: XS–3XL', 'Machine washable'],
    price: 899, originalPrice: 1199, category: 'clothing', subcategory: "Women's Wear",
    rating: 4.7, reviewCount: 423, isFeatured: true, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'womens-anarkali-kurti',
    name: "Women's Anarkali Kurti",
    description: "Flared Anarkali kurti in georgette with intricate embroidery, ideal for festive and casual occasions.",
    details: ['Georgette fabric', 'Embroidered neckline', 'Flared Anarkali cut', 'Available: XS–2XL', 'Dry wash recommended', 'Festive & casual wear'],
    price: 1499, originalPrice: 1999, category: 'clothing', subcategory: "Women's Wear",
    rating: 4.6, reviewCount: 234, isOnSale: true,
  },
  {
    slug: 'womens-palazzo-set',
    name: "Women's Kurta & Palazzo Set",
    description: "Matching kurta and palazzo pant set in cotton-silk blend with digital floral print.",
    details: ['Cotton-silk blend', 'Matching palazzo included', 'Digital floral print', 'Available: XS–3XL', 'Hand wash recommended', 'Co-ord set'],
    price: 1299, category: 'clothing', subcategory: "Women's Wear",
    rating: 4.5, reviewCount: 178, isNewArrival: true,
  },
  {
    slug: 'kids-cotton-tshirt-pack3',
    name: "Kids' Cotton T-Shirt — Pack of 3",
    description: "Pack of 3 soft cotton t-shirts for kids in fun prints, pre-shrunk and hypoallergenic.",
    details: ['100% soft cotton', 'Pack of 3', 'Fun graphic prints', 'Pre-shrunk', 'Hypoallergenic', 'Available: 2–12 years'],
    price: 699, category: 'clothing', subcategory: "Kids' Wear",
    rating: 4.6, reviewCount: 267, isBestSeller: true,
  },
  {
    slug: 'kids-dungaree-set',
    name: "Kids' Denim Dungaree Set",
    description: "Adorable kids' denim dungaree with adjustable straps and matching inner t-shirt.",
    details: ['Denim dungaree + inner tee', 'Adjustable shoulder straps', 'Front bib pocket', 'Available: 2–10 years', 'Machine washable', 'Gender-neutral colours'],
    price: 899, originalPrice: 1199, category: 'clothing', subcategory: "Kids' Wear",
    rating: 4.5, reviewCount: 134, isOnSale: true,
  },
  {
    slug: 'mens-innerwear-brief-pack5',
    name: "Men's Cotton Brief — Pack of 5",
    description: "Pack of 5 men's inner briefs in breathable combed cotton with elasticated waistband.",
    details: ['100% combed cotton', 'Pack of 5', 'Elasticated waistband', 'Breathable fabric', 'Available: S, M, L, XL, XXL', 'Machine washable'],
    price: 599, category: 'clothing', subcategory: 'Innerwear',
    rating: 4.4, reviewCount: 389,
  },
  {
    slug: 'womens-nightwear-set',
    name: "Women's Cotton Nightwear Set",
    description: "Comfortable cotton nightwear set with printed top and pyjama pants, perfect for a good night's sleep.",
    details: ['100% soft cotton', 'Top + pyjama set', 'Printed design', 'Elasticated waist', 'Available: S–3XL', 'Machine washable'],
    price: 799, category: 'clothing', subcategory: 'Nightwear',
    rating: 4.6, reviewCount: 201, isNewArrival: true,
  },

  // ── FASHION ACCESSORIES ────────────────────────────────────────────────────
  {
    slug: 'leather-tote-bag',
    name: "Women's Vegan Leather Tote Bag",
    description: "Spacious vegan leather tote bag with zip closure, inner pockets and detachable shoulder strap.",
    details: ['Vegan leather', 'Zip top closure', '2 inner compartments + card slots', 'Detachable shoulder strap', '38 × 32 × 14 cm', 'Available in 4 colours'],
    price: 1499, originalPrice: 1999, category: 'fashion', subcategory: 'Handbags',
    rating: 4.6, reviewCount: 289, isFeatured: true, isOnSale: true,
  },
  {
    slug: 'mens-leather-wallet',
    name: "Men's Genuine Leather Wallet",
    description: "Slim bifold genuine leather wallet with 8 card slots, ID window and RFID blocking.",
    details: ['Genuine leather', 'Bifold design', '8 card slots + ID window', 'RFID blocking', 'Slim profile', 'Gift box included'],
    price: 899, originalPrice: 1199, category: 'fashion', subcategory: 'Wallets',
    rating: 4.7, reviewCount: 312, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'womens-clutch-bag',
    name: "Women's Embroidered Clutch Bag",
    description: "Elegant evening clutch with traditional Indian embroidery, magnetic snap and detachable chain strap.",
    details: ['Traditional embroidery', 'Magnetic snap closure', 'Detachable chain strap', '1 main compartment + card pocket', '22 × 13 cm', 'Occasion wear'],
    price: 799, category: 'fashion', subcategory: 'Handbags',
    rating: 4.5, reviewCount: 145, isNewArrival: true,
  },
  {
    slug: 'mens-reversible-belt',
    name: "Men's Reversible Leather Belt",
    description: "Premium reversible leather belt in black and brown with a polished pin buckle, fits waist 28–42 in.",
    details: ['Genuine leather', 'Reversible black/brown', 'Polished pin buckle', 'Width: 3.5 cm', 'Fits waist 28–42 inches', 'Gift box'],
    price: 699, originalPrice: 999, category: 'fashion', subcategory: 'Belts',
    rating: 4.5, reviewCount: 198, isOnSale: true,
  },
  {
    slug: 'women-jhumka-earrings',
    name: "Women's Oxidised Silver Jhumka Earrings",
    description: "Traditional oxidised silver jhumka earrings with intricate filigree work and pearl drops.",
    details: ['Oxidised silver-plated brass', 'Filigree design', 'Pearl drops', 'Hook closure', 'Hypoallergenic', 'Velvet pouch included'],
    price: 499, category: 'fashion', subcategory: 'Jewellery',
    rating: 4.8, reviewCount: 378, isBestSeller: true, isFeatured: true,
  },
  {
    slug: 'mens-sunglasses-uv400',
    name: "Men's UV400 Wayfarer Sunglasses",
    description: "Polarised wayfarer-style sunglasses with UV400 protection, TR90 frame and spring hinges.",
    details: ['UV400 polarised lenses', 'TR90 lightweight frame', 'Spring hinges', 'Scratch-resistant coating', 'Includes case & cloth', 'Unisex fit'],
    price: 799, originalPrice: 1199, category: 'fashion', subcategory: 'Sunglasses',
    rating: 4.4, reviewCount: 156, isOnSale: true,
  },
  {
    slug: 'ladies-silk-scarf',
    name: "Women's Pure Silk Scarf",
    description: "Lightweight 100% pure silk scarf with hand-rolled edges and vibrant floral print, multipurpose styling.",
    details: ['100% pure silk', '70 × 180 cm', 'Hand-rolled edges', 'Digital floral print', 'Multipurpose: neck, hair, bag', 'Dry clean only'],
    price: 1199, originalPrice: 1599, category: 'fashion', subcategory: 'Scarves',
    rating: 4.6, reviewCount: 87, isOnSale: true,
  },
  {
    slug: 'backpack-canvas-15l',
    name: '15 L Canvas Backpack',
    description: 'Durable canvas backpack with laptop sleeve, USB charging port and water-resistant base.',
    details: ['15 L capacity', 'Canvas + water-resistant base', '15.6" laptop sleeve', 'USB charging port', 'Multiple compartments', 'Padded shoulder straps'],
    price: 1299, category: 'fashion', subcategory: 'Backpacks',
    rating: 4.5, reviewCount: 223, isNewArrival: true,
  },

  // ── TOWELS & LINEN ─────────────────────────────────────────────────────────
  {
    slug: 'cotton-bath-towel-large',
    name: 'Premium Cotton Bath Towel — Large',
    description: '600 GSM large bath towel in 100% ring-spun cotton, quick-dry, ultra-soft and highly absorbent.',
    details: ['100% ring-spun cotton', '600 GSM', '70 × 140 cm', 'Quick-dry', 'Highly absorbent', 'Machine washable'],
    price: 699, originalPrice: 899, category: 'linen', subcategory: 'Bath Towels',
    rating: 4.7, reviewCount: 312, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'bath-towel-set-4pc',
    name: 'Cotton Bath Towel Set — 4 Piece',
    description: 'Set of 4 matching bath towels in 500 GSM combed cotton — 2 large and 2 hand towels.',
    details: ['4-piece set (2 bath + 2 hand)', '500 GSM combed cotton', 'Large: 70×140 cm / Hand: 40×60 cm', 'Colour-fast dyes', 'Machine washable', 'Available in 5 colours'],
    price: 1499, originalPrice: 1999, category: 'linen', subcategory: 'Bath Towels',
    rating: 4.6, reviewCount: 187, isOnSale: true,
  },
  {
    slug: 'kitchen-towel-pack6',
    name: 'Cotton Kitchen Towel — Pack of 6',
    description: 'Absorbent cotton kitchen towels with hanging loop, ideal for drying dishes and wiping surfaces.',
    details: ['100% cotton', 'Pack of 6', '40 × 60 cm each', 'Hanging loop', 'Lint-free', 'Machine washable at 60°C'],
    price: 499, category: 'linen', subcategory: 'Kitchen Towels',
    rating: 4.5, reviewCount: 234, isBestSeller: true,
  },
  {
    slug: 'face-towel-pack6',
    name: 'Soft Face Towel — Pack of 6',
    description: 'Pack of 6 ultra-soft 400 GSM face towels for gentle cleansing, hypoallergenic and dye-free.',
    details: ['400 GSM cotton', 'Pack of 6', '30 × 30 cm each', 'Hypoallergenic', 'Dye-free', 'Machine washable'],
    price: 599, category: 'linen', subcategory: 'Face Towels',
    rating: 4.6, reviewCount: 145, isNewArrival: true,
  },
  {
    slug: 'gym-sports-towel',
    name: 'Microfibre Sports & Gym Towel',
    description: 'Ultra-compact microfibre sports towel that dries 5× faster than cotton — ideal for gym, travel and beach.',
    details: ['Microfibre fabric', '80 × 160 cm', 'Dries 5× faster than cotton', 'Lightweight & compact', 'Carry bag included', 'Machine washable'],
    price: 699, category: 'linen', subcategory: 'Sports Towels',
    rating: 4.4, reviewCount: 167,
  },

  // ── MATS & RUGS ────────────────────────────────────────────────────────────
  {
    slug: 'anti-slip-door-mat',
    name: 'Anti-Slip Coir Door Mat',
    description: 'Heavy-duty coir fibre door mat with PVC anti-slip backing, excellent dirt-scraping action.',
    details: ['100% natural coir', 'PVC anti-slip backing', '60 × 40 cm', 'Dirt-scraping fibres', 'Indoor & outdoor use', 'Easy to shake clean'],
    price: 449, originalPrice: 599, category: 'mats', subcategory: 'Door Mats',
    rating: 4.4, reviewCount: 289, isBestSeller: true, isOnSale: true,
  },
  {
    slug: 'rubber-door-mat-printed',
    name: 'Printed Rubber Door Mat',
    description: 'Durable rubber door mat with embossed welcome design, water-resistant and easy to clean.',
    details: ['Heavy-duty rubber', 'Embossed pattern', '60 × 40 cm', 'Water-resistant', 'Non-slip', 'Easy to clean with hose'],
    price: 399, category: 'mats', subcategory: 'Door Mats',
    rating: 4.3, reviewCount: 198,
  },
  {
    slug: 'cotton-bath-mat',
    name: 'Tufted Cotton Bath Mat',
    description: 'Plush tufted cotton bath mat with non-slip latex backing, machine washable and super absorbent.',
    details: ['100% cotton tufted', 'Non-slip latex backing', '50 × 80 cm', 'Super absorbent', 'Machine washable', 'Available in 6 colours'],
    price: 599, originalPrice: 799, category: 'mats', subcategory: 'Bath Mats',
    rating: 4.6, reviewCount: 234, isFeatured: true, isOnSale: true,
  },
  {
    slug: 'yoga-mat-6mm',
    name: 'Non-Slip Yoga Mat — 6 mm',
    description: 'Extra-thick 6 mm TPE yoga mat with alignment lines, carry strap and non-slip texture both sides.',
    details: ['TPE material (eco-friendly)', '6 mm thickness', '183 × 61 cm', 'Alignment lines', 'Non-slip both sides', 'Carry strap included'],
    price: 1299, originalPrice: 1799, category: 'mats', subcategory: 'Yoga Mats',
    rating: 4.7, reviewCount: 312, isOnSale: true,
  },
  {
    slug: 'cotton-dhurrie-rug',
    name: 'Handwoven Cotton Dhurrie Rug — 4 × 6 ft',
    description: 'Flat-woven Indian dhurrie rug in 100% cotton with geometric pattern, reversible and machine washable.',
    details: ['100% cotton', '4 × 6 ft (120 × 180 cm)', 'Flat weave, reversible', 'Geometric pattern', 'Machine washable', 'No shed'],
    price: 2499, originalPrice: 3299, category: 'mats', subcategory: 'Area Rugs',
    rating: 4.7, reviewCount: 156, isFeatured: true, isOnSale: true,
  },
  {
    slug: 'jute-rug-5x7',
    name: 'Natural Jute Area Rug — 5 × 7 ft',
    description: 'Eco-friendly handwoven jute area rug with cotton border, adds warmth and texture to any room.',
    details: ['Natural jute weave', '5 × 7 ft (152 × 213 cm)', 'Cotton border', 'Flat-woven', 'Eco-friendly', 'Spot clean only'],
    price: 2999, category: 'mats', subcategory: 'Area Rugs',
    rating: 4.5, reviewCount: 89,
  },
  {
    slug: 'kitchen-anti-fatigue-mat',
    name: 'Anti-Fatigue Kitchen Standing Mat',
    description: 'Ergonomic gel-foam kitchen mat that reduces leg and back fatigue during long cooking sessions.',
    details: ['Gel-foam core', '45 × 75 cm', 'Non-slip backing', 'Waterproof top surface', 'Easy to wipe clean', 'Reduces fatigue by 40%'],
    price: 1199, originalPrice: 1499, category: 'mats', subcategory: 'Kitchen Mats',
    rating: 4.6, reviewCount: 178, isNewArrival: true, isOnSale: true,
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
