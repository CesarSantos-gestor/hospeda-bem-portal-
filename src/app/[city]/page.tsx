import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITY_CONFIG, ALL_CITY_SLUGS, getCityConfig } from "@/data/city-config";
import { CityPageClient } from "./CityPageClient";

// ─── SSG: pre-render known cities ──────────────────────────────────────────
export function generateStaticParams() {
  return ALL_CITY_SLUGS.map((city) => ({ city }));
}

// ─── SEO: dynamic metadata per city ────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const cfg = getCityConfig(slug);
  if (!cfg) return {};

  const title = `Hospedagens em ${cfg.name}, ${cfg.state} | Hospeda Bem`;
  const url = `https://hospedabem.com/${cfg.slug}`;

  return {
    title,
    description: cfg.metaDescription,
    keywords: cfg.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: cfg.metaDescription,
      url,
      siteName: "Hospeda Bem",
      locale: "pt_BR",
      type: "website",
      images: [{ url: cfg.image, width: 1200, height: 630, alt: `${cfg.name}, ${cfg.state}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cfg.metaDescription,
      images: [cfg.image],
    },
  };
}

// ─── PAGE (Server Component) ───────────────────────────────────────────────
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const cfg = getCityConfig(slug);
  if (!cfg) notFound();

  // JSON-LD structured data for this city page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Hospedagens em ${cfg.name}, ${cfg.state}`,
    description: cfg.metaDescription,
    url: `https://hospedabem.com/${cfg.slug}`,
    isPartOf: { "@type": "WebSite", name: "Hospeda Bem", url: "https://hospedabem.com" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hospedabem.com" },
        { "@type": "ListItem", position: 2, name: cfg.name, item: `https://hospedabem.com/${cfg.slug}` },
        { "@type": "ListItem", position: 3, name: "Hospedagens" },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CityPageClient citySlug={slug} cityName={cfg.name} cityState={cfg.state} cityHighlights={cfg.highlights} />
    </>
  );
}
