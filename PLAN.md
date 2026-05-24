# 🏠 VANI ENTERPRISES — WEBSITE BUILD PLAN
> Exclusive Home Collections · Chennai, Tamil Nadu
> Production-Grade E-Commerce · plan.md v1.0

---

## ⚡ QUICK REFERENCE

| Item | Detail |
|---|---|
| **Project** | Vani Enterprises E-Commerce Website |
| **Type** | B2C Home Goods · India-focused |
| **Stack** | Next.js 14 · MongoDB · Razorpay · Cloudinary |
| **Deploy** | Vercel + MongoDB Atlas |
| **Timeline** | 12 Weeks |
| **Total Phases** | 7 |
| **Domain** | vanienterprises.com |

---

## 📦 TECH STACK

```
Frontend   →  Next.js 14 (App Router) + TypeScript
Styling    →  Tailwind CSS + shadcn/ui
State      →  Zustand (cart/wishlist) + React Query (server state)
Backend    →  Next.js API Routes (serverless)
Database   →  MongoDB Atlas + Mongoose ODM
Auth       →  NextAuth.js v5 (JWT · Google OAuth · Credentials)
Payments   →  Razorpay (UPI · Cards · COD · EMI)
Images     →  Cloudinary (upload · resize · CDN · WebP)
WhatsApp   →  WATI API (order notifications)
Email      →  Resend (transactional emails)
Cache      →  Upstash Redis (serverless)
AI         →  Anthropic Claude API (product descriptions · SEO)
Cron       →  Vercel Cron Jobs (stock alerts · best-seller updates)
Analytics  →  Vercel Analytics + Google Analytics 4
```

---

## 🗂️ REPOSITORY STRUCTURE

```
vani-enterprises/
├── app/
│   ├── (store)/              # Customer-facing pages
│   │   ├── page.tsx          ← Homepage
│   │   ├── shop/page.tsx     ← All products + filters
│   │   ├── shop/[category]/  ← Category pages
│   │   ├── product/[slug]/   ← Product detail
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/           ← My orders + tracking
│   │   ├── wishlist/
│   │   ├── offers/
│   │   ├── new-arrivals/
│   │   ├── best-sellers/
│   │   ├── about/
│   │   ├── contact/
│   │   └── layout.tsx        ← Navbar + Footer wrapper
│   ├── (admin)/              # Admin panel (protected)
│   │   ├── admin/
│   │   │   ├── page.tsx      ← Dashboard + KPIs
│   │   │   ├── products/     ← CRUD + AI generator
│   │   │   ├── orders/       ← Manage + update status
│   │   │   ├── categories/
│   │   │   ├── customers/
│   │   │   ├── inventory/    ← Stock management
│   │   │   ├── offers/       ← Coupons + banners
│   │   │   └── analytics/    ← Revenue + reports
│   │   └── layout.tsx        ← Admin sidebar wrapper
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── products/         ← GET list · POST create · PUT · DELETE
│   │   ├── categories/
│   │   ├── orders/           ← POST create · GET list · PUT status
│   │   ├── payments/
│   │   │   ├── create-order/ ← Razorpay order
│   │   │   └── verify/       ← Signature check
│   │   ├── reviews/
│   │   ├── users/
│   │   ├── ai/
│   │   │   └── generate-description/
│   │   ├── whatsapp/webhook/
│   │   ├── upload/           ← Cloudinary
│   │   └── cron/
│   │       ├── stock-alert/  ← Daily 9AM
│   │       └── best-sellers/ ← Daily midnight
│   ├── globals.css
│   └── layout.tsx            ← Root (fonts · providers)
├── components/
│   ├── store/                # All customer-facing UI
│   ├── admin/                # Admin dashboard UI
│   └── ui/                   # shadcn/ui base components
├── lib/                      # Clients: mongodb · cloudinary · razorpay · redis · auth · ai · whatsapp · email
├── models/                   # Mongoose: Product · Category · Order · User · Review · Coupon
├── store/                    # Zustand: cartStore · wishlistStore · uiStore
├── hooks/                    # useCart · useWishlist · useProducts · useOrders
├── types/                    # TypeScript interfaces
├── utils/                    # formatPrice · calculateDiscount · generateSlug
├── constants/                # categories · orderStatus · config
├── middleware.ts              # Route protection
├── next.config.ts
├── tailwind.config.ts
└── .env.local
```

---

## 🗄️ DATABASE MODELS

### Product
```
name · slug · description · shortDescription
category (ref) · subcategory · brand
price (MRP) · salePrice · discount%
stock · sku · unit
images[] · thumbnail
attributes { material · pieces · color · dimensions · weight · capacity }
flags { isActive · isFeatured · isBestSeller · isNewArrival · isSale }
metaTitle · metaDescription · tags[]
rating { average · count } · salesCount · viewCount
aiGenerated
```

### Order
```
orderId (VE-2024-000001)
user (ref) · guestEmail
items[] { product · name · image · price · salePrice · quantity · total }
subtotal · discount · couponCode · couponDiscount · shippingCharge · tax · total
shippingAddress { name · phone · addressLine1 · city · state · pincode }
paymentMethod (razorpay | cod | whatsapp)
paymentStatus (pending | paid | failed | refunded)
razorpayOrderId · razorpayPaymentId
status (placed | confirmed | processing | shipped | out_for_delivery | delivered | cancelled | returned)
trackingId · trackingUrl · courier
statusHistory[] { status · timestamp · note }
whatsappSent
```

### User
```
name · email · phone · password (bcrypt)
role (user | admin)
addresses[] { label · name · phone · addressLine1 · city · state · pincode · isDefault }
googleId
isVerified · isActive
totalOrders · totalSpent
```

### Category
```
name · slug · description
image { url · publicId }
icon · productCount · isActive · sortOrder · parent (ref)
```

### Review
```
product (ref) · user (ref)
rating (1–5) · title · comment · images[]
isVerifiedPurchase · isApproved
```

### Coupon
```
code · discountType (percent | flat) · discountValue
minOrderValue · maxDiscount · usageLimit · usedCount
validFrom · validTo · isActive
```

---

## 🔌 API ENDPOINTS

```
# Products
GET    /api/products                  List (filter · sort · paginate · search)
POST   /api/products                  Create [admin]
GET    /api/products/[id]             Detail
PUT    /api/products/[id]             Update [admin]
DELETE /api/products/[id]             Soft delete [admin]
GET    /api/products/search?q=
GET    /api/products/featured
GET    /api/products/best-sellers
GET    /api/products/new-arrivals
GET    /api/products/offers

# Orders
POST   /api/orders                    Create order
GET    /api/orders                    User's orders [auth]
GET    /api/orders/[id]               Order detail
PUT    /api/orders/[id]               Update status [admin]
GET    /api/orders/[id]/track         Tracking info
POST   /api/orders/[id]/cancel        Cancel order

# Payments
POST   /api/payments/create-order     Razorpay order (amount in paise)
POST   /api/payments/verify           HMAC signature verify → update order
POST   /api/payments/refund           Process refund [admin]

# Other
GET    /api/categories                All active categories
POST   /api/reviews                   Submit review [auth]
POST   /api/upload                    Cloudinary upload [admin]
POST   /api/ai/generate-description   AI product content [admin]
POST   /api/whatsapp/webhook          WATI webhook receiver
```

### Product Query Params
```
?category=kitchen-ware
&minPrice=100 &maxPrice=5000
&sort=price_asc | price_desc | rating | newest | best_sellers
&page=1 &limit=24
&sale=true &inStock=true
&material=stainless-steel
&search=pressure+cooker
&rating=4
```

---

## 💳 PAYMENT FLOW (Razorpay)

```
1. Customer → "Place Order"
2. POST /api/payments/create-order
   → Razorpay.orders.create({ amount in paise, currency: INR })
   → Returns { razorpayOrderId, amount }

3. Frontend opens Razorpay modal
   → Customer pays (UPI / Card / Wallet / NetBanking)

4. Success callback → { razorpay_order_id, razorpay_payment_id, razorpay_signature }

5. POST /api/payments/verify
   → HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
   → Verify signature matches
   → Update order.paymentStatus = "paid"
   → Send confirmation email (Resend)
   → Send WhatsApp notification (WATI)

6. Redirect → /orders/[id]?success=true
```

Supported: UPI · PhonePe · GPay · Paytm · Cards (Visa/MC/RuPay) · NetBanking · COD · EMI (≥₹3000)

---

## 📲 WHATSAPP NOTIFICATIONS (WATI)

| Trigger | Message |
|---|---|
| Order Placed | "Order #VE-XXXX received! Total: ₹XXX. Confirming shortly." |
| Order Confirmed | "Confirmed! Expected delivery in 3–5 days." |
| Order Shipped | "Shipped via {courier}! Track: {link}" |
| Out for Delivery | "Your order is out for delivery today! 🚚" |
| Delivered | "Delivered! Rate your experience: {link}" |
| Order Cancelled | "Order #VE-XXXX cancelled. Refund in 5–7 days." |

WhatsApp "Order on WhatsApp" button → `wa.me/919999999999?text=I want to order: {product}`

---

## 🔐 SECURITY

```
✅ bcrypt password hashing (rounds: 12)
✅ JWT in httpOnly + Secure + SameSite=Strict cookies
✅ Zod validation on ALL API route inputs
✅ Rate limiting: auth routes (Upstash Rate Limit)
✅ Razorpay webhook HMAC signature verification
✅ Admin routes protected by middleware.ts role check
✅ MongoDB injection prevention (Mongoose ODM)
✅ XSS prevention (React auto-escaping)
✅ CSRF protection (NextAuth handles)
✅ HTTPS enforced (Vercel)
✅ CSP headers in next.config.ts
✅ No secrets exposed to client bundle
✅ Image domains whitelisted in next.config.ts
```

---

## 🤖 AI FEATURES (Claude API)

| Feature | How it Works |
|---|---|
| **Product Description Generator** | Admin clicks Generate → sends name/category/material/price to Claude → returns description + shortDesc + bulletPoints + tags |
| **SEO Meta Generator** | Auto-creates metaTitle + metaDescription per product |
| **Smart Stock Alerts** | Vercel Cron (daily 9AM) → products with stock < 10 → email admin |
| **Auto-disable OOS** | Stock = 0 → isActive = false automatically |
| **Bulk Enrichment** | Upload CSV → AI fills missing descriptions → import to MongoDB |

---

## ☁️ IMAGE PIPELINE (Cloudinary)

```
Upload → Cloudinary auto-transforms:
  Product detail  →  800×800px  WebP  quality:auto
  Product card    →  400×400px  WebP  quality:auto
  Thumbnail       →  100×100px  WebP  quality:80
  Category card   →  400×300px  WebP  quality:auto
  Hero banner     →  1280×500px WebP  quality:auto

Storage path:
  vani-enterprises/products/{slug}/main.webp
  vani-enterprises/products/{slug}/gallery-{n}.webp
  vani-enterprises/categories/{slug}.webp
  vani-enterprises/banners/hero-{n}.webp
```

---

## 🚀 RENDERING STRATEGY

```
SSG + ISR (revalidate):
  /                    →  revalidate: 300s
  /shop                →  revalidate: 60s
  /shop/[category]     →  revalidate: 60s
  /product/[slug]      →  revalidate: 120s
  /offers              →  revalidate: 300s
  /best-sellers        →  revalidate: 300s

SSR (always fresh):
  /checkout
  /orders/[id]

Client-side (CSR):
  Cart · Wishlist (Zustand + localStorage)
  Search results (React Query)
  Admin dashboard (React Query, no cache)
```

---

## ⚡ REDIS CACHE TTLs (Upstash)

```
products:featured        →  5 min
products:best-sellers    →  5 min
products:new-arrivals    →  5 min
categories:all           →  1 hour
product:{slug}           →  10 min
search:{query}           →  2 min
orders:{userId}:list     →  2 min
```

---

## 🌍 DEPLOYMENT

```
Service           Provider              Cost/month
──────────────────────────────────────────────────
Frontend + API    Vercel Pro            ₹1,700
Database          MongoDB Atlas M10     ₹6,000
Cache             Upstash Redis         Free → ₹500
Images/CDN        Cloudinary            Free → ₹1,500
WhatsApp          WATI                  ₹2,500
Email             Resend                Free (3k/mo)
Domain + SSL      GoDaddy + Vercel      ₹800/yr
──────────────────────────────────────────────────
TOTAL             ~₹12,000–15,000/month
```

### CI/CD Pipeline
```
Push to GitHub
  ├── main    →  Auto-deploy to vanienterprises.com (Vercel)
  ├── staging →  Auto-deploy to staging.vanienterprises.com
  └── feat/*  →  Preview URL per branch (Vercel)

Vercel Cron Jobs:
  0 9 * * *   →  /api/cron/stock-alert      (daily 9AM)
  0 0 * * *   →  /api/cron/best-sellers     (midnight)
```

---

## 📋 PHASE-WISE PLAN

---

### PHASE 1 — Foundation `Week 1–2`

**Goal:** Project skeleton + auth + database + base UI

- [ ] Init Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [ ] Configure ESLint · Prettier · Husky pre-commit
- [ ] MongoDB Atlas setup + Mongoose connection pool
- [ ] Create all Mongoose models (Product · Category · User · Order · Review · Coupon)
- [ ] NextAuth.js v5 — Email/Password + Google OAuth
- [ ] Cloudinary integration + `/api/upload` route
- [ ] Upstash Redis connection
- [ ] Base layout: Navbar (logo · search · cart · wishlist · account) + Footer
- [ ] Category sidebar component
- [ ] Seed script: 6 categories + 50 products (varied)
- [ ] Responsive breakpoints set up
- [ ] `.env.local` with all keys configured

**Deliverable:** Homepage skeleton visible, auth working, DB seeded

---

### PHASE 2 — Product Catalog `Week 3–4`

**Goal:** Full browsable product catalog with filters + search

- [ ] Homepage complete:
  - [ ] Hero carousel (3 slides · auto-play · mobile swipe)
  - [ ] Trust bar (5 items)
  - [ ] Shop by Category grid (6 cards · hover effects)
  - [ ] Best Sellers product carousel
  - [ ] New Arrivals section
  - [ ] Offers banner
  - [ ] Newsletter section
- [ ] `/shop` page — all products grid
- [ ] `/shop/[category]` — filtered category pages
- [ ] Product filters sidebar: price range · material · rating · sort · in-stock
- [ ] `/product/[slug]` — product detail page:
  - [ ] Image gallery (zoom · mobile swipe)
  - [ ] Price + MRP + discount badge
  - [ ] Add to Cart / Buy Now / Wishlist
  - [ ] Product specs table
  - [ ] Related products carousel
  - [ ] Review section (display only)
- [ ] MongoDB Atlas Search — full-text search
- [ ] Pagination + infinite scroll option
- [ ] SEO: OG tags · sitemap.xml · robots.txt · JSON-LD structured data
- [ ] `/new-arrivals` and `/best-sellers` pages

**Deliverable:** Full catalog browsable, search working, product pages live

---

### PHASE 3 — Cart, Checkout & Payments `Week 5–6`

**Goal:** End-to-end purchase flow

- [ ] Zustand cartStore:
  - [ ] addItem · removeItem · updateQuantity · clearCart
  - [ ] localStorage persistence
  - [ ] Free shipping threshold logic (≥₹999)
- [ ] Cart drawer (slide-in from right)
- [ ] Cart page (full view)
- [ ] Zustand wishlistStore
- [ ] Wishlist page
- [ ] Checkout page:
  - [ ] Address form (new) + saved addresses selector
  - [ ] Coupon code input + validation
  - [ ] Order summary sidebar (sticky)
  - [ ] Payment method selector (Razorpay / COD)
- [ ] Razorpay integration:
  - [ ] `POST /api/payments/create-order`
  - [ ] Razorpay modal open
  - [ ] `POST /api/payments/verify` (HMAC check)
  - [ ] Order created on success
- [ ] COD order flow
- [ ] Order confirmation page (`/orders/[id]?success=true`)
- [ ] Confirmation email via Resend
- [ ] WhatsApp notification on order placed (WATI)
- [ ] Guest checkout (no login required)

**Deliverable:** Customer can browse → add to cart → checkout → pay → receive confirmation

---

### PHASE 4 — Order Management `Week 7`

**Goal:** Full post-purchase experience

- [ ] `/orders` — My Orders list (auth protected)
- [ ] `/orders/[id]` — Order detail page
- [ ] Order tracking page:
  - [ ] Visual status stepper (Placed → Confirmed → Shipped → Delivered)
  - [ ] Estimated delivery date display
  - [ ] Courier name + external tracking link
- [ ] Cancel order flow (within 24h window)
- [ ] Return request form
- [ ] WhatsApp notification on each status change
- [ ] Email notification on each status change
- [ ] Review submission form (post-delivery only)

**Deliverable:** Customers can track and manage their orders end-to-end

---

### PHASE 5 — Admin Dashboard `Week 8–9`

**Goal:** Full internal management panel

**Dashboard**
- [ ] KPI cards: Today's Revenue · Pending Orders · New Customers · Low Stock Count
- [ ] Revenue chart (7d / 30d / 90d — Recharts)
- [ ] Recent orders table (last 10)
- [ ] Top selling products list

**Products**
- [ ] Product list with search + filter + bulk select
- [ ] Add product form:
  - [ ] Multi-image upload (Cloudinary drag & drop)
  - [ ] Tiptap rich text editor for description
  - [ ] Category + subcategory selector
  - [ ] Price + sale price (auto discount calc)
  - [ ] Stock quantity
  - [ ] Attributes (material · pieces · color · dimensions)
  - [ ] Flags (featured · best seller · new arrival · sale)
  - [ ] SEO fields
  - [ ] **AI Generate Description button** (Claude API)
- [ ] Edit product (same form)
- [ ] Soft delete (isActive = false)
- [ ] Bulk CSV import (AI enriches missing fields)

**Orders**
- [ ] All orders table (filter by status · date · search)
- [ ] Order detail view
- [ ] Update order status → triggers WhatsApp + email
- [ ] Add tracking ID + courier name

**Other**
- [ ] Category CRUD (name · slug · image · sort order)
- [ ] Customer list + individual view + order history
- [ ] Inventory page — low stock alerts, bulk stock update
- [ ] Coupons: create · set discount type · expiry · usage limit
- [ ] Offers/banners: upload + schedule

**Deliverable:** Admin can manage every aspect of the store without touching code

---

### PHASE 6 — AI, Reviews & Analytics `Week 10`

**Goal:** Intelligence layer + social proof + data insights

- [ ] AI product description generator (Claude API endpoint)
- [ ] AI SEO meta generator (auto-runs on save)
- [ ] Vercel Cron: daily stock alert emails to admin
- [ ] Vercel Cron: nightly best-seller rank recalculation
- [ ] Review system:
  - [ ] Submit review (verified purchase check)
  - [ ] Star rating + comment + image upload
  - [ ] Admin approval workflow
  - [ ] Rating aggregate update on product
- [ ] Analytics dashboard:
  - [ ] Revenue by day/week/month chart
  - [ ] Orders by status breakdown (pie chart)
  - [ ] Category performance (bar chart)
  - [ ] Customer acquisition over time
- [ ] Google Analytics 4 integration
- [ ] Vercel Analytics (Core Web Vitals monitoring)

**Deliverable:** Store runs intelligently, reviews add social proof, admin has data visibility

---

### PHASE 7 — Polish, Security & Launch `Week 11–12`

**Goal:** Production-ready, hardened, performant launch

**Performance**
- [ ] MongoDB indexes: slug · category · price · isFeatured · isBestSeller · createdAt
- [ ] Redis cache implementation (all hot routes)
- [ ] Next.js Image component audit (all images lazy-loaded · WebP)
- [ ] Bundle analysis (`@next/bundle-analyzer`)
- [ ] Core Web Vitals target: LCP < 2.5s · CLS < 0.1 · INP < 200ms
- [ ] Font optimization: `next/font` with `display: swap`

**Security Audit**
- [ ] Rate limiting on: `/api/auth/*` · `/api/orders` · `/api/payments`
- [ ] Zod schema validation on every API route
- [ ] CSP headers configured in `next.config.ts`
- [ ] Admin middleware role-check verified
- [ ] Razorpay webhook signature re-audit
- [ ] Dependency audit: `npm audit`

**Mobile + Cross-Browser**
- [ ] Mobile responsiveness audit — all 20+ pages
- [ ] Test: Chrome · Firefox · Safari · Samsung Browser
- [ ] Test: iPhone 12 · iPhone SE · Samsung S21 · Pixel 6
- [ ] Touch gestures: hero swipe · product image swipe

**Launch Checklist**
- [ ] Custom domain connected (vanienterprises.com → Vercel)
- [ ] SSL certificate active
- [ ] Production `.env` variables set in Vercel dashboard
- [ ] Razorpay live mode keys activated
- [ ] WATI WhatsApp Business API verified
- [ ] Google Search Console connected + sitemap submitted
- [ ] Google Analytics 4 live
- [ ] Seed production DB with real products (all 8 categories)
- [ ] Admin account created (role: admin)
- [ ] Test full purchase flow on production (real ₹1 transaction)
- [ ] WhatsApp test notification received
- [ ] Soft launch → 10 beta customers → feedback → fix
- [ ] Full public launch 🚀

**Deliverable:** Live, production-grade store at vanienterprises.com

---

## ⏱️ TIMELINE SUMMARY

```
Week 1–2   ████████░░░░░░░░░░░░░░░░  Foundation + Auth + DB
Week 3–4   ░░░░████████░░░░░░░░░░░░  Product Catalog + Search
Week 5–6   ░░░░░░░░████████░░░░░░░░  Cart + Checkout + Razorpay
Week 7     ░░░░░░░░░░░░████░░░░░░░░  Order Management
Week 8–9   ░░░░░░░░░░░░░░░░████████  Admin Dashboard
Week 10    ░░░░░░░░░░░░░░░░░░░░████  AI + Reviews + Analytics
Week 11–12 ░░░░░░░░░░░░░░░░░░░░░░██  Polish + Security + Launch

Solo dev:  12 weeks
2 devs:    8 weeks
```

---

## 🔑 ENVIRONMENT VARIABLES

```bash
# App
NEXT_PUBLIC_APP_URL=https://vanienterprises.com
NEXT_PUBLIC_APP_NAME=Vani Enterprises
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=999
NEXT_PUBLIC_STORE_PHONE=9999999999
NEXT_PUBLIC_STORE_EMAIL=support@vanienterprises.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vani-enterprises

# NextAuth
NEXTAUTH_URL=https://vanienterprises.com
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=vani-enterprises
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=vani-enterprises

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# WATI (WhatsApp)
WATI_API_TOKEN=xxx
WATI_BASE_URL=https://live-server-xxx.wati.io

# Resend (Email)
RESEND_API_KEY=re_xxx
EMAIL_FROM=support@vanienterprises.com

# AI
ANTHROPIC_API_KEY=sk-ant-xxx
```

---

## 📊 MONTHLY COST BREAKDOWN

| Service | Plan | Cost/month |
|---|---|---|
| Vercel | Pro | ₹1,700 |
| MongoDB Atlas | M10 Dedicated | ₹6,000 |
| Cloudinary | Free (25GB) → Plus | ₹0 → ₹1,500 |
| Upstash Redis | Free 10k req/day → Pay-as-go | ₹0 → ₹500 |
| WATI WhatsApp | Starter | ₹2,500 |
| Resend Email | Free 3k/month → Pro | ₹0 → ₹700 |
| Domain (yearly) | GoDaddy | ₹67/month |
| **Total** | | **~₹10,267–12,967** |

> Start with MongoDB free tier (M0) to reduce cost to ~₹4,267/month during development. Upgrade to M10 before launch.

---

## ✅ DEFINITION OF DONE

A feature is **done** when:
1. Works on desktop + mobile (tested on real device)
2. TypeScript — zero type errors (`tsc --noEmit`)
3. All API inputs validated with Zod
4. Loading + error states handled in UI
5. Accessible (keyboard navigable, aria labels)
6. Committed to GitHub with descriptive commit message

---

*VANI ENTERPRISES · PLAN.md · v1.0*
*Built for production · Chennai, Tamil Nadu*
