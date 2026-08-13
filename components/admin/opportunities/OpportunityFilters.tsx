"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter, X } from "lucide-react";
import { OPPORTUNITY_TYPES, OPPORTUNITY_STATUSES } from "@/lib/constants/jobTypes";
import { cn } from "@/lib/utils/cn";

export default function OpportunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentType = searchParams.get("type") || "all";
  const currentStatus = searchParams.get("status") || "all";

  const [searchValue, setSearchValue] = useState(currentSearch);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page to 1 when filter changes
    params.delete("page");

    startTransition(() => {
      router.push(`/admin/opportunities?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchValue);
  };

  const clearSearch = () => {
    setSearchValue("");
    updateFilters("search", "");
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-4 space-y-4">
      {/* Top row: Type tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-neutral-100 no-scrollbar">
        <button
          onClick={() => updateFilters("type", "all")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
            currentType === "all"
              ? "bg-primary-600 text-white shadow-sm"
              : "text-neutral-600 hover:bg-neutral-100"
          )}
        >
          All Types
        </button>
        {OPPORTUNITY_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => updateFilters("type", t.value)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
              currentType === t.value
                ? "bg-primary-600 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bottom row: Search bar & Status filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search title, skills, location..."
            className="input pl-9 pr-8 text-xs py-2"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <select
            value={currentStatus}
            onChange={(e) => updateFilters("status", e.target.value)}
            className="input text-xs py-2 bg-white cursor-pointer w-full sm:w-44"
          >
            <option value="all">All Statuses</option>
            {OPPORTUNITY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
