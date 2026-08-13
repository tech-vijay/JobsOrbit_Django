// Site-wide configuration — update these values for your deployment

export const siteConfig = {
  name: "JobsOrbit",
  tagline: "Launch Your Career with Jobs & Internships",
  description:
    "JobsOrbit is a student-focused jobs and internship portal. Discover daily updated opportunities for freshers — jobs, internships, off-campus drives, and work-from-home roles.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/logo.png",
  social: {
    twitter: "https://twitter.com/jobsorbit",
    linkedin: "https://linkedin.com/company/jobsorbit",
    instagram: "https://instagram.com/jobsorbit",
    telegram: "https://t.me/jobsorbit",
  },
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "Internships", href: "/internships" },
    { label: "Categories", href: "/categories" },
    { label: "Companies", href: "/companies" },
    { label: "Blog", href: "/blog" },
  ],
  adminNavLinks: [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Opportunities", href: "/admin/opportunities", icon: "Briefcase" },
    { label: "Companies", href: "/admin/companies", icon: "Building2" },
    { label: "Categories", href: "/admin/categories", icon: "Tag" },
    { label: "Blog", href: "/admin/blog", icon: "FileText" },
    { label: "Media", href: "/admin/media", icon: "Image" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
  footerLinks: {
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
    resources: [
      { label: "Jobs", href: "/jobs" },
      { label: "Internships", href: "/internships" },
      { label: "Companies", href: "/companies" },
      { label: "Categories", href: "/categories" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
