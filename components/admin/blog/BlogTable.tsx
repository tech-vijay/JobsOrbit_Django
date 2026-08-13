"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { IBlogPost } from "@/types/blog.types";
import { deleteBlogPost, toggleBlogPostStatus } from "@/actions/blog.actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/date";

interface BlogTableProps {
  posts: IBlogPost[];
}

export default function BlogTable({ posts }: BlogTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);
    try {
      const res = await deleteBlogPost(deletingId);
      if (res.success) {
        toast.success("Blog post deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete article");
      }
    } catch {
      toast.error("Error deleting article");
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await toggleBlogPostStatus(id, nextStatus);
      if (res.success) {
        toast.success(`Status updated to ${nextStatus}`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Status</th>
              <th>Published</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id}>
                {/* Title & Cover */}
                <td>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden shrink-0">
                      {post.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-2xs text-neutral-400 font-mono">
                        /blog/{post.slug}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="text-xs text-neutral-600">
                  {post.category || "General"}
                </td>

                {/* Status */}
                <td>
                  <button
                    onClick={() => handleToggleStatus(post._id, post.status)}
                    className="cursor-pointer"
                    title="Click to toggle status"
                  >
                    <Badge variant={post.status === "published" ? "success" : "neutral"}>
                      {post.status}
                    </Badge>
                  </button>
                </td>

                {/* Date */}
                <td className="text-xs text-neutral-500">
                  {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                </td>

                {/* Actions */}
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/blog/${post._id}/edit`}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeletingId(post._id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Article?"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        loading={loading}
      />
    </>
  );
}
