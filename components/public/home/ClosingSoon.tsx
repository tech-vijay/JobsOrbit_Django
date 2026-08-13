import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { IOpportunity } from "@/types/opportunity.types";
import OpportunityCard from "@/components/public/opportunities/OpportunityCard";

interface ClosingSoonProps {
  opportunities: IOpportunity[];
}

export default function ClosingSoon({ opportunities }: ClosingSoonProps) {
  // Filter opportunities with active deadlines
  const closingSoonList = opportunities
    .filter((op) => op.deadline && new Date(op.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);

  if (closingSoonList.length === 0) return null;

  return (
    <section className="section bg-white border-b border-neutral-100">
      <div className="container-main space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-danger-600 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Hurry Up</span>
            </div>
            <h2 className="section-title">Closing Soon</h2>
            <p className="section-subtitle">
              Don&apos;t miss out — these student opportunities expire in a few days.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 no-underline shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {closingSoonList.map((op) => (
            <OpportunityCard key={op._id} opportunity={op} />
          ))}
        </div>
      </div>
    </section>
  );
}
