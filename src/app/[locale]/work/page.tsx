"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import Footer from "@/components/layout/Footer";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type Locale = "es" | "en";
type LocaleString = { es?: string; en?: string } | string | null | undefined;

function t(field: LocaleString, locale: Locale): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[locale] ?? field["es"] ?? field["en"] ?? "";
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  tags: string;
  year: string;
  description: LocaleString;
  sizeWork: "xl" | "wide" | "tall";
  coverImage?: { asset: { _ref: string } };
}

const FALLBACK: Project[] = [
  {
    _id: "1",
    slug: "estudios-nacionales",
    title: "Estudios Nacionales",
    tags: "Web Design · Development",
    year: "2025",
    description: {
      es: "Sitio web completo para un estudio de fotografía premium en México.",
      en: "Full website for a premium photography studio based in Mexico.",
    },
    sizeWork: "xl",
  },
  {
    _id: "2",
    slug: "contavlic",
    title: "Contavlic",
    tags: "Web Design · Development",
    year: "2025",
    description: {
      es: "Sitio web completo para un despacho jurídico y contable.",
      en: "Full website for a legal and accounting firm.",
    },
    sizeWork: "wide",
  },
];

const aspectRatio: Record<Project["sizeWork"], string> = {
  xl:   "4 / 4.7",
  wide: "16 / 11",
  tall: "4 / 5",
};

export default function WorkPage() {
  const locale = useLocale() as Locale;
  const tr = useTranslations("work");
  const [projects, setProjects] = useState<Project[]>(FALLBACK);

  useEffect(() => {
    client.fetch<Project[]>(projectsQuery)
      .then((data) => { if (data?.length) setProjects(data); })
      .catch(() => {/* keep fallback */});
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (!cards.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 36 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        onEnter: (els) => {
          gsap.to(els, { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.1, overwrite: true });
        },
      });
    });
    return () => ctx.revert();
  }, [projects]);

  return (
    <>
      <main>
        {/* Header */}
        <header className="page-header" style={{ padding: "clamp(120px,16vh,210px) var(--gutter) clamp(36px,5vh,56px)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".1em",
            textTransform: "uppercase", color: "var(--ds-graphite)",
            marginBottom: "clamp(20px,3vh,30px)",
          }}>
            <span style={{ width: "34px", height: "1px", background: "var(--ds-graph-300)", display: "inline-block" }} />
            / {tr("index")}
          </div>

          <h1 className="work-page-h1" style={{ fontWeight: 600, fontSize: "clamp(64px,12vw,120px)", lineHeight: 0.9, letterSpacing: "-0.05em" }}>
            Work
          </h1>

          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            gap: "30px", flexWrap: "wrap", marginTop: "clamp(28px,4vh,44px)",
            borderTop: "1px solid var(--ds-rule)", paddingTop: "22px",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
              {tr("subtitle")}
            </span>
          </div>
        </header>

        {/* Masonry grid */}
        <section aria-label="Selected projects" className="work-masonry" style={{
          padding: "0 var(--gutter) clamp(40px,6vh,70px)",
          columnCount: 2,
          columnGap: "clamp(16px,1.8vw,26px)",
        }}>
          {projects.map((p, idx) => (
            <Link
              key={p._id}
              href={`/work/${p.slug}`}
              data-reveal
              style={{
                display: "inline-block", width: "100%",
                marginBottom: "clamp(16px,1.8vw,26px)", breakInside: "avoid",
                textDecoration: "none", color: "inherit",
              }}
              className={`wcard${idx === 0 ? " wcard--hero" : ""}`}
            >
              {/* Media */}
              <div className="work-card-media" style={{
                position: "relative", overflow: "hidden",
                background: "var(--ds-ink)", aspectRatio: aspectRatio[p.sizeWork ?? "wide"],
              }}>
                {p.coverImage?.asset ? (
                  <Image
                    src={urlFor(p.coverImage).width(1800).quality(95).url()}
                    alt={p.title}
                    fill
                    style={{ objectFit: "cover", transition: "transform .7s cubic-bezier(.16,1,.3,1)" }}
                    className="wcard__img"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="wcard__img" style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(120% 120% at 70% 20%, #1b1b22 0%, #0E0E12 60%)",
                    transition: "transform .7s cubic-bezier(.16,1,.3,1)",
                  }} />
                )}
                <span style={{
                  position: "absolute", top: "18px", left: "20px", zIndex: 2,
                  fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".12em",
                  color: "rgba(241,238,229,.5)",
                }}>
                  ({String(idx + 1).padStart(2, "0")})
                </span>
                <span className="wcard__arrow" style={{
                  position: "absolute", right: "18px", bottom: "18px", zIndex: 2,
                  width: "46px", height: "46px", borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: "var(--ds-cobalto)", color: "var(--ds-paper)", fontSize: "16px",
                  opacity: 0, transform: "translateY(10px) scale(.85)",
                  transition: "opacity .4s cubic-bezier(.16,1,.3,1), transform .4s cubic-bezier(.16,1,.3,1)",
                }}>→</span>
              </div>

              {/* Body */}
              <div style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                gap: "16px", padding: "18px 2px 0", overflow: "hidden",
              }}>
                <h3 className="wcard__title" style={{
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: "clamp(22px,2.4vw,32px)", letterSpacing: "-0.025em",
                  color: "var(--ds-ink)", transition: "transform .4s cubic-bezier(.16,1,.3,1), color .3s ease",
                }}>
                  {p.title}
                </h3>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-end",
                  gap: "4px", flexShrink: 0, paddingTop: "6px",
                  fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em",
                  textTransform: "uppercase", color: "var(--ds-graphite)",
                  textAlign: "right", whiteSpace: "nowrap",
                }}>
                  <span>{p.tags}</span>
                  <span style={{ color: "var(--ds-graph-300)" }}>{p.year}</span>
                </div>
              </div>

              <p style={{
                margin: "11px 2px 0", fontFamily: "var(--font-display)",
                fontSize: "clamp(14px,1.05vw,15px)", lineHeight: 1.5, letterSpacing: "-0.01em",
                color: "var(--ds-graphite)", maxWidth: "42ch",
              }}>
                {t(p.description, locale)}
              </p>
            </Link>
          ))}

          {/* Next project placeholder */}
          <div data-reveal style={{ display: "inline-block", width: "100%", marginBottom: "clamp(16px,1.8vw,26px)", breakInside: "avoid" }}>
            <div className="work-card-media" style={{
              position: "relative", overflow: "hidden", background: "var(--ds-ink)",
              aspectRatio: "4 / 5", display: "grid", placeItems: "center",
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", padding: "24px" }}>
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px,2.8vw,38px)", letterSpacing: "-0.02em", color: "var(--ds-paper)" }}>
                  {tr("nextPlaceholderTitle")}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
                  {tr("nextPlaceholderSub")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div style={{
          textAlign: "center", padding: "clamp(30px,5vh,60px) var(--gutter) clamp(80px,12vh,130px)",
          fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em",
          textTransform: "uppercase", color: "var(--ds-graphite)",
        }}>
          {tr("moreSoon")}
        </div>
      </main>

      <Footer />

      <style>{`
        .wcard:hover .wcard__img { transform: scale(1.03); }
        .wcard:hover .wcard__arrow { opacity: 1 !important; transform: translateY(0) scale(1) !important; }
        .wcard:hover .wcard__title { transform: translateY(-4px); color: var(--ds-cobalto) !important; }

        @media (max-width: 768px) {
          .page-header { padding-top: 120px !important; padding-bottom: 34px !important; }
          .wcard__title { font-size: 22px !important; }
          .work-masonry {
            display: flex !important; flex-direction: column !important;
            column-count: unset !important; gap: clamp(28px, 4vw, 40px) !important;
          }
          .wcard, .work-masonry > div { width: 100% !important; margin-bottom: 0 !important; }
          .work-card-media { aspect-ratio: 4/4.7 !important; }
        }
        @media (max-width: 480px) {
          .page-header { padding-top: 140px !important; padding-bottom: 34px !important; }
          .work-page-h1 { font-size: 60px !important; }
          .wcard__title { font-size: 26px !important; }
          .work-card-media { aspect-ratio: 4/4.7 !important; }
          .wcard-meta { white-space: nowrap !important; }
        }
      `}</style>
    </>
  );
}
