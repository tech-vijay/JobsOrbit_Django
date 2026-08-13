import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import { IBlogPost } from "@/types/blog.types";
import BlogCard from "@/components/public/blog/BlogCard";

interface LatestBlogPostsProps {
  posts: IBlogPost[];
}

export default function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-main space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Career Advice</span>
            </div>
            <h2 className="section-title">Latest Articles &amp; Guides</h2>
            <p className="section-subtitle">
              Tips on resume writing, interview preparation, and placement strategies.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 no-underline shrink-0"
          >
            <span>Read All Posts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
