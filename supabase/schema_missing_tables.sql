-- ====================================================
-- BELLA VISTA — Missing Tables Fix
-- Supabase SQL Editor mein paste karo aur RUN karo
-- ====================================================

-- ── 1. Categories Table ──────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER      DEFAULT 0,
  is_active  BOOLEAN      DEFAULT true,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Admin all categories"   ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all categories"   ON categories FOR ALL   USING (auth.role() = 'authenticated');

-- Default categories
INSERT INTO categories (name, sort_order) VALUES
  ('Antipasti', 1), ('Pasta', 2), ('Pizza', 3),
  ('Mains', 4), ('Desserts', 5), ('Drinks', 6)
ON CONFLICT (name) DO NOTHING;

-- ── 2. Contact Messages Table ────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  subject    VARCHAR(200) DEFAULT '',
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      DEFAULT false,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can send message" ON contact_messages;
DROP POLICY IF EXISTS "Admin reads messages"    ON contact_messages;
CREATE POLICY "Anyone can send message" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads messages"    ON contact_messages FOR ALL   USING (auth.role() = 'authenticated');

-- ── 3. x_url Setting ─────────────────────────────────
INSERT INTO settings (key, value) VALUES ('x_url', '')
ON CONFLICT (key) DO NOTHING;

-- ====================================================
-- Done! Ab website reload karo — categories aur
-- contact messages kaam karne lagenge.
-- ====================================================
