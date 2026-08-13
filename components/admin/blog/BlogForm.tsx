"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { blogPostSchema, BlogPostInput } from "@/validations/blog.schema";
import { createBlogPost, updateBlogPost } from "@/actions/blog.actions";
import { IBlogPost } from "@/types/blog.types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import MarkdownEditor from "./MarkdownEditor";
import ImageUploader from "@/components/admin/media/ImageUploader";

interface BlogFormProps {
  initialData?: IBlogPost | null;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const formatInitialComma = (arr?: string[]) => {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join(", ");
  };

  interface FormValues {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    coverImageId?: string;
    category?: string;
    tags?: string;
    status: "draft" | "published";
    seoTitle?: string;
    seoDescription?: string;
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error - Zod transform handles tags string conversion
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      coverImageId: initialData?.coverImageId || "",
      category: initialData?.category || "Career Advice",
      tags: formatInitialComma(initialData?.tags),
      status: initialData?.status || "published",
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
    },
  });

  const handleCoverUpload = (url: string, publicId: string) => {
    setValue("coverImage", url);
    setValue("coverImageId", publicId);
  };

  const onSubmit = async (data: unknown) => {
    setLoading(true);
    try {
      const validatedInput = data as BlogPostInput;
      let res;
      if (isEditing && initialData) {
        res = await updateBlogPost(initialData._id, validatedInput);
      } else {
        res = await createBlogPost(validatedInput);
      }

      if (res.success) {
        toast.success(isEditing ? "Blog post updated!" : "Blog post published!");
        router.push("/admin/blog");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save blog post");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Article Title *"
            placeholder="e.g. How to Prepare for Tech Interviews in 2025"
            error={errors.title?.message}
            {...register("title")}
          />

          <Input
            label="Slug (optional)"
            placeholder="Auto-generated if blank"
            error={errors.slug?.message}
            {...register("slug")}
          />

          <Input
            label="Category"
            placeholder="e.g. Resume Tips, Interview Prep, Career Advice"
            error={errors.category?.message}
            {...register("category")}
          />

          <div className="md:col-span-2 space-y-2">
            <label className="label">Cover Image</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <ImageUploader
                label=""
                onUploadSuccess={handleCoverUpload}
              />
              <Input
                label="Or paste Cover Image URL"
                placeholder="https://res.cloudinary.com/..."
                hint="Auto-filled when you upload above"
                error={errors.coverImage?.message}
                {...register("coverImage")}
              />
            </div>
          </div>

          <Input
            label="Tags (comma separated)"
            placeholder="interview, tech, freshers, resume"
            error={errors.tags?.message}
            {...register("tags")}
          />

          <Select
            label="Status"
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
            error={errors.status?.message}
            {...register("status")}
          />
        </div>

        <Textarea
          label="Short Excerpt"
          placeholder="A short summary of the article for blog cards..."
          rows={3}
          error={errors.excerpt?.message}
          {...register("excerpt")}
        />

        {/* Markdown Content Editor */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              value={field.value}
              onChange={field.onChange}
              error={errors.content?.message}
            />
          )}
        />
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-4">
        <h3 className="text-base font-display font-semibold text-neutral-900">
          SEO Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SEO Title"
            placeholder="Custom title tag for Google search"
            error={errors.seoTitle?.message}
            {...register("seoTitle")}
          />

          <Textarea
            label="SEO Meta Description"
            placeholder="Summary snippet for search engines"
            rows={2}
            error={errors.seoDescription?.message}
            {...register("seoDescription")}
          />
        </div>
      </div>

      {/* Submit Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/blog")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? "Update Article" : "Publish Article"}
        </Button>
      </div>
    </form>
  );
}
