"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function CompanySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQ = searchParams.get("q") || "";
  const [value, setValue] = useState(currentQ);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/admin/companies?${params.toString()}`);
  };

  const clearSearch = () => {
    setValue("");
    router.push("/admin/companies");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full sm:w-72">
      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search companies..."
        className="input pl-9 pr-8 text-xs py-2"
      />
      {value && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );
}
