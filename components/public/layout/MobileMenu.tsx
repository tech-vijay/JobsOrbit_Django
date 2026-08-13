"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import Logo from "@/components/ui/Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline",
                pathname === link.href
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Admin login */}
        <div className="p-4 border-t border-neutral-100">
          <Link
            href="/login"
            onClick={onClose}
            className="btn btn-primary btn-md w-full no-underline"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </>
  );
}
