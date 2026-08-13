"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { IOpportunity } from "@/types/opportunity.types";
import OpportunityCard from "@/components/public/opportunities/OpportunityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

interface LatestOpportunitiesProps {
  opportunities: IOpportunity[];
}

export default function LatestOpportunities({ opportunities }: LatestOpportunitiesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "job" | "internship">("all");

  const filtered = opportunities.filter((op) => {
    if (activeTab === "all") return true;
    return op.type === activeTab;
  });

  return (
    <section className="section bg-white border-b border-neutral-100">
      <div className="container-main space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Drives</span>
            </div>
            <h2 className="section-title">Latest Opportunities</h2>
            <p className="section-subtitle">
              Handpicked software jobs, off-campus drives, and internships updated today.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "all"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              All ({opportunities.length})
            </button>
            <button
              onClick={() => setActiveTab("job")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "job"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab("internship")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                activeTab === "internship"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Internships
            </button>
          </div>
        </div>

        {/* Opportunities Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((op) => (
              <OpportunityCard key={op._id} opportunity={op} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No opportunities found"
            description="Check back soon for fresh job and internship postings."
          />
        )}

        {/* View All Footer CTA */}
        <div className="text-center pt-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 no-underline bg-primary-50 px-6 py-3 rounded-xl hover:bg-primary-100 transition-colors"
          >
            <span>Explore All Jobs &amp; Internships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
