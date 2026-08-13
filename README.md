<<<<<<< HEAD
# JobsOrbit
=======
# 🎓 CareerHub — Production Student Jobs & Internship Portal

**CareerHub** is a full-stack Next.js 16 Web Application designed for publishing daily off-campus jobs, internships, work-from-home opportunities, and career placement guides for students and freshers.

---

## 🌟 Key Features

### 👤 Public Candidate Portal
- **Homepage**: Hero section with search bar, category chips, featured opportunities slider, closing soon urgency section, and latest career blogs.
- **Jobs & Internships Listings (`/jobs`, `/internships`)**: Advanced real-time filters (category, work mode, job type, experience level), sorting dropdown, and pagination.
- **Dynamic SEO Detail Pages (`/jobs/[slug]`, `/internships/[slug]`)**: Google `JobPosting` JSON-LD schema, skills tags, company logo, salary/stipend badge, formatted requirements, share buttons, and direct external "Apply Now" button.
- **Companies & Categories (`/companies`, `/categories`)**: Public directory of hiring partners and domain categories with opportunity counts.
- **Career Advice Blog (`/blog`, `/blog/[slug]`)**: Article directory and full Markdown reader with `BlogPosting` JSON-LD schema.
- **Global Search Modal (`Cmd+K`)**: Instant multi-model search across opportunities, companies, categories, and articles.

### 🛡️ Admin Management Portal (`/admin`)
- **Dashboard Overview (`/admin`)**: Live metric counters (total jobs, published, drafts, companies, blog posts), quick action shortcuts, and recent activity table.
- **Opportunity Manager (`/admin/opportunities`)**: Full CRUD for jobs & internships, multi-section form (company, category, salary range, skills, deadline, SEO fields), instant publish/draft toggles, duplicate listing action, and bulk status controls.
- **Company Manager (`/admin/companies`)**: Add/edit hiring companies with logos and website links.
- **Category Manager (`/admin/categories`)**: Inline category editor modal and slug generator.
- **Blog Manager (`/admin/blog`)**: Markdown editor with real-time live preview tabs.
- **Media Library (`/admin/media`)**: Direct image uploader with Cloudinary SDK integration, copy URL action, and preview gallery.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **Framework** | Next.js 16.3.0 (App Router, Server Actions, Dynamic Metadata) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 (`@theme` design tokens in `globals.css`) |
| **Database** | MongoDB Atlas + Mongoose ORM |
| **Authentication** | NextAuth.js v5 (Auth.js) with bcrypt password hashing |
| **Media Storage** | Cloudinary v2 SDK (`app/api/upload`) |
| **Icons** | Lucide React |
| **Validation** | Zod schemas (`validations/`) |
| **Markdown** | `react-markdown` |

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
Ensure Node.js `v18.x` or later is installed on your system.

### 2. Environment Setup
Copy `.env.example` to `.env.local` and add your database and authentication keys:

```bash
cp .env.example .env.local
```

Fill in your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/careerhub?retryWrites=true&w=majority
NEXTAUTH_SECRET=super_secret_key_change_me
NEXTAUTH_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

On first run, the application automatically seeds the default admin user:

- **Email**: `admin@careerhub.com`
- **Password**: `admin123456`
- **Admin Login Route**: `/login`

---

## 📁 Project Directory Layout

```
CareerHub/
├── actions/             # Next.js Server Actions (opportunity, company, category, blog, stats, search, upload)
├── app/
│   ├── (admin)/         # Admin layout & protected pages (/admin/*)
│   ├── (public)/        # Public candidate routes (/jobs, /internships, /companies, /categories, /blog)
│   ├── api/             # API routes (Auth.js [...nextauth], Cloudinary upload)
│   ├── error.tsx        # Global error boundary
│   ├── layout.tsx       # Root layout with fonts & global JSON-LD schemas
│   ├── loading.tsx      # Global loading skeleton
│   ├── not-found.tsx    # 404 page
│   ├── robots.ts        # Dynamic robots.txt
│   └── sitemap.ts       # Dynamic sitemap.xml
├── components/          # Reusable UI components, layout headers/footers, search modal
├── config/              # Site configuration & metadata
├── lib/                 # Mongoose singleton, Auth options, Cloudinary SDK, SEO helpers, date/slug utilities
├── models/              # Mongoose database models (User, Company, Category, Opportunity, BlogPost)
├── proxy.ts             # Next.js 16 route protection middleware
├── types/               # TypeScript interface definitions
├── validations/         # Zod validation schemas
└── next.config.ts       # Performance headers & image domain rules
```

---

## 🚢 Production Build & Deployment

To test a production build locally:

```bash
npm run build
npm run start
```

### Deploying to Vercel
1. Push repository to GitHub/GitLab.
2. Import project into Vercel.
3. Add environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Cloudinary keys) in Vercel settings.
4. Deploy! Next.js 16 App Router will automatically build and deploy static & dynamic routes.

---

## 📜 License

MIT License. Designed and engineered for student career empowerment.
>>>>>>> e88f91a (feat: initial commit for JobsOrbit platform with full admin panel)
