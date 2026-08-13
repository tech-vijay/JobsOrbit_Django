import { Star } from "lucide-react";
import { IOpportunity } from "@/types/opportunity.types";
import OpportunityCard from "@/components/public/opportunities/OpportunityCard";

interface FeaturedOpportunitiesProps {
  opportunities: IOpportunity[];
}

export default function FeaturedOpportunities({ opportunities }: FeaturedOpportunitiesProps) {
  const featuredList = opportunities.filter((op) => op.featured).slice(0, 3);

  if (featuredList.length === 0) return null;

  return (
    <section className="section bg-gradient-to-br from-amber-500/5 via-primary-500/5 to-transparent border-b border-neutral-100">
      <div className="container-main space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent-600 uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-accent-500" />
            <span>Top Picks</span>
          </div>
          <h2 className="section-title">Featured Opportunities</h2>
          <p className="section-subtitle">
            Premium hiring drives and high-stipend internships verified by CareerHub.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredList.map((op) => (
            <OpportunityCard key={op._id} opportunity={op} />
          ))}
        </div>
      </div>
    </section>
  );
}
