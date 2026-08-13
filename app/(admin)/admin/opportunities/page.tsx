import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { getOpportunities } from "@/actions/opportunity.actions";
import OpportunityFilters from "@/components/admin/opportunities/OpportunityFilters";
import OpportunityTable from "@/components/admin/opportunities/OpportunityTable";
import AdminPagination from "@/components/admin/AdminPagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function AdminOpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    type?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);

  const { opportunities, totalPages } = await getOpportunities({
    search: resolvedParams.search,
    type: resolvedParams.type,
    status: resolvedParams.status,
    page,
    limit: 15,
  });

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">
            Opportunities
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage all job and internship listings.
          </p>
        </div>
        <Link href="/admin/opportunities/new" className="no-underline">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </Button>
        </Link>
      </div>

      {/* Filter toolbar */}
      <OpportunityFilters />

      {/* Opportunities list */}
      {opportunities.length > 0 ? (
        <div className="space-y-6">
          <OpportunityTable opportunities={opportunities} />
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card">
          <EmptyState
            icon={Briefcase}
            title="No opportunities found"
            description="Start adding daily job and internship listings for students."
            action={
              <Link href="/admin/opportunities/new" className="no-underline">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  <span>Create First Post</span>
                </Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
