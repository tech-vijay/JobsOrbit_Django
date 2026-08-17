"use server";

import { revalidatePath } from "next/cache";
import { fetchDjango } from "@/lib/api/django-client";
import { companySchema, CompanyInput } from "@/validations/company.schema";
import { ICompany } from "@/types/company.types";

interface DjangoCompanyListResponse {
  count?: number;
  results?: ICompany[];
}

export async function getCompanies(search?: string): Promise<ICompany[]> {
  try {
    const data = await fetchDjango<ICompany[] | DjangoCompanyListResponse>("/companies/", {
      params: search && search.trim() !== "" ? { search: search.trim() } : undefined,
    });

    if (Array.isArray(data)) {
      return data;
    }
    return data.results || [];
  } catch (error) {
    console.error("[getCompanies Error]:", error);
    return [];
  }
}

export async function getCompanyById(id: string): Promise<ICompany | null> {
  try {
    const data = await fetchDjango<ICompany>(`/companies/${id}/`);
    return data || null;
  } catch (error) {
    console.error("[getCompanyById Error]:", error);
    return null;
  }
}

export async function createCompany(input: CompanyInput) {
  try {
    const validated = companySchema.parse(input);

    const company = await fetchDjango<ICompany>("/companies/", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        logo_public_id: validated.logoPublicId,
      }),
    });

    revalidatePath("/admin/companies");
    revalidatePath("/companies");
    return { success: true, company };
  } catch (error) {
    console.error("[createCompany Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create company" };
  }
}

export async function updateCompany(id: string, input: CompanyInput) {
  try {
    const validated = companySchema.parse(input);

    const company = await fetchDjango<ICompany>(`/companies/${id}/`, {
      method: "PUT",
      requiresAuth: true,
      body: JSON.stringify({
        ...validated,
        logo_public_id: validated.logoPublicId,
      }),
    });

    revalidatePath("/admin/companies");
    revalidatePath("/companies");
    return { success: true, company };
  } catch (error) {
    console.error("[updateCompany Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update company" };
  }
}

export async function deleteCompany(id: string) {
  try {
    await fetchDjango(`/companies/${id}/`, {
      method: "DELETE",
      requiresAuth: true,
    });

    revalidatePath("/admin/companies");
    revalidatePath("/companies");
    return { success: true };
  } catch (error) {
    console.error("[deleteCompany Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete company" };
  }
}
