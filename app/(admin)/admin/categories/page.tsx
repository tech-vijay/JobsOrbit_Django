import { Tag } from "lucide-react";
import { getCategories } from "@/actions/category.actions";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categories = await getCategories(resolvedParams.q);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Categories
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage job &amp; internship categories. Categories are auto-seeded if empty.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left column: Add category form */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6">
          <h2 className="text-base font-display font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary-600" />
            <span>Add New Category</span>
          </h2>
          <CategoryForm />
        </div>

        {/* Right column: Categories table */}
        <div className="lg:col-span-2">
          {categories.length > 0 ? (
            <CategoryTable categories={categories} />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center text-neutral-400 text-sm">
              No categories found. Use the form on the left to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
