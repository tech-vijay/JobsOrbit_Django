import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getOpportunities } from "@/actions/opportunity.actions";
import { getCategories } from "@/actions/category.actions";
import { getCompanies } from "@/actions/company.actions";
import { getBlogPosts } from "@/actions/blog.actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internships`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  try {
    const [opportunitiesData, categories, companies, blogData] = await Promise.all([
      getOpportunities({ status: "published", limit: 100 }),
      getCategories(),
      getCompanies(),
      getBlogPosts({ status: "published", limit: 100 }),
    ]);

    const opportunities = opportunitiesData.opportunities || [];
    const blogPosts = blogData.posts || [];

    const opportunityRoutes: MetadataRoute.Sitemap = opportunities.map((op) => ({
      url: `${baseUrl}/${op.type === "internship" ? "internships" : "jobs"}/${op.slug}`,
      lastModified: op.updatedAt ? new Date(op.updatedAt) : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/categories/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const companyRoutes: MetadataRoute.Sitemap = companies.map((comp) => ({
      url: `${baseUrl}/companies/${comp.slug}`,
      lastModified: comp.updatedAt ? new Date(comp.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [
      ...staticRoutes,
      ...opportunityRoutes,
      ...categoryRoutes,
      ...companyRoutes,
      ...blogRoutes,
    ];
  } catch (error) {
    console.error("[Sitemap Error]:", error);
    return staticRoutes;
  }
}
