import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/lib/queries";
import { routing } from "@/i18n/routing";
import CaseStudyClient from "@/app/work/[slug]/CaseStudyClient";

type Locale = "es" | "en";
type LocaleString = { es?: string; en?: string } | string | null | undefined;
type LocaleArray  = { es?: string[]; en?: string[] } | string[] | null | undefined;

interface SanityProject {
  slug: string;
  title: string;
  tags: string;
  year: string;
  liveUrl?: string;
  liveName?: string;
  heroTag?: LocaleString;
  description?: LocaleString;
  challenge?: LocaleString;
  approach?: LocaleArray;
  solutionCaption?: LocaleString;
  heroImage?: { asset: { _ref: string } };
  solutionImage?: { asset: { _ref: string } };
  nextProject?: { title: string; slug: string };
}

const FALLBACK: Record<string, SanityProject> = {
  "estudios-nacionales": {
    slug: "estudios-nacionales",
    title: "Estudios Nacionales",
    tags: "Web Design · Development",
    year: "2025",
    liveUrl: "https://www.estudiosnacionales.com/es",
    liveName: "estudiosnacionales.com →",
    heroTag: {
      es: "Hero — Portada editorial",
      en: "Hero — Editorial cover",
    },
    challenge: {
      es: "Estudios Nacionales contaba con una identidad visual potente y un archivo de trabajo impresionante, pero sin presencia digital que los representara. El reto: construir desde cero un sitio que comunicara su nivel sin sobreexplicarlo.",
      en: "Estudios Nacionales had a powerful visual identity and an impressive body of work, but no digital presence to show for it. The challenge: build from scratch a site that communicated their caliber without over-explaining it.",
    },
    approach: {
      es: [
        "Analizamos la identidad del estudio — su estética, sus clientes, el tipo de trabajo que producen — y construimos una dirección de diseño que amplificara lo que ya tenían, sin inventar algo que no fueran.",
        "Diseñamos la experiencia alrededor de las imágenes: una cuadrícula editorial que deja respirar a cada sesión, marcada por espacios generosos y un solo acento de color para que nada compita con la fotografía.",
        "La arquitectura técnica se definió para velocidad y visibilidad — markup semántico, rutas pre-renderizadas y un pipeline de imágenes que entrega la resolución correcta a cada dispositivo.",
      ],
      en: [
        "We analyzed the studio's identity — their aesthetic, their clients, the type of work they produce — and built a design direction that amplified what they already had, without inventing something they weren't.",
        "We designed the experience around the imagery: an editorial grid that lets each shoot breathe, defined by generous whitespace and a single color accent so nothing competes with the photography.",
        "The technical architecture was defined for speed and visibility — semantic markup, pre-rendered routes, and an image pipeline that delivers the right resolution to every device.",
      ],
    },
    solutionCaption: {
      es: "Índice de proyectos — masonry editorial con leyendas reactivas al scroll.",
      en: "Project index — editorial masonry with scroll-reactive captions and lazy-loaded stills.",
    },
    nextProject: { slug: "contavlic", title: "Contavlic" },
  },
  "contavlic": {
    slug: "contavlic",
    title: "Contavlic",
    tags: "Web Design · Development",
    year: "2025",
    liveUrl: "#",
    liveName: "contavlic.com →",
    heroTag: {
      es: "Hero — Portada corporativa",
      en: "Hero — Corporate cover",
    },
    challenge: {
      es: "Un despacho jurídico y contable con profunda experiencia pero una presencia digital desactualizada que no transmitía profesionalismo a clientes corporativos.",
      en: "A legal and accounting firm with deep expertise but an outdated digital presence that failed to communicate professionalism to enterprise clients.",
    },
    approach: {
      es: [
        "Anclamos el rediseño en señales de confianza — jerarquía tipográfica limpia, espaciado preciso y una paleta contenida que posiciona al despacho junto a las consultoras de primer nivel.",
        "Las páginas de servicios se restructuraron en torno a los resultados del cliente en lugar de la taxonomía interna, reduciendo la fricción para prospectos y mejorando la relevancia orgánica.",
        "El rendimiento era innegociable: generación estática, fuentes optimizadas y un LCP por debajo de 1s en todas las páginas clave.",
      ],
      en: [
        "We anchored the redesign in trust signals — clean typographic hierarchy, precise spacing, and a restrained palette that positions the firm alongside top-tier consultancies.",
        "Service pages were restructured around client outcomes rather than internal taxonomy, reducing friction for prospects and improving organic search relevance.",
        "Performance was non-negotiable: static generation, optimised fonts, and a sub-1s LCP across all key pages.",
      ],
    },
    solutionCaption: {
      es: "Índice de servicios — jerarquía estructurada con CTAs inline.",
      en: "Services index — structured hierarchy with inline CTAs and proof points.",
    },
    nextProject: { slug: "estudios-nacionales", title: "Estudios Nacionales" },
  },
};

function t(field: LocaleString, locale: Locale): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ?? field["es"] ?? field["en"] ?? "";
}

function tArr(field: LocaleArray, locale: Locale): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field as string[];
  return field[locale] ?? field["es"] ?? field["en"] ?? [];
}

export async function generateStaticParams() {
  const locales = routing.locales;
  let slugs: { slug: string }[] = [];

  try {
    const fetched = await client.fetch<{ slug: string }[]>(projectSlugsQuery);
    if (fetched?.length) slugs = fetched;
  } catch {
    slugs = Object.keys(FALLBACK).map((s) => ({ slug: s }));
  }

  return locales.flatMap((locale) =>
    slugs.map((s) => ({ locale, slug: s.slug }))
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  let data: SanityProject | null = null;
  try {
    data = await client.fetch<SanityProject>(projectBySlugQuery, { slug });
  } catch {
    // fall through to hardcoded
  }

  if (!data) data = FALLBACK[slug] ?? null;
  if (!data) notFound();

  const slugKeys = Object.keys(FALLBACK);
  const cs = {
    slug: data.slug,
    idx: `Ø${slugKeys.indexOf(slug) + 1}`,
    client: data.title,
    category: data.tags ?? "",
    year: data.year ?? "",
    liveUrl: data.liveUrl ?? "#",
    liveName: data.liveName ?? `${slug} →`,
    heroTag: t(data.heroTag, locale),
    challenge: t(data.challenge, locale),
    approach: tArr(data.approach, locale),
    solutionCaption: t(data.solutionCaption, locale),
    heroImage: data.heroImage,
    solutionImage: data.solutionImage,
    nextSlug: data.nextProject?.slug ?? "",
    nextName: data.nextProject?.title ?? "",
  };

  return <CaseStudyClient cs={cs} />;
}
