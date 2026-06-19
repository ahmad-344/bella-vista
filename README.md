# Bella Vista — Italian Fine Dining Website
## Complete Setup Guide

---

## STEP 1 — Images Daalo (Pehle)

Ye images `public/images/` folder mein rakho.
Leonardo AI se download karo, naam bilkul wahi rakho jo neeche likhe hain.

### Dish Images (Menu + Signature Section)
| File Name        | Kya Banana Hai |
|-----------------|----------------|
| dish_a1.jpg     | Bruschetta al Pomodoro — close up, crusty bread, tomatoes, basil |
| dish_a2.jpg     | Burrata e Prosciutto — creamy burrata, Parma ham |
| dish_a3.jpg     | Carpaccio di Manzo — thin beef slices, rocket, parmesan |
| dish_a4.jpg     | Zuppa di Funghi — dark mushroom soup, truffle cream |
| dish_a5.jpg     | Fritto di Mare — crispy mixed seafood platter |
| dish_a6.jpg     | Insalata Caprese — buffalo mozzarella, tomatoes, basil |
| dish_a7.jpg     | Focaccia della Casa — rosemary focaccia, olive oil |
| dish_a8.jpg     | Gamberi all'Aglio — king prawns, garlic, herbs |
| dish_p1.jpg     | Truffle Tagliatelle — pasta with black truffle shavings ⭐ SIGNATURE |
| dish_p2.jpg     | Cacio e Pepe — spaghetti, pepper, pecorino |
| dish_p3.jpg     | Lobster Spaghetti — spaghetti with whole lobster ⭐ SIGNATURE |
| dish_p4.jpg     | Pappardelle al Cinghiale — wide pasta, wild boar ragù |
| dish_p5.jpg     | Rigatoni all'Amatriciana — rigatoni, tomato, guanciale |
| dish_p6.jpg     | Ravioli di Spinaci — spinach ricotta ravioli |
| dish_p7.jpg     | Lasagna della Nonna — classic layered lasagna |
| dish_p8.jpg     | Linguine alle Vongole — linguine with clams |
| dish_pz1.jpg    | Margherita Verace — Neapolitan pizza, basil |
| dish_pz2.jpg    | Tartufo Nero — white pizza, black truffle ⭐ SIGNATURE |
| dish_pz3.jpg    | Diavola Piccante — spicy salami pizza |
| dish_pz4.jpg    | Quattro Formaggi — four cheese pizza |
| dish_pz5.jpg    | Prosciutto e Rucola — prosciutto, rocket pizza |
| dish_pz6.jpg    | Salmone Affumicato — smoked salmon pizza |
| dish_pz7.jpg    | Ortolana — vegetable pizza |
| dish_pz8.jpg    | Calzone Classico — folded calzone |
| dish_m1.jpg     | Osso Buco alla Milanese — braised veal shank, saffron risotto ⭐ SIGNATURE |
| dish_m2.jpg     | Branzino al Forno — whole sea bass, caponata |
| dish_m3.jpg     | Bistecca Fiorentina — T-bone steak, herbs |
| dish_m4.jpg     | Agnello alla Scottadito — lamb cutlets, grilled |
| dish_m5.jpg     | Risotto ai Funghi Porcini — porcini mushroom risotto |
| dish_m6.jpg     | Pollo alla Cacciatora — chicken cacciatore |
| dish_m7.jpg     | Tonno alla Siciliana — seared tuna |
| dish_m8.jpg     | Melanzane alla Parmigiana — aubergine parmigiana |
| dish_d1.jpg     | Tiramisù della Casa — classic tiramisu |
| dish_d2.jpg     | Panna Cotta alla Vaniglia — vanilla panna cotta |
| dish_d3.jpg     | Cannolo Siciliano — crispy cannolo |
| dish_d4.jpg     | Affogato al Caffè — gelato + espresso |
| dish_d5.jpg     | Torta al Cioccolato — chocolate fondant |
| dish_d6.jpg     | Gelato Artigianale — 3 scoops gelato |
| dish_d7.jpg     | Zeppole Fritte — Neapolitan doughnuts |
| dish_d8.jpg     | Delizie al Limone — lemon cake |
| dish_dr1.jpg    | Aperol Spritz — orange cocktail, bubbles |
| dish_dr2.jpg    | Sparkling Water — elegant glass, San Pellegrino |
| dish_dr3.jpg    | Negroni — classic red cocktail, orange peel |
| dish_dr4.jpg    | Barolo DOCG — red wine glass, dark atmosphere |
| dish_dr5.jpg    | Limoncello — frozen limoncello glass |
| dish_dr6.jpg    | Espresso Martini — dark cocktail, coffee foam |
| dish_dr7.jpg    | Italian Lemonade — yellow drink, mint, lemon |
| dish_dr8.jpg    | Prosecco — champagne flute, bubbles |

### Gallery Images
| File Name      | Kya Banana Hai |
|---------------|----------------|
| gallery_1.jpg | Elegant Italian restaurant interior, dark, candlelight, mahogany |
| gallery_2.jpg | Open kitchen, chefs in white, flames, professional action shot |
| gallery_3.jpg | Wine cellar bar, hundreds of wine bottles, warm lighting |
| gallery_4.jpg | Outdoor terrace, fairy lights, jasmine, romantic dinner setting |
| gallery_5.jpg | Private dining room, crystal chandelier, intimate setting |
| gallery_6.jpg | Chef's hands rolling fresh pasta on marble surface |
| gallery_7.jpg | Dessert display — tiramisu, panna cotta on dark slate |
| gallery_8.jpg | Sophisticated bar lounge, Negroni cocktail, leather stools |
| gallery_9.jpg | Chef's table tasting menu, amuse-bouche, white gloves |

### Chef Portrait
| File Name       | Kya Banana Hai |
|----------------|----------------|
| chef_marco.jpg | Professional chef portrait, white jacket, dark background |

--- 

## STEP 2 — Supabase Setup

### A. Account + Project Banao
1. https://supabase.com jao → Free account banao
2. "New Project" → naam: `bella-vista` → password rakh lo (yaad rakhna)
3. Region: Singapore (Pakistan k qareeb)
4. Wait karo ~2 min

### B. Database Schema Run Karo
1. Left sidebar → **SQL Editor** → **New Query**
2. `supabase/schema.sql` file open karo
3. Saara content copy karo → SQL Editor mein paste karo → **Run**
4. "Success" message aana chahiye

### C. Admin User Banao
1. Left sidebar → **Authentication** → **Users** → **Add User**
2. Email: `admin@bellavista.pk` (ya jo bhi chahte ho)
3. Password: ek strong password rakho
4. "Create User" dabao

### D. API Keys Copy Karo
1. Left sidebar → **Settings** → **API**
2. **Project URL** copy karo
3. **anon public** key copy karo

### E. .env File Banao
Project folder mein `.env` naam ki file banao:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...apna-key-yahan
```

---

## STEP 3 — Project Chalao

```bash
# Dependencies install karo (sirf pehli baar)
npm install

# Development server start karo
npm run dev

# Browser mein kholo:
# Website:     http://localhost:5173
# Admin Panel: http://localhost:5173/admin/login
```

### Admin Panel Login
- URL: `http://localhost:5173/admin/login`
- Email: wahi jo Supabase mein banaya
- Password: wahi jo Supabase mein rakha

---

## Admin Panel Features

| Section      | Kya Kar Sakte Ho |
|-------------|-----------------|
| Dashboard   | Stats dekho, recent reservations |
| Reservations | Sab bookings dekho, status change karo (confirmed/completed/cancelled), detail modal |
| Menu        | Items add/edit/delete, availability toggle, signature mark |
| Gallery     | Images add/edit/delete, show/hide toggle |
| Testimonials| Reviews add/edit/delete, show/hide |
| Settings    | Restaurant name, phone, hours, email update karo |

---

## Image Prompts for Leonardo AI

### Dish Images (use for all dish_*.jpg files)
**Aspect Ratio: 4:3 (1200×900px)**

Template prompt (naam replace karo):
```
Professional food photography of [DISH NAME], Italian fine dining restaurant,
dark moody background, candlelight ambiance, elegant plate presentation,
steam rising, shallow depth of field, warm golden tones, ultra realistic,
8K, shot on marble surface
```

### Gallery Images
**Aspect Ratio: 3:2 (1800×1200px) — except gallery_3, gallery_5, gallery_6 use 2:3 portrait**

```
gallery_1: Elegant Italian restaurant interior, dark mahogany furniture,
white tablecloths, gold candelabras, Venetian ceiling murals, candlelight,
luxury fine dining atmosphere, wide angle, photorealistic, 8K

gallery_2: Professional open kitchen Italian restaurant, chefs in white
uniforms, gas flames, stainless steel, warm amber lighting, editorial photography

gallery_3 (portrait): Luxury wine cellar bar, hundreds of wine bottles on
wooden shelves, Edison bulbs, crystal glasses, romantic atmosphere

gallery_4: Outdoor restaurant terrace evening, fairy lights overhead, jasmine
vines, white tablecloths, candles, romantic garden atmosphere, golden hour

gallery_5 (portrait): Exclusive private dining room, 8-person table, crystal
chandelier, floor-length tablecloths, gold tableware, candlelight, luxury

gallery_6 (portrait): Chef's hands rolling fresh pasta on floured marble,
close up, Italian kitchen, warm editorial light, depth of field

gallery_7: Elegant Italian dessert display — tiramisu, panna cotta, cannoli
on dark marble slate, fine dining photography, warm tones

gallery_8: Sophisticated Italian bar lounge, Aperol Spritz and Negroni,
leather stools, moody lighting, golden accents, editorial photography

gallery_9: Intimate chef's table luxury restaurant, 8-course tasting menu,
white glove service, dramatic directional lighting, cinematic
```

### Chef Portrait
**Aspect Ratio: 2:3 portrait (1200×1800px)**
```
Professional portrait photography of a confident Italian male chef,
early 40s, white chef's jacket, warm studio lighting, dark bokeh background,
arms crossed, natural expression, photorealistic, 8K
```

---

## Project Structure

```
bella-vista/
├── public/
│   └── images/          ← APNI SAARI IMAGES YAHAN RAKHO
├── src/
│   ├── lib/
│   │   └── supabase.ts  ← Supabase client
│   ├── contexts/
│   │   └── AuthContext.tsx ← Admin authentication
│   ├── hooks/
│   │   ├── useSupabaseData.ts ← All data fetching
│   │   └── useScrollReveal.ts
│   ├── pages/
│   │   ├── admin/       ← Admin panel pages
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminReservations.tsx
│   │   │   ├── AdminMenu.tsx
│   │   │   ├── AdminGallery.tsx
│   │   │   ├── AdminTestimonials.tsx
│   │   │   └── AdminSettings.tsx
│   │   └── [public pages]
│   └── components/
│       ├── admin/
│       │   ├── AdminLayout.tsx
│       │   └── ProtectedRoute.tsx
│       └── [sections & layout]
└── supabase/
    └── schema.sql       ← Database setup SQL
```

---

## Agar Supabase Setup Na Karo

Website bina Supabase k bhi kaam karti hai:
- Menu, gallery, testimonials local data se load honge
- Reservations localStorage mein save hongi
- Admin panel ka data section nahi chalega

---

## Production Mein Deploy Karna (Vercel)

```bash
# Build banao
npm run build

# Vercel par deploy (free):
# 1. vercel.com par account banao
# 2. "Import Project" → bella-vista folder
# 3. Environment Variables mein VITE_SUPABASE_URL aur VITE_SUPABASE_ANON_KEY add karo
# 4. Deploy!
```

