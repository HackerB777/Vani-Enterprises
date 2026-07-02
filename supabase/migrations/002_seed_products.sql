-- ═══════════════════════════════════════════════════════════
-- Vani Enterprises — Sample Product Data
-- Run this file to populate the products table with sample data
-- ═══════════════════════════════════════════════════════════

INSERT INTO products (slug, name, description, price, "originalPrice", stock, category, images, "isFeatured", "isNewArrival", "isBestSeller", "isOnSale", rating, "reviewCount") VALUES
-- Electronics
('wireless-earbuds', 'Premium Wireless Earbuds', 'High-quality wireless earbuds with noise cancellation and 24-hour battery life', 1999, 2999, 50, 'electronics', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], true, false, true, true, 4.5, 128),
('smart-watch-pro', 'Smart Watch Pro', 'Advanced smartwatch with health monitoring and GPS tracking', 4999, 6999, 30, 'electronics', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'], true, true, false, false, 4.3, 85),
('portable-speaker', 'Portable Bluetooth Speaker', 'Waterproof portable speaker with 360-degree sound', 1499, 1999, 45, 'electronics', ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'], false, false, true, true, 4.4, 96),
('usb-c-hub', 'USB-C Multi-Port Hub', '7-in-1 USB-C hub with USB 3.0, HDMI, and SD card reader', 1299, 1899, 60, 'electronics', ARRAY['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'], false, true, false, false, 4.2, 72),
('phone-charger', 'Fast Charging Phone Charger', '65W USB-C fast charger compatible with all devices', 899, 1299, 100, 'electronics', ARRAY['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'], true, false, true, false, 4.6, 156),

-- Kitchen
('stainless-steel-pot-set', 'Stainless Steel Cookware Set', '8-piece non-stick cookware set with heat-resistant handles', 2499, 3999, 25, 'kitchen', ARRAY['https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500'], true, false, true, false, 4.5, 108),
('kitchen-knife-set', 'Professional Kitchen Knife Set', '5-piece chef knife set with protective case', 1799, 2499, 40, 'kitchen', ARRAY['https://images.unsplash.com/photo-1610707267537-b85fab00c77b?w=500'], false, true, false, false, 4.3, 64),
('bamboo-cutting-board', 'Organic Bamboo Cutting Board', 'Large bamboo cutting board with juice groove', 599, 899, 80, 'kitchen', ARRAY['https://images.unsplash.com/photo-1578500768093-4461f0ea16de?w=500'], false, false, true, true, 4.4, 92),
('glass-storage-containers', 'Glass Storage Container Set', '6-piece glass containers with airtight lids', 1299, 1799, 50, 'kitchen', ARRAY['https://images.unsplash.com/photo-1578500768093-4461f0ea16de?w=500'], true, true, false, false, 4.2, 78),

-- Home Decor
('decorative-throw-pillow', 'Decorative Throw Pillow', 'Hand-woven cotton throw pillow with natural patterns', 799, 1199, 70, 'decor', ARRAY['https://images.unsplash.com/photo-1583092916350-e323e09dbef0?w=500'], true, false, true, false, 4.4, 102),
('wall-art-canvas', 'Modern Abstract Wall Art', 'Canvas wall art with vibrant abstract design', 1499, 2199, 35, 'decor', ARRAY['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500'], false, true, false, true, 4.3, 58),
('ceramic-vase', 'Handmade Ceramic Vase', 'Artisan-crafted ceramic vase with intricate detailing', 1199, 1699, 45, 'decor', ARRAY['https://images.unsplash.com/photo-1587014675282-1eae2e889a7f?w=500'], true, false, false, false, 4.5, 86),
('led-string-lights', 'Warm LED String Lights', '20-meter LED string lights for indoor/outdoor use', 699, 999, 90, 'decor', ARRAY['https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500'], false, false, true, true, 4.6, 134),

-- Bedding
('cotton-bed-sheet', 'Premium Cotton Bed Sheet', '400 TC Egyptian cotton bed sheet set', 1999, 2999, 55, 'bedding', ARRAY['https://images.unsplash.com/photo-1540932239986-7d4e77a8971d?w=500'], true, false, true, false, 4.5, 114),
('memory-foam-pillow', 'Memory Foam Pillow', 'Ergonomic memory foam pillow with cooling gel', 1299, 1899, 65, 'bedding', ARRAY['https://images.unsplash.com/photo-1585771724684-38269d6639cc?w=500'], false, true, false, false, 4.4, 87),
('quilted-comforter', 'Quilted Bed Comforter', 'Soft quilted comforter filled with microfiber', 2299, 3299, 40, 'bedding', ARRAY['https://images.unsplash.com/photo-1596524478989-9c409cc3d3f0?w=500'], true, false, false, true, 4.3, 72),

-- Gifts
('gift-hamper-deluxe', 'Deluxe Gift Hamper', 'Luxury gift hamper with premium items', 3499, 4999, 20, 'gifts', ARRAY['https://images.unsplash.com/photo-1610312669537-991c6c7f597a?w=500'], true, false, true, false, 4.6, 98),
('personalized-mug-set', 'Personalized Coffee Mug Set', 'Set of 2 personalized ceramic mugs', 799, 1199, 85, 'gifts', ARRAY['https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=500'], false, true, false, true, 4.2, 54),
('scented-candle-set', 'Luxury Scented Candle Set', '3-piece scented candle set with natural wax', 1299, 1899, 70, 'gifts', ARRAY['https://images.unsplash.com/photo-1608571423813-96db131e7a63?w=500'], true, false, true, false, 4.5, 103),

-- Clothing
('cotton-t-shirt', 'Premium Cotton T-Shirt', '100% organic cotton comfortable t-shirt', 499, 799, 120, 'clothing', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], false, true, false, true, 4.3, 67),
('yoga-pants', 'High-Waisted Yoga Pants', 'Comfortable high-waisted yoga pants with pockets', 1299, 1899, 85, 'clothing', ARRAY['https://images.unsplash.com/photo-1506629082632-401ba5ce7807?w=500'], true, false, true, false, 4.4, 89),
('winter-sweater', 'Cozy Winter Sweater', 'Warm wool blend winter sweater', 1599, 2299, 50, 'clothing', ARRAY['https://images.unsplash.com/photo-1552062407-291826ab63fd?w=500'], false, false, false, false, 4.2, 61),

-- Fashion Accessories
('leather-wallet', 'Premium Leather Wallet', 'Genuine leather wallet with RFID protection', 1199, 1699, 75, 'fashion', ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'], true, false, true, true, 4.5, 112),
('silk-scarf', 'Silk Printed Scarf', 'Beautiful silk scarf with traditional patterns', 899, 1299, 95, 'fashion', ARRAY['https://images.unsplash.com/photo-1490122795320-ada1db1b0cef?w=500'], false, true, false, false, 4.3, 58),
('sunglasses-uv', 'UV Protection Sunglasses', 'Premium UV protection sunglasses with polarized lenses', 1499, 2199, 60, 'fashion', ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'], true, false, true, false, 4.4, 95);
