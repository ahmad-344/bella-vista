# Bella Vista — Italian Fine Dining Restaurant Website

A full-stack restaurant website for Bella Vista Ristorante Italiano, featuring an online reservation system, dynamic menu management, image gallery, customer testimonials, and a comprehensive admin panel — all powered by a Supabase backend.

---

## Features

### Public Website

**Home Page**
- Animated hero section with particle effects and parallax scrolling
- Chef's Signature Dishes section with dish detail modals
- Image gallery showcase with hover overlays
- Customer testimonials carousel with auto-rotation
- Contact section with CSS-based map and opening hours

**Menu Page**
- Tabbed navigation by category (Antipasti, Pasta, Pizza, Mains, Desserts, Drinks)
- Clickable dietary filters (Vegan, Gluten-Free, Spicy)
- Per-item popup modal with dish image, description, and price
- Dynamic categories loaded from the admin panel

**Reservations Page**
- Two-step reservation form with validation
- Real-time date picker with past dates disabled
- Time slots showing Passed and Booked status
- Add to Google Calendar integration
- PDF reservation confirmation download
- My Reservations section with Cancel and Reschedule functionality
- 24-hour cancellation policy enforcement

**Gallery Page**
- Masonry grid layout with restaurant imagery
- Hover overlay with image descriptions

**Contact Page**
- Contact form connected to the admin panel
- CSS-based map with configurable location
- Opening hours and contact details

**Other Pages**
- Our Story page with chef biography and timeline
- Privacy Policy
- Terms of Use

### Admin Panel

Accessible at `/admin/login`

| Section | Capabilities |
|---|---|
| Dashboard | Live statistics, recent reservations, pending count |
| Reservations | View all bookings, filter by status, update status, view contact details |
| Menu | Add, edit, delete menu items with dietary tags and availability toggle |
| Categories | Add, reorder, show or hide menu categories |
| Gallery | Manage gallery images with show or hide control |
| Testimonials | Add, edit, delete customer reviews |
| Messages | View contact form submissions, mark as read, reply via email |
| Settings | Update all restaurant information — changes propagate site-wide instantly |

### Settings Propagation

Any change saved in Admin Settings updates the entire website in real time, including the restaurant name, phone number, email, opening hours, social media links, address, and map location.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript |
| Styling | Tailwind CSS, custom CSS |
| Build Tool | Vite |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL, Auth, Row Level Security) |
| Deployment | Vercel (recommended) or Netlify |

---

## Prerequisites

Before you begin, ensure the following are installed on your system.

- Node.js version 18 or higher — https://nodejs.org
- npm (included with Node.js)
- Git — https://git-scm.com

To verify installation, open a terminal and run:

```
node --version
npm --version
git --version
```

---

## Local Development Setup

### Step 1 — Clone or Download the Project

If you have the project as a ZIP file, extract it to a folder of your choice.

If cloning from GitHub:

```
git clone https://github.com/YOUR_USERNAME/bella-vista.git
cd bella-vista
```

### Step 2 — Install Dependencies

```
npm install
```

### Step 3 — Configure Supabase

The application requires a Supabase project for full functionality. Without Supabase, the site still runs using local fallback data, but reservations, contact messages, and admin panel features will not persist.

**Create a Supabase project**

1. Go to https://supabase.com and create a free account
2. Click "New Project" and name it `bella-vista`
3. Wait approximately two minutes for the project to initialise

**Set up the database**

1. In your Supabase project, go to SQL Editor
2. Click "New Query"
3. Open the file `supabase/schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click "Run" — all tables, policies, and seed data will be created
6. If you previously ran an older version of this schema, also run `supabase/schema_missing_tables.sql` to add the `categories` and `contact_messages` tables

**Create an admin user**

1. Go to Authentication > Users
2. Click "Add User"
3. Enter your admin email and a strong password
4. Click "Create User"

**Get your API credentials**

1. Go to Settings > API
2. Copy the "Project URL"
3. Copy the "anon public" key

### Step 4 — Configure Environment Variables

Create a file named `.env` in the project root directory:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

Replace the values with your actual Supabase credentials. A template is provided in `.env.example`.

### Step 5 — Add Images

Place all restaurant images in the `public/images/` directory. The full list of required image filenames and suggested AI image generation prompts are documented in `README_IMAGES.md`.

### Step 6 — Start the Development Server

```
npm run dev
```

The website will be available at:
- Public website: http://localhost:5173
- Admin panel: http://localhost:5173/admin/login

---

## Building for Production

To create an optimised production build:

```
npm run build
```

The output will be generated in the `dist/` directory, ready to deploy to any static hosting provider.

To preview the production build locally:

```
npm run preview
```

---

## Deployment

### Option A — Vercel (Recommended)

Vercel provides zero-configuration deployment for React applications and handles client-side routing automatically.

1. Push your project to a GitHub repository (see GitHub Setup below)
2. Go to https://vercel.com and sign in with GitHub
3. Click "New Project" and import your repository
4. In the "Environment Variables" section, add:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon key
5. Click "Deploy"

Your site will be live at a Vercel subdomain within approximately one minute. Every push to the main branch triggers an automatic redeployment.

### Option B — Netlify

1. Push your project to GitHub
2. Go to https://netlify.com and connect your GitHub account
3. Select your repository and configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add the same environment variables as listed above
5. Create a file at `public/_redirects` with the following content, so client-side routing works correctly:

```
/*    /index.html   200
```

6. Click "Deploy Site"

---

## GitHub Setup — Pushing from Your PC (Windows)

Follow these steps to push the project to GitHub from a Windows machine.

### Step 1 — Install Git

Download Git for Windows from https://git-scm.com/download/win and install with default settings.

### Step 2 — Configure Git Identity

Open a terminal (Command Prompt, PowerShell, or the VS Code terminal) and run:

```
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Step 3 — Create a GitHub Account

Go to https://github.com and create a free account if you do not already have one.

### Step 4 — Create a New Repository

1. On GitHub, click the "+" icon in the top right corner
2. Select "New repository"
3. Set the repository name to `bella-vista`
4. Set the description (see Repository Information below)
5. Choose "Public" or "Private"
6. Do not initialise with a README, .gitignore, or license — the project already includes these
7. Click "Create repository"

### Step 5 — Verify .gitignore

Before pushing, confirm that your `.env` file will never be uploaded to GitHub. Open the `.gitignore` file in the project root and verify it contains:

```
.env
node_modules
dist
```

### Step 6 — Initialise and Push

Open a terminal in your project folder and run the following commands in order:

```
git init
git add .
git commit -m "Initial commit: Bella Vista restaurant website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bella-vista.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 7 — Authenticate with GitHub

When prompted for credentials during the push, use your GitHub username and a Personal Access Token in place of your password.

To create a token: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token > select the "repo" scope > Generate token. Copy the token immediately, as it will not be shown again.

### Step 8 — Future Updates

After making changes to the project, push updates with:

```
git add .
git commit -m "Description of changes"
git push
```

---

## Repository Information

**Recommended repository name**

```
bella-vista
```

**Recommended description**

```
A full-stack Italian fine dining restaurant website built with React, TypeScript, Tailwind CSS, and Supabase. Features an online reservation system, dynamic menu management, image gallery, customer testimonials, and a complete admin panel with real-time settings propagation.
```

**Recommended topics** (add under repository Settings > Topics)

```
react typescript tailwind supabase restaurant vite admin-panel reservation-system postgresql
```

---

## Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL, found in Settings > API | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key, found in Settings > API | Yes |

---

## Project Structure

```
bella-vista/
├── public/
│   └── images/                   Restaurant and dish images
├── src/
│   ├── assets/
│   │   └── svgs/Icons.tsx        Custom SVG icon components
│   ├── components/
│   │   ├── admin/                Admin layout and route protection
│   │   ├── layout/                Navbar and Footer
│   │   └── sections/              Page section components
│   ├── contexts/
│   │   ├── AuthContext.tsx       Admin authentication state
│   │   └── SettingsContext.tsx   Global restaurant settings
│   ├── data/
│   │   ├── menuData.ts           Local fallback menu data
│   │   └── restaurantData.ts     Local fallback restaurant data
│   ├── hooks/
│   │   ├── useSupabaseData.ts    All data fetching and mutations
│   │   └── useScrollReveal.ts    Scroll animation hook
│   ├── lib/
│   │   └── supabase.ts           Supabase client initialisation
│   ├── pages/
│   │   ├── admin/                Admin panel pages
│   │   └── [public pages]        Public-facing pages
│   ├── App.tsx                   Route configuration
│   ├── main.tsx                  Application entry point
│   └── index.css                 Global styles and animations
├── supabase/
│   ├── schema.sql                Complete database schema with seed data
│   └── schema_missing_tables.sql SQL for tables added in later updates
├── .env.example                  Environment variable template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Database Schema

The Supabase database contains the following tables:

| Table | Purpose |
|---|---|
| `reservations` | Customer booking records with status tracking |
| `menu_items` | Restaurant menu with categories and dietary information |
| `gallery_items` | Gallery images with labels and sort order |
| `testimonials` | Customer reviews and ratings |
| `categories` | Dynamic menu category configuration |
| `settings` | Key-value store for restaurant configuration |
| `contact_messages` | Customer enquiries submitted from the contact form |

All tables have Row Level Security enabled. Public visitors can read menu items, gallery, testimonials, categories, and settings. Only authenticated admin users have write access and can read reservations and contact messages.

---

## Admin Panel Access

The admin panel is accessible at the `/admin/login` path on any deployment.

Admin credentials are created during Supabase setup (Authentication > Users). To change the admin password later, go to your Supabase Dashboard > Authentication > Users, select the user, and edit the password.

---

## Known Considerations

- The Supabase `schema.sql` file must be executed before first use. Without it, the admin panel will show empty data or table-not-found errors, and the public site will fall back to static local data.
- The `schema_missing_tables.sql` file must also be run if upgrading from an earlier version of this project that did not include the `categories` or `contact_messages` tables.
- Images must be manually placed in `public/images/`, as the application does not include a file upload feature. Image filenames follow a strict naming convention documented in `README_IMAGES.md`.

---

## License

This project is provided for personal and commercial use by the repository owner. The source code is not licensed for redistribution or resale.

---

Bella Vista Ristorante Italiano — Built with React, TypeScript, and Supabase
