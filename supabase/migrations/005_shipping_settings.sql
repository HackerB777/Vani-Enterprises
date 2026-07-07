-- Admin-configurable shipping: a global "free shipping" toggle and a flat
-- shipping cost charged on every order when it's off, replacing the
-- hardcoded subtotal >= 999 ? 0 : 99 rule that used to live in application code.
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "freeShippingEnabled" BOOLEAN DEFAULT FALSE;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "shippingCost" NUMERIC(10,2) DEFAULT 99;
