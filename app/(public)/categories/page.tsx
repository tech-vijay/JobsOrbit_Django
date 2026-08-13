import { getCategoriesWithCounts } from "@/actions/category.actions";
import CategoryCard from "@/components/public/categories/CategoryCard";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Job & Internship Categories",
  description:
    "Explore jobs and internships by technical domain: Software Development, Data Science, AI/ML, DevOps, Product, Design, and more.",
  path: "/categories",
});

export default async function PublicCategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="section bg-neutral-50 min-h-screen">
      <div className="container-main space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Browse by Category
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Find opportunities tailored to your technical field of interest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} count={category.count} />
          ))}
        </div>
      </div>
    </div>
  );
}
