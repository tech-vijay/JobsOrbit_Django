"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  onMenuToggle?: () => void;
}

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/opportunities": "Opportunities",
    "/admin/opportunities/new": "Create Opportunity",
    "/admin/companies": "Companies",
    "/admin/companies/new": "Add Company",
    "/admin/categories": "Categories",
    "/admin/blog": "Blog Posts",
    "/admin/blog/new": "New Blog Post",
    "/admin/media": "Media Library",
    "/admin/settings": "Settings",
  };

  if (map[pathname]) return map[pathname];

  // Dynamic edit/view routes — extract entity from path
  if (pathname.includes("/opportunities/")) {
    return pathname.endsWith("/edit") ? "Edit Opportunity" : "View Opportunity";
  }
  if (pathname.includes("/companies/")) {
    return pathname.endsWith("/edit") ? "Edit Company" : "Company Details";
  }
  if (pathname.includes("/blog/")) {
    return pathname.endsWith("/edit") ? "Edit Blog Post" : "Blog Post";
  }
  if (pathname.includes("/categories/")) {
    return pathname.endsWith("/edit") ? "Edit Category" : "Category Details";
  }

  return "Admin Panel";
}

export default function AdminHeader({ user, onMenuToggle }: AdminHeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";
  const userRole = user?.role || "Admin";

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Hamburger button + Page Title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            onClick={onMenuToggle}
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-neutral-900 font-display">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: View site link + User profile badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* User profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
                <span>{user?.name || "Administrator"}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600 inline" />
              </div>
              <div className="text-2xs text-neutral-400 capitalize">
                {userRole} • {user?.email || "admin@jobsorbit.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
