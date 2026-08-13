import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import { ICategory } from "@/types/category.types";
import CategoryCard from "@/components/public/categories/CategoryCard";

interface CategoriesSectionProps {
  categories: ICategory[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="section bg-neutral-50 border-b border-neutral-100">
      <div className="container-main space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Browse Domain</span>
            </div>
            <h2 className="section-title">Popular Categories</h2>
            <p className="section-subtitle">
              Explore opportunities filtered by your technical specialization.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 no-underline shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
