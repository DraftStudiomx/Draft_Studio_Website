import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/lib/queries";
import CaseStudyClient from "./CaseStudyClient";

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

// Fallback data for when Sanity has no content yet
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
      es: "Un estudio de fotografía de moda con un archivo impresionante, atrapado dentro de un sitio lento construido con plantillas que enterraba el trabajo y no posicionaba en ningún lugar.",
      en: "A fashion-photography studio with a striking archive, trapped inside a slow, template-built site that buried the work and ranked nowhere.",
    },
    approach: {
      es: [
        "Reconstruimos la experiencia alrededor de las imágenes — una cuadrícula editorial que deja respirar a cada sesión, marcada por espacios generosos y un solo acento para que nada compita con la fotografía.",
        "Un front end a medida reemplazó el constructor de páginas: tipografía ajustada a mano, un cursor personalizado y movimiento que responde al scroll en lugar de decorarlo.",
        "Por debajo, rearquitecturamos el markup para semántica y velocidad — metadatos estructurados, rutas pre-renderizadas y un pipeline de imágenes que envía la resolución correcta a cada dispositivo.",
      ],
      en: [
        "We rebuilt the experience around the imagery itself — an editorial grid that lets each shoot breathe, paced by generous whitespace and a single accent so nothing competes with the photography.",
        "A bespoke front end replaced the page-builder: hand-tuned type, a custom cursor, and motion that responds to scroll rather than decorating it. Every interaction was designed to feel deliberate and fast.",
        "Underneath, we re-architected the markup for semantics and speed — structured metadata, pre-rendered routes, and an image pipeline that ships the right resolution to every device.",
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

/** Resolve a bilingual field to a plain string for the given locale */
function t(field: LocaleString, locale: "es" | "en" = "es"): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ?? field["es"] ?? field["en"] ?? "";
}

/** Resolve a bilingual array field to string[] */
function tArr(field: LocaleArray, locale: "es" | "en" = "es"): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field as string[];
  return field[locale] ?? field["es"] ?? field["en"] ?? [];
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(projectSlugsQuery);
    if (slugs?.length) return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    // fallback to hardcoded slugs
  }
  return Object.keys(FALLBACK).map((slug) => ({ slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try Sanity first
  let data: SanityProject | null = null;
  try {
    data = await client.fetch<SanityProject>(projectBySlugQuery, { slug });
  } catch {
    // fall through to hardcoded
  }

  // Fall back to hardcoded if Sanity has nothing
  if (!data) data = FALLBACK[slug] ?? null;
  if (!data) notFound();

  // TODO Paso 14: derive locale from next-intl params
  const locale: "es" | "en" = "es";

  // Adapt to CaseStudyClient interface
  const cs = {
    slug: data.slug,
    idx: `Ø${Object.keys(FALLBACK).indexOf(slug) + 1}`,
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
