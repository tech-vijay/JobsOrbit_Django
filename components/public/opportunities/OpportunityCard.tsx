import Link from "next/link";
import { Building2, MapPin, Clock, Star } from "lucide-react";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import { Badge } from "@/components/ui/Badge";
import { formatDate, deadlineLabel } from "@/lib/utils/date";

interface OpportunityCardProps {
  opportunity: IOpportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const company = typeof opportunity.company === "object" ? (opportunity.company as ICompany) : null;
  const category = typeof opportunity.category === "object" ? (opportunity.category as ICategory) : null;
  const dl = opportunity.deadline ? deadlineLabel(opportunity.deadline) : null;

  const detailUrl =
    opportunity.type === "internship"
      ? `/internships/${opportunity.slug}`
      : `/jobs/${opportunity.slug}`;

  return (
    <div className="card card-padding flex flex-col justify-between h-full group hover:border-primary-200 transition-all">
      <div className="space-y-4">
        {/* Top bar: Company logo + Title + Type badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            {company?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-1.5" />
            ) : (
              <Building2 className="w-6 h-6 text-neutral-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant={opportunity.type === "internship" ? "accent" : "primary"}>
                {opportunity.type.toUpperCase()}
              </Badge>
              {opportunity.featured && (
                <Badge variant="warning" className="gap-1">
                  <Star className="w-3 h-3 fill-accent-500" />
                  <span>Featured</span>
                </Badge>
              )}
            </div>

            <Link
              href={detailUrl}
              className="font-display font-bold text-base text-neutral-900 group-hover:text-primary-600 no-underline line-clamp-1 transition-colors"
            >
              {opportunity.title}
            </Link>

            <p className="text-xs font-medium text-neutral-500 mt-0.5">
              {company?.name || "Company"} • {category?.name || "General"}
            </p>
          </div>
        </div>

        {/* Location & Meta info */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-neutral-500 border-y border-neutral-100 py-2.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>{opportunity.location || opportunity.workMode || "Remote"}</span>
          </span>
          <span className="flex items-center gap-1 capitalize">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{opportunity.workMode || "On-site"}</span>
          </span>
          {opportunity.salaryMin || opportunity.salaryMax ? (
            <span className="font-semibold text-neutral-800">
              ₹{opportunity.salaryMin?.toLocaleString()} - ₹{opportunity.salaryMax?.toLocaleString()}
            </span>
          ) : (
            <span className="text-neutral-400">Best in Industry</span>
          )}
        </div>

        {/* Skills tags */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {opportunity.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-2xs font-medium"
              >
                {skill}
              </span>
            ))}
            {opportunity.skills.length > 4 && (
              <span className="text-2xs text-neutral-400 self-center">
                +{opportunity.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer bar: Deadline & Apply Button */}
      <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-neutral-100">
        <span className="text-2xs">
          {dl ? (
            <span className={dl.expired ? "text-danger-600 font-semibold" : dl.urgent ? "text-accent-600 font-semibold" : "text-neutral-400"}>
              {dl.label}
            </span>
          ) : (
            <span className="text-neutral-400">Posted {formatDate(opportunity.publishedAt || opportunity.createdAt)}</span>
          )}
        </span>

        <Link
          href={detailUrl}
          className="btn btn-secondary btn-sm no-underline group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-colors"
        >
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
}
