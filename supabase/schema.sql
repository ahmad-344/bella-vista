-- ================================================
-- BELLA VISTA — Complete Supabase Schema
-- ================================================
-- Supabase Dashboard > SQL Editor > New Query
-- Is poora code paste karo aur RUN dabao

-- ── 1. RESERVATIONS ──────────────────────────────
CREATE TABLE IF NOT EXISTS reservations (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_code VARCHAR(6)   NOT NULL,
  date              DATE         NOT NULL,
  time              VARCHAR(20)  NOT NULL,
  guests            VARCHAR(20)  NOT NULL,
  seating           VARCHAR(50)  DEFAULT '',
  occasion          VARCHAR(50)  DEFAULT 'None',
  special_requests  TEXT         DEFAULT '',
  name              VARCHAR(100) NOT NULL,
  phone             VARCHAR(30)  NOT NULL,
  email             VARCHAR(100) NOT NULL,
  source            VARCHAR(50)  DEFAULT '',
  status            VARCHAR(20)  DEFAULT 'pending',
  created_at        TIMESTAMPTZ  DEFAULT NOW()
);

-- ── 2. MENU ITEMS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         VARCHAR(150)  NOT NULL,
  description  TEXT          DEFAULT '',
  price        INTEGER       NOT NULL,
  category     VARCHAR(50)   NOT NULL,
  dietary      TEXT[]        DEFAULT '{}',
  is_signature BOOLEAN       DEFAULT false,
  is_available BOOLEAN       DEFAULT true,
  image_name   VARCHAR(100)  DEFAULT '',
  sort_order   INTEGER       DEFAULT 0,
  created_at   TIMESTAMPTZ   DEFAULT NOW()
);

-- ── 3. GALLERY ITEMS ──────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label       VARCHAR(100) NOT NULL,
  description TEXT         DEFAULT '',
  image_name  VARCHAR(100) NOT NULL,
  gradient    TEXT         DEFAULT 'linear-gradient(135deg,#1a0a12,#2d1520)',
  sort_order  INTEGER      DEFAULT 0,
  is_active   BOOLEAN      DEFAULT true,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ── 4. TESTIMONIALS ───────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text       TEXT         NOT NULL,
  author     VARCHAR(100) NOT NULL,
  location   VARCHAR(100) DEFAULT '',
  rating     INTEGER      DEFAULT 5,
  is_active  BOOLEAN      DEFAULT true,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── 5. CATEGORIES ────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER      DEFAULT 0,
  is_active  BOOLEAN      DEFAULT true,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── 6. SETTINGS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT         NOT NULL,
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ── 7. CONTACT MESSAGES ───────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL,
  subject    VARCHAR(200) DEFAULT '',
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      DEFAULT false,
  created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================
ALTER TABLE reservations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public: INSERT reservations + contact messages
DROP POLICY IF EXISTS "Anyone can book"           ON reservations;
DROP POLICY IF EXISTS "Anyone can send message"   ON contact_messages;
CREATE POLICY "Anyone can book"         ON reservations     FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can send message" ON contact_messages FOR INSERT WITH CHECK (true);

-- Public: READ menu, gallery, testimonials, categories, settings
DROP POLICY IF EXISTS "Public read menu"          ON menu_items;
DROP POLICY IF EXISTS "Public read gallery"       ON gallery_items;
DROP POLICY IF EXISTS "Public read testimonials"  ON testimonials;
DROP POLICY IF EXISTS "Public read categories"    ON categories;
DROP POLICY IF EXISTS "Public read settings"      ON settings;
CREATE POLICY "Public read menu"         ON menu_items    FOR SELECT USING (is_available = true);
CREATE POLICY "Public read gallery"      ON gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Public read testimonials" ON testimonials  FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories"   ON categories    FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings"     ON settings      FOR SELECT USING (true);

-- Public: READ reservation times for a date (to check booked slots)
DROP POLICY IF EXISTS "Public read reservation times" ON reservations;
CREATE POLICY "Public read reservation times" ON reservations FOR SELECT USING (true);

-- Admin: full access
DROP POLICY IF EXISTS "Admin all reservations"    ON reservations;
DROP POLICY IF EXISTS "Admin all menu"            ON menu_items;
DROP POLICY IF EXISTS "Admin all gallery"         ON gallery_items;
DROP POLICY IF EXISTS "Admin all testimonials"    ON testimonials;
DROP POLICY IF EXISTS "Admin all categories"      ON categories;
DROP POLICY IF EXISTS "Admin all settings"        ON settings;
DROP POLICY IF EXISTS "Admin reads messages"      ON contact_messages;
CREATE POLICY "Admin all reservations"  ON reservations     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all menu"          ON menu_items       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all gallery"       ON gallery_items    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all testimonials"  ON testimonials     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all categories"    ON categories       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings"      ON settings         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin reads messages"    ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

-- ================================================
-- SEED DATA — Default Settings
-- ================================================
INSERT INTO settings (key, value) VALUES
  ('restaurant_name', 'Bella Vista'),
  ('tagline',         'An Experience for All Your Senses.'),
  ('address',         'Blue Area, Islamabad, Pakistan'),
  ('phone',           '+92 51 234 5678'),
  ('whatsapp',        '+923001234567'),
  ('email',           'reservations@bellavista.pk'),
  ('hours_mon_thu',   '12:00 PM — 10:00 PM'),
  ('hours_fri_sat',   '12:00 PM — 11:30 PM'),
  ('hours_sun',       '1:00 PM — 10:00 PM'),
  ('map_label',       'Blue Area, Islamabad'),
  ('map_lat',         '33.7215'),
  ('map_lng',         '73.0433'),
  ('instagram_url',   'https://instagram.com/'),
  ('facebook_url',    'https://facebook.com/'),
  ('x_url',           '')
ON CONFLICT (key) DO NOTHING;

-- ── Default Categories ────────────────────────────
INSERT INTO categories (name, sort_order) VALUES
  ('Antipasti',1),('Pasta',2),('Pizza',3),
  ('Mains',4),('Desserts',5),('Drinks',6)
ON CONFLICT (name) DO NOTHING;

-- ── Default Testimonials ──────────────────────────
INSERT INTO testimonials (text, author, location, rating) VALUES
  ('The truffle tagliatelle was the most exquisite thing I have ever tasted. The ambiance is pure magic — golden candlelight, impeccable service. Bella Vista is now our family''s celebration restaurant.','Amna S.','Islamabad',5),
  ('We celebrated our anniversary here and it exceeded every expectation. The wine pairing was masterful, the osso buco simply melted. Truly world-class in every dimension.','Omar & Fatima R.','Lahore',5),
  ('As someone who has dined in Naples and Rome, I can honestly say Bella Vista stands among them. The authenticity and attention to detail — it is extraordinary.','Dr. Tariq M.','Islamabad',5)
ON CONFLICT DO NOTHING;

-- ── Default Gallery ───────────────────────────────
INSERT INTO gallery_items (label, description, image_name, gradient, sort_order) VALUES
  ('The Main Dining Hall',  'Intimate candlelit tables beneath hand-painted Venetian ceilings.','gallery_1.jpg','linear-gradient(135deg,#2d0a12,#4a1520)',1),
  ('Chef''s Open Kitchen',  'Watch our brigade craft each dish with precision and passion.',     'gallery_2.jpg','linear-gradient(135deg,#1a0f00,#3d2800)',2),
  ('The Wine Cellar Bar',   'Over 200 Italian labels curated by our resident sommelier.',        'gallery_3.jpg','linear-gradient(135deg,#0a1a0a,#1a3015)',3),
  ('Garden Terrace',        'Al fresco dining under jasmine canopies and fairy lights.',         'gallery_4.jpg','linear-gradient(135deg,#0f1a0a,#263d1a)',4),
  ('Private Dining Room',   'Exclusively yours for up to 20 guests — celebrations done right.', 'gallery_5.jpg','linear-gradient(135deg,#1a0a1a,#32153a)',5),
  ('The Pasta Atelier',     'Daily hand-rolling — tagliatelle, pappardelle, ravioli and more.', 'gallery_6.jpg','linear-gradient(135deg,#1a1200,#3d2e00)',6),
  ('Dessert Showcase',      'Patisserie crafted by our award-winning pastry chef.',              'gallery_7.jpg','linear-gradient(135deg,#1a0c06,#3d1e10)',7),
  ('Lounge & Aperitivo',    'Begin your evening with a Negroni and house-cured antipasti.',     'gallery_8.jpg','linear-gradient(135deg,#0a0f1a,#152038)',8),
  ('Chef''s Table',         'An 8-course journey — your private theatre with our head chef.',   'gallery_9.jpg','linear-gradient(135deg,#0c0c0c,#2a2215)',9)
ON CONFLICT DO NOTHING;

-- ── Menu Items (48 items) ─────────────────────────
INSERT INTO menu_items (name,description,price,category,dietary,is_signature,image_name,sort_order) VALUES
  ('Bruschetta al Pomodoro','Toasted sourdough, heirloom tomatoes, fresh basil, aged balsamic',850,'Antipasti','{vegan}',false,'dish_a1.jpg',1),
  ('Burrata e Prosciutto','Pugliese burrata, 24-month Parma ham, fig compote, pine nuts',1800,'Antipasti','{}',false,'dish_a2.jpg',2),
  ('Carpaccio di Manzo','Wagyu beef, rocket, Parmigiano, truffle oil, capers',2400,'Antipasti','{}',false,'dish_a3.jpg',3),
  ('Zuppa di Funghi','Wild mushroom veloute, truffle cream, crispy shallots',1100,'Antipasti','{vegan,gluten-free}',false,'dish_a4.jpg',4),
  ('Fritto di Mare','Crispy calamari, prawns, baby scallops, saffron aioli',2800,'Antipasti','{}',false,'dish_a5.jpg',5),
  ('Insalata Caprese','Buffalo mozzarella, vine tomatoes, basil, Calabrian olive oil',1400,'Antipasti','{vegan,gluten-free}',false,'dish_a6.jpg',6),
  ('Focaccia della Casa','Rosemary focaccia, Taggiasca olive oil, sea salt, roasted garlic',650,'Antipasti','{vegan}',false,'dish_a7.jpg',7),
  ('Gamberi all Aglio','King prawns, white wine, garlic, chilli, crostini',2200,'Antipasti','{spicy}',false,'dish_a8.jpg',8),
  ('Truffle Tagliatelle','Hand-rolled pasta, Perigord black truffle, aged parmesan, brown butter',4500,'Pasta','{}',true,'dish_p1.jpg',1),
  ('Cacio e Pepe','Tonnarelli, Pecorino Romano DOP, Parmigiano, black pepper',2200,'Pasta','{vegan}',false,'dish_p2.jpg',2),
  ('Lobster Spaghetti','Spaghetti, Boston lobster, cherry tomatoes, white wine, chilli',5500,'Pasta','{spicy}',true,'dish_p3.jpg',3),
  ('Pappardelle al Cinghiale','Wide pasta, slow-braised wild boar ragu, juniper, sage',3800,'Pasta','{}',false,'dish_p4.jpg',4),
  ('Rigatoni all Amatriciana','Guanciale, San Marzano tomatoes, Pecorino, chilli',2600,'Pasta','{spicy}',false,'dish_p5.jpg',5),
  ('Ravioli di Spinaci','Spinach ricotta ravioli, sage brown butter, pine nuts, lemon',2900,'Pasta','{}',false,'dish_p6.jpg',6),
  ('Lasagna della Nonna','Slow-cooked Bolognese, bechamel, Parmigiano',2800,'Pasta','{}',false,'dish_p7.jpg',7),
  ('Linguine alle Vongole','Clams, white wine, garlic, parsley, chilli',3200,'Pasta','{spicy}',false,'dish_p8.jpg',8),
  ('Margherita Verace','San Marzano DOP, Fior di Latte, fresh basil, olive oil',1900,'Pizza','{vegan}',false,'dish_pz1.jpg',1),
  ('Tartufo Nero','Black truffle, mozzarella, fontina, mushrooms, thyme',3200,'Pizza','{}',true,'dish_pz2.jpg',2),
  ('Diavola Piccante','Calabrian salami, mozzarella, Nduja, fresh chilli',2400,'Pizza','{spicy}',false,'dish_pz3.jpg',3),
  ('Quattro Formaggi','Mozzarella, Gorgonzola, Provolone, aged Parmigiano',2700,'Pizza','{}',false,'dish_pz4.jpg',4),
  ('Prosciutto e Rucola','San Marzano, mozzarella, Parma ham, rocket, Parmigiano',2600,'Pizza','{}',false,'dish_pz5.jpg',5),
  ('Salmone Affumicato','Smoked salmon, creme fraiche, capers, red onion, dill',3100,'Pizza','{}',false,'dish_pz6.jpg',6),
  ('Ortolana','Grilled vegetables, tomato, mozzarella, basil pesto',2000,'Pizza','{vegan}',false,'dish_pz7.jpg',7),
  ('Calzone Classico','Ricotta, salami, mozzarella, mushrooms, tomato',2300,'Pizza','{}',false,'dish_pz8.jpg',8),
  ('Osso Buco alla Milanese','Slow-braised veal shank, saffron risotto, gremolata',6500,'Mains','{}',true,'dish_m1.jpg',1),
  ('Branzino al Forno','Mediterranean sea bass, Sicilian caponata, olives, capers',5200,'Mains','{gluten-free}',false,'dish_m2.jpg',2),
  ('Bistecca Fiorentina','Dry-aged Wagyu T-bone, rosemary, garlic, roasted potatoes',9500,'Mains','{gluten-free}',false,'dish_m3.jpg',3),
  ('Agnello alla Scottadito','Grilled lamb cutlets, herb crust, root vegetables, salsa verde',7200,'Mains','{gluten-free}',false,'dish_m4.jpg',4),
  ('Risotto ai Funghi Porcini','Carnaroli risotto, porcini, Parmigiano, thyme, truffle oil',3900,'Mains','{gluten-free}',false,'dish_m5.jpg',5),
  ('Pollo alla Cacciatora','Free-range chicken, tomatoes, olives, capers, rosemary',4200,'Mains','{gluten-free}',false,'dish_m6.jpg',6),
  ('Tonno alla Siciliana','Seared yellowfin tuna, cherry tomatoes, olives, capers',5800,'Mains','{gluten-free}',false,'dish_m7.jpg',7),
  ('Melanzane alla Parmigiana','Aubergine, San Marzano, Fior di Latte, fresh basil',2800,'Mains','{vegan,gluten-free}',false,'dish_m8.jpg',8),
  ('Tiramisu della Casa','Savoiardi, mascarpone, espresso, dark Valrhona cocoa',950,'Desserts','{}',false,'dish_d1.jpg',1),
  ('Panna Cotta alla Vaniglia','Vanilla bean panna cotta, wild berry coulis, fresh mint',850,'Desserts','{gluten-free}',false,'dish_d2.jpg',2),
  ('Cannolo Siciliano','Crispy pastry, sweetened ricotta, pistachio, candied orange',900,'Desserts','{}',false,'dish_d3.jpg',3),
  ('Affogato al Caffe','Vanilla gelato, double shot Illy espresso',750,'Desserts','{gluten-free}',false,'dish_d4.jpg',4),
  ('Torta al Cioccolato','Warm chocolate fondant, salted caramel, hazelnut, gelato',1100,'Desserts','{}',false,'dish_d5.jpg',5),
  ('Gelato Artigianale','3 scoops house gelato: pistachio, stracciatella or hazelnut',800,'Desserts','{gluten-free}',false,'dish_d6.jpg',6),
  ('Zeppole Fritte','Warm Neapolitan doughnuts, icing sugar, Nutella dipping sauce',900,'Desserts','{}',false,'dish_d7.jpg',7),
  ('Delizie al Limone','Lemon sponge, limoncello cream, candied peel, lemon glaze',950,'Desserts','{gluten-free}',false,'dish_d8.jpg',8),
  ('Aperol Spritz','Aperol, Prosecco Valdobbiadene, soda, fresh orange',1200,'Drinks','{}',false,'dish_dr1.jpg',1),
  ('Sparkling Water 500ml','San Pellegrino or still Acqua Panna',400,'Drinks','{vegan,gluten-free}',false,'dish_dr2.jpg',2),
  ('Negroni','Gin, Campari, sweet Martini Rosso, orange peel',1800,'Drinks','{}',false,'dish_dr3.jpg',3),
  ('Barolo DOCG Glass','Piedmont king of wines, rich and complex, aged 3 years',2800,'Drinks','{vegan,gluten-free}',false,'dish_dr4.jpg',4),
  ('Limoncello di Casa','House-infused Amalfi lemon liqueur, served ice cold',900,'Drinks','{}',false,'dish_dr5.jpg',5),
  ('Espresso Martini','Vodka, fresh espresso, Kahlua, shaken to creamy foam',1600,'Drinks','{}',false,'dish_dr6.jpg',6),
  ('Italian Lemonade','Fresh Amalfi lemon, basil syrup, sparkling water, elderflower',700,'Drinks','{vegan,gluten-free}',false,'dish_dr7.jpg',7),
  ('Prosecco Valdobbiadene','Fine bubbles, pear, white blossom — perfect aperitivo',1400,'Drinks','{vegan,gluten-free}',false,'dish_dr8.jpg',8)
ON CONFLICT DO NOTHING;

-- ================================================
-- DONE! Now go to Authentication > Users and
-- create your admin user with email + password.
-- ================================================
