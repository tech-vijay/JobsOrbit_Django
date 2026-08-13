import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import ApplyButton from "./ApplyButton";
import { deadlineLabel, isExpired } from "@/lib/utils/date";

interface OpportunityDetailProps {
  opportunity: IOpportunity;
  siteUrl: string;
}

export default function OpportunityDetail({
  opportunity,
  siteUrl,
}: OpportunityDetailProps) {
  const company = typeof opportunity.company === "object" ? (opportunity.company as ICompany) : null;
  const category = typeof opportunity.category === "object" ? (opportunity.category as ICategory) : null;
  const dl = opportunity.deadline ? deadlineLabel(opportunity.deadline) : null;
  const expired = opportunity.deadline ? isExpired(opportunity.deadline) : false;

  const currentPath =
    opportunity.type === "internship"
      ? `/internships/${opportunity.slug}`
      : `/jobs/${opportunity.slug}`;

  const shareUrl = `${siteUrl}${currentPath}`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: opportunity.type === "internship" ? "Internships" : "Jobs",
      href: opportunity.type === "internship" ? "/internships" : "/jobs",
    },
    { label: opportunity.title },
  ];

  return (
    <article className="space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbs} />

      {/* Hero Header Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Left: Company Logo + Title + Metadata */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              {company?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 className="w-8 h-8 text-neutral-400" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={opportunity.type === "internship" ? "accent" : "primary"}>
                  {opportunity.type.toUpperCase()}
                </Badge>
                {opportunity.featured && <Badge variant="warning">FEATURED</Badge>}
                {expired && <Badge variant="danger">EXPIRED</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 leading-tight">
                {opportunity.title}
              </h1>

              <p className="text-sm font-semibold text-neutral-700">
                {company?.name ? (
                  <Link
                    href={`/companies/${company.slug}`}
                    className="text-neutral-800 hover:text-primary-600 no-underline"
                  >
                    {company.name}
                  </Link>
                ) : (
                  "Company"
                )}{" "}
                {category?.name && (
                  <span className="font-normal text-neutral-500">
                    • In{" "}
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-neutral-600 hover:text-primary-600 no-underline"
                    >
                      {category.name}
                    </Link>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right: Apply Button (Desktop) */}
          <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
            <ApplyButton url={opportunity.applicationUrl} isExpired={expired} />
            <ShareButtons url={shareUrl} title={opportunity.title} />
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl text-xs border border-neutral-100">
          <div>
            <span className="text-neutral-400 block mb-1 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Location / Mode
            </span>
            <span className="font-semibold text-neutral-800 capitalize">
              {opportunity.location || opportunity.workMode || "Remote"}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block mb-1 font-medium flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Job Type
            </span>
            <span className="font-semibold text-neutral-800 capitalize">
              {opportunity.jobType || "Full-time"}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block mb-1 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Experience
            </span>
            <span className="font-semibold text-neutral-800 capitalize">
              {opportunity.experience || "Fresher"}
            </span>
          </div>

          <div>
            <span className="text-neutral-400 block mb-1 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Deadline
            </span>
            <span className={`font-semibold ${dl?.expired ? "text-danger-600" : dl?.urgent ? "text-accent-600" : "text-neutral-800"}`}>
              {dl ? dl.label : "Open until filled"}
            </span>
          </div>
        </div>

        {/* Mobile CTA & Share Bar */}
        <div className="md:hidden space-y-3 pt-2">
          <ApplyButton url={opportunity.applicationUrl} isExpired={expired} />
          <ShareButtons url={shareUrl} title={opportunity.title} />
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Job Overview, Responsibilities, Requirements */}
        <div className="lg:col-span-2 space-y-8">
          {/* About the Role */}
          <div className="card card-padding space-y-4">
            <h2 className="text-lg font-display font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
              About the Role
            </h2>
            <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line space-y-2">
              {opportunity.description}
            </div>
          </div>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="card card-padding space-y-4">
              <h2 className="text-lg font-display font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                Key Responsibilities
              </h2>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                {opportunity.responsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="card card-padding space-y-4">
              <h2 className="text-lg font-display font-semibold text-neutral-900 border-b border-neutral-100 pb-3">
                Requirements &amp; Eligibility
              </h2>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Company Info & Required Skills */}
        <div className="space-y-6">
          {/* Required Skills */}
          {opportunity.skills && opportunity.skills.length > 0 && (
            <div className="card card-padding space-y-3">
              <h3 className="font-display font-semibold text-sm text-neutral-900">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.skills.map((skill, idx) => (
                  <Badge key={idx} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {opportunity.education && (
            <div className="card card-padding space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-primary-600" />
                <span>Education</span>
              </div>
              <p className="text-sm font-semibold text-neutral-800">
                {opportunity.education}
              </p>
            </div>
          )}

          {/* Company Card */}
          {company && (
            <div className="card card-padding space-y-4">
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
                  <h3 className="font-display font-semibold text-sm text-neutral-900">
                    {company.name}
                  </h3>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 no-underline"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              </div>
              {company.description && (
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-4">
                  {company.description}
                </p>
              )}
            </div>
          )}

          {/* Disclaimer Box */}
          <div className="bg-neutral-100 rounded-2xl p-4 text-2xs text-neutral-500 space-y-1">
            <p className="font-semibold text-neutral-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>Disclaimer</span>
            </p>
            <p>
              CareerHub does not charge job seekers for applying. If any employer asks for money, please report it immediately.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
