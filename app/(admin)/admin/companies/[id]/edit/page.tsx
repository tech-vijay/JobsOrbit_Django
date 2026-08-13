import { notFound } from "next/navigation";
import { getCompanyById } from "@/actions/company.actions";
import CompanyForm from "@/components/admin/companies/CompanyForm";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const company = await getCompanyById(resolvedParams.id);

  if (!company) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Edit Company: {company.name}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Update company profile details.
        </p>
      </div>

      <CompanyForm initialData={company} />
    </div>
  );
}
