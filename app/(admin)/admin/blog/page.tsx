import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { getBlogPosts } from "@/actions/blog.actions";
import BlogTable from "@/components/admin/blog/BlogTable";
import AdminPagination from "@/components/admin/AdminPagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);

  const { posts, totalPages } = await getBlogPosts({
    search: resolvedParams.search,
    category: resolvedParams.category,
    status: resolvedParams.status,
    page,
    limit: 15,
  });

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900">
            Blog Posts
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage career advice articles and student guides.
          </p>
        </div>
        <Link href="/admin/blog/new" className="no-underline">
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </Button>
        </Link>
      </div>

      {/* Blog Posts content */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          <BlogTable posts={posts} />
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-card">
          <EmptyState
            icon={FileText}
            title="No blog articles yet"
            description="Publish career advice articles to help students with interview prep, resumes, and job hunting."
            action={
              <Link href="/admin/blog/new" className="no-underline">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4" />
                  <span>Write First Article</span>
                </Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
