"use server";

import { fetchDjango } from "@/lib/api/django-client";
import { IOpportunity } from "@/types/opportunity.types";

export interface AdminStats {
  totalOpportunities: number;
  publishedOpportunities: number;
  draftOpportunities: number;
  totalCompanies: number;
  totalCategories: number;
  totalBlogPosts: number;
  recentOpportunities: IOpportunity[];
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const data = await fetchDjango<AdminStats>("/stats/");
    return {
      totalOpportunities: data.totalOpportunities || 0,
      publishedOpportunities: data.publishedOpportunities || 0,
      draftOpportunities: data.draftOpportunities || 0,
      totalCompanies: data.totalCompanies || 0,
      totalCategories: data.totalCategories || 0,
      totalBlogPosts: data.totalBlogPosts || 0,
      recentOpportunities: data.recentOpportunities || [],
    };
  } catch (error) {
    console.error("[getAdminStats Error]:", error);
    return {
      totalOpportunities: 0,
      publishedOpportunities: 0,
      draftOpportunities: 0,
      totalCompanies: 0,
      totalCategories: 0,
      totalBlogPosts: 0,
      recentOpportunities: [],
    };
  }
}
