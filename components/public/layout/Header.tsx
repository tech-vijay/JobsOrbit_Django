"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import MobileMenu from "./MobileMenu";
import GlobalSearchModal from "@/components/public/search/GlobalSearchModal";
import Logo from "@/components/ui/Logo";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-sm">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline",
                    pathname === link.href
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Global Search trigger button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search opportunities"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 text-xs transition-all"
              >
                <Search className="w-4 h-4 text-neutral-400" />
                <span className="hidden sm:inline font-medium">Search...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white text-3xs font-mono font-semibold text-neutral-400 border border-neutral-200">
                  ⌘K
                </kbd>
              </button>

              {/* Admin login — desktop */}
              <Link
                href="/login"
                className="hidden md:inline-flex btn btn-primary btn-sm no-underline"
              >
                Admin
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={handleCloseSearch}
      />

      {/* Mobile menu drawer */}
      <MobileMenu open={mobileOpen} onClose={handleCloseMobile} />
    </>
  );
}
