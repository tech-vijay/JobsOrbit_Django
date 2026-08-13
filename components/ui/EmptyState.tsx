import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "Get started by adding something new.",
  action,
  icon: Icon = InboxIcon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-400 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
