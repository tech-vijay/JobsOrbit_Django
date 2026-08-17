"use server";

import { revalidatePath } from "next/cache";
import { fetchDjango } from "@/lib/api/django-client";
import { opportunitySchema, OpportunityInput } from "@/validations/opportunity.schema";
import { IOpportunity } from "@/types/opportunity.types";

export interface GetOpportunitiesFilters {
  search?: string;
  type?: string;
  category?: string;
  company?: string;
  status?: string;
  featured?: boolean;
  workMode?: string;
  jobType?: string;
  page?: number;
  limit?: number;
}

interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getOpportunities(filters: GetOpportunitiesFilters = {}) {
  try {
    const {
      search,
      type,
      category,
      company,
      status,
      featured,
      workMode,
      jobType,
      page = 1,
      limit = 20,
    } = filters;

    const queryParams: Record<string, string | number | boolean | undefined> = {
      page,
      page_size: limit,
    };

    if (search && search.trim() !== "") queryParams.search = search.trim();
    if (type && type !== "all") queryParams.type = type;
    if (category && category !== "all") queryParams.category = category;
    if (company && company !== "all") queryParams.company = company;
    if (status && status !== "all") queryParams.status = status;
    if (featured !== undefined) queryParams.featured = featured;
    if (workMode && workMode !== "all") queryParams.workMode = workMode;
    if (jobType && jobType !== "all") queryParams.jobType = jobType;

    const data = await fetchDjango<DjangoPaginatedResponse<IOpportunity> | IOpportunity[]>("/opportunities/", {
      params: queryParams,
    });

    if (Array.isArray(data)) {
      return {
        opportunities: data,
        total: data.length,
        totalPages: 1,
        page: 1,
      };
    }

    const total = data.count || 0;
    return {
      opportunities: data.results || [],
      total,
      totalPages: Math.ceil(total / limit) || 1,
      page,
    };
  } catch (error) {
    console.error("[getOpportunities Error]:", error);
    return { opportunities: [], total: 0, totalPages: 1, page: 1 };
  }
}

export async function getOpportunityById(id: string): Promise<IOpportunity | null> {
  try {
    const data = await fetchDjango<IOpportunity>(`/opportunities/${id}/`);
    return data || null;
  } catch (error) {
    console.error("[getOpportunityById Error]:", error);
    return null;
  }
}

export async function getOpportunityBySlug(slug: string): Promise<IOpportunity | null> {
  try {
    const data = await fetchDjango<IOpportunity>(`/opportunities/${slug}/`);
    return data || null;
  } catch (error) {
    console.error("[getOpportunityBySlug Error]:", error);
    return null;
  }
}

export async function createOpportunity(input: OpportunityInput) {
  try {
    const validated = opportunitySchema.parse(input);

    const opportunity = await fetchDjango<IOpportunity>("/opportunities/", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        job_type: validated.jobType,
        work_mode: validated.workMode,
        salary_min: validated.salaryMin,
        salary_max: validated.salaryMax,
        salary_type: validated.salaryType,
        salary_currency: validated.salaryCurrency,
        is_paid: validated.isPaid,
        application_url: validated.applicationUrl,
        seo_title: validated.seoTitle,
        seo_description: validated.seoDescription,
        seo_keywords: validated.seoKeywords,
      }),
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    revalidatePath("/");
    return { success: true, opportunity };
  } catch (error) {
    console.error("[createOpportunity Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create opportunity" };
  }
}

export async function updateOpportunity(id: string, input: OpportunityInput) {
  try {
    const validated = opportunitySchema.parse(input);

    const updated = await fetchDjango<IOpportunity>(`/opportunities/${id}/`, {
      method: "PUT",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        job_type: validated.jobType,
        work_mode: validated.workMode,
        salary_min: validated.salaryMin,
        salary_max: validated.salaryMax,
        salary_type: validated.salaryType,
        salary_currency: validated.salaryCurrency,
        is_paid: validated.isPaid,
        application_url: validated.applicationUrl,
        seo_title: validated.seoTitle,
        seo_description: validated.seoDescription,
        seo_keywords: validated.seoKeywords,
      }),
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    if (updated.slug) {
      revalidatePath(`/jobs/${updated.slug}`);
      revalidatePath(`/internships/${updated.slug}`);
    }
    return { success: true, opportunity: updated };
  } catch (error) {
    console.error("[updateOpportunity Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update opportunity" };
  }
}

export async function deleteOpportunity(id: string) {
  try {
    await fetchDjango(`/opportunities/${id}/`, {
      method: "DELETE",
      requiresAuth: true,
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[deleteOpportunity Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete opportunity" };
  }
}

export async function toggleOpportunityStatus(id: string, newStatus: "draft" | "published" | "expired") {
  try {
    const res = await fetchDjango<{ success: boolean; opportunity?: IOpportunity }>(`/opportunities/${id}/toggle_status/`, {
      method: "PATCH",
      requiresAuth: true,
      body: JSON.stringify({ status: newStatus }),
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/jobs");
    revalidatePath("/internships");
    return { success: res.success ?? true };
  } catch (error) {
    console.error("[toggleOpportunityStatus Error]:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function toggleOpportunityFeatured(id: string) {
  try {
    const res = await fetchDjango<{ success: boolean; featured: boolean }>(`/opportunities/${id}/toggle_featured/`, {
      method: "PATCH",
      requiresAuth: true,
    });

    revalidatePath("/admin/opportunities");
    revalidatePath("/");
    return { success: true, featured: res.featured };
  } catch (error) {
    console.error("[toggleOpportunityFeatured Error]:", error);
    return { success: false, error: "Failed to toggle featured status" };
  }
}

export async function duplicateOpportunity(id: string) {
  try {
    const res = await fetchDjango<{ success: boolean; opportunity: IOpportunity }>(`/opportunities/${id}/duplicate/`, {
      method: "POST",
      requiresAuth: true,
    });

    revalidatePath("/admin/opportunities");
    return { success: true, opportunity: res.opportunity };
  } catch (error) {
    console.error("[duplicateOpportunity Error]:", error);
    return { success: false, error: "Failed to duplicate opportunity" };
  }
}
