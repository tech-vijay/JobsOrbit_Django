import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, ExternalLink, ArrowLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Company } from "@/models/Company";
import { getOpportunities } from "@/actions/opportunity.actions";
import OpportunityGrid from "@/components/public/opportunities/OpportunityGrid";
import { buildMetadata } from "@/lib/utils/seo";
import { ICompany } from "@/types/company.types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  await connectToDatabase();
  const company = await Company.findOne({ slug: resolvedParams.slug }).lean();

  if (!company) {
    return buildMetadata({
      title: "Company Not Found",
      description: "Requested company profile not found.",
    });
  }

  return buildMetadata({
    title: `${company.name} Jobs & Internships`,
    description: company.description || `Explore active job and internship opportunities at ${company.name}.`,
    path: `/companies/${company.slug}`,
  });
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  await connectToDatabase();
  const rawCompany = await Company.findOne({ slug: resolvedParams.slug }).lean();

  if (!rawCompany) {
    notFound();
  }

  const company: ICompany = JSON.parse(JSON.stringify(rawCompany));

  const { opportunities } = await getOpportunities({
    company: company._id,
    status: "published",
    limit: 20,
  });

  return (
    <div className="section bg-neutral-50 min-h-screen">
      <div className="container-main space-y-8">
        {/* Back Link */}
        <Link href="/companies" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 no-underline">
          <ArrowLeft className="w-4 h-4" />
          <span>All Companies</span>
        </Link>

        {/* Company Header Card */}
        <div className="card card-padding flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              {company.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="w-8 h-8 text-neutral-400" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-display font-bold text-neutral-900">
                {company.name}
              </h1>
              {company.description && (
                <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
                  {company.description}
                </p>
              )}
            </div>
          </div>

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm no-underline inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Opportunities list for company */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold text-neutral-900">
            Open Positions at {company.name} ({opportunities.length})
          </h2>
          <OpportunityGrid opportunities={opportunities} />
        </div>
      </div>
    </div>
  );
}
