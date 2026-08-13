import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Build a complete Next.js Metadata object with Open Graph, Twitter, and canonical URL.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  keywords,
  type = "website",
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;
  const fullTitle = `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

interface JobPostingOptions {
  title: string;
  description: string;
  companyName: string;
  companyLogo?: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  jobLocation?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
}

/**
 * Generate Google JobPosting JSON-LD structured data for SEO indexation
 */
export function buildJobPostingSchema({
  title,
  description,
  companyName,
  companyLogo,
  datePosted,
  validThrough,
  employmentType = "FULL_TIME",
  jobLocation = "India",
  salaryMin,
  salaryMax,
  salaryCurrency = "INR",
}: JobPostingOptions) {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    validThrough,
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      logo: companyLogo || siteConfig.ogImage,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressLocality: jobLocation,
      },
    },
    ...(salaryMin || salaryMax
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: salaryCurrency,
            value: {
              "@type": "QuantitativeValue",
              minValue: salaryMin || salaryMax,
              maxValue: salaryMax || salaryMin,
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };
}

interface ArticleOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  authorName?: string;
}

/**
 * Generate BlogArticle JSON-LD structured data
 */
export function buildArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  authorName = siteConfig.name,
}: ArticleOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image || siteConfig.ogImage,
    url,
    datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.ogImage,
      },
    },
  };
}
