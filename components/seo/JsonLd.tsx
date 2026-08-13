import Script from "next/script";
import { siteConfig } from "@/config/site";

interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

export function JsonLd({ data, id = "jsonld-schema" }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema for Google Knowledge Graph
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.ogImage,
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.telegram,
    ],
  };

  return <JsonLd data={schema} id="organization-jsonld" />;
}

/**
 * WebSite Schema with Sitelinks Searchbox
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/jobs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={schema} id="website-jsonld" />;
}
