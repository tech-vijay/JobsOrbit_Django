import Link from "next/link";
import { Building2, ExternalLink, ArrowRight } from "lucide-react";
import { getCompanies } from "@/actions/company.actions";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Companies Hiring Freshers & Students",
  description:
    "Explore top companies hiring interns, software engineers, and college graduates in India.",
  path: "/companies",
});

export default async function PublicCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const companies = await getCompanies(resolvedParams.q);

  return (
    <div className="section bg-neutral-50 min-h-screen">
      <div className="container-main space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Hiring Companies
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Browse companies offering jobs &amp; internships for freshers.
          </p>
        </div>

        {companies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                href={`/companies/${company.slug}`}
                className="card card-padding group flex flex-col justify-between no-underline hover:border-primary-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {company.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-1.5" />
                      ) : (
                        <Building2 className="w-6 h-6 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {company.name}
                      </h3>
                      {company.website && (
                        <span className="text-2xs text-neutral-400 flex items-center gap-1">
                          <span>Official Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                      {company.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-primary-600 group-hover:text-primary-700">
                  <span>View Opportunities</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center text-neutral-500 text-sm">
            No companies found.
          </div>
        )}
      </div>
    </div>
  );
}
