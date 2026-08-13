"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  isInternshipsPage?: boolean;
}

export default function SortDropdown({ isInternshipsPage = false }: SortDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "latest") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    const path = isInternshipsPage ? "/internships" : "/jobs";
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <select
        value={currentSort}
        onChange={handleSortChange}
        className="input text-xs py-1.5 px-3 bg-white cursor-pointer w-auto"
      >
        <option value="latest">Sort: Latest First</option>
        <option value="deadline">Sort: Deadline Approaching</option>
        <option value="featured">Sort: Featured First</option>
      </select>
    </div>
  );
}
