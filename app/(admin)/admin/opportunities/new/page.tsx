import Link from "next/link";
import { getCompanies } from "@/actions/company.actions";
import { getCategories } from "@/actions/category.actions";
import OpportunityForm from "@/components/admin/opportunities/OpportunityForm";
import { Button } from "@/components/ui/Button";

export default async function NewOpportunityPage() {
  const [companies, categories] = await Promise.all([
    getCompanies(),
    getCategories(),
  ]);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Create Opportunity
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Publish a new job or internship opportunity for students and freshers.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold text-base">Company Required</h3>
          <p className="text-sm text-amber-700">
            You must create at least one company profile before adding an opportunity.
          </p>
          <Link href="/admin/companies/new" className="no-underline">
            <Button variant="accent" size="sm">
              + Add Company First
            </Button>
          </Link>
        </div>
      ) : (
        <OpportunityForm companies={companies} categories={categories} />
      )}
    </div>
  );
}
