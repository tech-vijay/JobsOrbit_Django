import { getBlogPosts } from "@/actions/blog.actions";
import BlogCard from "@/components/public/blog/BlogCard";
import { Pagination } from "@/components/ui/Pagination";
import { buildMetadata } from "@/lib/utils/seo";

export const metadata = buildMetadata({
  title: "Career Advice & Student Placement Guides",
  description:
    "Read career advice, resume tips, interview guides, and off-campus placement preparation strategies for college students and freshers.",
  path: "/blog",
});

export default async function PublicBlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);

  const { posts, totalPages } = await getBlogPosts({
    search: resolvedParams.search,
    category: resolvedParams.category,
    status: "published",
    page,
    limit: 9,
  });

  return (
    <div className="section bg-neutral-50 min-h-screen">
      <div className="container-main space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Career Advice &amp; Guides
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Expert insights to help you crack technical interviews and land your dream job.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => p}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center text-neutral-500 text-sm">
            No blog articles published yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
