"use server";

import { fetchDjango } from "@/lib/api/django-client";
import { IOpportunity } from "@/types/opportunity.types";
import { ICompany } from "@/types/company.types";
import { ICategory } from "@/types/category.types";
import { IBlogPost } from "@/types/blog.types";

export interface GlobalSearchResults {
  opportunities: IOpportunity[];
  companies: ICompany[];
  categories: ICategory[];
  blogPosts: IBlogPost[];
}

export async function searchAll(query: string): Promise<GlobalSearchResults> {
  if (!query || query.trim().length < 2) {
    return {
      opportunities: [],
      companies: [],
      categories: [],
      blogPosts: [],
    };
  }

  try {
    const data = await fetchDjango<GlobalSearchResults>("/search/", {
      params: { q: query.trim() },
    });

    return {
      opportunities: data.opportunities || [],
      companies: data.companies || [],
      categories: data.categories || [],
      blogPosts: data.blogPosts || [],
    };
  } catch (error) {
    console.error("[searchAll Error]:", error);
    return {
      opportunities: [],
      companies: [],
      categories: [],
      blogPosts: [],
    };
  }
}
