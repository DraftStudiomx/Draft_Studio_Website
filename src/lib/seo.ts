/**
 * Draft Studio — SEO helpers
 * Shared across all page layouts for consistent metadata generation.
 */

const BASE_URL = "https://draftstudio.mx";

export const SEO = {
  baseUrl:        BASE_URL,
  siteName:       "Draft Studio",
  twitterHandle:  "@draftstudio_mx",
  defaultOgImage: "/og-image.jpg",
  email:          "hola@draftstudio.mx",
  addressCountry: "MX",
  addressLocality:"México",
};

// ─── Per-page copy ───────────────────────────────────────────────────────────

type PageKey = "home" | "work" | "studio" | "services" | "contact";

interface PageCopy {
  es: { title: string; description: string };
  en: { title: string; description: string };
  path: string; // '' for home, '/work', '/studio', etc.
}

export const PAGE_META: Record<PageKey, PageCopy> = {
  home: {
    es: {
      title:       "Draft Studio — Precision Web Studio",
      description: "Diseño y desarrollo web de precisión para marcas y empresas listas para resultados de clase mundial. Basados en México, trabajamos globalmente.",
    },
    en: {
      title:       "Draft Studio — Precision Web Studio",
      description: "Precision web design & development for established brands and companies ready for world-class results. Based in Mexico, working globally.",
    },
    path: "",
  },
  work: {
    es: {
      title:       "Proyectos",
      description: "Proyectos seleccionados de Draft Studio — diseño y desarrollo web de precisión para marcas listas para resultados de clase mundial.",
    },
    en: {
      title:       "Work",
      description: "Selected projects by Draft Studio — precision web design and development for brands ready for world-class results.",
    },
    path: "/work",
  },
  studio: {
    es: {
      title:       "Estudio",
      description: "Un estudio web de precisión basado en México, construyendo para marcas que van en serio. Conoce quiénes somos, nuestros valores y cómo trabajamos.",
    },
    en: {
      title:       "Studio",
      description: "A precision web studio based in Mexico, building for brands that mean business. Learn who we are, our values, and how we work.",
    },
    path: "/studio",
  },
  services: {
    es: {
      title:       "Servicios",
      description: "Diseño web, desarrollo, SEO, branding, automatización con IA y mantenimiento. Lo que hace Draft Studio — y cómo lo hace.",
    },
    en: {
      title:       "Services",
      description: "Web design, development, SEO, branding, AI automation and maintenance. What Draft Studio does — and how we do it.",
    },
    path: "/services",
  },
  contact: {
    es: {
      title:       "Contacto",
      description: "Inicia un proyecto con Draft Studio. Cuéntanos tus objetivos — respondemos en menos de 24 horas.",
    },
    en: {
      title:       "Contact",
      description: "Start a project with Draft Studio. Tell us about your goals — we'll get back within 24 hours.",
    },
    path: "/contact",
  },
};

// ─── URL helpers ─────────────────────────────────────────────────────────────

/** Returns ES and EN canonical URLs for a given page path. */
export function pageUrls(path: string) {
  const esUrl = path ? `${BASE_URL}${path}` : BASE_URL;
  const enUrl = `${BASE_URL}/en${path || ""}`;
  return { esUrl, enUrl };
}

// ─── generateMetadata helper ─────────────────────────────────────────────────

/**
 * Builds the full Next.js `Metadata` object for a static page.
 * Handles: title, description, canonical, hreflang, og:locale, og:image, twitter.
 */
export function buildPageMeta(page: PageKey, locale: string) {
  const isEn   = locale === "en";
  const meta   = PAGE_META[page];
  const copy   = isEn ? meta.en : meta.es;
  const { esUrl, enUrl } = pageUrls(meta.path);
  const canonical = isEn ? enUrl : esUrl;

  return {
    title:       copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: {
        es:          esUrl,
        en:          enUrl,
        "x-default": esUrl,
      },
    },
    openGraph: {
      title:            copy.title,
      description:      copy.description,
      url:              canonical,
      locale:           isEn ? "en_US" : "es_MX",
      alternateLocale:  isEn ? "es_MX" : "en_US",
      images: [{
        url:    SEO.defaultOgImage,
        width:  1200,
        height: 630,
        alt:    `${copy.title} — Draft Studio`,
      }],
    },
    twitter: {
      title:       copy.title,
      description: copy.description,
      images:      [SEO.defaultOgImage],
    },
  };
}

// ─── JSON-LD builders ────────────────────────────────────────────────────────

/** Organization + LocalBusiness + WebSite — global schema. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":           ["Organization", "LocalBusiness"],
        "@id":             `${BASE_URL}/#organization`,
        name:              "Draft Studio",
        url:               BASE_URL,
        logo: {
          "@type": "ImageObject",
          url:     `${BASE_URL}/favicon-96x96.png`,
          width:   96,
          height:  96,
        },
        image:   `${BASE_URL}/og-image.jpg`,
        email:   SEO.email,
        address: {
          "@type":          "PostalAddress",
          addressLocality:  SEO.addressLocality,
          addressCountry:   SEO.addressCountry,
        },
        description: "Precision web design & development studio based in Mexico.",
        sameAs: [
          // social links go here once accounts are active
        ],
        hasMap:         `https://maps.google.com/?q=México`,
        priceRange:     "$$",
      },
      {
        "@type":     "WebSite",
        "@id":       `${BASE_URL}/#website`,
        url:         BASE_URL,
        name:        "Draft Studio",
        description: "Precision web design & development for established brands.",
        publisher:   { "@id": `${BASE_URL}/#organization` },
        inLanguage:  ["es-MX", "en"],
      },
    ],
  };
}

/** BreadcrumbList schema — used on case study pages. */
export function breadcrumbSchema(
  locale: string,
  crumbs: { name: string; url: string }[]
) {
  return {
    "@context":        "https://schema.org",
    "@type":           "BreadcrumbList",
    inLanguage:        locale === "en" ? "en" : "es-MX",
    itemListElement:   crumbs.map((c, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       c.name,
      item:       c.url,
    })),
  };
}

/** Service schema — used on the services page. */
export function serviceSchema(locale: string) {
  const isEn = locale === "en";
  const services = isEn
    ? [
        { name: "Web Design",         desc: "Pixel-perfect, brand-faithful design for the web." },
        { name: "Web Development",    desc: "Fast, accessible, scalable Next.js builds." },
        { name: "SEO",                desc: "Technical SEO and content strategy for organic growth." },
        { name: "Branding",           desc: "Visual identity systems for ambitious brands." },
        { name: "AI Automation",      desc: "Workflows and integrations powered by AI." },
        { name: "Maintenance",        desc: "Ongoing support, updates, and performance monitoring." },
      ]
    : [
        { name: "Diseño Web",         desc: "Diseño pixel-perfect y fiel a la marca para la web." },
        { name: "Desarrollo Web",     desc: "Sitios rápidos, accesibles y escalables con Next.js." },
        { name: "SEO",                desc: "SEO técnico y estrategia de contenido para crecimiento orgánico." },
        { name: "Branding",           desc: "Sistemas de identidad visual para marcas ambiciosas." },
        { name: "Automatización IA",  desc: "Flujos de trabajo e integraciones impulsados por IA." },
        { name: "Mantenimiento",      desc: "Soporte continuo, actualizaciones y monitoreo de rendimiento." },
      ];

  return {
    "@context":        "https://schema.org",
    "@type":           "ItemList",
    inLanguage:        isEn ? "en" : "es-MX",
    itemListElement:   services.map((s, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      item: {
        "@type":      "Service",
        name:         s.name,
        description:  s.desc,
        provider:     { "@id": `${BASE_URL}/#organization` },
        url:          isEn ? `${BASE_URL}/en/services` : `${BASE_URL}/services`,
      },
    })),
  };
}

/** Case study schema — WebPage + BreadcrumbList */
export function caseStudySchema(opts: {
  locale:       string;
  slug:         string;
  title:        string;
  description:  string;
  year:         string;
}) {
  const { locale, slug, title, description, year } = opts;
  const isEn = locale === "en";
  const base = isEn ? `${BASE_URL}/en/work/${slug}` : `${BASE_URL}/work/${slug}`;
  const workPage = isEn ? `${BASE_URL}/en/work` : `${BASE_URL}/work`;
  const homePage = isEn ? `${BASE_URL}/en` : BASE_URL;
  const homeLabel = isEn ? "Home" : "Inicio";
  const workLabel = isEn ? "Work" : "Proyectos";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":       "WebPage",
        "@id":         `${base}/#webpage`,
        url:           base,
        name:          `${title} — Draft Studio`,
        description,
        inLanguage:    isEn ? "en" : "es-MX",
        datePublished: `${year}-01-01`,
        publisher:     { "@id": `${BASE_URL}/#organization` },
      },
      breadcrumbSchema(locale, [
        { name: homeLabel, url: homePage },
        { name: workLabel, url: workPage },
        { name: title,     url: base },
      ]),
    ],
  };
}
