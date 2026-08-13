"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { ICategory } from "@/types/category.types";

interface FilterChipsProps {
  categories: ICategory[];
  isInternshipsPage?: boolean;
}

export default function FilterChips({
  categories,
  isInternshipsPage = false,
}: FilterChipsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search");
  const categoryId = searchParams.get("category");
  const workMode = searchParams.get("workMode");
  const jobType = searchParams.get("jobType");
  const experience = searchParams.get("experience");

  const categoryObj = categories.find((c) => c._id === categoryId);

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");

    const path = isInternshipsPage ? "/internships" : "/jobs";
    router.push(`${path}?${params.toString()}`);
  };

  const activeChips: { key: string; label: string }[] = [];

  if (search) activeChips.push({ key: "search", label: `Search: "${search}"` });
  if (categoryObj) activeChips.push({ key: "category", label: `Category: ${categoryObj.name}` });
  if (workMode) activeChips.push({ key: "workMode", label: `Mode: ${workMode}` });
  if (jobType) activeChips.push({ key: "jobType", label: `Type: ${jobType}` });
  if (experience) activeChips.push({ key: "experience", label: `Exp: ${experience}` });

  if (activeChips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-2xs font-semibold text-neutral-400 uppercase tracking-wider">
        Active Filters:
      </span>
      {activeChips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100 text-xs font-medium"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => removeParam(chip.key)}
            className="hover:text-primary-900 transition-colors"
            aria-label={`Remove ${chip.label}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
