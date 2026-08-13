import Link from "next/link";
import { FileText, Calendar } from "lucide-react";
import { IBlogPost } from "@/types/blog.types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/date";

interface BlogCardProps {
  post: IBlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="card overflow-hidden group flex flex-col justify-between h-full hover:border-primary-200 transition-all">
      <div>
        {/* Cover Image */}
        <div className="w-full h-48 bg-neutral-100 overflow-hidden relative">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-100 text-neutral-400">
              <FileText className="w-10 h-10 text-primary-300" />
            </div>
          )}
          {post.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="primary">{post.category}</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-2">
          <Link
            href={`/blog/${post.slug}`}
            className="font-display font-bold text-base text-neutral-900 group-hover:text-primary-600 no-underline line-clamp-2 transition-colors leading-snug"
          >
            {post.title}
          </Link>
          {post.excerpt && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between text-2xs text-neutral-400 border-t border-neutral-100 mt-2">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="font-semibold text-primary-600 hover:text-primary-700 no-underline"
        >
          Read Article →
        </Link>
      </div>
    </article>
  );
}
