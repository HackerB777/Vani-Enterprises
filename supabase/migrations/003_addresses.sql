-- addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId"      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label         TEXT DEFAULT 'Home',
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  pincode       TEXT NOT NULL,
  "isDefault"   BOOLEAN DEFAULT FALSE,
  "createdAt"   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_userId ON addresses("userId");

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY addresses_all ON addresses FOR ALL USING (true);

-- Razorpay fields on orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "razorpayOrderId"   TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS "razorpayPaymentId" TEXT;
