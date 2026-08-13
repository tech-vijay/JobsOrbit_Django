"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw } from "lucide-react";
import { ICategory } from "@/types/category.types";
import { WORK_MODES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants/jobTypes";

interface FilterPanelProps {
  categories: ICategory[];
  isInternshipsPage?: boolean;
}

export default function FilterPanel({
  categories,
  isInternshipsPage = false,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentWorkMode = searchParams.get("workMode") || "all";
  const currentJobType = searchParams.get("jobType") || "all";
  const currentExperience = searchParams.get("experience") || "all";

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c._id, label: c.name })),
  ];

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset pagination

    const path = isInternshipsPage ? "/internships" : "/jobs";
    router.push(`${path}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const path = isInternshipsPage ? "/internships" : "/jobs";
    router.push(path);
  };

  const hasActiveFilters =
    currentCategory !== "all" ||
    currentWorkMode !== "all" ||
    currentJobType !== "all" ||
    currentExperience !== "all" ||
    !!searchParams.get("search");

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <h3 className="font-display font-semibold text-sm text-neutral-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>Filter Opportunities</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-2xs font-medium text-danger-600 hover:text-danger-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="label text-xs">Category</label>
          <select
            value={currentCategory}
            onChange={(e) => updateParam("category", e.target.value)}
            className="input text-xs py-2 bg-white cursor-pointer"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div>
          <label className="label text-xs">Work Mode</label>
          <select
            value={currentWorkMode}
            onChange={(e) => updateParam("workMode", e.target.value)}
            className="input text-xs py-2 bg-white cursor-pointer"
          >
            <option value="all">All Modes</option>
            {WORK_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type (if not internships-only page) */}
        {!isInternshipsPage && (
          <div>
            <label className="label text-xs">Job Type</label>
            <select
              value={currentJobType}
              onChange={(e) => updateParam("jobType", e.target.value)}
              className="input text-xs py-2 bg-white cursor-pointer"
            >
              <option value="all">All Job Types</option>
              {JOB_TYPES.map((jt) => (
                <option key={jt.value} value={jt.value}>
                  {jt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Experience Level */}
        <div>
          <label className="label text-xs">Experience Level</label>
          <select
            value={currentExperience}
            onChange={(e) => updateParam("experience", e.target.value)}
            className="input text-xs py-2 bg-white cursor-pointer"
          >
            <option value="all">Any Experience</option>
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp.value} value={exp.value}>
                {exp.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
