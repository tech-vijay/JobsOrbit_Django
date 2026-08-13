"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Company } from "@/models/Company";
import { companySchema, CompanyInput } from "@/validations/company.schema";
import { generateSlug } from "@/lib/utils/slug";
import { ICompany } from "@/types/company.types";

export async function getCompanies(search?: string): Promise<ICompany[]> {
  try {
    await connectToDatabase();
    const query: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    const companies = await Company.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(companies));
  } catch (error) {
    console.error("[getCompanies Error]:", error);
    return [];
  }
}

export async function getCompanyById(id: string): Promise<ICompany | null> {
  try {
    await connectToDatabase();
    const company = await Company.findById(id).lean();
    if (!company) return null;
    return JSON.parse(JSON.stringify(company));
  } catch (error) {
    console.error("[getCompanyById Error]:", error);
    return null;
  }
}

export async function createCompany(input: CompanyInput) {
  try {
    const validated = companySchema.parse(input);
    await connectToDatabase();

    const slug = validated.slug && validated.slug.trim() !== ""
      ? generateSlug(validated.slug)
      : generateSlug(validated.name);

    // Check for existing slug
    const existing = await Company.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36).slice(-4)}` : slug;

    const company = await Company.create({
      ...validated,
      slug: finalSlug,
    });

    revalidatePath("/admin/companies");
    revalidatePath("/companies");
    return { success: true, company: JSON.parse(JSON.stringify(company)) };
  } catch (error) {
    console.error("[createCompany Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to create company" };
  }
}

export async function updateCompany(id: string, input: CompanyInput) {
  try {
    const validated = companySchema.parse(input);
    await connectToDatabase();

    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return { success: false, error: "Company not found" };
    }

    let slug = existingCompany.slug;
    if (validated.slug && validated.slug.trim() !== "") {
      slug = generateSlug(validated.slug);
    } else if (validated.name !== existingCompany.name) {
      slug = generateSlug(validated.name);
    }

    const updated = await Company.findByIdAndUpdate(
      id,
      {
        ...validated,
        slug,
      },
      { new: true, runValidators: true }
    ).lean();

    revalidatePath("/admin/companies");
    revalidatePath("/companies");
    return { success: true, company: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("[updateCompany Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to update company" };
  }
}

export async function deleteCompany(id: string) {
  try {
    await connectToDatabase();
    await Company.findByIdAndDelete(id);

    revalidatePath("/admin/companies");
    revalidatePath("/companies");
    return { success: true };
  } catch (error) {
    console.error("[deleteCompany Error]:", error);
    return { success: false, error: (error as Error).message || "Failed to delete company" };
  }
}
