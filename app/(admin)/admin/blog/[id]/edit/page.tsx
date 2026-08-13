import { notFound } from "next/navigation";
import { getBlogPostById } from "@/actions/blog.actions";
import BlogForm from "@/components/admin/blog/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const post = await getBlogPostById(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Edit Blog Post: {post.title}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Update article content, category, or SEO parameters.
        </p>
      </div>

      <BlogForm initialData={post} />
    </div>
  );
}
