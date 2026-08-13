import BlogForm from "@/components/admin/blog/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">
          Create Blog Post
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Write a new article or career guide for students.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
