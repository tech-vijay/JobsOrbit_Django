"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error Boundary caught]:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="card card-padding max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-danger-50 text-danger-600 border border-danger-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-display font-bold text-neutral-900">
            Admin Error Encountered
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {error.message || "Failed to process administrative operation."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="primary" size="md" onClick={() => reset()}>
            <RefreshCw className="w-4 h-4" />
            <span>Retry Action</span>
          </Button>

          <Link href="/admin">
            <Button variant="secondary" size="md">
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
