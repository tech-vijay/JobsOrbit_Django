"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function AdminPagination({
  currentPage,
  totalPages,
  className,
}: AdminPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* Previous */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                   hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40
                   disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 py-2 text-neutral-400 text-sm"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page as number)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200",
              page === currentPage
                ? "bg-primary-600 text-white shadow-sm"
                : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300"
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="p-2 rounded-lg border border-neutral-200 text-neutral-500
                   hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-40
                   disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
