import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getBlogPostBySlug } from "@/actions/blog.actions";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { buildMetadata, buildArticleSchema } from "@/lib/utils/seo";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils/date";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found",
      description: "Requested blog article could not be found.",
    });
  }

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    image: post.coverImage,
    type: "article",
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const shareUrl = `${siteConfig.url}/blog/${post.slug}`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ];

  const jsonLd = buildArticleSchema({
    title: post.title,
    description: post.excerpt || post.title,
    url: shareUrl,
    image: post.coverImage,
    datePublished: (post.publishedAt || post.createdAt).toString(),
  });

  return (
    <article className="section bg-neutral-50 min-h-screen">
      {/* BlogArticle Structured Data */}
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-main max-w-4xl space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbs} />

        {/* Article Header Card */}
        <div className="card p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            {post.category && <Badge variant="primary">{post.category}</Badge>}

            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-neutral-900 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                {post.excerpt}
              </p>
            )}

            {/* Author & Date Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                  <User className="w-3.5 h-3.5 text-primary-600" />
                  <span>{siteConfig.name} Editorial Team</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </span>
              </div>

              <ShareButtons url={shareUrl} title={post.title} />
            </div>
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed space-y-4 pt-4 border-t border-neutral-100">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-neutral-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-neutral-500">Tags:</span>
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Back Link Footer */}
        <div className="pt-4 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600 hover:text-primary-700 no-underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
