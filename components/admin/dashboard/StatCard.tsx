import Link from "next/link";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  href?: string;
  variant?: "primary" | "accent" | "success" | "warning";
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  variant = "primary",
}: StatCardProps) {
  const iconColor = {
    primary: "bg-primary-50 text-primary-600 border-primary-100",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-orange-50 text-orange-600 border-orange-100",
  }[variant];

  const content = (
    <div className="card card-padding hover:border-primary-300 transition-all flex flex-col justify-between space-y-4 group">
      <div className="flex items-center justify-between">
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${iconColor}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-primary-600 transition-colors" />
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-neutral-500">{title}</p>
        <p className="text-2xl font-display font-extrabold text-neutral-900 mt-1">
          {value.toLocaleString()}
        </p>
        {description && (
          <p className="text-2xs text-neutral-400 mt-1 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline block">
        {content}
      </Link>
    );
  }

  return content;
}
