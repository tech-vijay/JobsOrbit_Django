"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Briefcase,
  Building2,
  Tag,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { searchAll, GlobalSearchResults } from "@/actions/search.actions";
import { Badge } from "@/components/ui/Badge";
import { ICompany } from "@/types/company.types";
import { siteConfig } from "@/config/site";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptyResults: GlobalSearchResults = {
  opportunities: [],
  companies: [],
  categories: [],
  blogPosts: [],
};

export default function GlobalSearchModal({
  isOpen,
  onClose,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResults>(emptyResults);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setQuery("");
    setResults(emptyResults);
    onClose();
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val || val.trim().length < 2) {
      setResults(emptyResults);
    }
  };

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchAll(query);
        setResults(res);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.opportunities.length +
    results.companies.length +
    results.categories.length +
    results.blogPosts.length;

  const handleSelect = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[80vh] z-10">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search jobs, internships, companies, topics..."
            className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
          />
          {isPending ? (
            <Loader2 className="w-4 h-4 text-primary-600 animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => handleQueryChange("")}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={handleClose}
            className="text-2xs font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-700 px-2 py-1 bg-neutral-100 rounded-md shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-neutral-400 text-xs space-y-1">
              <p className="font-semibold text-neutral-600">Type to search {siteConfig.name}</p>
              <p>Search by title, skill (e.g. React, Python), company, or guide.</p>
            </div>
          ) : totalResults === 0 && !isPending ? (
            <div className="py-8 text-center text-neutral-400 text-xs">
              No results found for &ldquo;{query}&rdquo;. Try another search term.
            </div>
          ) : (
            <>
              {/* Opportunities (Jobs & Internships) */}
              {results.opportunities.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-neutral-400 px-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Jobs &amp; Internships ({results.opportunities.length})</span>
                  </div>

                  <div className="space-y-1">
                    {results.opportunities.map((op) => {
                      const company = typeof op.company === "object" ? (op.company as ICompany) : null;
                      const href = op.type === "internship" ? `/internships/${op.slug}` : `/jobs/${op.slug}`;

                      return (
                        <button
                          key={op._id}
                          onClick={() => handleSelect(href)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center justify-between transition-colors group"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <Badge variant={op.type === "internship" ? "accent" : "primary"}>
                                {op.type.toUpperCase()}
                              </Badge>
                              <span className="font-semibold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors">
                                {op.title}
                              </span>
                            </div>
                            <p className="text-2xs text-neutral-500">
                              {company?.name ? `${company.name} • ` : ""}
                              {op.location || "Remote"}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Companies */}
              {results.companies.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-neutral-400 px-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Companies ({results.companies.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.companies.map((comp) => (
                      <button
                        key={comp._id}
                        onClick={() => handleSelect(`/companies/${comp.slug}`)}
                        className="p-2.5 rounded-xl border border-neutral-100 hover:border-primary-300 hover:bg-neutral-50 flex items-center gap-3 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          {comp.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={comp.logo} alt={comp.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Building2 className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                        <span className="font-semibold text-xs text-neutral-900 group-hover:text-primary-600">
                          {comp.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-neutral-400 px-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Categories ({results.categories.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {results.categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleSelect(`/categories/${cat.slug}`)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-primary-50 text-neutral-700 hover:text-primary-700 text-xs font-semibold transition-colors"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Posts */}
              {results.blogPosts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-neutral-400 px-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Career Guides ({results.blogPosts.length})</span>
                  </div>

                  <div className="space-y-1">
                    {results.blogPosts.map((post) => (
                      <button
                        key={post._id}
                        onClick={() => handleSelect(`/blog/${post.slug}`)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 flex items-center justify-between transition-colors group"
                      >
                        <span className="font-semibold text-xs text-neutral-900 group-hover:text-primary-600 line-clamp-1">
                          {post.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-2xs text-neutral-400">
          <span>Search {siteConfig.name} positions &amp; career guides</span>
          <span className="font-mono">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
