import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { projectSlugsQuery } from "@/sanity/lib/queries";

const BASE = "https://draftstudio.mx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic case-study slugs from Sanity (fallback to known ones)
  let slugs: string[] = [];
  try {
    const fetched = await client.fetch<{ slug: string }[]>(projectSlugsQuery);
    if (fetched?.length) slugs = fetched.map((r) => r.slug);
  } catch {
    slugs = ["estudios-nacionales", "contavlic"];
  }

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             BASE,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        1.0,
      alternates:      { languages: { es: BASE, en: `${BASE}/en` } },
    },
    {
      url:             `${BASE}/work`,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        0.9,
      alternates:      { languages: { es: `${BASE}/work`, en: `${BASE}/en/work` } },
    },
    {
      url:             `${BASE}/studio`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.8,
      alternates:      { languages: { es: `${BASE}/studio`, en: `${BASE}/en/studio` } },
    },
    {
      url:             `${BASE}/services`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.85,
      alternates:      { languages: { es: `${BASE}/services`, en: `${BASE}/en/services` } },
    },
    {
      url:             `${BASE}/contact`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.7,
      alternates:      { languages: { es: `${BASE}/contact`, en: `${BASE}/en/contact` } },
    },
  ];

  const caseStudyRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url:             `${BASE}/work/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly" as const,
    priority:        0.85,
    alternates:      {
      languages: {
        es: `${BASE}/work/${slug}`,
        en: `${BASE}/en/work/${slug}`,
      },
    },
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
