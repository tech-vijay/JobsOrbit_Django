"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { categorySchema, CategoryInput } from "@/validations/category.schema";
import { createCategory, updateCategory } from "@/actions/category.actions";
import { ICategory } from "@/types/category.types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface CategoryFormProps {
  initialData?: ICategory | null;
  onSuccess?: () => void;
}

export default function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
    },
  });

  const onSubmit = async (data: CategoryInput) => {
    setLoading(true);
    try {
      let res;
      if (isEditing && initialData) {
        res = await updateCategory(initialData._id, data);
      } else {
        res = await createCategory(data);
      }

      if (res.success) {
        toast.success(isEditing ? "Category updated!" : "Category created!");
        if (!isEditing) reset();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save category");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Category Name *"
        placeholder="e.g. Software Development, AI/ML"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Slug (optional)"
        placeholder="e.g. software-development"
        hint="Auto-generated if left blank"
        error={errors.slug?.message}
        {...register("slug")}
      />

      <Textarea
        label="Description"
        placeholder="Brief overview of this category..."
        rows={3}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="pt-2 border-t border-neutral-100 space-y-4">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          SEO Config
        </p>
        <Input
          label="SEO Title"
          placeholder="Custom page title for category"
          error={errors.seoTitle?.message}
          {...register("seoTitle")}
        />
        <Textarea
          label="SEO Meta Description"
          placeholder="Custom meta description for search engines"
          rows={2}
          error={errors.seoDescription?.message}
          {...register("seoDescription")}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
        <Button type="submit" variant="primary" loading={loading} className="w-full sm:w-auto">
          {isEditing ? "Update Category" : "Add Category"}
        </Button>
      </div>
    </form>
  );
}
