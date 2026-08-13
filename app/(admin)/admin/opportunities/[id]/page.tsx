import { notFound } from "next/navigation";
import Link from "next/link";
import { Edit2, ArrowLeft, ExternalLink, Building2 } from "lucide-react";
import { getOpportunityById } from "@/actions/opportunity.actions";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, deadlineLabel } from "@/lib/utils/date";

export default async function ViewOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const opportunity = await getOpportunityById(resolvedParams.id);

  if (!opportunity) {
    notFound();
  }

  const company = typeof opportunity.company === "object" ? (opportunity.company as ICompany) : null;
  const category = typeof opportunity.category === "object" ? (opportunity.category as ICategory) : null;
  const dl = opportunity.deadline ? deadlineLabel(opportunity.deadline) : null;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/opportunities" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 no-underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>
        <Link href={`/admin/opportunities/${opportunity._id}/edit`} className="no-underline">
          <Button variant="primary" size="sm">
            <Edit2 className="w-4 h-4" />
            <span>Edit Listing</span>
          </Button>
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              {company?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="w-7 h-7 text-neutral-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">
                  {opportunity.title}
                </h1>
                <Badge variant={opportunity.type === "internship" ? "accent" : "primary"}>
                  {opportunity.type.toUpperCase()}
                </Badge>
                {opportunity.featured && <Badge variant="warning">FEATURED</Badge>}
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                {company?.name || "Company"} • {category?.name || "Category"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={opportunity.status === "published" ? "success" : opportunity.status === "expired" ? "danger" : "neutral"}>
              {opportunity.status}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl text-xs">
          <div>
            <span className="text-neutral-400 block mb-1">Work Mode</span>
            <span className="font-semibold text-neutral-800 capitalize">{opportunity.workMode || "On-site"}</span>
          </div>
          <div>
            <span className="text-neutral-400 block mb-1">Job Type</span>
            <span className="font-semibold text-neutral-800 capitalize">{opportunity.jobType || "Full-time"}</span>
          </div>
          <div>
            <span className="text-neutral-400 block mb-1">Location</span>
            <span className="font-semibold text-neutral-800">{opportunity.location || "N/A"}</span>
          </div>
          <div>
            <span className="text-neutral-400 block mb-1">Deadline</span>
            <span className="font-semibold text-neutral-800">{dl ? dl.label : "Open"}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-base font-display font-semibold text-neutral-900">Job Description</h3>
          <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
            {opportunity.description}
          </p>
        </div>

        {/* Responsibilities */}
        {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-display font-semibold text-neutral-900">Responsibilities</h3>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              {opportunity.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-display font-semibold text-neutral-900">Requirements</h3>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              {opportunity.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-display font-semibold text-neutral-900">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {opportunity.skills.map((s, i) => (
                <Badge key={i} variant="neutral">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Apply Link */}
        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between gap-4">
          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-md no-underline inline-flex items-center gap-2"
          >
            <span>Apply URL Link</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <span className="text-2xs text-neutral-400">
            Published on {formatDate(opportunity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
