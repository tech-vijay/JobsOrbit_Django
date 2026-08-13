"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { opportunitySchema, OpportunityInput } from "@/validations/opportunity.schema";
import { createOpportunity, updateOpportunity } from "@/actions/opportunity.actions";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import {
  OPPORTUNITY_TYPES,
  JOB_TYPES,
  WORK_MODES,
  SALARY_TYPES,
  EXPERIENCE_LEVELS,
  OPPORTUNITY_STATUSES,
} from "@/lib/constants/jobTypes";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface OpportunityFormProps {
  initialData?: IOpportunity | null;
  companies: ICompany[];
  categories: ICategory[];
}

export default function OpportunityForm({
  initialData,
  companies,
  categories,
}: OpportunityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const companyOptions = companies.map((c) => ({ value: c._id, label: c.name }));
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));

  const formatInitialArray = (arr?: string[]) => {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join("\n");
  };

  const formatInitialComma = (arr?: string[]) => {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join(", ");
  };

  const formatDateForInput = (date?: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // Raw form field values before Zod transformation
  interface FormValues {
    title: string;
    slug?: string;
    type: "job" | "internship" | "offcampus" | "wfh";
    company: string;
    category: string;
    description: string;
    responsibilities?: string;
    requirements?: string;
    skills?: string;
    jobType?: "full-time" | "part-time" | "contract" | "freelance";
    workMode?: "remote" | "onsite" | "hybrid";
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryType?: "monthly" | "yearly" | "stipend" | "unpaid";
    salaryCurrency?: string;
    isPaid?: boolean;
    education?: string;
    experience?: string;
    applicationUrl: string;
    deadline?: string;
    status: "draft" | "published" | "expired";
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error - Zod transform output aligns with OpportunityInput on submit
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      type: initialData?.type || "job",
      company:
        typeof initialData?.company === "object"
          ? (initialData.company as ICompany)._id
          : (initialData?.company as string) || (companies[0]?._id ?? ""),
      category:
        typeof initialData?.category === "object"
          ? (initialData.category as ICategory)._id
          : (initialData?.category as string) || (categories[0]?._id ?? ""),
      description: initialData?.description || "",
      responsibilities: formatInitialArray(initialData?.responsibilities),
      requirements: formatInitialArray(initialData?.requirements),
      skills: formatInitialComma(initialData?.skills),
      jobType: initialData?.jobType || "full-time",
      workMode: initialData?.workMode || "onsite",
      location: initialData?.location || "",
      salaryMin: initialData?.salaryMin || 0,
      salaryMax: initialData?.salaryMax || 0,
      salaryType: initialData?.salaryType || "monthly",
      salaryCurrency: initialData?.salaryCurrency || "INR",
      isPaid: initialData?.isPaid !== undefined ? initialData.isPaid : true,
      education: initialData?.education || "",
      experience: initialData?.experience || "fresher",
      applicationUrl: initialData?.applicationUrl || "",
      deadline: formatDateForInput(initialData?.deadline),
      status: initialData?.status || "published",
      featured: initialData?.featured || false,
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
      seoKeywords: formatInitialComma(initialData?.seoKeywords),
    },
  });

  const onSubmit = async (data: unknown) => {
    setLoading(true);
    try {
      const validatedInput = data as OpportunityInput;
      let res;
      if (isEditing && initialData) {
        res = await updateOpportunity(initialData._id, validatedInput);
      } else {
        res = await createOpportunity(validatedInput);
      }

      if (res.success) {
        toast.success(isEditing ? "Opportunity updated!" : "Opportunity published!");
        router.push("/admin/opportunities");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save opportunity");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* 1. Basic Information */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 pb-2 border-b border-neutral-100">
          1. Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Opportunity Title *"
            placeholder="e.g. Software Engineer Intern / React Developer"
            error={errors.title?.message}
            {...register("title")}
          />

          <Select
            label="Opportunity Type *"
            options={OPPORTUNITY_TYPES}
            error={errors.type?.message}
            {...register("type")}
          />

          <Select
            label="Company *"
            placeholder="Select company..."
            options={companyOptions}
            error={errors.company?.message}
            {...register("company")}
          />

          <Select
            label="Category *"
            placeholder="Select category..."
            options={categoryOptions}
            error={errors.category?.message}
            {...register("category")}
          />

          <Select
            label="Job Type"
            options={JOB_TYPES}
            error={errors.jobType?.message}
            {...register("jobType")}
          />

          <Select
            label="Work Mode"
            options={WORK_MODES}
            error={errors.workMode?.message}
            {...register("workMode")}
          />

          <Input
            label="Location"
            placeholder="e.g. Bengaluru / Remote / Hybrid"
            error={errors.location?.message}
            {...register("location")}
          />

          <Input
            label="Slug (optional)"
            placeholder="Auto-generated if blank"
            error={errors.slug?.message}
            {...register("slug")}
          />
        </div>
      </section>

      {/* 2. Compensation & Eligibility */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 pb-2 border-b border-neutral-100">
          2. Compensation &amp; Eligibility
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Salary / Stipend Type"
            options={SALARY_TYPES}
            error={errors.salaryType?.message}
            {...register("salaryType")}
          />

          <Input
            label="Minimum Amount"
            type="number"
            placeholder="0"
            error={errors.salaryMin?.message}
            {...register("salaryMin", { valueAsNumber: true })}
          />

          <Input
            label="Maximum Amount"
            type="number"
            placeholder="0"
            error={errors.salaryMax?.message}
            {...register("salaryMax", { valueAsNumber: true })}
          />

          <Select
            label="Experience Level"
            options={EXPERIENCE_LEVELS}
            error={errors.experience?.message}
            {...register("experience")}
          />

          <Input
            label="Education Requirement"
            placeholder="e.g. B.Tech / B.E / B.Sc / Any Graduate"
            error={errors.education?.message}
            {...register("education")}
          />

          <Input
            label="Required Skills (comma separated)"
            placeholder="e.g. React, Node.js, Python, SQL"
            error={errors.skills?.message}
            {...register("skills")}
          />
        </div>
      </section>

      {/* 3. Description & Details */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 pb-2 border-b border-neutral-100">
          3. Description &amp; Requirements
        </h2>

        <Textarea
          label="Job Description *"
          placeholder="Comprehensive overview of the role..."
          rows={5}
          error={errors.description?.message}
          {...register("description")}
        />

        <Textarea
          label="Key Responsibilities (one per line)"
          placeholder="• Develop clean code&#10;• Collaborate with team"
          rows={4}
          error={errors.responsibilities?.message}
          {...register("responsibilities")}
        />

        <Textarea
          label="Requirements (one per line)"
          placeholder="• Proficiency in JS&#10;• Good communication skills"
          rows={4}
          error={errors.requirements?.message}
          {...register("requirements")}
        />
      </section>

      {/* 4. Application Link & Deadline */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 pb-2 border-b border-neutral-100">
          4. Application &amp; Deadline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Application URL *"
            type="url"
            placeholder="https://company.careers.com/apply/123"
            hint="Redirect URL when students click 'Apply Now'"
            error={errors.applicationUrl?.message}
            {...register("applicationUrl")}
          />

          <Input
            label="Application Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register("deadline")}
          />
        </div>
      </section>

      {/* 5. Publishing & SEO */}
      <section className="bg-white rounded-2xl border border-neutral-100 shadow-card p-6 space-y-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 pb-2 border-b border-neutral-100">
          5. Publishing &amp; SEO Metadata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Publication Status"
            options={OPPORTUNITY_STATUSES}
            error={errors.status?.message}
            {...register("status")}
          />

          <div className="flex items-center gap-3 pt-6">
            <input
              id="featured-checkbox"
              type="checkbox"
              className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
              {...register("featured")}
            />
            <label htmlFor="featured-checkbox" className="text-sm font-medium text-neutral-700 cursor-pointer">
              Mark as Featured Opportunity
            </label>
          </div>

          <Input
            label="SEO Title (optional)"
            placeholder="Custom title tag for Google"
            error={errors.seoTitle?.message}
            {...register("seoTitle")}
          />

          <Input
            label="SEO Keywords (comma separated)"
            placeholder="e.g. software jobs, internship, tech roles"
            error={errors.seoKeywords?.message}
            {...register("seoKeywords")}
          />
        </div>

        <Textarea
          label="SEO Meta Description"
          placeholder="Custom meta description snippet"
          rows={2}
          error={errors.seoDescription?.message}
          {...register("seoDescription")}
        />
      </section>

      {/* Submit Bar */}
      <div className="flex items-center justify-end gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-card sticky bottom-4 z-10">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/opportunities")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="lg" loading={loading}>
          {isEditing ? "Update Opportunity" : "Publish Opportunity"}
        </Button>
      </div>
    </form>
  );
}
