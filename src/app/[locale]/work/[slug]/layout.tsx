import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { projectBySlugQuery } from "@/sanity/lib/queries";
import { SEO, caseStudySchema, pageUrls } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

// ─── Fallback data for known projects ────────────────────────────────────────

const FALLBACK: Record<string, {
  title: string;
  descEs: string;
  descEn: string;
  year:   string;
  ogImage?: string;
}> = {
  "estudios-nacionales": {
    title:  "Estudios Nacionales",
    descEs: "Sitio web completo para un estudio de fotografía premium en México — diseño editorial, velocidad y visibilidad optimizadas.",
    descEn: "Full website for a premium photography studio based in Mexico — editorial design, optimised speed and visibility.",
    year:   "2025",
  },
  "contavlic": {
    title:  "Contavlic",
    descEs: "Rediseño web para un despacho jurídico y contable — jerarquía de confianza, LCP sub-1s y páginas orientadas al cliente.",
    descEn: "Web redesign for a legal and accounting firm — trust hierarchy, sub-1s LCP, and client-outcome-driven service pages.",
    year:   "2025",
  },
};

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  // Try Sanity first, fall back to hardcoded
  let title = "Case Study";
  let description = "";
  let year = "2025";

  try {
    const data = await client.fetch<{ title?: string; description?: { es?: string; en?: string } | string; year?: string }>(
      projectBySlugQuery, { slug }
    );
    if (data) {
      title       = data.title ?? title;
      year        = data.year ?? year;
      const desc  = data.description;
      if (typeof desc === "string") description = desc;
      else if (desc) description = (isEn ? desc.en : desc.es) ?? desc.es ?? desc.en ?? "";
    }
  } catch { /* fall through */ }

  // Overlay fallback if we got nothing
  if (!title || title === "Case Study") {
    const fb = FALLBACK[slug];
    if (fb) {
      title       = fb.title;
      description = isEn ? fb.descEn : fb.descEs;
      year        = fb.year;
    }
  }

  const { esUrl, enUrl } = pageUrls(`/work/${slug}`);
  const canonical        = isEn ? enUrl : esUrl;
  const fullTitle        = `${title} — Case Study`;
  const ogImage          = FALLBACK[slug]?.ogImage ?? SEO.defaultOgImage;

  return {
    title:       fullTitle,
    description,
    alternates: {
      canonical,
      languages: {
        es:          esUrl,
        en:          enUrl,
        "x-default": esUrl,
      },
    },
    openGraph: {
      title:           fullTitle,
      description,
      url:             canonical,
      locale:          isEn ? "en_US" : "es_MX",
      alternateLocale: isEn ? "es_MX" : "en_US",
      images: [{
        url:    ogImage,
        width:  1200,
        height: 630,
        alt:    `${title} — Draft Studio`,
      }],
    },
    twitter: {
      title:       fullTitle,
      description,
      images:      [ogImage],
    },
  };
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function CaseStudyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  // Resolve title + description for JSON-LD (same logic as above)
  let title       = FALLBACK[slug]?.title ?? "Case Study";
  let description = isEn
    ? (FALLBACK[slug]?.descEn ?? "")
    : (FALLBACK[slug]?.descEs ?? "");
  const year      = FALLBACK[slug]?.year ?? "2025";

  try {
    const data = await client.fetch<{ title?: string; description?: { es?: string; en?: string } | string; year?: string }>(
      projectBySlugQuery, { slug }
    );
    if (data?.title) {
      title = data.title;
      const desc = data.description;
      if (typeof desc === "string") description = desc;
      else if (desc) description = (isEn ? desc.en : desc.es) ?? description;
    }
  } catch { /* use fallback */ }

  const schema = caseStudySchema({ locale, slug, title, description, year });

  return (
    <>
      <JsonLd data={schema} />
      {children}
    </>
  );
}
