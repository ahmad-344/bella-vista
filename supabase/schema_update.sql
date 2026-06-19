-- ================================================
-- BELLA VISTA — Schema Update (Run after schema.sql)
-- ================================================
-- Supabase SQL Editor mein paste karke Run karo

-- ── Contact Messages ─────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  subject    VARCHAR(200) DEFAULT '',
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send message" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- ── Categories ───────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all categories"   ON categories FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO categories (name, sort_order) VALUES
  ('Antipasti', 1), ('Pasta', 2), ('Pizza', 3),
  ('Mains', 4), ('Desserts', 5), ('Drinks', 6)
ON CONFLICT (name) DO NOTHING;

-- ── Extra Settings (Map + Social) ────────────────
INSERT INTO settings (key, value) VALUES
  ('map_label',       'Blue Area, Islamabad'),
  ('map_lat',         '33.7215'),
  ('map_lng',         '73.0433'),
  ('instagram_url',   'https://instagram.com/'),
  ('facebook_url',    'https://facebook.com/'),
  ('whatsapp_url',    '')
ON CONFLICT (key) DO NOTHING;

-- ── Update reservations status default to pending ─
ALTER TABLE reservations ALTER COLUMN status SET DEFAULT 'pending';
