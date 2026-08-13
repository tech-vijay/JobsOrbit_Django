import { getOpportunities } from "@/actions/opportunity.actions";
import { getCategories } from "@/actions/category.actions";
import OpportunityGrid from "@/components/public/opportunities/OpportunityGrid";
import FilterPanel from "@/components/public/filters/FilterPanel";
import FilterChips from "@/components/public/filters/FilterChips";
import SortDropdown from "@/components/public/filters/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Internship Opportunities for College Students",
  description:
    "Find paid internships, work-from-home internships, and remote developer roles for college students and freshers across India.",
  path: "/internships",
});

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    workMode?: string;
    experience?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);

  const [categories, opportunitiesData] = await Promise.all([
    getCategories(),
    getOpportunities({
      search: resolvedParams.search,
      category: resolvedParams.category,
      workMode: resolvedParams.workMode,
      type: "internship", // Filter exclusively for internships
      status: "published",
      page,
      limit: 12,
    }),
  ]);

  const { opportunities, total, totalPages } = opportunitiesData;

  return (
    <div className="section bg-neutral-50 min-h-screen">
      <div className="container-main space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Student Internships
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Discover {total} paid &amp; remote internships for college students.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel categories={categories} isInternshipsPage />
          </div>

          {/* Right Column: Active Chips + Sorting + Grid + Pagination */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-neutral-100 p-4 shadow-card">
              <FilterChips categories={categories} isInternshipsPage />
              <SortDropdown isInternshipsPage />
            </div>

            <OpportunityGrid opportunities={opportunities} />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => p}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
