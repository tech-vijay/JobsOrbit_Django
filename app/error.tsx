"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error Boundary caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-neutral-50">
      <div className="card card-padding max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-danger-50 text-danger-600 border border-danger-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-display font-bold text-neutral-900">
            Something went wrong!
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            An unexpected error occurred while loading this page. Please try again or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={() => reset()} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
