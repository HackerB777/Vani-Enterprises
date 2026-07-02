-- ═══════════════════════════════════════════════════════════
-- Vani Enterprises — Full Database Schema
-- Run this entire file once in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ── 2. PRODUCTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  details         TEXT[],
  price           NUMERIC(10,2) NOT NULL,
  "originalPrice" NUMERIC(10,2),
  stock           INTEGER DEFAULT 0,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  images          TEXT[],
  "isFeatured"    BOOLEAN DEFAULT FALSE,
  "isNewArrival"  BOOLEAN DEFAULT FALSE,
  "isBestSeller"  BOOLEAN DEFAULT FALSE,
  "isOnSale"      BOOLEAN DEFAULT FALSE,
  "isCodAvailable" BOOLEAN DEFAULT TRUE,
  rating          NUMERIC(3,1),
  "reviewCount"   INTEGER DEFAULT 0,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug        ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_isBestSeller ON products("isBestSeller");
CREATE INDEX IF NOT EXISTS idx_products_isNewArrival ON products("isNewArrival");
CREATE INDEX IF NOT EXISTS idx_products_isOnSale     ON products("isOnSale");

ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ── 3. ORDERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  TEXT PRIMARY KEY,
  "userId"            UUID REFERENCES users(id) ON DELETE SET NULL,
  items               JSONB NOT NULL DEFAULT '[]',
  subtotal            NUMERIC(10,2) NOT NULL,
  "shippingCharge"    NUMERIC(10,2) DEFAULT 0,
  tax                 NUMERIC(10,2) DEFAULT 0,
  discount            NUMERIC(10,2) DEFAULT 0,
  total               NUMERIC(10,2) NOT NULL,
  "paymentMethod"     TEXT NOT NULL DEFAULT 'cod',
  "paymentStatus"     TEXT NOT NULL DEFAULT 'pending',
  status              TEXT NOT NULL DEFAULT 'placed',
  "shippingAddress"   JSONB NOT NULL DEFAULT '{}',
  "couponCode"        TEXT,
  "trackingId"        TEXT,
  courier             TEXT,
  notes               TEXT,
  "razorpayOrderId"   TEXT,
  "razorpayPaymentId" TEXT,
  "createdAt"         TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_userId    ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status    ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders("createdAt" DESC);

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- ── 4. COUPONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code             TEXT UNIQUE NOT NULL,
  "discountType"   TEXT NOT NULL DEFAULT 'percentage',
  "discountValue"  NUMERIC(10,2) NOT NULL,
  "minOrderAmount" NUMERIC(10,2) DEFAULT 0,
  "maxUses"        INTEGER,
  "usedCount"      INTEGER DEFAULT 0,
  "isActive"       BOOLEAN DEFAULT TRUE,
  "expiresAt"      TIMESTAMPTZ,
  "createdAt"      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;

-- ── 5. SETTINGS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT UNIQUE NOT NULL,
  value      JSONB,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- ── 6. ADDRESSES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId"       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label          TEXT DEFAULT 'Home',
  name           TEXT NOT NULL,
  phone          TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  pincode        TEXT NOT NULL,
  "isDefault"    BOOLEAN DEFAULT FALSE,
  "createdAt"    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_userId ON addresses("userId");

ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;

-- ── 7. PARCEL EVENTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parcel_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId"       TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status          TEXT NOT NULL,
  location        TEXT,
  description     TEXT,
  "eventTimestamp" TIMESTAMPTZ DEFAULT NOW(),
  "metadata"      JSONB,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcel_events_orderId ON parcel_events("orderId");
CREATE INDEX IF NOT EXISTS idx_parcel_events_status ON parcel_events(status);
CREATE INDEX IF NOT EXISTS idx_parcel_events_timestamp ON parcel_events("eventTimestamp" DESC);

ALTER TABLE parcel_events DISABLE ROW LEVEL SECURITY;

-- ── 8. SHIPMENTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shipments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId"       TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  "shipmentId"    TEXT,
  courier         TEXT NOT NULL,
  "trackingUrl"   TEXT,
  "estimatedDeliveryDate" DATE,
  "actualDeliveryDate"    DATE,
  status          TEXT DEFAULT 'pending',
  "rawData"       JSONB,
  "lastSyncedAt"  TIMESTAMPTZ,
  "createdAt"     TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_orderId ON shipments("orderId");
CREATE INDEX IF NOT EXISTS idx_shipments_courier ON shipments(courier);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

ALTER TABLE shipments DISABLE ROW LEVEL SECURITY;
