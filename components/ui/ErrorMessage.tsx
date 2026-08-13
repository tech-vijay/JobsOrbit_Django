import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  className?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 bg-danger-50 border border-danger-100 rounded-xl p-4",
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-danger-700">{title}</p>
        {message && (
          <p className="text-sm text-danger-600 mt-0.5">{message}</p>
        )}
      </div>
    </div>
  );
}
