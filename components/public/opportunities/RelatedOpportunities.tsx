import { getOpportunities } from "@/actions/opportunity.actions";
import OpportunityCard from "./OpportunityCard";

interface RelatedOpportunitiesProps {
  currentId: string;
  categoryId?: string;
  type?: string;
}

export default async function RelatedOpportunities({
  currentId,
  categoryId,
  type,
}: RelatedOpportunitiesProps) {
  const { opportunities } = await getOpportunities({
    category: categoryId,
    type,
    status: "published",
    limit: 4,
  });

  const related = opportunities.filter((op) => op._id !== currentId).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="space-y-6 pt-8 border-t border-neutral-200">
      <div>
        <h2 className="text-xl font-display font-bold text-neutral-900">
          Related Opportunities
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Explore similar job &amp; internship postings for students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((op) => (
          <OpportunityCard key={op._id} opportunity={op} />
        ))}
      </div>
    </div>
  );
}
