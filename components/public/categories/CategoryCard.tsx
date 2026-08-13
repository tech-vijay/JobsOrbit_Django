import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { ICategory } from "@/types/category.types";

interface CategoryCardProps {
  category: ICategory;
  count?: number;
}

export default function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="card card-padding group flex items-center justify-between no-underline hover:border-primary-300 transition-all"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors">
            {category.name}
          </h3>
          {count !== undefined && (
            <p className="text-2xs text-neutral-400 mt-0.5">
              {count} {count === 1 ? "Opportunity" : "Opportunities"}
            </p>
          )}
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-neutral-50 group-hover:bg-primary-50 text-neutral-400 group-hover:text-primary-600 flex items-center justify-center transition-colors">
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
