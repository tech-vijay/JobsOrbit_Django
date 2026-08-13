import Link from "next/link";
import { Plus, Building2, Tag, FileText, Image } from "lucide-react";

export default function QuickActionsCard() {
  const actions = [
    {
      label: "Post New Job / Internship",
      href: "/admin/opportunities/new",
      icon: Plus,
      color: "bg-primary-600 text-white hover:bg-primary-700",
    },
    {
      label: "Add Company",
      href: "/admin/companies/new",
      icon: Building2,
      color: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
    },
    {
      label: "Manage Categories",
      href: "/admin/categories",
      icon: Tag,
      color: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
    },
    {
      label: "Write Blog Article",
      href: "/admin/blog/new",
      icon: FileText,
      color: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
    },
    {
      label: "Media Library",
      href: "/admin/media",
      icon: Image,
      color: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
    },
  ];

  return (
    <div className="card card-padding space-y-4">
      <h3 className="font-display font-bold text-sm text-neutral-900">
        Quick Administrative Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              href={action.href}
              className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold no-underline transition-all ${action.color}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
