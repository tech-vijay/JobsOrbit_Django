"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdminAction } from "@/actions/auth.actions";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Tag,
  FileText,
  Image,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";
import Logo from "@/components/ui/Logo";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Briefcase,
  Building2,
  Tag,
  FileText,
  Image,
  Settings,
};

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await logoutAdminAction();
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "admin-sidebar transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="bg-white/90 backdrop-blur rounded-xl p-2 inline-block">
            <Logo href="/admin" size="sm" />
          </div>
          {/* Close btn — mobile only */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Admin label */}
        <div className="px-6 py-3">
          <span className="text-2xs font-semibold uppercase tracking-widest text-neutral-500">
            Admin Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {siteConfig.adminNavLinks.map((link) => {
            const Icon = iconMap[link.icon];
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onMobileClose}
                className={cn(
                  "admin-nav-link",
                  active && "admin-nav-link-active"
                )}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleSignOut}
            className="admin-nav-link w-full text-left text-neutral-400 hover:text-danger-400 hover:bg-danger-500/10"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </button>
          <p className="text-2xs text-neutral-600 text-center mt-3 px-2">
            {siteConfig.name} Admin v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
