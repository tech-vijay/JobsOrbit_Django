# 🎓 JobsOrbit — Production Student Jobs & Internship Portal

**JobsOrbit** is a full-stack web application designed for publishing daily off-campus jobs, internships, work-from-home opportunities, and career placement guides for students and freshers.

It features a high-performance **Next.js 16 (React 19, Tailwind CSS v4)** frontend and a robust **Django & Django REST Framework (DRF)** backend with built-in JWT authentication, OpenAPI/Swagger documentation, and SQLite/PostgreSQL database support.

Live Link : jobs-orbit-khaki.vercel.app

---

## 🌟 Key Features

### 👤 Public Candidate Portal
- **Homepage**: Hero section with live search, domain category cards, featured opportunities slider, closing-soon urgency ticker, and career blogs.
- **Jobs & Internships Listings (`/jobs`, `/internships`)**: Real-time multi-criteria filtering (category, work mode, job type, experience level), sorting dropdown, and pagination.
- **Dynamic SEO Detail Pages (`/jobs/[slug]`, `/internships/[slug]`)**: Google `JobPosting` JSON-LD schema, skills tags, company branding, salary/stipend tags, formatted requirements, and direct external "Apply Now" action.
- **Companies & Categories (`/companies`, `/categories`)**: Public directory of hiring partners and domain categories with dynamic opportunity counters.
- **Career Advice Blog (`/blog`, `/blog/[slug]`)**: Article directory and full Markdown reader with `BlogPosting` JSON-LD schema.
- **Global Search Modal (`Cmd+K`)**: Instant multi-model search across opportunities, companies, categories, and articles.

### 🛡️ Admin Management Portal (`/admin` & Django Admin `/admin/`)
- **Dashboard Overview (`/admin`)**: Real-time metric counters (total jobs, published, drafts, companies, blog posts), quick action shortcuts, and recent activity.
- **Opportunity Manager (`/admin/opportunities`)**: Full CRUD for jobs & internships, multi-section form, instant publish/draft toggles, duplicate listing action, and bulk status controls.
- **Company Manager (`/admin/companies`)**: Add/edit hiring companies with logos and website links.
- **Category Manager (`/admin/categories`)**: Category editor and automatic opportunity counter aggregation.
- **Blog Manager (`/admin/blog`)**: Markdown article editor with live preview tabs.
- **Media Library (`/admin/media`)**: Direct image uploader with Cloudinary SDK and local fallback storage.
- **Django Built-in Admin (`http://127.0.0.1:8000/admin/`)**: Complete administrative control with model filters, search, and user permission management.
- **Interactive Swagger / OpenAPI 3 API Docs (`http://127.0.0.1:8000/api/docs/`)**: Interactive Swagger UI to explore and test all REST endpoints.

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend Framework** | Django 5.1 + Django REST Framework | REST API, data models, business logic & auth |
| **API Documentation** | DRF Spectacular (OpenAPI 3 / Swagger) | Interactive API exploration at `/api/docs/` |
| **Frontend Framework** | Next.js 16.3 (Turbopack, App Router) | Server-Side Rendering (SSR) & dynamic SEO |
| **Language** | Python 3.12 & TypeScript | Type-safe full-stack development |
| **Styling** | Tailwind CSS v4 (`@theme` design tokens) | Modern glassmorphic and accessible UI |
| **Database** | SQLite (default) / PostgreSQL ready | Relational database storage |
| **Authentication** | Django SimpleJWT (Bearer Token / Cookie) | Secure admin authentication & route protection |
| **Media Storage** | Cloudinary SDK / Local Storage | Image and company logo management |

---

## 🛠️ Quick Start Guide

### 1. Start the Django Backend

```bash
# Navigate to backend folder
cd backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install requirements (if not already installed)
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed sample database (Admin, categories, companies, jobs, blogs)
python manage.py seed_data

# Start Django development server (runs on port 8000)
python manage.py runserver 127.0.0.1:8000
```

The Django REST API is available at:
- **API Base**: `http://127.0.0.1:8000/api/v1/`
- **Swagger Documentation**: `http://127.0.0.1:8000/api/docs/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

---

### 2. Start the Next.js Frontend

In a separate terminal window:

```bash
# Install frontend dependencies
npm install

# Run frontend development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Admin Credentials

On first run, the database seeding command creates the default administrator:

- **Email**: `admin@jobsorbit.com`
- **Password**: `admin123456`
- **Portal Admin Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Django Admin Login**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 📁 Project Directory Layout

```
JobsOrbit/
├── backend/                             # Django Backend Application
│   ├── jobsorbit_core/                  # Project settings, URLs, WSGI, ASGI
│   │   ├── settings.py                  # CORS, REST Framework, SimpleJWT, Database
│   │   └── urls.py                      # Root URL routing & Swagger docs
│   ├── apps/
│   │   ├── authentication/              # Custom User model, JWT login & me views
│   │   ├── companies/                   # Company model, serializers, ViewSet
│   │   ├── categories/                  # Category model, with_counts, seed command
│   │   ├── opportunities/               # Opportunity model, filters, ViewSet, toggles
│   │   ├── blog/                        # BlogPost model, markdown, ViewSet
│   │   ├── analytics/                   # Stats API for admin dashboard counters
│   │   ├── search/                      # Global multi-model search API
│   │   └── media_service/               # Cloudinary / local image upload API
│   ├── manage.py                        # Django management CLI
│   └── requirements.txt                 # Python dependencies
├── actions/                             # Next.js Server Actions connecting to Django API
│   ├── auth.actions.ts                  # JWT login, session cookies & logout
│   ├── opportunity.actions.ts           # Opportunity CRUD & filters
│   ├── category.actions.ts              # Category endpoints & counts
│   ├── company.actions.ts               # Company directory actions
│   ├── blog.actions.ts                  # Blog post actions
│   ├── stats.actions.ts                 # Dashboard metrics
│   ├── search.actions.ts                # Unified search action
│   └── upload.actions.ts                # Image upload action
├── app/                                 # Next.js 16 App Router pages
│   ├── (admin)/admin/                   # Protected admin management pages
│   ├── (public)/                        # Public candidate pages (Jobs, Blogs, etc.)
│   └── login/                           # Admin login page
├── components/                          # Reusable UI components & layouts
├── lib/
│   └── api/django-client.ts             # Centralized typed Django REST API client
└── types/                               # TypeScript interface definitions
```

---

## 📜 License

MIT License. Designed and engineered for student career empowerment.
