import Link from "next/link";
import { Home, Briefcase, FileText, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-neutral-50">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Badge */}
        <div className="space-y-3">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold font-mono tracking-wider">
            404 — PAGE NOT FOUND
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900">
            Lost your way?
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            The page or opportunity you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Shortcuts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            href="/jobs"
            className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-sm flex items-center justify-between no-underline group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 group-hover:text-primary-600">
                  Explore Jobs
                </p>
                <p className="text-3xs text-neutral-400">Full-time roles</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600" />
          </Link>

          <Link
            href="/internships"
            className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-accent-300 hover:shadow-sm flex items-center justify-between no-underline group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 group-hover:text-amber-600">
                  Internships
                </p>
                <p className="text-3xs text-neutral-400">Student stipends</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-amber-600" />
          </Link>

          <Link
            href="/blog"
            className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-sm flex items-center justify-between no-underline group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 group-hover:text-primary-600">
                  Career Blog
                </p>
                <p className="text-3xs text-neutral-400">Interview guides</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600" />
          </Link>

          <Link
            href="/"
            className="p-3.5 rounded-2xl bg-white border border-neutral-200 hover:border-primary-300 hover:shadow-sm flex items-center justify-between no-underline group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900 group-hover:text-primary-600">
                  Homepage
                </p>
                <p className="text-3xs text-neutral-400">Back to start</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600" />
          </Link>
        </div>
      </div>
    </div>
  );
}
