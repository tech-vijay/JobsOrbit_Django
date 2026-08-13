import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { getCompanies } from "@/actions/company.actions";
import CompanyTable from "@/components/admin/companies/CompanyTable";
import CompanySearch from "@/components/admin/companies/CompanySearch";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const companies = await getCompanies(resolvedParams.q);

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">
            Companies
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage company profiles used when creating job &amp; internship posts.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <CompanySearch />
          <Link href="/admin/companies/new" className="no-underline">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              <span>Add Company</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Companies content */}
      {companies.length > 0 ? (
        <CompanyTable companies={companies} />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card">
          <EmptyState
            icon={Building2}
            title="No companies found"
            description="Create company profiles to reuse them when creating job listings."
            action={
              <Link href="/admin/companies/new" className="no-underline">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  <span>Add First Company</span>
                </Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
