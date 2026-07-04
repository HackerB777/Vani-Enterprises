-- Repairs schema drift between the live database and 001_full_schema.sql.
-- The live project was missing columns/tables that later migration edits
-- added to the file but were never re-applied. All statements are
-- idempotent (IF NOT EXISTS) and safe to run more than once.

-- products: admin add/edit product forms always send isCodAvailable,
-- which was failing every single product creation with
-- "Could not find the 'isCodAvailable' column of 'products'".
ALTER TABLE products ADD COLUMN IF NOT EXISTS "isCodAvailable" BOOLEAN DEFAULT TRUE;

-- orders: admin order status/tracking updates and customer order
-- cancellation both set updatedAt on every write, which was failing
-- for the same reason as above.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "couponCode" TEXT;

-- users: not currently written by any code path, added for schema
-- completeness / consistency with the rest of the tables.
ALTER TABLE users ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ DEFAULT NOW();

-- parcel_events and shipments: these tables never existed in the live
-- database at all, silently breaking the live parcel-tracking feature
-- end to end (admin's "Add Tracking Update" form, the customer-facing
-- timeline, and the realtime subscriptions on both).
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
