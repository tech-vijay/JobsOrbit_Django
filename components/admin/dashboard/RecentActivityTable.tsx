import Link from "next/link";
import { Edit2, Eye, Building2 } from "lucide-react";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/date";

interface RecentActivityTableProps {
  opportunities: IOpportunity[];
}

export default function RecentActivityTable({
  opportunities,
}: RecentActivityTableProps) {
  if (opportunities.length === 0) {
    return (
      <div className="card card-padding text-center text-xs text-neutral-500 py-8">
        No recent opportunities created yet.
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-neutral-900">
          Recently Posted Opportunities
        </h3>
        <Link
          href="/admin/opportunities"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 no-underline"
        >
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
            <tr>
              <th className="p-3 pl-4">Title &amp; Company</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Posted Date</th>
              <th className="p-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {opportunities.map((op) => {
              const company = typeof op.company === "object" ? (op.company as ICompany) : null;
              const isIntern = op.type === "internship";

              return (
                <tr key={op._id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="p-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                        {company?.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={company.logo} alt={company.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Building2 className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 line-clamp-1">
                          {op.title}
                        </p>
                        <p className="text-2xs text-neutral-400">
                          {company?.name || "No company"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <Badge variant={isIntern ? "accent" : "primary"}>
                      {op.type.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3">
                    <Badge
                      variant={
                        op.status === "published"
                          ? "success"
                          : op.status === "expired"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {op.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-3 text-neutral-500">
                    {formatDate(op.createdAt)}
                  </td>

                  <td className="p-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/opportunities/${op._id}`}
                        aria-label="View details"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/opportunities/${op._id}/edit`}
                        aria-label="Edit opportunity"
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
