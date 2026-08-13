import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { siteConfig } from "@/config/site";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 p-6 bg-neutral-50">
      <LoadingSpinner size="lg" />
      <p className="text-xs font-semibold text-neutral-500 animate-pulse">
        Loading {siteConfig.name}...
      </p>
    </div>
  );
}
