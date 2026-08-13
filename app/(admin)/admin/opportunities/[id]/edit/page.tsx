import { notFound } from "next/navigation";
import { getOpportunityById } from "@/actions/opportunity.actions";
import { getCompanies } from "@/actions/company.actions";
import { getCategories } from "@/actions/category.actions";
import OpportunityForm from "@/components/admin/opportunities/OpportunityForm";

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const [opportunity, companies, categories] = await Promise.all([
    getOpportunityById(resolvedParams.id),
    getCompanies(),
    getCategories(),
  ]);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Edit Opportunity: {opportunity.title}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Update opportunity listing information and parameters.
        </p>
      </div>

      <OpportunityForm
        initialData={opportunity}
        companies={companies}
        categories={categories}
      />
    </div>
  );
}
