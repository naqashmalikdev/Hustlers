-- =============================================================================
-- IRONFORGE GYM — COMPLETE DATABASE SCHEMA
-- Run this entire script in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- =============================================================================


-- =============================================================================
-- SECTION 1: ENUMS
-- =============================================================================

CREATE TYPE user_role        AS ENUM ('customer', 'admin');
CREATE TYPE product_category AS ENUM ('protein', 'pre-workout', 'recovery', 'vitamins', 'apparel', 'equipment');
CREATE TYPE order_status     AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status   AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE coupon_type      AS ENUM ('percentage', 'fixed');


-- =============================================================================
-- SECTION 2: PROFILES
-- Automatically created for every new auth.users signup via trigger
-- =============================================================================

CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT,
  phone        TEXT,
  avatar_url   TEXT,
  role         user_role NOT NULL DEFAULT 'customer',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: keep updated_at current
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
-- SECTION 3: PRODUCTS
-- =============================================================================

CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  brand             TEXT NOT NULL DEFAULT 'IRONFORGE Nutrition',
  description       TEXT,
  category          product_category NOT NULL,
  price             NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price  NUMERIC(10,2) CHECK (compare_at_price >= 0),
  weight            TEXT,
  images            TEXT[] NOT NULL DEFAULT '{}',
  flavors           TEXT[] NOT NULL DEFAULT '{}',
  sizes             TEXT[] NOT NULL DEFAULT '{}',
  stock_quantity    INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active         BOOLEAN NOT NULL DEFAULT true,
  slug              TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
-- SECTION 4: COUPONS
-- =============================================================================

CREATE TABLE coupons (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT NOT NULL UNIQUE,
  type              coupon_type NOT NULL,
  value             NUMERIC(10,2) NOT NULL CHECK (value > 0),
  min_order_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_uses          INTEGER,  -- NULL = unlimited
  uses_count        INTEGER NOT NULL DEFAULT 0,
  expires_at        TIMESTAMPTZ,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);


-- =============================================================================
-- SECTION 5: ADDRESSES
-- =============================================================================

CREATE TABLE addresses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label          TEXT,  -- e.g. 'Home', 'Office'
  full_name      TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address_line1  TEXT NOT NULL,
  address_line2  TEXT,
  city           TEXT NOT NULL,
  province       TEXT NOT NULL,
  postal_code    TEXT,
  is_default     BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Ensure only one default address per user
CREATE OR REPLACE FUNCTION enforce_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER single_default_address
  AFTER INSERT OR UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION enforce_single_default_address();


-- =============================================================================
-- SECTION 6: ORDERS
-- =============================================================================

-- Auto-generate order numbers like IF-2026-00001
CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'IF-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
END;
$$;

CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT NOT NULL UNIQUE DEFAULT generate_order_number(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- NULL = guest
  guest_email      TEXT,
  guest_name       TEXT,
  guest_phone      TEXT,
  status           order_status NOT NULL DEFAULT 'pending',
  subtotal         NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount  NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_amount  NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_amount >= 0),
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  coupon_id        UUID REFERENCES coupons(id) ON DELETE SET NULL,
  shipping_address JSONB NOT NULL,
  payment_method   TEXT NOT NULL DEFAULT 'cash_on_delivery',
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Either user_id or guest_email must be present
  CONSTRAINT order_has_owner CHECK (
    user_id IS NOT NULL OR guest_email IS NOT NULL
  )
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Increment coupon uses_count when an order with a coupon is placed
CREATE OR REPLACE FUNCTION increment_coupon_uses()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.coupon_id IS NOT NULL THEN
    UPDATE coupons SET uses_count = uses_count + 1 WHERE id = NEW.coupon_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_coupon_used
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION increment_coupon_uses();


-- =============================================================================
-- SECTION 7: ORDER ITEMS
-- =============================================================================

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  flavor      TEXT,
  size        TEXT,
  subtotal    NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Reduce product stock when order items are inserted
CREATE OR REPLACE FUNCTION reduce_product_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_item_inserted
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION reduce_product_stock();

-- Restore product stock if order is cancelled or refunded
CREATE OR REPLACE FUNCTION restore_product_stock_on_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded') THEN
    UPDATE products p
    SET stock_quantity = stock_quantity + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_cancelled
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION restore_product_stock_on_cancel();


-- =============================================================================
-- SECTION 8: REVIEWS
-- =============================================================================

CREATE TABLE reviews (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id           UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating               INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                TEXT,
  body                 TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (product_id, user_id)  -- one review per product per user
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Helper function: get average rating for a product
CREATE OR REPLACE FUNCTION get_product_avg_rating(product_uuid UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
  SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM reviews WHERE product_id = product_uuid;
$$;


-- =============================================================================
-- SECTION 9: ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons     ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews     ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------
-- PROFILES policies
-- -----------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- -----------------------------------------------------------------------
-- PRODUCTS policies
-- -----------------------------------------------------------------------
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (is_admin());

-- -----------------------------------------------------------------------
-- COUPONS policies
-- -----------------------------------------------------------------------
CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  USING (is_admin());

-- Allow authenticated users to read active coupons (for validation at checkout)
CREATE POLICY "Authenticated users can read active coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true);

-- -----------------------------------------------------------------------
-- ADDRESSES policies
-- -----------------------------------------------------------------------
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (is_admin());

-- -----------------------------------------------------------------------
-- ORDERS policies
-- -----------------------------------------------------------------------
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- Allow order creation without auth for guest checkout (via service role only)
-- Guest orders are created server-side using the admin client

-- -----------------------------------------------------------------------
-- ORDER ITEMS policies
-- -----------------------------------------------------------------------
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (is_admin());

-- -----------------------------------------------------------------------
-- REVIEWS policies
-- -----------------------------------------------------------------------
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage reviews"
  ON reviews FOR ALL
  USING (is_admin());


-- =============================================================================
-- SECTION 10: STORAGE BUCKET
-- (Run this separately if needed — creates the product-images bucket)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND is_admin());


-- =============================================================================
-- SECTION 11: SEED — Products from existing supplements data
-- =============================================================================

INSERT INTO products (name, brand, category, price, weight, images, flavors, stock_quantity, is_active, slug) VALUES
(
  'Whey Isolate Pro',
  'IRONFORGE Nutrition',
  'protein',
  8500,
  '2kg',
  ARRAY['https://images.unsplash.com/photo-1693996045300-521e9d08cabc?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY['Chocolate Fudge', 'Vanilla Cream', 'Strawberry', 'Unflavoured'],
  50,
  true,
  'whey-isolate-pro'
),
(
  'Mass Builder XL',
  'IRONFORGE Nutrition',
  'protein',
  11500,
  '3kg',
  ARRAY['https://images.unsplash.com/photo-1693996045346-d0a9b9470909?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY['Double Chocolate', 'Banana Caramel', 'Cookies & Cream'],
  35,
  true,
  'mass-builder-xl'
),
(
  'Inferno Pre-Workout',
  'IRONFORGE Nutrition',
  'pre-workout',
  4200,
  '300g',
  ARRAY['https://images.unsplash.com/photo-1709976142411-26dfc86b13fc?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY['Watermelon Blast', 'Blue Raspberry', 'Cherry Bomb'],
  60,
  true,
  'inferno-pre-workout'
),
(
  'Stim-Free Pump',
  'IRONFORGE Nutrition',
  'pre-workout',
  3800,
  '280g',
  ARRAY['https://images.unsplash.com/photo-1704650311298-4d6915d34c64?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY['Tropical Punch', 'Peach Mango'],
  0,
  true,
  'stim-free-pump'
),
(
  'Creatine Monohydrate',
  'IRONFORGE Nutrition',
  'recovery',
  2200,
  '500g',
  ARRAY['https://images.unsplash.com/photo-1709976142749-4a83767c4228?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY['Unflavoured'],
  80,
  true,
  'creatine-monohydrate'
),
(
  'Recovery BCAA Complex',
  'IRONFORGE Nutrition',
  'recovery',
  3500,
  '400g',
  ARRAY['https://images.unsplash.com/photo-1693996045838-980674653385?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY['Grape Ice', 'Lemon Lime', 'Mixed Berry', 'Passionfruit'],
  45,
  true,
  'recovery-bcaa-complex'
),
(
  'Omega-3 Fish Oil',
  'IRONFORGE Nutrition',
  'vitamins',
  1800,
  '120 softgels',
  ARRAY['https://images.unsplash.com/photo-1670850757896-e1b6c3e311ea?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY[]::TEXT[],
  100,
  true,
  'omega-3-fish-oil'
),
(
  'Multivitamin Elite',
  'IRONFORGE Nutrition',
  'vitamins',
  2600,
  '90 tablets',
  ARRAY['https://images.unsplash.com/photo-1624362772755-4d5843e67047?w=400&h=400&fit=crop&q=80&auto=format'],
  ARRAY[]::TEXT[],
  75,
  true,
  'multivitamin-elite'
);


-- =============================================================================
-- SECTION 12: SEED — Sample Coupons
-- =============================================================================

INSERT INTO coupons (code, type, value, min_order_amount, max_uses, expires_at, is_active) VALUES
('WELCOME10',  'percentage', 10, 0,    NULL, NULL,                       true),
('IRONFORGE20','percentage', 20, 5000, 100,  NOW() + INTERVAL '90 days', true),
('FLAT500',    'fixed',      500, 2000, 50,  NOW() + INTERVAL '30 days', true);


-- =============================================================================
-- DONE
-- =============================================================================
-- Tables created:
--   profiles, products, coupons, addresses, orders, order_items, reviews
--
-- Triggers created:
--   on_auth_user_created    → auto-create profile on signup
--   profiles_updated_at     → keep updated_at current
--   products_updated_at     → keep updated_at current
--   orders_updated_at       → keep updated_at current
--   single_default_address  → enforce one default address per user
--   on_order_coupon_used    → increment coupon uses_count
--   on_order_item_inserted  → decrement product stock
--   on_order_cancelled      → restore stock on cancel/refund
--
-- RLS enabled on all tables with granular policies
-- Storage bucket 'product-images' created (public read, admin write)
-- 8 products seeded + 3 sample coupons seeded
-- =============================================================================
