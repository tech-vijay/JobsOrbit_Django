import CompanyForm from "@/components/admin/companies/CompanyForm";

export default function NewCompanyPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Add New Company
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Create a reusable company profile for job and internship listings.
        </p>
      </div>

      <CompanyForm />
    </div>
  );
}
