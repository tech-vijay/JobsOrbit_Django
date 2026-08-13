import { getOpportunities } from "@/actions/opportunity.actions";
import { getCategories } from "@/actions/category.actions";
import OpportunityGrid from "@/components/public/opportunities/OpportunityGrid";
import FilterPanel from "@/components/public/filters/FilterPanel";
import FilterChips from "@/components/public/filters/FilterChips";
import SortDropdown from "@/components/public/filters/SortDropdown";
import { Pagination } from "@/components/ui/Pagination";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Fresher Jobs & Off-Campus Drives",
  description:
    "Explore latest software developer jobs, fresher opportunities, and off-campus hiring drives for college graduates in India.",
  path: "/jobs",
});

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    workMode?: string;
    jobType?: string;
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
      jobType: resolvedParams.jobType,
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
            Fresher Jobs &amp; Opportunities
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Discover {total} active job listings updated daily.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel categories={categories} />
          </div>

          {/* Right Column: Active Chips + Sorting + Grid + Pagination */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-neutral-100 p-4 shadow-card">
              <FilterChips categories={categories} />
              <SortDropdown />
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
