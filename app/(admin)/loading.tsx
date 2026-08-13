import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 p-6">
      <LoadingSpinner size="lg" />
      <p className="text-xs font-semibold text-neutral-500 animate-pulse">
        Loading Admin Dashboard...
      </p>
    </div>
  );
}
