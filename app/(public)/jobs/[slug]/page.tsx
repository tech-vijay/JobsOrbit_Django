import { notFound } from "next/navigation";
import Script from "next/script";
import { getOpportunityBySlug } from "@/actions/opportunity.actions";
import OpportunityDetail from "@/components/public/opportunities/OpportunityDetail";
import RelatedOpportunities from "@/components/public/opportunities/RelatedOpportunities";
import { buildMetadata, buildJobPostingSchema } from "@/lib/utils/seo";
import { siteConfig } from "@/config/site";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const opportunity = await getOpportunityBySlug(resolvedParams.slug);

  if (!opportunity) {
    return buildMetadata({
      title: "Job Not Found",
      description: "The requested job opportunity could not be found.",
    });
  }

  const company = typeof opportunity.company === "object" ? (opportunity.company as ICompany) : null;
  const companyName = company?.name || siteConfig.name;

  return buildMetadata({
    title: opportunity.seoTitle || `${opportunity.title} at ${companyName}`,
    description:
      opportunity.seoDescription ||
      `Apply for ${opportunity.title} at ${companyName}. ${opportunity.description.slice(0, 140)}...`,
    keywords: opportunity.seoKeywords || [opportunity.title, companyName, "fresher jobs", siteConfig.name.toLowerCase()],
    path: `/jobs/${opportunity.slug}`,
  });
}

export default async function JobDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const opportunity = await getOpportunityBySlug(resolvedParams.slug);

  if (!opportunity || opportunity.type === "internship") {
    notFound();
  }

  const company = typeof opportunity.company === "object" ? (opportunity.company as ICompany) : null;
  const category = typeof opportunity.category === "object" ? (opportunity.category as ICategory) : null;

  const jsonLd = buildJobPostingSchema({
    title: opportunity.title,
    description: opportunity.description,
    companyName: company?.name || siteConfig.name,
    datePosted: (opportunity.publishedAt || opportunity.createdAt).toString(),
    validThrough: opportunity.deadline ? opportunity.deadline.toString() : undefined,
    employmentType: opportunity.jobType?.toUpperCase() || "FULL_TIME",
    jobLocation: opportunity.location || "India",
    salaryMin: opportunity.salaryMin,
    salaryMax: opportunity.salaryMax,
    salaryCurrency: opportunity.salaryCurrency || "INR",
  });

  return (
    <div className="section bg-neutral-50 min-h-screen">
      {/* JobPosting Structured Data for Google Jobs */}
      <Script
        id="job-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-main max-w-5xl space-y-12">
        <OpportunityDetail opportunity={opportunity} siteUrl={siteConfig.url} />

        <RelatedOpportunities
          currentId={opportunity._id}
          categoryId={category?._id}
          type="job"
        />
      </div>
    </div>
  );
}
