"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Briefcase, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="container-main relative z-10 text-center max-w-4xl mx-auto space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium text-accent-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India&apos;s Dedicated Career Portal for Freshers &amp; Students</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight text-balance">
          Find Your Next <span className="text-accent-400">Internship</span> &amp;{" "}
          <span className="text-accent-300">Job Opportunity</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed text-balance">
          Discover daily updated off-campus hiring drives, work-from-home internships, and fresher software jobs curated for college graduates.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative w-full flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, skills (e.g. React, Python), or company..."
              className="w-full pl-11 pr-4 py-3 bg-transparent text-neutral-900 text-sm placeholder:text-neutral-400 outline-none"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto shrink-0">
            <span>Search Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        {/* Quick CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/jobs" className="no-underline">
            <Button variant="secondary" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Briefcase className="w-4 h-4 text-accent-400" />
              <span>Fresher Jobs</span>
            </Button>
          </Link>
          <Link href="/internships" className="no-underline">
            <Button variant="secondary" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <TrendingUp className="w-4 h-4 text-accent-400" />
              <span>Internships</span>
            </Button>
          </Link>
          <Link href="/categories/software-development" className="no-underline">
            <Button variant="secondary" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <span>Software Dev</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
