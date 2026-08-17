import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { getCategoryById } from "@/actions/category.actions";
import { getOpportunities } from "@/actions/opportunity.actions";
import OpportunityGrid from "@/components/public/opportunities/OpportunityGrid";
import { buildMetadata } from "@/lib/utils/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const category = await getCategoryById(resolvedParams.slug);

  if (!category) {
    return buildMetadata({
      title: "Category Not Found",
      description: "Requested category not found.",
    });
  }

  return buildMetadata({
    title: category.seoTitle || `${category.name} Jobs & Internships`,
    description:
      category.seoDescription ||
      category.description ||
      `Find latest ${category.name} jobs and internships for college students.`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = await getCategoryById(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  const { opportunities, total } = await getOpportunities({
    category: category.slug || category._id,
    status: "published",
    limit: 24,
  });

  return (
    <div className="section bg-neutral-50 min-h-screen">
      <div className="container-main space-y-8">
        {/* Back Link */}
        <Link href="/categories" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 no-underline">
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider">
            <Tag className="w-4 h-4" />
            <span>Category</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            {category.name} ({total})
          </h1>
          {category.description && (
            <p className="text-neutral-500 text-sm max-w-2xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Opportunities grid */}
        <OpportunityGrid opportunities={opportunities} />
      </div>
    </div>
  );
}
