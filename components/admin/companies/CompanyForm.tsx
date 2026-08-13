"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { companySchema, CompanyInput } from "@/validations/company.schema";
import { createCompany, updateCompany } from "@/actions/company.actions";
import { ICompany } from "@/types/company.types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import ImageUploader from "@/components/admin/media/ImageUploader";

interface CompanyFormProps {
  initialData?: ICompany | null;
}

export default function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      logo: initialData?.logo || "",
      logoPublicId: initialData?.logoPublicId || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
    },
  });

  const handleLogoUpload = (url: string, publicId: string) => {
    setValue("logo", url);
    setValue("logoPublicId", publicId);
  };

  const onSubmit = async (data: CompanyInput) => {
    setLoading(true);
    try {
      let res;
      if (isEditing && initialData) {
        res = await updateCompany(initialData._id, data);
      } else {
        res = await createCompany(data);
      }

      if (res.success) {
        toast.success(isEditing ? "Company updated!" : "Company created!");
        router.push("/admin/companies");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save company");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name *"
          placeholder="e.g. Google, Microsoft, Infosys"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Slug (optional)"
          placeholder="e.g. google (auto-generated if empty)"
          hint="SEO-friendly URL identifier"
          error={errors.slug?.message}
          {...register("slug")}
        />

        <Input
          label="Company Website"
          type="url"
          placeholder="https://company.com"
          error={errors.website?.message}
          {...register("website")}
        />

        <div className="md:col-span-2 space-y-2">
          <label className="label">Company Logo</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <ImageUploader
              label=""
              onUploadSuccess={handleLogoUpload}
            />
            <Input
              label="Or paste Logo URL directly"
              placeholder="https://res.cloudinary.com/..."
              hint="Auto-filled when you upload above"
              error={errors.logo?.message}
              {...register("logo")}
            />
          </div>
        </div>
      </div>

      <Textarea
        label="Description"
        placeholder="Brief description about the company, work culture, or overview..."
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/companies")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? "Update Company" : "Create Company"}
        </Button>
      </div>
    </form>
  );
}
