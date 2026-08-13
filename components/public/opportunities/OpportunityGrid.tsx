import { IOpportunity } from "@/types/opportunity.types";
import OpportunityCard from "@/components/public/opportunities/OpportunityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase } from "lucide-react";

interface OpportunityGridProps {
  opportunities: IOpportunity[];
}

export default function OpportunityGrid({ opportunities }: OpportunityGridProps) {
  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 p-8">
        <EmptyState
          icon={Briefcase}
          title="No opportunities found"
          description="Try adjusting your filters or search term to find relevant job & internship listings."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((op) => (
        <OpportunityCard key={op._id} opportunity={op} />
      ))}
    </div>
  );
}
